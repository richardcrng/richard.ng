// import Link from "next/link";

const NOTION_PAGE_ID = "f434fec9855b4ae29477b2d223aae7d6";

import { NotionRenderer, BlockMapType } from "react-notion";

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

const Work: React.FC<{ blocks: BlockMapType }> = ({
  blocks,
}) => {
  return (
    <div className="content">
      <h1>Work</h1>
      <NotionRenderer blockMap={blocks} />
    </div>
  );
};


export default Work;


