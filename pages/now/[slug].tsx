import { BlockMapType } from "react-notion";
import Page from "../../components/Page";

import { getPublishedNows, Now } from "./index";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  // Get all nows again
  const nows = await getPublishedNows();

  // Find the current blognow by slug
  const now = nows.find((t) => t.slug === slug);

  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${now!.id}`
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
    <Page blocks={blocks}>
      <h1>{now.date}</h1>
    </Page>
  );
};

export async function getStaticPaths() {
  const table = await getPublishedNows();
  return {
    paths: table.map((row) => `/now/${row.slug}`),
    fallback: true,
  };
}

export default BlogNow;
