import type { AppProps } from "next/app";
import LayoutContainer from "../src/components/Layouts/SiteLayout";
import UseWalletProviderWrapper from "@providers/UseWalletProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import FavIcon from "public/icons/svgs/circlelogo.svg";
import { useSetDocumentTitle } from "@hooks/useSetDocumentTitle";
import "@spatie/media-library-pro-react-styles/dist/styles.css";
import "../styles/globals.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-tooltip/dist/react-tooltip.css";
import DataProviders from "@providers/DataProviders";
import SWRWrapper from "@providers/SWR";

function MyApp({ Component, pageProps }: AppProps) {
  useSetDocumentTitle();
  return (
    <UseWalletProviderWrapper>
      <SWRWrapper>
        <LayoutContainer>
          <Head>
            <title>BullPad</title>
            <link rel="shortcut icon" href="/favicon.ico" />
          </Head>
          <DataProviders>
            <Component {...pageProps} /> <ToastContainer />
          </DataProviders>
        </LayoutContainer>
      </SWRWrapper>
    </UseWalletProviderWrapper>
  );
}

export default MyApp;
