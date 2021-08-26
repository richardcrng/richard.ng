import Page from "../components/Page";
import { ExtendedRecordMap } from 'notion-types';
import { GetStaticProps } from 'next';
import { getNotionPageBlocks } from "../utils/fetcher/getNotionBlocks";

const NOTION_PAGE_ID = "7378f66a7b2f4cb19cd101b2f7a496ec";

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      blocks: await getNotionPageBlocks(NOTION_PAGE_ID),
    },
    revalidate: 60
  };
}

interface Props {
  blocks: ExtendedRecordMap
}

const Home: React.FC<Props> = ({ blocks }) => {
  return <Page blocks={blocks} />;
};

export default Home;
