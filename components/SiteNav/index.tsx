import Link from "next/link";
import { Fragment } from "react";
// import { DarkModeSwitch } from "react-toggle-dark-mode";

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
    Graph: "/graph",
    Now: "/now",
  },
];

interface Props {
  isDarkMode: boolean;
  handleDarkModeChange?(bool: boolean): void;
}

const SiteNav: React.FC<Props> = ({ isDarkMode, handleDarkModeChange }) => {
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
        justifyContent: isDarkMode ? "flex-end" : "space-between",
        width: "100%",
        height: "36px",
      }}
    >
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
      {/* <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DarkModeSwitch
          checked={isDarkMode}
          onChange={(bool) =>
            handleDarkModeChange && handleDarkModeChange(bool)
          }
          size={24}
        />
      </div> */}
    </div>
  );
};

export default SiteNav;
