import { BlockMapType } from "react-notion";
import Page from "../components/Page";

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
    <Page blocks={blocks} title='Work' />
  );
};


export default Work;


