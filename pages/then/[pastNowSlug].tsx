import Page from "../../components/Page";
import { NowRefined } from "../../types/now.types";
import { ExtendedRecordMap } from 'notion-types';
import { GetStaticProps } from 'next';
import { NotionAPI } from "notion-client";
import { getPublishedNows } from "../../utils/fetcher/getPublishedNows";

export const getStaticProps: GetStaticProps<Props, { pastNowSlug: string; }> = async ({
  params,
}) => {
  const { pastNowSlug } = params!
  const publishedNows = await getPublishedNows();
  const relevantNow = publishedNows.find((now) => now.slug === pastNowSlug);

  if (!relevantNow) {
    return {
      notFound: true
    }
  }

  const notion = new NotionAPI();
  const blocks = await notion.getPage(relevantNow.notionPageId);

  return {
    props: {
      blocks,
      now: relevantNow,
    },
  };
}

interface Props {
  now: NowRefined;
  blocks: ExtendedRecordMap;
}

const BlogNow: React.FC<Props> = ({
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
    paths: table.map((now) => `/then/${now.slug}`),
    fallback: false,
  };
}

export default BlogNow;
