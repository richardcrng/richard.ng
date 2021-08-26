import { GetStaticProps } from 'next';
import Link from "next/link";
import Page from "../components/Page";
import { ExtendedRecordMap } from 'notion-types';
import { getNotionPageBlocks } from '../utils/fetcher/getNotionBlocks';

const NOTION_PAGE_ID =
  "fbd6b558853a4cb28ff093db17f8a7d1";

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

const Media: React.FC<Props> = ({
  blocks,
}) => {
  return (
    <Page blocks={blocks} title='Me'>
      {(notionContent) => (
        <>
          <p><b>Looking for a 'professional bio?' <Link href='/work'>There's a separate page for that.</Link></b></p>
          {notionContent}
        </>
      )}
    </Page>
  );
};


export default Media;


