import React from "react";
import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import Page from "../components/Page";
import { getPublicObisidanNotes } from "../lib/obsidian";
import { useRouter } from "next/dist/client/router";
import GardenMessage from "../components/GardenMessage";
import { CommonPageProps } from "./_app";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ graphData: GraphData } & CommonPageProps>
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
      suppressNav: true
    },
  };
}

function GardenGraphPage({ graphData }: { graphData: GraphData }) {
  const [canvasWidth, setCanvasWidth] = React.useState(766);
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    if (window) {
      setHasLoaded(true)
      setCanvasWidth(Math.min(canvasWidth, 766, window.innerWidth));
    }
  });

  return (
    <Page title="Garden Graph">
      <p>Try navigating around the graph!</p>
      {hasLoaded && (
        <ForceGraph2D
          graphData={graphData}
          width={canvasWidth}
          nodeRelSize={6}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id as string;
            const fontSize = 18 / globalScale;
            ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
      "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(
              (n) => n + fontSize * 0.2
            ) as [number, number];

            const createText = () => {
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
            }

            const createCircle = () => {
              ctx.fillStyle = "rgba(58, 95, 11, 0.4)"
              ctx.beginPath();
              ctx.arc(node.x!, node.y!, 2, 0, 2 * Math.PI, false);
              ctx.fill();
            }

            createText()
            createCircle()

          }}
          onNodeClick={(node) => {
            const navigateAway = window.confirm(`Navigate to ${node.id}?`)
            if (navigateAway) {
              router.push(`/garden/${node.id}`)
            }
          }}
        />
      )}
    </Page>
  );
}

export default GardenGraphPage;
