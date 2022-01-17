import {
  FireFilled,
  HeartFilled,
  LeftOutlined,
  MenuOutlined,
  StarFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { Icons } from "@shared/const/Icons";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "../common/button/button";
import {
  AddressText,
  TransactionText,
} from "../common/specialFields/SpecialFields";
import { Typography } from "../common/typography";

const NFTDetailComponent = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen w-full flex flex-col xl:px-20 md:px-10 sm:px-6 pt-32">
      <div className="flex sm:flex-row flex-col sm:justify-between  w-full">
        <div className="flex flex-col gap-2">
          <div
            className="cursor-pointer text-white flex font-bold items-center gap-1"
            onClick={() => router.back()}
          >
            <LeftOutlined />
            Back
          </div>
          <Typography type="span" className="bg-white text-dark px-4 py-1">
            #
            <TransactionText
              text={"16545646486486489781156566544864864615468486471"}
            />
          </Typography>
          <Typography type="title" className="text-primary">
            Axie #
            <TransactionText
              text={"16545646486486489781156566544864864615468486471"}
            />
          </Typography>
        </div>
        <div className="flex gap-2 items-start sm:mt-0 mt-4 sm:justify-end justify-between">
          <div className="flex flex-col items-end">
            <div className="text-primary font-bold flex items-center gap-2">
              <MenuOutlined />
              <Typography type="title">0.035</Typography>
            </div>
            <Typography type="subTitle" className="text-white">
              $116.15
            </Typography>
          </div>
          <Button decoration="fillPrimary" size="small">
            <img src={Icons.harmony} className="h-6 w-5 mr-2" alt="" /> Buy now
          </Button>
        </div>
      </div>
      <div className="w-full flex md:flex-row flex-col mt-10">
        <div className="flex relative justify-center md:w-1/2 xl:px-24">
          <div className="sm:sticky sm:top-32 h-min w-72">
            <img src={Icons.logo} className="w-72" alt="" />
          </div>
        </div>
        <div className="flex flex-col md:w-1/2">
          <div className="flex flex-col">
            <Typography type="title" className="text-primary font-bold">
              About
            </Typography>
            <div className="flex flex-col gap-4 px-10 py-6 border border-primary rounded-xl mt-4">
              <div className="flex flex-row gap-4">
                <div className="flex flex-col">
                  <Typography
                    type="smallTitle"
                    className="text-white font-bold"
                  >
                    CLASS
                  </Typography>
                  <Typography
                    type="smallTitle"
                    className="text-primary opacity-75"
                  >
                    Earth
                  </Typography>
                </div>
                <div className="flex flex-col">
                  <Typography
                    type="smallTitle"
                    className="text-white font-bold"
                  >
                    BREED COUNT
                  </Typography>
                  <Typography
                    type="smallTitle"
                    className="text-primary opacity-75"
                  >
                    0/7
                  </Typography>
                </div>
              </div>
              <div>
                {" "}
                <div className="flex flex-col">
                  <Typography
                    type="smallTitle"
                    className="text-white font-bold"
                  >
                    OWNER
                  </Typography>
                  <Typography
                    type="smallTitle"
                    className="text-primary opacity-75"
                  >
                    Maria
                    <Typography type="span" className="text-gray-500 pl-2">
                      <AddressText text="one1hhe8ztms7cz2pmxwdm6js9mhna9u9ah6t255q9" />
                    </Typography>
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-4">
            <Typography type="title" className="text-primary font-bold">
              Stats
            </Typography>
            <div className="grid sm:grid-cols-4 grid-cols-2 items-center px-10 py-6 border border-primary rounded-xl mt-4">
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  HEALTH
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <HeartFilled />
                  45
                </div>
              </div>
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  SPEED
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <ThunderboltFilled />
                  50
                </div>
              </div>
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  SKILL
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <StarFilled />
                  31
                </div>
              </div>
              <div className="flex flex-col">
                <Typography type="smallTitle" className="text-white font-bold">
                  MORALE
                </Typography>
                <div className="flex items-center font-bold text-primary gap-1">
                  <FireFilled />
                  36
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailComponent;
