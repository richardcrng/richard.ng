import { NotionRenderer, BlockMapType } from "react-notion";

const NOTION_PAGE_ID = "f434fec9855b4ae29477b2d223aae7d6";

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
      <NotionRenderer blockMap={blocks} />
    </div>
  );
};


export default Work;


