import { AppProps } from "next/app";
import Link from 'next/link'

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from '../components/SiteNav';
import Socials from "../components/Socials";
import Metadata from "../components/Metadata";


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Metadata />
      <div className='content'>
        <h1><Link href='/'>Richard Ng</Link></h1>
        <div className='introduction'>
          <span><b>Tech, education, startups, D&I</b></span>
          <button className='main-cta'>
            <a href='https://calendly.com/richard-ng/serendipity-slots' target='_blank'>Calendar me</a>
          </button>
        </div>
        <div className='navbar'>
          <SiteNav />
          <Socials />
        </div>
        <br />
        <div className='main-body'>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
