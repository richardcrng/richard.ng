import Link from "next/link";
import Page from "../../components/Page";

const NOTION_BLOG_ID = "226d3d0173484430bcc4b4d755c725f5";

interface PostBase {
  id: string;
  title: string;
  date: string;
  isPublished: boolean;
  tags: string[];
  slug?: string;
  href?: string;
}

interface InternalPost extends PostBase {
  slug: string
}

interface ExternalPost extends PostBase {
  href: string
}

export type Post = InternalPost | ExternalPost;

export function isInternalPost(post: Post): post is InternalPost {
  return !post.href
}

export const getAllPosts = async (): Promise<Post[]> => {
  return await fetch(
    `https://notion-api.splitbee.io/v1/table/${NOTION_BLOG_ID}`
  ).then((res) => res.json());
};

export const getPublishedPosts = async(): Promise<Post[]> => {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => post.isPublished)
}

export const getInternalPosts = async (): Promise<Post[]> => {
  const publishedPosts = await getPublishedPosts()
  return publishedPosts.filter(post => !post.href)
}

export async function getStaticProps() {
  const publishedPosts = await getPublishedPosts()

  return {
    props: {
      posts: publishedPosts,
    },
  };
}

function PostItem({ post }: { post: Post }) {
  if (isInternalPost(post)) {
    return (
      <div>
        <Link href="/blog/[slug]" as={`/blog/${post.slug}`}>
          <a style={{ fontSize: '1.2rem' }}><b>{post.title}</b></a>
        </Link>
        <div className="sub">posted on {post.date}</div>
      </div>
    )
  } else {
    return (
      <div>
        <a style={{ fontSize: '1.2rem' }} href={post.href} target='_blank'>
          <b>{post.title}</b>
        </a>
        <div className="sub">posted on {post.date}</div>
      </div>
    )
  }
}

function HomePage({ posts }: { posts: Post[] }) {
  return (
    <Page title='Writing'>
      <h1>Articles, blogs and posts</h1>
      <div>
        {posts.map((post) => (
          <div
            key={post?.id}
            style={{ margin: '1rem 0' }}
          >
            <PostItem post={post} />
          </div>
        ))}
      </div>
    </Page>
  );
}

export default HomePage;
