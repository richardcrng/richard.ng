import { AppProps } from "next/app";
import Link from 'next/link'

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from '../components/SiteNav';
import Socials from "../components/Socials";


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
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
      <Component {...pageProps} />
    </div>
  );
}
