import { Client } from "@notionhq/client";
import { NowRaw, NowRefined } from "../../types/now.types";

const NOTION_TABLE_ID = "0989c683e9554d57a54f09761a0e3ae7";

export const getPublishedNows = async () => {
  const notion = new Client({
    auth: process.env.NEXT_PUBLIC_NOTION_ACCESS_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: NOTION_TABLE_ID,
    filter: {
      property: "isPublished",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "date",
        direction: "descending",
      },
    ],
  });
  const nows: NowRefined[] = response.results.map((notionPage) => {
    // coerce because Notion doesn't know shape but we do
    // TODO build type assertion
    const pageProperties = notionPage.properties as unknown as NowRaw;
    return {
      notionPageId: notionPage.id,
      date: pageProperties.date.date.start,
      isPublished: pageProperties.isPublished.checkbox,
      slug: pageProperties.slug.title[0].plain_text,
    };
  });
  return nows;
};
