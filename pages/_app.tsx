import { AppProps } from "next/app";
import Link from "next/link";

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from "../components/SiteNav";
import Socials from "../components/Socials";
import Metadata from "../components/Metadata";

export interface CommonPageProps {
  suppressNav?: boolean
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Metadata />
      <div className="content">
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
        <div style={{ marginBottom: "0.5rem" }}>
          <b>Tech, education, startups, D&I</b>
        </div>
        {!pageProps.suppressNav && (
          <div className="navbar">
            <SiteNav />
          </div>
        )}
        <br />
        <div className="main-body">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
