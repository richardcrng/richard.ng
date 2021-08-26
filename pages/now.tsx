import { GetStaticProps } from "next";
import Link from "next/link";
import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
import Page from "../components/Page";
import { NowRefined } from '../types/notion/now.types';
import { getPublishedNows } from "../utils/fetcher/getPublishedNows";


export const getStaticProps: GetStaticProps<Props> = async () => {
  const [currentNow, ...pastNows] = await getPublishedNows();
  const notion = new NotionAPI();
  const blocks = await notion.getPage(currentNow.notionPageId);

  return {
    props: {
      blocks,
      currentNow,
      pastNows,
    },
  };
}

interface Props {
  blocks: ExtendedRecordMap,
  currentNow: NowRefined,
  pastNows: NowRefined[]
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

const ArchivedNows: React.FC<{ nows: NowRefined[] }> = ({
  nows
}) => {
  if (nows.length >= 1) {
    return (
      <div>
        <h3>Previous</h3>
        {nows.map((now) => (
          <Link key={now.notionPageId} href={`/then/${now.slug}`}>
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
