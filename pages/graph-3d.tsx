import React from "react";
import { GetStaticPropsResult } from "next";
import dynamic from "next/dynamic";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import SpriteText from "three-spritetext";
import { getPublicObisidanNotes } from "../lib/obsidian";
import { CommonPageProps } from "./_app";
import { getAllGardenCommits } from "../lib/api/github";
import { AsyncReturnType } from "type-fest";
import { useRouter } from "next/dist/client/router";

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

function GardenGraphPage({ graphData, publicNotes }: Props) {
  const router = useRouter();

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
  );
}

export default GardenGraphPage;
