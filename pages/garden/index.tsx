import { GetStaticPropsResult } from "next";
import GardenMessage from "../../components/GardenMessage";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote/GardenNote";
import Page from "../../components/Page";
import { getAllGardenCommits, getCommitDatesForGardenNote } from "../../lib/api/github";
import GardenHeatmap from '../../components/GardenHeatmap';
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getCommonObsidianNoteProps,
  getPublicObsidianNotesHome,
} from "../../lib/obsidian";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<Props>
> {
  const allNotes = getAllObsidianNotes();
  const homeNote = getPublicObsidianNotesHome();
  const homeWithBacklinks = addBacklinksToNote(homeNote, allNotes);
  const homeCommitData = await getCommitDatesForGardenNote(homeNote.fileName);
  const gardenCommitData = await getAllGardenCommits()

  return {
    props: {
      note: homeWithBacklinks,
      ...getCommonObsidianNoteProps(),
      commitDenominator: 14,
      commitData: homeCommitData,
      gardenCommitData,
    },
  };
}

interface Props extends GardenNoteProps {
  gardenCommitData: GardenNoteProps['commitData']
}

function GardenPage({
  note,
  slugs,
  publicSlugs,
  publicNotes,
  commitData,
  commitDenominator,
  gardenCommitData
}: Props) {
  return (
    <Page title="Digital Garden">
      <GardenMessage />
      <GardenNote
        {...{
          note,
          slugs,
          publicSlugs,
          publicNotes,
          commitData,
          commitDenominator,
          gardenCommitData
        }}
      />
    </Page>
  );
}

export default GardenPage;
