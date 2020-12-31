import ReactMarkdown from "react-markdown";
import Page from "../../components/Page";
import {
  getAllObsidianNotes,
  getObsidianNoteBySlug,
  ObsidianNote,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const note = getObsidianNoteBySlug(slug);

  if (!note) {
    return {
      notFound: true,
    };
  }

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
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <ReactMarkdown>{note.content}</ReactMarkdown>
    </Page>
  );
}

export async function getStaticPaths() {
  const notes = getAllObsidianNotes();
  return {
    paths: notes.map((note) => `/garden/${note.slug}`),
    fallback: false,
  };
}

export default Note;
