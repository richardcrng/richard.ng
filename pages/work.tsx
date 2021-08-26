import { GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';
import Page from "../components/Page";
import { getNotionPageBlocks } from '../utils/fetcher/getNotionBlocks';

const NOTION_PAGE_ID = "f434fec9855b4ae29477b2d223aae7d6";

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      blocks: await getNotionPageBlocks(NOTION_PAGE_ID),
    },
    revalidate: 60
  };
};

interface Props {
  blocks: ExtendedRecordMap;
}

function Work({ blocks }: Props) {
  return (
    <Page blocks={blocks} title='Work' />
  );
};


export default Work;


