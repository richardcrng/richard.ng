// import Link from "next/link";

const NOTION_PAGE_ID = "7378f66a7b2f4cb19cd101b2f7a496ec";

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

const Home: React.FC<{ blocks: BlockMapType }> = ({
  blocks,
}) => {
  return (
    <div className="content">
      <h1>Richard Ng</h1>
      <NotionRenderer blockMap={blocks} />
    </div>
  );
};


export default Home;


