import { BlockMapType } from "react-notion";
import Page from "../../components/Page";

import { getPublishedNows, Now } from "../now";

export async function getStaticProps({
  params: { pastNowSlug },
}: {
  params: { pastNowSlug: string };
}) {
  // Get all nows again
  const nows = await getPublishedNows();

  // Find the current blognow by pastNowSlug
  const now = nows.find((t) => t.slug === pastNowSlug);

  if (!now) {
    return {
      notFound: true
    }
  }

  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${now.id}`
  ).then((res) => res.json());

  return {
    props: {
      blocks,
      now,
    },
  };
}

const BlogNow: React.FC<{ now: Now; blocks: BlockMapType }> = ({
  now,
  blocks,
}) => {
  if (!now) return null;

  return (
    <Page blocks={blocks} title={`Then: ${now.date}`}>
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
            <p><i>This version: {now.date}</i></p>
            <p className="notion-h1" style={{ marginTop: '0.5rem' }}><s>What am I up to right <code className="notion-inline-code">/now</code>?</s></p>
            <h1 className="notion-h1" style={{ marginTop: '0.5rem' }}>What <i>was</i> I up to back <i>then</i>?</h1>
            <p className="notion-text">
              <b>This <i>was</i> my </b><code className="notion-inline-code"><b>/now</b></code><b> page.</b> It was written with two main goals mind:
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
            <hr className='notion-hr' />
          </div>
          {notionContent}
        </>
      )}
    </Page>
  );
};

export async function getStaticPaths() {
  const table = await getPublishedNows();
  return {
    paths: table.map((row) => `/then/${row.slug}`),
    fallback: false,
  };
}

export default BlogNow;
