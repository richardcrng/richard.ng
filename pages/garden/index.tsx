import { GetStaticPropsResult } from "next";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
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

  return {
    props: {
      note: homeWithBacklinks,
      ...getCommonObsidianNoteProps(),
    },
  };
}

function GardenPage({
  note,
  slugs,
  publicSlugs,
  publicNotes,
}: GardenNoteProps) {
  return (
    <Page title="Digital Garden">
      <GardenNote {...{ note, slugs, publicSlugs, publicNotes }} />
    </Page>
  );
}

export default GardenPage;
