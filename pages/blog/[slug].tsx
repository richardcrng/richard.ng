import { NotionRenderer, BlockMapType } from "react-notion";
import Page from "../../components/Page";

import { getInternalPosts, Post } from "./index";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  // Get all posts again
  const posts = await getInternalPosts();

  // Find the current blogpost by slug
  const post = posts.find((t) => t.slug === slug);

  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${post!.id}`
  ).then((res) => res.json());

  return {
    props: {
      blocks,
      post,
    },
  };
}

const BlogPost: React.FC<{ post: Post; blocks: BlockMapType }> = ({
  post,
  blocks,
}) => {
  if (!post) return null;

  return (
    <Page head={<title>{post.title} | Richard Ng</title>}>
      <h1>{post.title}</h1>
      <p><i>Published: {post.date}</i></p>
      <NotionRenderer blockMap={blocks} />
    </Page>
  )
};

export async function getStaticPaths() {
  const table = await getInternalPosts();
  return {
    paths: table.map((row) => `/blog/${row.slug}`),
    fallback: true,
  };
}

export default BlogPost;
