import { request } from "graphql-request";
export const fetcher = (query: any) =>
  request(
    "https://api.thegraph.com/subgraphs/name/martianatwork/circle-mumbai",
    query
  );
