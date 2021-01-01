import React from "react";
import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import Page from "../components/Page";
import { getPublicObisidanNotes } from "../lib/obsidian";
import { useRouter } from "next/dist/client/router";
import { CommonPageProps } from "./_app";
import GardenLink from "../components/GardenLink";
import GardenHeatmap from "../components/GardenHeatmap";
import { getAllGardenCommits } from "../lib/api/github";
import { AsyncReturnType } from "type-fest";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export async function getStaticProps(): Promise<
  GetStaticPropsResult<Props & CommonPageProps>
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
      ...linksFromNote.reduce((accLinks, internalLink) => {
        if (publicNotes[internalLink.fileName]) {
          return [
            ...accLinks,
            {
              source: note.fileName,
              target: internalLink.fileName,
            },
          ];
        } else {
          return accLinks;
        }
      }, [] as LinkObject[]),
    ];
  }, [] as LinkObject[]);

  const commitData = await getAllGardenCommits();

  return {
    props: {
      graphData: {
        nodes,
        links,
      },
      commitData,
      publicNotes,
      suppressNav: true,
    },
  };
}

interface Props {
  graphData: GraphData;
  publicNotes: ReturnType<typeof getPublicObisidanNotes>;
  commitData: AsyncReturnType<typeof getAllGardenCommits>;
}

function GardenGraphPage({ graphData, publicNotes, commitData }: Props) {
  const [canvasWidth, setCanvasWidth] = React.useState(766);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (window) {
      setHasLoaded(true);
      setCanvasWidth(Math.min(canvasWidth, 766, window.innerWidth));
    }
  });

  const width = 0.95 * canvasWidth;

  return (
    <Page title="Garden Graph">
      <p>
        This graph shows how different notes in my{" "}
        <GardenLink href="/garden">digital garden</GardenLink> are connected.
      </p>
      <p>You can navigate around and click on notes to navigate to them.</p>
      {hasLoaded && (
        <div style={{ width }}>
          <ForceGraph2D
            graphData={graphData}
            height={250}
            width={width}
            nodeRelSize={10}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id as string;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px sans-serif`;
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
                ctx.fillStyle = "#1e6823";
                ctx.fillText(label, node.x!, node.y!);
              };

              const createCircle = () => {
                ctx.fillStyle = "rgba(58, 95, 11, 0.8)";
                ctx.beginPath();
                ctx.arc(node.x!, node.y!, 2, 0, 2 * Math.PI, false);
                ctx.fill();
              };

              createText();
              createCircle();
            }}
            onNodeClick={(node) => {
              const navigateAway = window.confirm(`Navigate to ${node.id}?`);
              if (navigateAway) {
                const href = publicNotes[node.id as string].frontMatter.isHome
                  ? "/garden"
                  : `/garden/${node.id}`;
                router.push(href);
              }
            }}
          />
        </div>
      )}
      <style jsx>{`
        div {
          border-style: solid;
        }
      `}</style>
      <hr />
      <GardenHeatmap
        commitData={commitData}
        changeUnit="across the notes in this digital garden graph"
      />
    </Page>
  );
}

export default GardenGraphPage;
