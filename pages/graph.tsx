import React from "react";
import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import Page from "../components/Page";
import { getPublicObisidanNotes } from "../lib/obsidian";
import { useRouter } from "next/dist/client/router";
import { CommonPageProps } from "./_app";
import GardenHeatmap from "../components/GardenHeatmap";
import { getAllGardenCommits } from "../lib/api/github";
import { AsyncReturnType } from "type-fest";
import Link from "next/link";
import { bundle, useRiducer } from "riduce";

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

const INITIAL_CANVAS_WIDTH = 0.95 * 766;
const INITIAL_CANVAS_HEIGHT = 250;

function GardenGraphPage({ graphData, publicNotes, commitData }: Props) {
  const {
    state: { canvasWidth, canvasHeight, hasWindowLoaded },
    dispatch,
    actions,
  } = useRiducer({
    canvasWidth: INITIAL_CANVAS_WIDTH,
    canvasHeight: INITIAL_CANVAS_HEIGHT,
    hasWindowLoaded: false,
  });

  const router = useRouter();

  React.useEffect(() => {
    if (window) {
      dispatch(
        bundle([
          actions.hasWindowLoaded.create.on(),
          actions.canvasWidth.create.update(
            Math.min(canvasWidth, 766, 0.9 * window.innerWidth)
          ),
          actions.canvasHeight.create.do((leafState, treeState) => {
            return Math.max(leafState, 0.7 * treeState.canvasWidth);
          }),
        ])
      );
    }
  });

  return (
    <Page title="Garden Graph">
      <p style={{ marginTop: "0" }}>
        This graph shows how different notes in my{" "}
        <Link href="/garden">digital garden</Link> are connected.
      </p>
      {hasWindowLoaded && (
        <div style={{ width: canvasWidth }}>
          <ForceGraph2D
            graphData={graphData}
            height={canvasHeight}
            width={canvasWidth}
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
                ctx.fillStyle = "rgb(140,198,101, 0.5)";
                ctx.beginPath();
                ctx.arc(node.x!, node.y!, 4, 0, 2 * Math.PI, false);
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
      <p>
        You can navigate around and click on notes/nodes to navigate to them, or
        try dragging nodes around.
      </p>
      <p>
        If you're feeling fancy, <Link href="/graph-3d">view it in 3D</Link>...!
      </p>
      <style jsx>{`
        div {
          border-style: solid;
        }
      `}</style>
      <hr />
      <GardenHeatmap
        commitData={commitData}
        changeUnit="across the notes in this digital garden graph"
        commitDenominator={42}
      />
    </Page>
  );
}

export default GardenGraphPage;
