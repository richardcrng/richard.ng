import Page from "../../components/Page";
import {
  getAndParseObsidianNoteBySlug,
  getObsidianNoteSlugs,
  ObsidianNote,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const note = await getAndParseObsidianNoteBySlug(slug);

  return {
    props: {
      note,
    },
  };
}

function Note({ note }: { note: ObsidianNote }) {
  if (!note) return null;

  return (
    <Page
      head={<title>{note.frontMatter.title ?? note.slug} | Richard Ng</title>}
    >
      <div dangerouslySetInnerHTML={{ __html: note.content }} />
    </Page>
  );
}

export async function getStaticPaths() {
  const slugs = await getObsidianNoteSlugs();
  return {
    paths: slugs.map((slug) => `/garden/${encodeURIComponent(slug)}`),
    fallback: true,
  };
}

export default Note;
