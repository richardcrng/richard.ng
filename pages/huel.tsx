import { GetStaticProps } from 'next';
import Page from "../components/Page";
import { ExtendedRecordMap } from 'notion-types';
import { getNotionPageBlocks } from '../utils/fetcher/getNotionBlocks';

const NOTION_PAGE_ID = "7ed873d697144113ae0a84cd0a1a8441";

export const getStaticProps: GetStaticProps<Props> = async () => {
  
  return {
    props: {
      blocks: await getNotionPageBlocks(NOTION_PAGE_ID)
    },
    revalidate: 60
  };
}

interface Props {
  blocks: ExtendedRecordMap
}

const Media: React.FC<Props> = ({
  blocks,
}) => {
  return (
    <Page blocks={blocks} title='Huel' />
  );
};


export default Media;


