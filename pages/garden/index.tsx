import { GetStaticPropsResult } from "next";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getAllObsidianNoteSlugs,
  getPublicObisidanNotes,
  getPublicObsidianNotesHome,
  getPublicObsidianSlugs,
} from "../../lib/obsidian";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<GardenNoteProps>
> {
  const allNotes = getAllObsidianNotes();
  const publicNotes = getPublicObisidanNotes();
  const homeNote = getPublicObsidianNotesHome();
  const homeWithBacklinks = addBacklinksToNote(homeNote, allNotes);
  const allSlugs = getAllObsidianNoteSlugs();
  const publicSlugs = getPublicObsidianSlugs();

  return {
    props: {
      note: homeWithBacklinks,
      slugs: allSlugs,
      publicSlugs,
      publicNotes,
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
