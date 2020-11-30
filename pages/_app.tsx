import { AppProps } from "next/app";
import Link from 'next/link'
import styled from 'styled-components'

import "react-notion/src/styles.css";
import "prismjs/themes/prism-tomorrow.css";

import "../styles.css";
import SiteNav from '../components/SiteNav';
import Socials from "../components/Socials";

const Flex = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className='content'>
      <h1><Link href='/'>Richard Ng</Link></h1>
      <Flex>
        <SiteNav />
        <Socials />
      </Flex>
      <br />
      <Component {...pageProps} />
    </div>
  );
}
