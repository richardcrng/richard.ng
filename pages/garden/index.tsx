import { GetStaticPropsResult } from "next";
import GardenNote, { GardenNoteProps } from "../../components/GardenNote";
import Page from "../../components/Page";
import {
  addBacklinksToNote,
  getAllObsidianNotes,
  getAllObsidianNoteSlugs,
  getPublicObsidianNotesHome,
  getPublicObsidianSlugs,
} from "../../lib/obsidian";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<GardenNoteProps>
> {
  const allNotes = getAllObsidianNotes();
  const homeNote = getPublicObsidianNotesHome();
  const homeWithBacklinks = addBacklinksToNote(homeNote, allNotes);
  const allSlugs = getAllObsidianNoteSlugs();
  const publicSlugs = getPublicObsidianSlugs();

  return {
    props: {
      note: homeWithBacklinks,
      slugs: allSlugs,
      publicSlugs,
    },
  };
}

function GardenPage({ note, slugs, publicSlugs }: GardenNoteProps) {
  return (
    <Page title="Digital Garden">
      <GardenNote {...{ note, slugs, publicSlugs }} />
    </Page>
  );
}

export default GardenPage;
