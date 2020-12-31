import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import Page from "../../components/Page";
import { getPublicObisidanNotes } from "../../lib/obsidian";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ graphData: GraphData }>
> {
  const publicNotes = getPublicObisidanNotes();
  const notesArr = Object.values(publicNotes);

  const nodes: NodeObject[] = notesArr.map((note) => ({
    id: note.fileName,
    name: note.fileName,
  }));

  const links: LinkObject[] = notesArr.reduce((acc, note) => {
    const linksFromNote = Object.values(note.internalLinks);
    return [
      ...acc,
      ...linksFromNote.map((internalLink) => ({
        source: note.fileName,
        target: internalLink.fileName,
      })),
    ];
  }, [] as LinkObject[]);

  return {
    props: {
      graphData: {
        nodes,
        links,
      },
    },
  };
}

function GardenGraphPage({ graphData }: { graphData: GraphData }) {
  return (
    <Page title="Garden Graph">
      <ForceGraph2D graphData={graphData} />
    </Page>
  );
}

export default GardenGraphPage;
