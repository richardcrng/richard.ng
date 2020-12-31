import Link from "next/link";
import ReactMarkdown from "react-markdown";
import Page from "../../components/Page";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getObsidianNoteBySlug,
  ObsidianNoteWithBacklinks,
} from "../../lib/obsidian";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const allNotes = getAllObsidianNotes();
  const note = getObsidianNoteBySlug(slug);
  const noteWithBacklinks = addBacklinksToNote(note, allNotes);

  if (!note) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      note: noteWithBacklinks,
    },
  };
}

function Note({ note }: { note: ObsidianNoteWithBacklinks }) {
  if (!note) return null;
  const backlinks = Object.values(note.backlinks);

  return (
    <Page
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <ReactMarkdown>{note.markdownContent}</ReactMarkdown>
      {backlinks.length > 0 && (
        <div>
          <p>Backlinks:</p>
          <ul>
            {backlinks.map((backlink) => (
              <li key={backlink.fileName}>
                <Link href={`/garden/${backlink.slug}`}>
                  {backlink.frontMatter.title ?? backlink.fileName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
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
