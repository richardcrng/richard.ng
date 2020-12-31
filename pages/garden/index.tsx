import Link from "next/link";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown";
import Page from "../../components/Page";
import { getAllObsdianNotes, ObsidianNote } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";

// export const getVault = async (): Promise<Vault> => {
//   const vault = await readVault("../../vault");
//   return vault;
// };

// const vaultDirectory = process.cwd() + "/vault";

// export function getDocBySlug(slug: string) {
//   const realSlug = slug.replace(/\.md$/, "");
//   const fullPath = vaultDirectory + `${realSlug}.md`;
//   console.log("path", fullPath);
//   const fileContents = fs.readFileSync(fullPath, "utf8");
//   const { data, content } = matter(fileContents);

//   return { slug: realSlug, meta: data, content };
// }

export async function getStaticProps() {
  const notes = getAllObsdianNotes(["slug", "content", "isPublished"]);
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
