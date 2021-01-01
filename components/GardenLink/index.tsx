import Link, { LinkProps } from "next/link";
import { MouseEvent } from "react";

import styled from "styled-components";

export interface GardenLinkProps extends Omit<LinkProps, "as"> {
  className?: string;
  children: React.ReactNode;
  onClick?(e: MouseEvent): void;
  onMouseOver?(e: MouseEvent): void;
  onMouseEnter?(e: MouseEvent): void;
  onMouseLeave?(e: MouseEvent): void;
  withAs?: LinkProps["as"];
}

const StyledLink = ({
  withAs,
  className,
  children,
  href,
  onClick,
  onMouseOver,
  onMouseEnter,
  onMouseLeave,
}: GardenLinkProps) => (
  <Link href={href} as={withAs} passHref>
    <a
      onClick={onClick}
      className={className}
      onMouseOver={onMouseOver}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  </Link>
);

const GardenLink = styled(StyledLink)`
  color: green;
  // text-decoration: none;
  // transition: all 0.2s ease-in-out;

  // &:hover {
  //   color: #40a9ff;
  // }

  // &:focus {
  //   color: #40a9ff;
  //   outline: none;
  //   border: 0;
  // }
`;

// function GardenLink({}: LinkProps) {
//   return <Link {...props} />;
// }

export default GardenLink;
