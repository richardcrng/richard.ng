import { useEffect, useState } from "react";
import { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

import "ts-polyfill";

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from "../components/SiteNav";
import Socials from "../components/Socials";
import Metadata from "../components/Metadata";
import * as gtag from "../utils/gtag";

export interface CommonPageProps {
  suppressNav?: boolean;
  wholePage?: boolean;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isDarkMode, setDarkMode] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Metadata />
      {pageProps.wholePage && <Component {...pageProps} />}
      {!pageProps.wholePage && (
        <div className="content">
          <div></div>
          <div>
            <h1
              style={{
                display: "inline-block",
                marginRight: "10px",
                marginBottom: "0",
              }}
            >
              <Link href="/">Richard Ng</Link>
            </h1>
            <span>
              <Socials />
            </span>
          </div>
          <div>
            <b>Tech, education, startups, D&I</b>
          </div>
          {!pageProps.suppressNav && (
            <div className="navbar">
              <SiteNav
                isDarkMode={isDarkMode}
                handleDarkModeChange={setDarkMode}
              />
            </div>
          )}
          <br />
          <div className="main-body">
            <Component {...pageProps} />
          </div>
        </div>
      )}
    </>
  );
}
