import SidebarComp from "@components/Sidebar";
import React, { useEffect, useState } from "react";
import HeaderComp from "../../Header";
import { useRouter } from "next/router";
import Footer from "@components/Footer";
import useWidth from "@hooks/useWidth";
import NewHeader from "@components/NewHeader";

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const router = useRouter();
  const width = useWidth();

  useEffect(() => {
    if (width < 1300) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  }, [width]);

  return (
    <div className={`relative pb-4 2xl:pb-8 bg-[#010501] dark`}>
      {/* <HeaderComp
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerOpen={isDrawerOpen}
      /> */}
      <NewHeader />
      {/* {isDrawerOpen && (
        <SidebarComp
          setIsDrawerOpen={setIsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
        />
      )} */}
      <div className={`transition-all ease-linear duration-200`}>
        {children}
      </div>
      {/* <Footer className={isDrawerOpen ? "xl:ml-[250px]" : "ml-0"} /> */}
    </div>
  );
};

export default LayoutContainer;
