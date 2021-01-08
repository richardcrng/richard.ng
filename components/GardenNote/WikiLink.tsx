import { MouseEvent } from "react";
import ReactMarkdown from "react-markdown";
import gfm from 'remark-gfm';
import { WikiLinkNode } from "remark-wiki-link";
import { GardenNoteProps } from "./GardenNote";
import GardenLinkWithPopover from '../GardenLink/GardenLinkWithPopover';
import GardenNoteFrontMatter from './GardenNoteFrontMatter';
import { wikiLinkPluginDetails } from "./utils";

interface WikiLinkProps {
  publicNotes: GardenNoteProps["publicNotes"];
  fileName: string;
  anchorText: string;
  onClick?(e: MouseEvent): void;
}

function WikiLink({
  publicNotes,
  fileName,
  anchorText,
  onClick,
}: WikiLinkProps) {
  // sometimes fileName will end up with extra `\\` because of GFM tables
  const matchingNote = publicNotes[fileName] || publicNotes[fileName.substring(0, -2)];

  const renderers = {
    wikiLink: (node: WikiLinkNode) => {
      return (
        <WikiLink
          {...{ publicNotes, onClick }}
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
        onClick={onClick}
        content={() => (
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
            <GardenNoteFrontMatter note={matchingNote} />
            <ReactMarkdown
              plugins={[gfm, wikiLinkPluginDetails]}
              renderers={renderers}
            >
              {matchingNote.markdownContent}
            </ReactMarkdown>
          </div>
        )}
        href={hrefForFileName}
      >
        {anchorText}
      </GardenLinkWithPopover>
    );
  } else {
    return (
      <GardenLinkWithPopover
        href="#"
        content={() => (
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
            <p>
              <b>This note doesn't publicly exist yet.</b> 👻
            </p>
            <p>
              (It's a placeholder link - hopefully something will exist here in
              the future!)
            </p>
          </div>
        )}
        onClick={(e) => {
          e.preventDefault();
          onClick && onClick(e);
          window.alert(
            "There's nothing to navigate to - that note either hasn't been created yet or isn't currently public. Try again in future!"
          );
        }}
      >
        {anchorText}
      </GardenLinkWithPopover>
    );
  }
}

export default WikiLink
