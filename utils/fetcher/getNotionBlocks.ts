import { NotionAPI } from 'notion-client'

export const getNotionPageBlocks = async (notionPageId: string) => {
  const notion = new NotionAPI();
  const blocks = await notion.getPage(notionPageId as string);
  return blocks;
};
