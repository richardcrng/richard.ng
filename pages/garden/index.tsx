import Link from "next/link";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Page from "../../components/Page";
import { getAndParseAllObsidianNotes, ObsidianNote } from "../../lib/obsidian";
import markdownToHtml from "../../lib/markdownToHtml";

export async function getStaticProps() {
  const notes = await getAndParseAllObsidianNotes();

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
            <div>
              <pre>{JSON.stringify(note, null, 2)}</pre>
            </div>
            <Link href="/garden/[slug]" as={`/garden/${note.slug}`}>
              Go to
            </Link>
          </div>
        ))}
      </div>
      <code>{JSON.stringify(notes, null, 2)}</code>
      {/* <ReactMarkdown>{markdown}</ReactMarkdown> */}
    </Page>
  );
}

export default GardenPage;
