import React from "react";
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
    // name: note.fileName,
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
  const [canvasWidth, setCanvasWidth] = React.useState(766);

  React.useEffect(() => {
    if (window && canvasWidth !== Math.min(766, window.innerWidth)) {
      setCanvasWidth(Math.min(766, window.innerWidth));
    }
  });

  return (
    <Page title="Garden Graph">
      <ForceGraph2D
        graphData={graphData}
        width={canvasWidth}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id as string;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(
            (n) => n + fontSize * 0.2
          ) as [number, number];

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
          ctx.fillRect(
            node.x! - bckgDimensions[0] / 2,
            node.y! - bckgDimensions[1] / 2,
            ...bckgDimensions
          );

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "black";
          ctx.fillText(label, node.x!, node.y!);
        }}
      />
    </Page>
  );
}

export default GardenGraphPage;
