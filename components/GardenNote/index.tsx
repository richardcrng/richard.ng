import { Button, Input, Spacer } from "@geist-ui/react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode, wikiLinkPlugin } from "remark-wiki-link";
import { AsyncReturnType } from "type-fest";
import { CgSearch } from "react-icons/cg";
import Fuse from "fuse.js";
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
  // const { query: { search } } = useRouter()
  const [enteredSearch, setEnteredSearch] = useState<string>();
  const [typedSearch, setTypedSearch] = useState("");

  const fuse = useMemo(() => {
    return new Fuse(Object.values(publicNotes), {
      keys: [
        { name: "fileName", weight: 1 },
        { name: "markdownContent", weight: 1 },
      ],
    });
  }, [publicNotes]);

  const [searchResults, setSearchResults] = useState<
    Fuse.FuseResult<ObsidianNoteBase>[]
  >();

  const handleSearch = () => {
    console.log("searching:", typedSearch);
    setEnteredSearch(typedSearch);
    setSearchResults(fuse.search(typedSearch));
  };

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
        <Input
          clearable
          onClearClick={() => {
            setTypedSearch("");
          }}
          icon={<CgSearch />}
          placeholder="Fancy a gander?"
          width="100%"
          value={typedSearch}
          onChange={(e) => {
            setTypedSearch(e.target.value);
          }}
          onKeyPress={(e) => {
            e.key === "Enter" && handleSearch();
          }}
        />
        <Spacer y={0.5} />
        <Button auto type="secondary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {enteredSearch && (
        <p>
          Search results for <i>{enteredSearch}</i>:
        </p>
      )}
      {searchResults && searchResults.length === 0 && (
        <p>
          <code>No results found!</code>
        </p>
      )}
      {Array.isArray(searchResults) && (
        <ol>
          {searchResults.slice(0, 10).map(({ item: matchingNote }) => (
            <li key={matchingNote.fileName}>
              <WikiLink
                fileName={matchingNote.fileName}
                anchorText={
                  matchingNote.frontMatter.title ?? matchingNote.fileName
                }
                publicNotes={publicNotes}
              />
            </li>
          ))}
        </ol>
      )}
      {searchResults && (
        <Button
          onClick={() => {
            setSearchResults(undefined);
            setEnteredSearch(undefined);
          }}
        >
          Clear search
        </Button>
      )}
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
            <ReactMarkdown
              plugins={[wikiLinkPluginDetails]}
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

export default GardenNote;
