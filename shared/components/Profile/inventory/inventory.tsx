import { Typography } from "@shared/components/common/typography";
import { Icons } from "@shared/const/Icons";
import clsx from "clsx";
import React from "react";
import { useAppSelector } from "redux/store";
import { SearchOutlined } from "@ant-design/icons";
import Styles from "./styles.module.scss";
import NFTCard from "@shared/components/Marketplace/itemCard";
import { getBalance } from "@shared/web3";
import Link from "next/link";
import { Images } from "@shared/const/Images";
import { convertArrayCards } from "@shared/components/common/convertCards";
import { useWeb3React } from "@web3-react/core";
import { Dropdown } from "@shared/components/common/dropdown/dropdown";
import { XIcon } from "@heroicons/react/solid";

const navItems = [
  { title: "Trading Cards", value: "Trading Cards" },
  { title: "Packs", value: "Packs" },
];

const Inventory = () => {
  const nfts = useAppSelector((state) => state.nfts);
  const { account: user } = useWeb3React();
  const inventoryCards = nfts.balanceCards;
  const [inventoryPacks, setInventoryPacks] = React.useState([]);
  const [columnSelected, setColumnSelected] = React.useState("Trading Cards");
  const [balance, setBalance] = React.useState("0");
  const [search, setSearch] = React.useState("");

  const cards = convertArrayCards();

  React.useEffect(() => {
    if (user) {
      handleSetBalance();
    }
  }, [user]);

  React.useEffect(() => {
    console.log(nfts);
    const arrayPacks = [];
    nfts.balancePacks.forEach((pack, index) => {
      arrayPacks.push({
        id: pack.id,
        quantity: pack.balance,
        image:
          index === 0
            ? Images.pack1
            : index === 1
            ? Images.pack2
            : index === 2
            ? Images.pack3
            : Images.pack4,
        name:
          index === 0
            ? "Common Pack"
            : index === 1
            ? "Rare Pack"
            : index === 2
            ? "Epic Pack"
            : "Legendary Pack",
      });
    });
    setInventoryPacks(arrayPacks);
  }, [nfts]);

  const handleSetBalance = async () => {
    const balance = await getBalance(user);
    setBalance(balance);
  };

  return (
    <div className="flex flex-col w-full px-24">
      <h2 className="text-white font-bold text-4xl mb-8">
        My Enders Gate NFTs
      </h2>
      <div className="flex gap-4 items-center mb-4">
        <div className="border flex items-center text-lg justify-center border-overlay-border bg-overlay-2 rounded-xl w-full">
          <div className="text-white flex items-center w-full py-3 px-4 rounded-xl bg-overlay border-r border-overlay-border">
            <input
              type="text"
              className="text-white w-full bg-transparent focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <div
              className="text-white cursor-pointer flex items-center"
              onClick={() => setSearch("")}
            >
              <XIcon color="#fff" width={"16px"} />
            </div>
          </div>
          <div className="text-white text-xl flex items-center justify-center px-2">
            <SearchOutlined />
          </div>
        </div>
        <div className="flex items-center justify-center py-4 text-xl">
          <Dropdown
            classTitle={
              "text-red-primary hover:text-orange-500 whitespace-nowrap w-60"
            }
            title={columnSelected}
          >
            <div className="flex flex-col rounded-md border border-overlay-border">
              {navItems.map((item) => (
                <div
                  className="p-4 text-center font-bold hover:text-orange-500 text-primary whitespace-nowrap cursor-pointer"
                  onClick={() => setColumnSelected(item.value)}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </Dropdown>
        </div>
      </div>
      <div
        className={clsx(
          "flex mb-10 justify-center",
          {
            [`${Styles.gray} flex-col items-center gap-6 h-72`]:
              (inventoryCards.length == 0 &&
                columnSelected === "Trading Cards") ||
              (inventoryPacks.length == 0 && columnSelected === "Packs"),
          },
          {
            ["gap-2 flex-wrap gap-6"]:
              (inventoryCards.length > 0 &&
                columnSelected === "Trading Cards") ||
              (inventoryPacks.length > 0 && columnSelected === "Packs"),
          },
        )}
      >
        {columnSelected === "Trading Cards" ? (
          inventoryCards.filter(
            (card) =>
              cards[card.id]?.properties?.name?.value
                .toLowerCase()
                .includes(search.toLowerCase()) && card.balance > 0,
          ).length > 0 ? (
            inventoryCards
              .filter(
                (card) =>
                  cards[card.id]?.properties?.name?.value
                    .toLowerCase()
                    .includes(search.toLowerCase()) && card.balance > 0,
              )
              .map((card) => {
                return (
                  <NFTCard
                    key={card.id}
                    id={card.id}
                    icon={cards[card.id]?.properties?.image?.value}
                    name={cards[card.id]?.properties?.name?.value}
                    balance={card.balance}
                    byId
                  />
                );
              })
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-white font-bold gap-4 relative">
              <img src={Icons.logoCard} className="w-24 h-24" alt="" />
              You don't own EG NFTs Cards yet
            </div>
          )
        ) : columnSelected === "Packs" ? (
          inventoryPacks.filter((pack) => parseInt(pack.quantity) > 0).length >
          0 ? (
            inventoryPacks
              .filter((pack) => parseInt(pack.quantity) > 0)
              .map((pack, index) => {
                return (
                  <Link href={`/PackDetailID/${pack.id}`}>
                    <div
                      className={clsx(
                        "rounded-xl flex flex-col text-gray-100 w-96 bg-secondary cursor-pointer relative overflow-hidden border border-gray-500 m-4 cursor-pointer",
                        Styles.cardHover,
                      )}
                    >
                      <img
                        src={pack.image}
                        className="absolute top-[-40%] bottom-0 left-[-5%] right-0 margin-auto opacity-50 min-w-[110%]"
                        alt=""
                      />
                      <div className="flex flex-col items-center relative">
                        <div className="w-full flex flex-col items-center text-xs gap-1">
                          <div className="w-full text-lg flex justify-between rounded-xl p-2 bg-secondary">
                            <span>
                              Pack #{pack.id !== undefined ? pack.id : "12345"}
                            </span>
                            <span>
                              x
                              {nfts.balancePacks[pack.id].balance
                                ? nfts.balancePacks[pack.id].balance
                                : ""}
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-72 flex justify-center items-center my-6">
                          <img
                            src={pack.image || Icons.logo}
                            className={pack.image ? "h-64" : "h-24"}
                          />
                        </div>
                        <div className="flex flex-col rounded-xl bg-secondary w-full px-4 pb-3 relative">
                          <div className="flex text-lg font-bold text-left py-2 ">
                            <div className="w-40 relative">
                              <img
                                src={Icons.logoCard}
                                className="w-40 absolute top-[-60px]"
                                alt=""
                              />
                            </div>
                            <div className="w-full flex flex-col justify-center">
                              <span className="uppercase text-white text-lg">
                                {pack.name || "Enders Gate"}
                              </span>
                            </div>
                            <img
                              src={Icons.logo}
                              className="w-10 h-10"
                              alt=""
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-white font-bold gap-4 relative">
              <img src={Icons.logoCard} className="w-24 h-24" alt="" />
              You don't own EG NFTs Packs yet
            </div>
          )
        ) : (
          <>
            <img src={Icons.logo} className="h-40 w-40" alt="" />
            <Typography
              type="subTitle"
              className={clsx(Styles.title, "text-primary")}
            >
              You don't have any item yet
            </Typography>
          </>
        )}
      </div>
      ;
    </div>
  );
};

export default Inventory;
