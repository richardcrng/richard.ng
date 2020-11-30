import Link from "next/link";
import { Fragment } from 'react';

const paths: Record<string, string> = {
  // Home: '/',
  Work: '/work',
  Speaking: '/speaking',
  Writing: '/blog',
  Media: '/media'
}

const SiteNav: React.FC<{}> = () => {
  const routes = Object.entries(paths)

  return (
    <span>
      {routes.map(([text, href], idx) => (
        idx < routes.length - 1
          ? (
            <Fragment key={href}>
              <Link href={href}>{text}</Link>
              <span> | </span>
            </Fragment>
          )
          : <Link key={href} href={href}>{text}</Link>
      ))}
    </span>
  )
}

export default SiteNav