const NOTION_PAGE_ID = "cd63bee3ccda419ab1e15efb72d251fa";

import Page from "../components/Page";
import { getNotionPageBlocks } from "../utils/fetcher/getNotionBlocks";
import { GetStaticProps } from 'next';
import { ExtendedRecordMap } from 'notion-types';

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      blocks: await getNotionPageBlocks(NOTION_PAGE_ID)
    },
  };
}

interface Props {
  blocks: ExtendedRecordMap
}

const Speaking: React.FC<Props> = ({
  blocks,
}) => {
  return (
    <Page blocks={blocks} title='Speaking' />
  );
};


export default Speaking;


