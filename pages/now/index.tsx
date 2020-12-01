import Link from "next/link";
import { NotionRenderer, BlockMapType } from "react-notion";

const NOTION_TABLE_ID = "0989c683e9554d57a54f09761a0e3ae7";

export type Now = {
  id: string;
  slug: string;
  date: string,
  published: boolean
};

export const getAllNows = async (): Promise<Now[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${NOTION_TABLE_ID}`
  ).then((res) => res.json());
};

export async function getStaticProps() {
  const allNows = await getAllNows();
  const [currentNow, ...pastNows] = allNows.filter(now => now.published)

  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${currentNow.id}`
  ).then((res) => res.json());

  return {
    props: {
      blocks,
      nows: pastNows,
    },
  };
}

const Now: React.FC<{ blocks: BlockMapType, nows: Now[] }> = ({ blocks, nows }) => {
  return (
    <div className="content">
      <NotionRenderer blockMap={blocks} />
      <ArchivedNows nows={nows} />
    </div>
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
          <Link href="/now/[slug]" as={`/now/${now.slug}`}>
            <a>
              <b>{now.slug}</b>
              {/* <div className="sub">Then: {now.date}</div> */}
            </a>
          </Link>
        ))}
      </div>
    )
  }

  return null
}

export default Now;
