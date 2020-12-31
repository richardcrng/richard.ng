import Link from "next/link";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Page from "../../components/Page";
import { getAllObsdianNotes, ObsidianNote } from "../../lib/obsidian";
import markdownToHtml from "../../lib/markdownToHtml";

export async function getStaticProps() {
  const notes = getAllObsdianNotes();
  const parsedNotes = await Promise.all(
    notes.map(async (note) => {
      const parsedContent = await markdownToHtml(note.content);
      return {
        ...note,
        content: parsedContent,
      };
    })
  );

  return {
    props: {
      notes: parsedNotes,
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
      <code>{JSON.stringify(notes, null, 2)}</code>
      {/* <ReactMarkdown>{markdown}</ReactMarkdown> */}
    </Page>
  );
}

export default GardenPage;
