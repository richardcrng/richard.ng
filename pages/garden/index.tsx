import Link from "next/link";
import Page from "../../components/Page";
import {
  getAllObsidianNotes,
  getAndParseAllObsidianNotes,
  ObsidianNote,
} from "../../lib/obsidian";

export async function getStaticProps() {
  const notes = await getAllObsidianNotes();

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
  return (
    <Page title="Digital Garden">
      <h1>Digital Garden</h1>
      <div>
        {notes.map((note) => (
          <div key={note.slug}>
            <h1>{note.slug}</h1>
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
