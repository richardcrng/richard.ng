import { PaginatedList } from "@notionhq/client/build/src/api-types";
import { GetStaticProps } from "next";
import Link from "next/link";
// import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
import useSWR from "swr";
// import { BlockMapType } from "react-notion";
import Page from "../components/Page";
import fetcher from "../utils/fetcher";
import { NowRaw } from '../types/notion/now.types';

// const notion = new NotionAPI()

const NOTION_TABLE_ID = "0989c683e9554d57a54f09761a0e3ae7";
const NOTION_VIEW_ID = "f44ab40e114e48319d87650fd44747f2";

export type Now = {
  id: string;
  slug: string;
  date: string,
  isPublished: boolean
};

// export const getNow = async (id: string): Promise<ExtendedRecordMap> => {
//   const notion = new NotionAPI();
//   return await notion.getPage(id)
// }

export const getAllNows = async (): Promise<Now[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${NOTION_TABLE_ID}`
  ).then((res) => res.json());
};

export const getPublishedNows = async (): Promise<any> => {
  const response = await fetch('/api/nows/published')
  return await response.json();
  // return await (await fetch('/api/getNows')).json()
  // const notion = new NotionAPI();
  // const collection = await notion.getCollectionData(NOTION_TABLE_ID, NOTION_VIEW_ID, { query: { property: "isPublished", equals: true } });
  // const ids = collection.result.blockIds;
  // const results = collection.result.aggregationResults;
  // console.log(results)
  // return Promise.all(ids.map(getNow))
  // return map
  // const allNows = await getAllNows()
  // return allNows.filter(now => now.isPublished)
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const response: NowRaw[] = await fetcher(`/api/nows/published`);
  console.log("nows", response)

  // const currentNow = await notion.getPage(currentNowId);
  // const pastNows = await Promise.all(pastNowIds.map(id => notion.getPage(id)))

  // console.log('current', currentNow, 'past', pastNows)

  // const blocks = await notion.getPage(currentNowId);

  return {
    props: {
      blocks: response,
      // currentNow,
      // pastNows,
    },
  };
}

interface Props {
  blocks: NowRaw[],
  // currentNow: Now,
  // pastNows: Now[]
}

const Now: React.FC<Props> = ({ blocks, currentNow, pastNows }) => {

  return (
    <Page blocks={blocks} title="Now">
      {(notionContent) => (
        <>
          <div className="notion">
            <div className="notion-callout notion-gray_background_co">
              <div>
                <span
                  className="notion-emoji notion-page-icon"
                  role="img"
                  aria-label="🤔"
                >
                  🤔
                </span>
              </div>
              <div className="notion-callout-text">
                <b>Learn more:</b>{" "}
                <a className="notion-link" href="https://nownownow.com/about">
                  what's a Now Page?
                </a>
              </div>
            </div>
            <p>
              <i>Last updated: {currentNow.date}</i>
            </p>
            <h1 className="notion-h1" style={{ marginTop: "0.5rem" }}>
              What am I up to right{" "}
              <code className="notion-inline-code">/now</code>?
            </h1>
            <p className="notion-text">
              <b>This is my </b>
              <code className="notion-inline-code">
                <b>/now</b>
              </code>
              <b> page.</b> It's written with two main goals mind:
            </p>
            <ol start={1} className="notion-list notion-list-numbered">
              <li>To answer the prompt:</li>
              <ol className="notion-list notion-list-numbered">
                <blockquote className="notion-quote">
                  Think of{" "}
                  <b>what you’d tell a friend you hadn’t seen in a year.</b>
                </blockquote>
              </ol>
            </ol>
            <ol start={2} className="notion-list notion-list-numbered">
              <li>
                To provide focus, clarity and public accountability on my goals.
              </li>
            </ol>
            <p className="notion-text">
              It will get updated sporadically - probably between quarterly and
              monthly.
            </p>
            <hr className="notion-hr" />
          </div>
          {notionContent}
          <ArchivedNows nows={pastNows} />
        </>
      )}
    </Page>
  );
};

const ArchivedNows: React.FC<{ nows: Now[] }> = ({
  nows
}) => {
  if (nows.length >= 1) {
    return (
      <div>
        <h3>Previous</h3>
        {nows.map((now) => (
          <Link key={now.id} href={`/then/${now.slug}`}>
            <a>
              <b>{now.slug}</b>
            </a>
          </Link>
        ))}
      </div>
    )
  }

  return null
}

export default Now;
