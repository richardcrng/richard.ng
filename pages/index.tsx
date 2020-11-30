import Link from "next/link";

const NOTION_BLOG_ID =
  process.env.NOTION_BLOG_ID || "226d3d0173484430bcc4b4d755c725f5";

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string,
  published: boolean
};

export const getAllPosts = async (): Promise<Post[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${NOTION_BLOG_ID}`
  ).then((res) => res.json());
};

export async function getStaticProps() {
  const allPosts = await getAllPosts();
  const publishedPosts = allPosts.filter(post => post.published)

  return {
    props: {
      posts: publishedPosts,
    },
  };
}

function HomePage({ posts }: { posts: Post[] }) {
  return (
    <div className="content">
      <h1>Posts</h1>
      <div>
        {posts.map((post) => (
          <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>
            <a>
              <b>{post.title}</b>
              <div className="sub">posted on {post.date}</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
