import { AppProps } from "next/app";
import Head from 'next/head';
import Link from 'next/link'

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from '../components/SiteNav';
import Socials from "../components/Socials";


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className='content'>
        <h1><Link href='/'>Richard Ng</Link></h1>
        <div style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          // marginBottom: '1rem'
        }}>
          <span><b>Tech, education, startups, D&I</b></span>
          <button><a href='https://calendly.com/richard-ng/serendipity-slots' target='_blank'>Calendar me</a></button>
          <style jsx>{`
            button {
              background-color: white;
              outline-color: black;
              transition-duration: 0.4s;
            }

            button a {
              text-decoration: none;
            }

            button:hover {
              background-color: black;
              outline-color: white;
              color: white;
            }
          `}</style>
        </div>
        <div style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between'
        }}>
          <SiteNav />
          <Socials />
        </div>
        <br />
        <div style={{
          marginBottom: '2rem'
        }}>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
