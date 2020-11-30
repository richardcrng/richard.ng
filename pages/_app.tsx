import { AppProps } from "next/app";
import Link from 'next/link'

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from '../components/SiteNav';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='content'>
      <h1><Link href='/'>Richard Ng</Link></h1>
      <SiteNav />
      <br />
      <Component {...pageProps} />
    </div>
  );
}
