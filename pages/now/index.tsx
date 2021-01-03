import Link from "next/link";
import { BlockMapType } from "react-notion";
import Page from "../../components/Page";

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
          <p><i>Last updated: {currentNow.date}</i></p>
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
          <Link key={now.id} href={`/now/${now.slug}`}>
            <a>
              <b>{now.date}</b>
            </a>
          </Link>
        ))}
      </div>
    )
  }

  return null
}

export default Now;
