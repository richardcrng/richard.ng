import Link from "next/link";
import { BlockMapType } from "react-notion";
import Page from "../components/Page";

const NOTION_TABLE_ID = "0989c683e9554d57a54f09761a0e3ae7";

export type Now = {
  id: string;
  slug: string;
  date: string,
  isPublished: boolean
};

export const getAllNows = async (): Promise<Now[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${NOTION_TABLE_ID}`
  ).then((res) => res.json());
};

export const getPublishedNows = async (): Promise<Now[]> => {
  const allNows = await getAllNows()
  return allNows.filter(now => now.isPublished)
}

export async function getStaticProps() {
  const [currentNow, ...pastNows] = await getPublishedNows();

  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${currentNow.id}`
  ).then((res) => res.json());

  return {
    props: {
      blocks,
      currentNow,
      pastNows,
    },
  };
}

const Now: React.FC<{ blocks: BlockMapType, currentNow: Now, pastNows: Now[] }> = ({ blocks, currentNow, pastNows }) => {
  return (
    <Page blocks={blocks} title='Now'>
      {notionContent => (
        <>
          <div className="notion">
            <div className="notion-callout notion-gray_background_co">
              <div>
                <span className="notion-emoji notion-page-icon" role="img" aria-label="🤔">🤔</span>
              </div>
              <div className="notion-callout-text">
                <b>Learn more:</b> <a className="notion-link" href="https://nownownow.com/about">what's a Now Page?</a>
              </div>
            </div>
            <p><i>Last updated: {currentNow.date}</i></p>
            <h1 className="notion-h1" style={{ marginTop: '0.5rem' }}>What am I up to right <code className="notion-inline-code">/now</code>?</h1>
            <p className="notion-text">
              <b>This is my </b><code className="notion-inline-code"><b>/now</b></code><b> page.</b> It's written with two main goals mind:
            </p>
            <ol start={1} className="notion-list notion-list-numbered">
              <li>To answer the prompt:</li>
              <ol className="notion-list notion-list-numbered">
                <blockquote className="notion-quote">Think of <b>what you’d tell a friend you hadn’t seen in a year.</b></blockquote>
              </ol>
            </ol>
            <ol start={2} className="notion-list notion-list-numbered">
              <li>To provide focus, clarity and public accountability on my goals.</li>
            </ol>
            <p className="notion-text">It will get updated sporadically - probably between quarterly and monthly.</p>
            <hr className='notion-hr' />
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
