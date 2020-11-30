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
