import { ObsidianNoteBase } from "../../lib/obsidian";

function GardenNoteFrontMatter({ note }: { note: ObsidianNoteBase }) {
  if (note.frontMatter.title || note.frontMatter.external) {
    return (
      <div>
        {note.frontMatter.title && (
          <h1 style={{ display: "inline" }}>{note.frontMatter.title}</h1>
        )}
        {note.frontMatter.external && (
          <>
            {note.frontMatter.title && <span> </span>}
            <a href={note.frontMatter.external} target="_blank">
              (view externally)
            </a>
          </>
        )}
      </div>
    );
  } else {
    return null;
  }
}

export default GardenNoteFrontMatter