import { GetStaticPropsResult } from "next";
import GardenMessage from "../../components/GardenMessage";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
import { getCommitDatesForGardenNote } from "../../lib/api/github";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getCommonObsidianNoteProps,
  getPublicObsidianNotesHome,
} from "../../lib/obsidian";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<GardenNoteProps>
> {
  const allNotes = getAllObsidianNotes();
  const homeNote = getPublicObsidianNotesHome();
  const homeWithBacklinks = addBacklinksToNote(homeNote, allNotes);
  const commitData = await getCommitDatesForGardenNote(homeNote.fileName);

  return {
    props: {
      note: homeWithBacklinks,
      ...getCommonObsidianNoteProps(),
      commitTotalCount: commitData.length,
      commitData,
    },
  };
}

function GardenPage({
  note,
  slugs,
  publicSlugs,
  publicNotes,
  commitData,
  commitTotalCount
}: GardenNoteProps) {
  return (
    <Page title="Digital Garden">
      <GardenMessage />
      <GardenNote {...{ note, slugs, publicSlugs, publicNotes, commitData, commitTotalCount }} />
    </Page>
  );
}

export default GardenPage;
