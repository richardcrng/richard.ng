import Link from "next/link";
import { Fragment } from "react";

const paths: Record<string, string>[] = [
  {
    // Me: "/me",
    Work: "/work",
    Speaking: "/speaking",
    Writing: "/blog",
  },
  {
    Me: "/me",
    Garden: "/garden",
    Now: "/now",
  },
];

const SiteNav: React.FC<{}> = () => {
  const [upperRoutes, lowerRoutes] = paths.map(Object.entries);
  // const routes = [...upperRoutes, ...lowerRoutes];

  // return (
  //   <div
  //     style={{
  //       display: "grid",
  //       gridTemplateColumns: "1fr 1fr 1fr",
  //       justifyContent: "center",
  //       alignItems: "center",

  //     }}
  //   >
  //     {routes.map(([text, href]) => (
  //       <span key={href}>
  //         <Link key={href} href={href}>
  //           {text}
  //         </Link>
  //       </span>
  //     ))}
  //   </div>
  // );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        {upperRoutes.map(([text, href], idx) =>
          idx < upperRoutes.length - 1 ? (
            <Fragment key={href}>
              <Link href={href}>{text}</Link>
              <span> | </span>
            </Fragment>
          ) : (
            <Link key={href} href={href}>
              {text}
            </Link>
          )
        )}
      </div>
      <div>
        {lowerRoutes.map(([text, href], idx) =>
          idx < lowerRoutes.length - 1 ? (
            <Fragment key={href}>
              <Link href={href}>{text}</Link>
              <span> | </span>
            </Fragment>
          ) : (
            <Link key={href} href={href}>
              {text}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default SiteNav;
