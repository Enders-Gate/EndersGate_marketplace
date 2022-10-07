import ProfileLayoutComponent from "@shared/components/Profile/profile";
import { useMoralis } from "react-moralis";
import React from "react";
import { useRouter } from "next/router";
import AccountSettingsComponent from "@shared/components/Profile/accountSettings/accountSettings";

const ProfileSettings = () => {
  const { isAuthenticated } = useMoralis();
  const router = useRouter();

  React.useEffect(() => {
    console.log(isAuthenticated);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated]);
  return <AccountSettingsComponent />;
};

export default ProfileSettings;
