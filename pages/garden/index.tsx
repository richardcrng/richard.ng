import Link from "next/link";
import Page from "../../components/Page";
import {
  getAllObsidianNotes,
  ObsidianNoteWithInternalLinks,
} from "../../lib/obsidian";

export async function getStaticProps() {
  const notes = getAllObsidianNotes();

  return {
    props: {
      notes,
    },
  };
}

function GardenPage({ notes }: { notes: ObsidianNoteWithInternalLinks[] }) {
  return (
    <Page title="Digital Garden">
      <h1>Digital Garden</h1>
      <div>
        {notes.map((note) => (
          <div key={note.slug}>
            <h1>{note.fileName}</h1>
            <Link href="/garden/[slug]" as={`/garden/${note.slug}`}>
              Go to
            </Link>
          </div>
        ))}
      </div>
    </Page>
  );
}

export default GardenPage;
