import React from "react";
import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import Page from "../components/Page";
import { getPublicObisidanNotes } from "../lib/obsidian";
import { useRouter } from "next/dist/client/router";
import { CommonPageProps } from "./_app";
import GardenHeatmap from "../components/GardenHeatmap";
import { getAllGardenCommits } from "../lib/api/github";
import { AsyncReturnType } from "type-fest";
import Link from "next/link";
import { bundle, useRiducer } from "riduce";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
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
      wholePage: true,
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
    <ForceGraph3D
      graphData={graphData}
      linkWidth={2}
      nodeThreeObject={(node: NodeObject) => {
        const sprite = new SpriteText(node.id as string);
        sprite.color = "rgb(140,198,101, 1)";
        sprite.textHeight = 8;
        return sprite;
      }}
    />
  );
}

export default GardenGraphPage;
