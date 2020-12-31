import ReactMarkdown from "react-markdown";
import Page from "../../components/Page";
import {
  getObsidianNoteBySlug,
  getObsidianNoteSlugs,
  ObsidianNote,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const note = getObsidianNoteBySlug(slug);

  return {
    props: {
      note,
    },
  };
}

function Note({ note }: { note: ObsidianNote }) {
  if (!note) return null;

  console.log(note);

  return (
    <Page
      head={<title>{note.frontMatter.title ?? note.slug} | Richard Ng</title>}
    >
      <ReactMarkdown>{note.content}</ReactMarkdown>
    </Page>
  );
}

export async function getStaticPaths() {
  const slugs = getObsidianNoteSlugs();
  return {
    paths: slugs.map((slug) => `/garden/${encodeURIComponent(slug)}`),
    fallback: true,
  };
}

export default Note;
