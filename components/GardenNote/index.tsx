import { Button, Divider, Input, Spacer } from "@geist-ui/react";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode, wikiLinkPlugin } from "remark-wiki-link";
import { AsyncReturnType } from "type-fest";
import { CgSearch } from "react-icons/cg";
import { getCommitDatesForGardenNote } from "../../lib/api/github";
import {
  ObsidianNoteBase,
  ObsidianNoteWithBacklinks,
} from "../../lib/obsidian";
import GardenHeatmap from "../GardenHeatmap";
import GardenLinkWithPopover from "../GardenLink/GardenLinkWithPopover";

export interface GardenNoteProps {
  note: ObsidianNoteWithBacklinks;
  slugs: string[];
  publicSlugs: string[];
  publicNotes: Record<string, ObsidianNoteBase>;
  commitData: AsyncReturnType<typeof getCommitDatesForGardenNote>;
}

const wikiLinkPluginDetails = [
  wikiLinkPlugin,
  {
    aliasDivider: "|",
    pageResolver: (pageName) => [encodeURIComponent(pageName)],
    hrefTemplate: (permalink) => `/garden/${permalink}`,
  },
] as [typeof wikiLinkPlugin, Parameters<typeof wikiLinkPlugin>[0]];

function GardenNote({ note, publicNotes, commitData }: GardenNoteProps) {
  if (!note) return null;

  const backlinks = Object.values(note.backlinks);

  const renderers = {
    wikiLink: (node: WikiLinkNode) => {
      return (
        <WikiLink
          {...{ publicNotes }}
          fileName={node.value}
          anchorText={node.data.alias}
        />
      );
    },
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Input icon={<CgSearch />} placeholder="Fancy a gander?" width="100%" />
        <Spacer y={0.5} />
        <Button auto type="secondary">
          Search
        </Button>
      </div>
      <GardenHeatmap
        commitData={commitData}
        changeUnit={
          <span>
            to <b>{note.frontMatter.title ?? note.fileName}</b>
          </span>
        }
      />
      <ReactMarkdown plugins={[wikiLinkPluginDetails]} renderers={renderers}>
        {note.markdownContent}
      </ReactMarkdown>
      {backlinks.length > 0 && (
        <>
          <hr />
          <div>
            <p>Backlinks:</p>
            <ul>
              {backlinks.map((backlink) => (
                <li key={backlink.fileName}>
                  <WikiLink
                    {...{ publicNotes }}
                    fileName={backlink.fileName}
                    anchorText={backlink.frontMatter.title ?? backlink.fileName}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

interface WikiLinkProps {
  publicNotes: GardenNoteProps["publicNotes"];
  fileName: string;
  anchorText: string;
}

function WikiLink({ publicNotes, fileName, anchorText }: WikiLinkProps) {
  const matchingNote = publicNotes[fileName];

  const renderers = {
    wikiLink: (node: WikiLinkNode) => {
      return (
        <WikiLink
          {...{ publicNotes }}
          fileName={node.value}
          anchorText={node.data.alias}
        />
      );
    },
  };

  if (matchingNote) {
    /** Find the href for filename - direct to garden root if it's home */
    const hrefForFileName = matchingNote.frontMatter.isHome
      ? "/garden"
      : `/garden/${matchingNote.slug}`;

    return (
      <GardenLinkWithPopover
        content={
          <div
            className="content"
            style={{
              padding: "0 1rem",
              maxHeight: "200px",
              maxWidth: "250px",
              overflow: "hidden",
              fontSize: "x-small",
            }}
          >
            <ReactMarkdown
              plugins={[wikiLinkPluginDetails]}
              renderers={renderers}
            >
              {matchingNote.markdownContent}
            </ReactMarkdown>
          </div>
        }
        href={hrefForFileName}
      >
        {anchorText}
      </GardenLinkWithPopover>
    );
  } else {
    return (
      <GardenLinkWithPopover
        href="#"
        content={
          <div
            className="content"
            style={{
              padding: "0 1rem",
              maxHeight: "100px",
              maxWidth: "250px",
              overflow: "hidden",
              fontSize: "x-small",
            }}
          >
            <p>This note either isn't public or is currently hidden</p>
          </div>
        }
        onClick={(e) => {
          e.preventDefault();
          window.alert(
            "That note either isn't public yet or is still due to be created - sorry!"
          );
        }}
      >
        {anchorText}
      </GardenLinkWithPopover>
    );
  }
}

export default GardenNote;
