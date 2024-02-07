import Web3 from "web3";
import { AbiItem } from "web3-utils";
import contracts from "shared/contracts";
import { CHAINS, CHAIN_IDS_BY_NAME } from "@shared/utils/chains";
import {
  onLoadSales,
  parseSaleNative,
  parseSaleTokens,
  removeAll,
} from "@redux/actions";
import { findSum } from "@shared/components/common/specialFields/SpecialFields";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { toast } from "react-hot-toast";

import { config, passport } from "@imtbl/sdk";

const baseConfig = {
  environment: config.Environment.SANDBOX,
  publishableKey: "pk_imapik-test-T4T232i3Ud_@jpQozNrd",
};

const passportInstance = new passport.Passport({
  baseConfig,
  clientId: "HXHIOulzVI5FUDSTVmFc0XRoyd7zFEwz",
  redirectUri: "http://localhost:3000",
  logoutMode: "silent",
  audience: "platform_api",
  scope: "openid offline_access email transact",
});

export const loginIMXPassport: any = async ({
  updateUser,
  updateBlockchain,
  onSuccess,
}) => {
  try {
    const provider = passportInstance.connectEvm();
    const accounts = await provider.request({
      method: "eth_requestAccounts",
    });
    localStorage.setItem("typeOfConnection", "passport");
    localStorage.setItem("loginTime", new Date().getTime().toString());
    updateUser({
      ethAddress: accounts[0],
      email: "",
      provider: provider,
      providerName: "passport",
    });
    updateBlockchain("imx");
    if (onSuccess) onSuccess();
  } catch (err) {
    console.log(err);
  }
};

export const logoutIMXPassport: any = async ({ updateUser }) => {
  try {
    updateUser({
      ethAddress: "",
      email: "",
      provider: "",
      providerName: "",
    });
    await passportInstance.logout();
  } catch (err) {
    console.log(err);
  }
};

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
  console.log(blockchain, CHAINS[CHAIN_IDS_BY_NAME[blockchain]]);
  return new Web3.providers.HttpProvider(
    CHAINS[CHAIN_IDS_BY_NAME[blockchain]]?.urls[0],
  );
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
    case "imx":
      return getAddressesIMX();
    case "skl":
      return getAddressesSkale();
    case "linea":
      return getAddressesLinea();
    default:
      return undefined;
  }
};

