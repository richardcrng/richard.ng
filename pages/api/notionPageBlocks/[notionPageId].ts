import { VercelRequest, VercelResponse } from "@vercel/node";
import { NotionAPI } from "notion-client";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const notion = new NotionAPI();
  const { notionPageId } = req.query;
  const blocks = await notion.getPage(notionPageId as string);
  res.json(blocks);
}