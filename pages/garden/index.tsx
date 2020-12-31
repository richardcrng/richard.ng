import Link from "next/link";
import Page from "../../components/Page";
import { getAllObsidianNotes, ObsidianNote } from "../../lib/obsidian";

export async function getStaticProps() {
  const notes = getAllObsidianNotes();

  return {
    props: {
      notes,
    },
  };

  // const vault = getDocBySlug("/My Digital Garden");
  // const { data, content } = matter(vault);
  // console.log(data, vault);

  // return {
  //   props: {
  //     markdown: content,
  //   },
  // };
}

function GardenPage({ notes }: { notes: ObsidianNote[] }) {
  console.log(notes);

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
