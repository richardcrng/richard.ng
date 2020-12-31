import Link, { LinkProps } from "next/link";
import { MouseEvent } from "react";

import styled from "styled-components";

interface GardenLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
  onClick?(e: MouseEvent): void;
}

const StyledLink = ({
  as,
  className,
  children,
  href,
  onClick,
}: GardenLinkProps) => (
  <Link href={href} as={as} passHref>
    <a onClick={onClick} className={className}>
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
