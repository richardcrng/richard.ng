import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode, wikiLinkPlugin } from "remark-wiki-link";
import Page from "../../components/Page";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getObsidianNoteBySlug,
  ObsidianNoteWithBacklinks,
  getPublicObsidianSlugs,
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

  const allSlugs = allNotes.map((note) => note.slug);
  const publicSlugs = allNotes
    .filter((note) => note.frontMatter.isPublic)
    .map((note) => note.slug);

  return {
    props: {
      note: noteWithBacklinks,
      slugs: allSlugs,
      publicSlugs,
    },
  };
}

function Note({
  note,
  slugs,
}: {
  note: ObsidianNoteWithBacklinks;
  slugs: string[];
  publicSlugs: string[];
}) {
  if (!note) return null;
  const backlinks = Object.values(note.backlinks);

  const wikiLinkPluginDetails = [
    wikiLinkPlugin,
    {
      aliasDivider: "|",
      pageResolver: (pageName) => [encodeURIComponent(pageName)],
      permalinks: slugs,
      hrefTemplate: (permalink) => `/garden/${permalink}`,
    },
  ] as [typeof wikiLinkPlugin, Parameters<typeof wikiLinkPlugin>[0]];

  const renderers = {
    wikiLink: (node: WikiLinkNode) => {
      return (
        <Link href={`/garden/${node.data.permalink}`}>{node.data.alias}</Link>
      );
    },
  };

  return (
    <Page
      head={
        <title>{note.frontMatter.title ?? note.fileName} | Richard Ng</title>
      }
    >
      <ReactMarkdown plugins={[wikiLinkPluginDetails]} renderers={renderers}>
        {note.markdownContent}
      </ReactMarkdown>
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
  const slugs = getPublicObsidianSlugs();
  return {
    paths: slugs.map((slug) => `/garden/${slug}`),
    fallback: false,
  };
}

export default Note;
