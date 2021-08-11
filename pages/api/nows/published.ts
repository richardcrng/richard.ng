import { VercelRequest, VercelResponse } from "@vercel/node";
import notion from "../index";

const NOTION_TABLE_ID = "0989c683e9554d57a54f09761a0e3ae7";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const response = await notion.databases.query({
    database_id: NOTION_TABLE_ID,
    filter: {
      property: "isPublished",
      checkbox: {
        equals: true
      }
    },
    sorts: [
      {
        property: 'date',
        direction: 'descending'
      }
    ]
  });
  res.json(response.results);
}