import { VercelRequest, VercelResponse } from "@vercel/node";
import { NowRaw, NowRefined } from "../../../types/notion/now.types";
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
  const nows: NowRefined[] = response.results.map(notionPage => {
    // coerce because Notion doesn't know shape but we do
    // TODO build type assertion
    const pageProperties = notionPage.properties as unknown as NowRaw;
    return {
      notionPageId: notionPage.id,
      date: pageProperties.date.date.start,
      isPublished: pageProperties.isPublished.checkbox,
      slug: pageProperties.slug.title[0].plain_text
    }
  })
  res.json(nows);
}