import { fetcher } from "@helpers/gqlFetcher";
import React from "react";
import { SWRConfig } from "swr";

const SWRWrapper = ({ children }: { children: React.ReactNode }) => {
  return <SWRConfig value={{ fetcher }}>{children}</SWRConfig>;
};

export default SWRWrapper;
