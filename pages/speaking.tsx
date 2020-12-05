const NOTION_PAGE_ID = "cd63bee3ccda419ab1e15efb72d251fa";

import { BlockMapType } from "react-notion";
import Page from "../components/Page";

export async function getStaticProps() {
  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${NOTION_PAGE_ID}`
  ).then((res) => res.json());

  return {
    props: {
      blocks
    },
  };
}

const Speaking: React.FC<{ blocks: BlockMapType }> = ({
  blocks,
}) => {
  return (
    <Page blocks={blocks} title='Speaking' />
  );
};


export default Speaking;


