import { FunctionComponent, ReactNode, useState } from "react";
import { Popover } from "@geist-ui/react";
import GardenLink from ".";
import { GardenLinkProps } from "./index";

interface GardenLinkWithPopoverProps extends GardenLinkProps {
  content: FunctionComponent | ReactNode;
}

function GardenLinkWithPopover({
  content,
  ...rest
}: GardenLinkWithPopoverProps) {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <Popover
      content={content}
      visible={showPopover}
      onVisibleChange={setShowPopover}
      placement="top"
      // to stop long anchors ruining on mobile
      style={{ width: "inherit", display: "inline" }}
    >
      <GardenLink
        {...rest}
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      />
    </Popover>
  );
}

export default GardenLinkWithPopover;
