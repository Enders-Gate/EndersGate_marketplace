import Web3 from "web3";
import { AbiItem } from "web3-utils";
import contracts from "shared/contracts";
import { useBlockchain } from "@shared/context/useBlockchain";
import { CHAINS, CHAIN_IDS_BY_NAME } from "@shared/components/chains";
import {
  onLoadSales,
  parseSaleNative,
  parseSaleTokens,
  removeAll,
} from "@redux/actions";
import { findSum } from "@shared/components/common/specialFields/SpecialFields";
// import Moralis from "moralis";

export const loginMetamaskWallet = async () => {
  const provider = await (window as any).ethereum;
  if (!provider) return false;
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  return new Web3(provider);
};

export const getWeb3 = (provider?: any) => {
  return new Web3(provider ? provider : (window as any).ethereum);
};

export const getContract = (
  factory: keyof typeof contracts,
  address: string,
  blockchain: string,
) => {
  const web3 = getWeb3(getProvider(blockchain));
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractWebSocket = (
  factory: keyof typeof contracts,
  address: string,
) => {
  const web3 = getWeb3(process.env.NEXT_PUBLIC_POLYGON_PROVIDER_WSS);
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractMetamask = (
  factory: keyof typeof contracts,
  address: string,
) => {
  const web3 = getWeb3();
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getContractCustom = (
  factory: keyof typeof contracts,
  address: string,
  provider: any,
) => {
  const web3 = getWeb3(provider);
  return new web3.eth.Contract(contracts[factory].abi as AbiItem[], address);
};

export const getProvider = (blockchain) => {
  console.log(CHAINS[CHAIN_IDS_BY_NAME[blockchain]]?.urls[0]);
  return CHAINS[CHAIN_IDS_BY_NAME[blockchain]]?.urls[0];
};

export const getBalance = async (address: string, blockchain: string) => {
  if (!Web3.utils.isAddress(address)) return "0";
  const web3 = getWeb3(getProvider(blockchain));
  const balance = await web3.eth.getBalance(address);
  return web3.utils
    .fromWei(balance)
    .substr(0, web3.utils.fromWei(balance).indexOf(".") + 5);
};

export const getAddresses = (blockchain) => {
  switch (blockchain) {
    case "matic":
      return getAddressesMatic();
    case "eth":
      return getAddressesEth();
    case "findora":
      return getAddressesFindora();
  }
};

export const getAddressesMatic = () => {
  const testAddresses = require("../../Contracts/addresses.mumbai.json");
  const addresses = require("../../Contracts/addresses.matic.json");
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getAddressesFindora = () => {
  const testAddresses = require("../../Contracts/addresses.anvil.json");
  const addresses = require("../../Contracts/addresses.matic.json");
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getAddressesEth = () => {
  const testAddresses = require("../../Contracts/addresses.sepolia.json");
  const addresses = require("../../Contracts/addresses.ethereum.json");

  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getTokensAllowed = () => {
  const testAddresses = require("../../Contracts/tokensAllowed.mumbai.json");
  const addresses = require("../../Contracts/tokensAllowed.matic.json");

  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getTokensAllowedEth = () => {
  const testAddresses = require("../../Contracts/tokensAllowed.sepolia.json");
  const addresses = require("../../Contracts/tokensAllowed.ethereum.json");
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const approveERC1155 = async ({
  provider,
  from,
  to,
  address,
}: {
  provider: any;
  from: string;
  to: string;
  address: string;
}) => {
  const erc1155Contract = getContractCustom("EndersPack", address, provider);
  return await erc1155Contract.methods.setApprovalForAll(to, true).send({
    from: from,
  });
};

export const switchChain = async (network) => {
  try {
    await (window as any).ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x" + parseInt(network).toString(16),
          chainName: CHAINS[network].name,
          rpcUrls: CHAINS[network].rpcUrls,
          nativeCurrency: CHAINS[network].nativeCurrency,
          blockExplorerUrls: CHAINS[network].blockExplorerUrls,
        },
      ],
    });
    await (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x" + parseInt(network).toString(16),
        },
      ],
    });
    return true;
  } catch (err) {
    return false;
  }
};

export const createEvent = ({
  type,
  metadata,
}: {
  type: "sell" | "buy" | "login" | "cancel";
  metadata:
    | Object
    | {
        from: string;
        tokenId: string;
        startingPrice: string;
        amount: string;
        duration: string;
        address: string;
      };
}) => {
  return "";
};

export const loadSale = async function prepare({ tokenId, blockchain }: any) {
  const addresses = getAddresses(blockchain);
  const marketplace = getContract(
    blockchain === "matic" ? "ClockSale" : "ClockSaleFindora",
    addresses.marketplace,
    blockchain,
  );
  const saleFormated = (
    await marketplace.methods.getSales([tokenId]).call()
  ).map((sale) =>
    blockchain === "matic" ? parseSaleTokens(sale) : parseSaleNative(sale),
  )[0];
  return saleFormated;
};

export const buyNFTsMatic = async ({
  tokenSelected,
  addToast,
  setMessageBuy,
  cart,
  marketplace,
  provider,
  ethAddress,
  tokensAllowed,
  MATICUSD,
  dispatch,
}) => {
  if (tokenSelected === "") {
    addToast("Please Select a Payment Method", { appearance: "error" });
    return;
  }
  try {
    setMessageBuy(`Processing your purchase...`);

    const { amounts, bid, token, tokensId } = {
      amounts: cart.map((item) => item.quantity),
      bid: cart
        ?.map((item: any, i) =>
          ((parseInt(item.price) / 10 ** 6) * item.quantity).toString(),
        )
        .reduce((item: any, acc: any) => {
          return findSum(item, acc) as any;
        }),
      token: tokenSelected,
      tokensId: cart.map((item) => item.id),
    };

    const marketplaceContract = getContractCustom(
      "ClockSale",
      marketplace,
      provider,
    );
    let price: any = 0;

    const ERC20 = getContractCustom("ERC20", token, provider);
    const addresses = getTokensAllowed();
    if (
      tokenSelected ===
      addresses.filter((item) => item.name === "MATIC")[0].address
    ) {
      const Aggregator = getContractCustom("Aggregator", MATICUSD, provider);
      const priceMATIC = await Aggregator.methods.latestAnswer().call();
      price = Web3.utils.toWei(
        ((bid * 10 ** 8) / priceMATIC).toString(),
        "ether",
      );
      await marketplaceContract.methods
        .buyBatch(tokensId, amounts, token)
        .send({ from: ethAddress, value: price });
    } else {
      const allowance = await ERC20.methods
        .allowance(ethAddress, marketplace)
        .call();
      if (allowance < 1000000000000) {
        setMessageBuy(
          `Increasing the allowance of ${
            tokensAllowed.filter((item) => item.address === tokenSelected)[0]
              .name
          } 1/2`,
        );
        await ERC20.methods
          .increaseAllowance(
            marketplace,
            "1000000000000000000000000000000000000000000000000",
          )
          .send({
            from: ethAddress,
          });
        setMessageBuy("Buying your NFT(s) 2/2");
        await marketplaceContract.methods
          .buyBatch(tokensId, amounts, tokenSelected)
          .send({ from: ethAddress });
      } else {
        setMessageBuy("Buying your NFT(s)");
        await marketplaceContract.methods
          .buyBatch(tokensId, amounts, tokenSelected)
          .send({ from: ethAddress });
      }

      // }
      dispatch(removeAll());
    }
  } catch (err) {}

  setMessageBuy(``);
};

export const buyNFTsNative = async ({
  setMessageBuy,
  cart,
  marketplace,
  provider,
  ethAddress,
  dispatch,
}) => {
  try {
    setMessageBuy(`Processing your purchase...`);

    const { amounts, bid, tokensId } = {
      amounts: cart.map((item) => item.quantity),
      bid: cart
        ?.map((item: any, i) =>
          (parseInt(item.price) * item.quantity).toString(),
        )
        .reduce((item: any, acc: any) => {
          return findSum(item, acc) as any;
        }),
      tokensId: cart.map((item) => item.id),
    };

    const marketplaceContract = getContractCustom(
      "ClockSaleFindora",
      marketplace,
      provider,
    );

    await marketplaceContract.methods
      .buyBatch(tokensId, amounts)
      .send({ from: ethAddress, value: bid });

    dispatch(removeAll());
    dispatch(onLoadSales());
  } catch (err) {}

  setMessageBuy(``);
};
