import React from "react";
import Link from "next/link";
import { Layout } from "antd";
import { useMoralis } from "react-moralis";

import { Icons } from "@shared/const/Icons";
import { useRouter } from "next/dist/client/router";
import clsx from "clsx";
import { Button } from "../common/button/button";
import { DropdownMenu } from "../common/dropdownMenu/dropdownMenu";
import { MenuIcon } from "@heroicons/react/outline";
import { SidebarMobile } from "./sidebars/mobile";
import { useAppSelector, useAppDispatch } from "redux/store";
import { onGetAssets, onLoadSales } from "redux/actions";
import {
  AppstoreFilled,
  AreaChartOutlined,
  GoldenFilled,
  ShopOutlined,
  TwitterOutlined,
  WalletOutlined,
} from "@ant-design/icons";

import {
  getAddresses,
  getContract,
  getWeb3,
  loginMetamaskWallet,
} from "@shared/web3";

const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",
    color: "#041836",
  },
  // headerRight: {
  //   display: "flex",
  //   gap: "20px",
  //   alignItems: "center",
  //   fontSize: "15px",
  //   fontWeight: "600",
  // },
};

const navItems = [
  { name: "DASHBOARD", link: "/dashboard", icon: <AreaChartOutlined /> },
  { name: "EXPLORE", link: "/marketplace", icon: <ShopOutlined /> },
  {
    link: "/profile/inventory",
    name: "INVENTORY",
    icon: <GoldenFilled />,
  },
];

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const refSidebarMobile = React.useRef(null);
  const [isExecuted, setIsExecuted] = React.useState(false);
  const [notAvailable, setNotAvailable] = React.useState({
    message: "",
    value: false,
  });
  const { blur, message } = useAppSelector((state) => ({
    ...state.layout,
  }));
  const router = useRouter();
  const { enableWeb3, isWeb3Enabled, isAuthenticated, authenticate, user } =
    useMoralis();

  const chainChangedHandler = async () => {
    // window.location.reload();
    const web3 = await getWeb3();
    const networkId = await web3.eth.net.getId();
    if (networkId != 1666600000 && networkId != 1666600000) {
      setNotAvailable({
        message: "Change your network to harmony mainnet please",
        value: true,
      });
    } else {
      setNotAvailable({
        message: "",
        value: false,
      });
    }
  };

  const accountChangedHandler = async (newAccount: any) => {
    const web3 = await loginMetamaskWallet();
    await dispatch(onGetAssets((window as any).ethereum.selectedAddress));
    // if (user !== null) {
    await enableWeb3();
    const user = await authenticate();
    // }
  };
  if (
    typeof window !== "undefined" &&
    (window as any).ethereum?.isConnected() &&
    !isExecuted
  ) {
    (window as any).ethereum.on("accountsChanged", accountChangedHandler);
    (window as any).ethereum.on("chainChanged", chainChangedHandler);
    setIsExecuted(true);
  }

  const dispatch = useAppDispatch();

  const initApp = async () => {
    const addresses = getAddresses();
    const marketplace = getContract("ClockSale", addresses.marketplace);
    await dispatch(onLoadSales());
  };

  const handleEnableWeb3 = async () => {
    if (!isWeb3Enabled) {
      await enableWeb3();
    }
  };

  React.useEffect(() => {
    initApp();
  }, []);

  React.useEffect(() => {
    if (isAuthenticated && user) dispatch(onGetAssets(user.get("ethAddress")));
  }, [isAuthenticated]);

  React.useEffect(() => {
    handleEnableWeb3();
  }, [isWeb3Enabled]);

  return (
    <Layout
      style={{
        height: "100vh",
        // overflow: "auto",
        ...(blur
          ? {
              filter: "blur(8px)",
              "-webkit-filter": "blur(8px)",
            }
          : {}),
      }}
    >
      <nav
        className={clsx(
          "fixed top-0 z-10",
          "bg-overlay",
          "w-[100%] px-8 py-2 flex flex-row items-center justify-between shadow-md",
        )}
      >
        <Logo />
        <div className="md:flex hidden gap-4 items-center">
          {navItems.map((item, index) => {
            return (
              <>
                <NavbarItem
                  key={index}
                  name={item.name}
                  link={item.link}
                  route={router.asPath}
                />
              </>
            );
          })}
          <NavbarItem
            name={isAuthenticated ? "MY ACCOUNT" : "Log In"}
            link={isAuthenticated ? "/profile" : "/login"}
            route={router.asPath}
          />
        </div>
        <div
          className="md:hidden flex"
          onClick={() => {
            setSidebarOpen(true);
          }}
        >
          <MenuIcon
            className="h-6 w-6 text-primary cursor-pointer"
            aria-hidden="true"
          />
        </div>
      </nav>
      <SidebarMobile
        initialFocus={refSidebarMobile}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      {notAvailable.value ? (
        <div className="bg-overlay md:px-10 px-6 flex flex-col items-center justify-center w-screen h-screen text-primary text-3xl font-bold">
          {notAvailable.message}
        </div>
      ) : (
        <div
          className={clsx("bg-overlay", {
            ["md:px-10 px-6"]: router.asPath !== "/marketplace",
          })}
          style={styles.content}
        >
          {children}
          <Message content={message} open={Boolean(message)} />
        </div>
      )}
    </Layout>
  );
}

export const Message: React.FunctionComponent<{
  content: string;
  open: boolean;
}> = (props) => {
  const { content, open } = props;

  return (
    <div
      className={clsx(
        `absolute bottom-3.5 left-3.5 bg-purple-300 px-10 py-4 rounded-md`,
        "ease-out duration-300",
        open ? "scale-100" : "scale-0",
      )}
    >
      {content}
    </div>
  );
};

export const Logo = () => (
  <Link href="/dashboard">
    <div className="mr-4 md:py-0 py-2 flex gap-2 items-center cursor-pointer">
      <img className="h-6" src={Icons.logo5HG} alt="logo" />
      <img className="h-6 xl:block hidden" src={Icons.logoenders} alt="logo" />
    </div>
  </Link>
);

export const NavbarItem = ({ name, link, route }) => {
  return (
    <Link href={link}>
      <a className={clsx("py-2 relative")} href={link}>
        <div
          className={clsx(
            { "opacity-50": link !== route },
            "gap-2 flex items-center text-white",
          )}
        >
          <h3 className={clsx("text-md font-[450]")}>{name}</h3>
        </div>
      </a>
    </Link>
  );
};
