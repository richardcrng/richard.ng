import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode, wikiLinkPlugin } from "remark-wiki-link";
import { ObsidianNoteWithBacklinks } from "../../lib/obsidian";

export interface GardenNoteProps {
  note: ObsidianNoteWithBacklinks;
  slugs: string[];
  publicSlugs: string[];
}

function GardenNote({ note, slugs, publicSlugs }: GardenNoteProps) {
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
      if (publicSlugs.includes(node.data.permalink)) {
        return (
          <Link href={`/garden/${node.data.permalink}`}>{node.data.alias}</Link>
        );
      } else {
        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.alert("That note isn't public - sorry!");
            }}
          >
            {node.data.alias}
          </a>
        );
      }
    },
  };

  return (
    <>
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
    </>
  );
}

export default GardenNote;
