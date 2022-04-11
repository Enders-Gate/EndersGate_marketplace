import React from "react";
import ProfileDataAndActions from "./profilePersonalData/profilePersonalData";

const ProfileLayoutComponent = ({children}) => {
  const [testUrl, setTestUrl] = React.useState("");
  const inputFile = React.useRef(null);

  const onButtonClick = () => {
    // `current` points to the mounted file input element
    inputFile.current.click();
  };

  const onLoad = (load: unknown) => {
    console.log({load});
  };

  const onError = (error: unknown) => {
    console.log({error});
  };

  const onSuccess = () => {};

  const onChangeFile = async (e: React.ChangeEvent<any>) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    console.log("Fukc");
    const metadata = {
      name: file.name,
      lastModified: file.lastModified,
      lastModifiedDate: file.lastModifiedDate,
      size: file.size,
      type: file.type,
    };
  };

  return (
    <div className="flex w-full ">
      <aside className="md:flex hidden flex-col pt-32 pr-8 h-screen w-72 border-r border-overlay-border">
        <ProfileDataAndActions />
      </aside>
      <div className="w-full pt-28 md:px-4 min-h-screen">{children}</div>
    </div>
  );
};

export default ProfileLayoutComponent;
