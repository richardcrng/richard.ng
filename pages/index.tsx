import { NotionAPI } from "notion-client";
import Page from "../components/Page";
import { ExtendedRecordMap } from 'notion-types';

const NOTION_PAGE_ID = "7378f66a7b2f4cb19cd101b2f7a496ec";

export async function getStaticProps() {
  const notion = new NotionAPI();
  const blocks = await notion.getPage(NOTION_PAGE_ID);

  return {
    props: {
      blocks,
    },
  };
}

const Home: React.FC<{ blocks: ExtendedRecordMap }> = ({ blocks }) => {
  return <Page blocks={blocks} />;
};

export default Home;
