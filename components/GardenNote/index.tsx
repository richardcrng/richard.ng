import { Button, Input, Spacer } from "@geist-ui/react";
import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode } from "remark-wiki-link";
import { AsyncReturnType } from "type-fest";
import { CgSearch } from "react-icons/cg";
import Fuse from "fuse.js";
import { getCommitDatesForGardenNote } from "../../lib/api/github";
import {
  ObsidianNoteBase,
  ObsidianNoteWithBacklinks,
} from "../../lib/obsidian";
import GardenHeatmap from "../GardenHeatmap";
import { useRiducer } from "riduce";
import GardenNoteFrontMatter from './GardenNoteFrontMatter';
import { wikiLinkPluginDetails } from './utils';
import WikiLink from "./WikiLink";
import GardenNoteBacklinks from "./GardenNoteBacklinks";
import GardenNoteContent from "./GardenNoteContent";

export interface GardenNoteProps {
  note: ObsidianNoteWithBacklinks;
  slugs: string[];
  publicSlugs: string[];
  publicNotes: Record<string, ObsidianNoteBase>;
  commitData: AsyncReturnType<typeof getCommitDatesForGardenNote>;
  commitDenominator: number;
}

function GardenNote({
  note,
  publicNotes,
  commitData,
  commitDenominator,
}: GardenNoteProps) {
  const { state: searchState, dispatch, actions } = useRiducer({
    entered: "",
    typed: "",
    results: [] as Fuse.FuseResult<ObsidianNoteBase>[],
  });

  const fuse = useMemo(() => {
    return new Fuse(Object.values(publicNotes), {
      keys: [
        { name: "fileName", weight: 1 },
        { name: "markdownContent", weight: 1 },
      ],
    });
  }, [publicNotes]);

  const handleReset = () => dispatch(actions.create.reset());
  const handleSearch = () => {
    dispatch(
      actions.create.do((prevState) => ({
        ...prevState,
        entered: prevState.typed,
        results: fuse.search(prevState.typed),
      }))
    );
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
          onClick={handleReset}
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
            dispatch(actions.typed.create.reset());
          }}
          icon={<CgSearch />}
          placeholder="Explore the weeds!"
          width="100%"
          value={searchState.typed}
          onChange={(e) => {
            dispatch(actions.typed.create.update(e.target.value));
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
      {searchState.entered && (
        <p>
          Search results for <i>{searchState.entered}</i>:
        </p>
      )}
      {searchState.entered && searchState.results.length === 0 && (
        <p>
          <code>No results found!</code>
        </p>
      )}
      {searchState.entered && (
        <ol>
          {searchState.results.slice(0, 10).map(({ item: matchingNote }) => (
            <li key={matchingNote.fileName}>
              <WikiLink
                fileName={matchingNote.fileName}
                anchorText={
                  matchingNote.frontMatter.title ?? matchingNote.fileName
                }
                publicNotes={publicNotes}
                onClick={handleReset}
              />
            </li>
          ))}
        </ol>
      )}
      {searchState.entered && (
        <Button onClick={handleReset}>Clear search</Button>
      )}
      <Spacer y={0.5} />
      <GardenHeatmap
        commitData={commitData}
        commitDenominator={commitDenominator}
        changeUnit={
          <span>
            to <b>{note.frontMatter.title ?? note.fileName}</b>
          </span>
        }
      />
      <Spacer y={0.5} />
      <GardenNoteContent
        note={note}
        renderers={renderers}
      />
      {backlinks.length > 0 && (
        <>
          <hr />
          <GardenNoteBacklinks
            {...{
              backlinks,
              publicNotes
            }}
            onBacklinkClick={handleReset}
          />
        </>
      )}
    </>
  );
}



export default GardenNote;
