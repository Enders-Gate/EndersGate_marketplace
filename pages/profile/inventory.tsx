import ProfileLayoutComponent from "@shared/components/Profile/profile";
import React from "react";
import { useRouter } from "next/router";
import Inventory from "@shared/components/Profile/inventory/inventory";
import useMagicLink from "@shared/hooks/useMagicLink";
import { useSelector } from "react-redux";

const ProfileInventory = () => {
  const { user } = useMagicLink();
  const router = useRouter();

  React.useEffect(() => {
    if (user && !user.ethAddress) {
      router.push("/login");
    }
  }, [user]);

  return (
    <ProfileLayoutComponent>
      <Inventory></Inventory>
    </ProfileLayoutComponent>
  );
};

export default ProfileInventory;
