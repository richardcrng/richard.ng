import Link from "next/link";

const paths: Record<string, string> = {
  // Home: '/',
  Work: '/work',
  Speaking: '/speaking',
  Writing: '/blog'
}

const SiteNav: React.FC<{}> = () => {
  const routes = Object.entries(paths)

  return (
    <span>
      {routes.map(([text, href], idx) => (
        idx < routes.length - 1
          ? (
            <>
              <Link href={href}>{text}</Link>
              <span> | </span>
            </>
          )
          : <Link href={href}>{text}</Link>
      ))}
    </span>
  )
}

export default SiteNav