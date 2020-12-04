import { NotionRenderer, BlockMapType } from "react-notion";
import Link from "next/link";

const NOTION_PAGE_ID =
  "fbd6b558853a4cb28ff093db17f8a7d1";

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

const Media: React.FC<{ blocks: BlockMapType }> = ({
  blocks,
}) => {
  return (
    <div className="content">
      <p><b>Looking for a 'professional bio?' <Link href='/work'>There's a separate page for that.</Link></b></p>
      <NotionRenderer blockMap={blocks} />
    </div>
  );
};


export default Media;


