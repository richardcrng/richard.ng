import { MouseEvent } from "react";
import { ObsidianNoteBase } from "../../lib/obsidian";
import WikiLink from "./WikiLink";

interface Props {
  backlinks: ObsidianNoteBase[];
  onBacklinkClick?(e: MouseEvent): void;
  publicNotes: Record<string, ObsidianNoteBase>;
}

function GardenNoteBacklinks({ backlinks, onBacklinkClick, publicNotes }: Props) {
  return (
    <div>
      <p>Backlinks:</p>
      <ul>
        {backlinks.map((backlink) => (
          <li key={backlink.fileName}>
            <WikiLink
              {...{ publicNotes }}
              fileName={backlink.fileName}
              anchorText={backlink.frontMatter.title ?? backlink.fileName}
              onClick={onBacklinkClick}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GardenNoteBacklinks;