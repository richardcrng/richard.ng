import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode, wikiLinkPlugin } from "remark-wiki-link";
import {
  ObsidianNoteBase,
  ObsidianNoteWithBacklinks,
} from "../../lib/obsidian";
import GardenLink from "../GardenLink";

export interface GardenNoteProps {
  note: ObsidianNoteWithBacklinks;
  slugs: string[];
  publicSlugs: string[];
  publicNotes: Record<string, ObsidianNoteBase>;
}

function GardenNote({
  note,
  slugs,
  publicSlugs,
  publicNotes,
}: GardenNoteProps) {
  if (!note) return null;

  const backlinks = Object.values(note.backlinks);

  /** Find the href for filename - direct to garden root if it's home */
  const hrefForFileName = (fileName: string) => {
    const matchingNote = publicNotes[fileName];
    return matchingNote.frontMatter.isHome
      ? "/garden"
      : `/garden/${matchingNote.slug}`;
  };

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
      if (
        publicSlugs.includes(node.data.permalink) &&
        publicNotes[node.value]
      ) {
        return (
          <GardenLink href={hrefForFileName(node.value)}>
            {node.data.alias}
          </GardenLink>
        );
      } else {
        return (
          <GardenLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.alert("That note isn't public - sorry!");
            }}
          >
            {node.data.alias}
          </GardenLink>
        );
      }
    },
  };

  return (
    <>
      <p>
        🧑‍🌾{" "}
        <i>
          Thanks for visiting my <Link href="/garden">digital garden</Link> of
          working thoughts!
        </i>
      </p>
      <p>
        🚧 <i>Please expect content to be incomplete, rough and unstable...</i>
      </p>
      <ReactMarkdown plugins={[wikiLinkPluginDetails]} renderers={renderers}>
        {note.markdownContent}
      </ReactMarkdown>
      {backlinks.length > 0 && (
        <div>
          <p>Backlinks:</p>
          <ul>
            {backlinks.map((backlink) => (
              <li key={backlink.fileName}>
                <GardenLink href={hrefForFileName(backlink.fileName)}>
                  {backlink.frontMatter.title ?? backlink.fileName}
                </GardenLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default GardenNote;
