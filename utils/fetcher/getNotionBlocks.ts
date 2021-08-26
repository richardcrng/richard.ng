import { ExtendedRecordMap } from 'notion-types';
import fetcher from '.';

export const getNotionPageBlocks = async (notionPageId: string) => {
  const blocks: ExtendedRecordMap = await fetcher(`/api/notionPageBlocks/${notionPageId}`);
  return blocks;
};