export const getAddressesMatic = () => {
  const testAddresses = require("../../Contracts/addresses.mumbai.json");
  const addresses = require("../../Contracts/addresses.matic.json");
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getAddressesIMX = () => {
  const testAddresses = require("../../Contracts/addresses.imx_test.json");
  const addresses = require("../../Contracts/addresses.imx_test.json");
  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getAddressesFindora = () => {
  const testAddresses = require("../../Contracts/addresses.anvil.json");
  const addresses = require("../../Contracts/addresses.findora.json");
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

export const getAddressesSkale = () => {
  const testAddresses = require("../../Contracts/addresses.nebula_test.json");
  const addresses = require("../../Contracts/addresses.nebula.json");

  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getAddressesLinea = () => {
  const testAddresses = require("../../Contracts/addresses.linea_test.json");
  const addresses = require("../../Contracts/addresses.linea.json");

  return process.env.NEXT_PUBLIC_ENV === "production"
    ? addresses
    : testAddresses;
};

export const getTokensAllowed = (blockchain) => {
  switch (blockchain) {
    case "matic":
      return getTokensAllowedMatic();
    case "eth":
      return getTokensAllowedEth();
    case "skl":
      return getTokensAllowedSkale();
    case "linea":
      return getTokensAllowedLinea();
  }
};

export const getTokensAllowedMatic = () => {
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

export const getTokensAllowedSkale = () => {
  const addresses = require("../../Contracts/tokensAllowed.skale.json");
  return addresses;
};

export const getTokensAllowedLinea = () => {
  const addresses = require("../../Contracts/tokensAllowed.linea_test.json");
  return addresses;
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
    const chainId = await (window as any).ethereum.request({
      method: "eth_chainId",
    });
    if (chainId !== network) {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x" + parseInt(network).toString(16),
          },
        ],
      });
    }
    return true;
  } catch (err) {
    if (err.code === 4902) {
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
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
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
    getNativeBlockchain(blockchain)
      ? "ClockSaleFindora"
      : onlyAcceptsERC20(blockchain)
      ? "ClockSaleOnlyMultiToken"
      : "ClockSale",
    addresses.marketplace,
    blockchain,
  );
  const saleFormated = (
    await marketplace.methods.getSales([tokenId]).call()
  ).map((sale) =>
    !getNativeBlockchain(blockchain)
      ? parseSaleTokens(sale)
      : parseSaleNative(sale),
  )[0];
  return saleFormated;
};

export const buyNFTsMatic = async ({
  tokenSelected,
  setMessageBuy,
  cart,
  marketplace,
  provider,
  ethAddress,
  tokensAllowed,
  NATIVEUSD,
  dispatch,
  blockchain,
}) => {
  if (tokenSelected === "") {
    toast.error("Please Select a Payment Method");
    return;
  }
  try {
    console.log("initiated");

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
      tokensId: cart.map((item) => item.saleId),
    };

    const marketplaceContract = getContractCustom(
      getNativeBlockchain(blockchain)
        ? "ClockSaleFindora"
        : onlyAcceptsERC20(blockchain)
        ? "ClockSaleOnlyMultiToken"
        : "ClockSale",
      marketplace,
      provider,
    );
    let price: any = 0;

    const ERC20 = getContract("ERC20", token, blockchain);
    const addresses = getTokensAllowed(blockchain);
    if (
      !onlyAcceptsERC20(blockchain) &&
      tokenSelected === addresses.filter((item) => item.main)[0]?.address
    ) {
      const Aggregator = getContractCustom("Aggregator", NATIVEUSD, provider);
      const priceMATIC = await Aggregator.methods.latestAnswer().call();
      price = Web3.utils.toWei(
        ((bid * 10 ** 8) / priceMATIC).toString(),
        "ether",
      );

      setMessageBuy(`Processing your purchase...`);

      await marketplaceContract.methods
        .buyBatch(tokensId, amounts, token)
        .send({ from: ethAddress, value: price });
    } else {
      // const balanceOf = await ERC20.methods.balanceOf(ethAddress).call();
      // if (balanceOf) {
      // }
      setMessageBuy(`Processing your purchase...`);

      const allowance = await ERC20.methods
        .allowance(ethAddress, marketplace)
        .call();

      if (allowance < 1000000000000000000) {
        setMessageBuy(
          `Increasing the allowance of ${
            tokensAllowed.filter((item) => item.address == token)[0].name
          } 1/2`,
        );
        const ERC20Token = getContractCustom("ERC20", token, provider);

        await ERC20Token.methods
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

      dispatch(removeAll());
    }
  } catch (err) {
    console.log(err, "catch");
  }
  dispatch(onLoadSales());
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
      tokensId: cart.map((item) => item.saleId),
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

export const redeemNFT = async ({ tokenId, provider, user, blockchain }) => {
  try {
    const { rent } = getAddresses(blockchain);
    const rentContract = getContractCustom(
      onlyAcceptsERC20(blockchain) ? "RentOnlyMultiToken" : "Rent",
      rent,
      provider,
    );
    console.log(tokenId, rentContract, "pre redeem");
    const tx = await rentContract.methods
      .redeemRent(tokenId.toString())
      .send({ from: user });
    return tx;
  } catch (err) {
    console.log(err);
  }
};

export const onCancelSale = async (args: {
  tokenId;
  provider;
  user;
  blockchain;
}) => {
  try {
    const { tokenId, provider, user, blockchain } = args;

    const { marketplace } = getAddresses(blockchain);
    const marketplaceContract = getContractCustom(
      getNativeBlockchain(blockchain)
        ? "ClockSaleFindora"
        : onlyAcceptsERC20(blockchain)
        ? "ClockSaleOnlyMultiToken"
        : "ClockSale",
      marketplace,
      provider,
    );
    console.log("before tx");
    const tx = await marketplaceContract.methods
      .cancelSale(tokenId)
      .send({ from: user });

    console.log(tx, marketplace, marketplaceContract);
    return tx;
  } catch (err) {
    console.log(err);
    return { err };
  }
};

export const isPack = (address: string, blockchain: string) => {
  return address === getAddresses(blockchain)?.pack;
};

export const getRentsPendingByUser = ({ user, rents }) => {
  return rents.filter((rent) => {
    return (
      !getRentAvailable(rent) && rent.status === "1" && rent.seller == user
    );
  });
};

export const getRentAvailable = (rent) => {
  return (
    (parseInt(rent.duration) + parseInt(rent.startedAt)) * 1000 >=
    Number(new Date())
  );
};

export const getNativeBlockchain = (blockchain) => {
  switch (blockchain) {
    case "matic":
      return false;
    case "eth":
      return false;
    case "findora":
      return true;
    case "imx":
      return false;
    case "skl":
      return false;
    case "linea":
      return false;
    default:
      return undefined;
  }
};

export const hasAggregatorFeed = (blockchain) => {
  switch (blockchain) {
    case "matic":
      return true;
    case "eth":
      return true;
    case "findora":
      return false;
    case "imx":
      return false;
    case "skl":
      return false;
    case "linea":
      return true;
    default:
      return undefined;
  }
};

export const onlyAcceptsERC20 = (blockchain) => {
  switch (blockchain) {
    case "matic":
      return false;
    case "eth":
      return false;
    case "findora":
      return false;
    case "imx":
      return true;
    case "skl":
      return true;
    case "linea":
      return false;
    default:
      return undefined;
  }
};

export const sendFirebaseTx = async ({ tx, influencer_code }) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const txs = (await get(child(dbRef, `tx`))).exists()
    ? (await get(child(dbRef, `tx`))).val()
    : [];
  if (txs.length > 0) {
    const newArray = Object.keys(txs).map((item) => {
      return txs[item];
    });
    newArray.push({ influencer_code, tx });
    set(ref(db, "tx"), newArray);
  } else {
    txs.push({ influencer_code, tx });
    console.log(txs, "txs");
    set(ref(db, "tx"), txs);
  }
};

export const checkFirebaseInfluencerCode = async ({
  influencer_code,
  setError,
  clearErrors,
}) => {
  const db = getDatabase();
  const dbRef = ref(db);
  const code = await get(child(dbRef, `influencer_code/${influencer_code}`));
  if (code.exists()) {
    clearErrors("influencer_code");
    return code.val();
  } else {
    setError("influencer_code", { message: "Invalid Code." });
    return false;
  }
};

export const getSFUEL = async (address) => {
  const pk: any = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  const skale = CHAINS[CHAIN_IDS_BY_NAME["skl"]];
  const web3 = getWeb3(skale.urls[0]);
  console.log(address);
  const balance = await web3.eth.getBalance(address);
  console.log(balance);

  const params = {
    to: address,
    value: Web3.utils.toHex(Web3.utils.toWei("0.00001", "ether")),
    gas: Web3.utils.toHex(21000), // optional
    gasPrice: Web3.utils.toHex(20 * Math.pow(10, 9)), // optional
  };

  if (parseFloat(Web3.utils.fromWei(balance, "ether")) <= 0.000001) {
    const signedTx: any = await web3.eth.accounts.signTransaction(params, pk);
    web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .on("transactionHash", () => {
        toast.success("Gas request succesfully sent!");
      })
      .on("error", () => {
        toast.error("An error has ocurred");
      });
  } else {
    toast.error("You have enough sFUEL to make txs");
  }
};
