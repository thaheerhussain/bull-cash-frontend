import React from "react";
import type { NextPage } from "next";
import MeComp from "@components/Me";
import Authenticated from "@providers/Authenticated";

const MePage: NextPage = () => {
  return (
    <div>
      <Authenticated>
        <MeComp />
      </Authenticated>
    </div>
  );
};

export default MePage;
