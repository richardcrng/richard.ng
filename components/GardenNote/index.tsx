import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { WikiLinkNode, wikiLinkPlugin } from "remark-wiki-link";
import { AsyncReturnType } from "type-fest";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { getCommitDatesForGardenNote } from "../../lib/api/github";
import {
  ObsidianNoteBase,
  ObsidianNoteWithBacklinks,
} from "../../lib/obsidian";
import GardenLink from "../GardenLink";

export interface GardenNoteProps {
  note: ObsidianNoteWithBacklinks;
  slugs: string[];
  publicSlugs: string[];
  publicNotes: Record<string, ObsidianNoteBase>;
  commitData: AsyncReturnType<typeof getCommitDatesForGardenNote>;
}

interface CalendarPoint {
  date: string;
  count: number;
}

const commitDataToCount = (
  commitData: GardenNoteProps["commitData"]
): CalendarPoint[] => {
  const dateDict = commitData.reduce((acc, commitDatum) => {
    const commitDate = commitDatum.date;
    if (typeof commitDate === "string") {
      if (acc[commitDate]) {
        acc[commitDate].count += 1;
        return acc;
      } else {
        return {
          ...acc,
          [commitDate]: { date: commitDate, count: 1 },
        };
      }
    } else {
      return acc;
    }
  }, {} as Record<string, CalendarPoint>);
  return Object.values(dateDict);
};

function GardenNote({
  note,
  slugs,
  publicSlugs,
  publicNotes,
  commitData,
}: GardenNoteProps) {
  const [currentDate] = useState(new Date());
  const [dateRangeStart] = useState(() => {
    const d = new Date();
    // d.setMonth(d.getMonth() - 3);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  });

  if (!note) return null;

  const heatmapData = commitDataToCount(commitData);
  const largestCount = Math.max(...heatmapData.map((point) => point.count));

  const backlinks = Object.values(note.backlinks);

  /** Find the href for filename - direct to garden root if it's home */
  const hrefForFileName = (fileName: string) => {
    const matchingNote = publicNotes[fileName];
    return matchingNote.frontMatter.isHome
      ? "/garden"
      : `/garden/${matchingNote.slug}`;
  };

  const wikiLinkPluginDetails = [
    wikiLinkPlugin,
    {
      aliasDivider: "|",
      pageResolver: (pageName) => [encodeURIComponent(pageName)],
      permalinks: slugs,
      hrefTemplate: (permalink) => `/garden/${permalink}`,
    },
  ] as [typeof wikiLinkPlugin, Parameters<typeof wikiLinkPlugin>[0]];

  const renderers = {
    wikiLink: (node: WikiLinkNode) => {
      if (
        publicSlugs.includes(node.data.permalink) &&
        publicNotes[node.value]
      ) {
        return (
          <GardenLink href={hrefForFileName(node.value)}>
            {node.data.alias}
          </GardenLink>
        );
      } else {
        return (
          <GardenLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.alert("That note isn't public - sorry!");
            }}
          >
            {node.data.alias}
          </GardenLink>
        );
      }
    },
  };

  return (
    <>
      {commitData && currentDate && dateRangeStart && (
        <CalendarHeatmap
          startDate={dateRangeStart}
          endDate={currentDate}
          values={commitDataToCount(commitData)}
          // classForValue={(value) => {
          //   // console.log(value, largestCount);
          //   // if (value >= 0.8 * largestCount) {
          //   //   return `color-scale-4`;
          //   // } else if (value >= 0.6 * largestCount) {
          //   //   return "color-scale-3";
          //   // } else if (value >= 0.4 * largestCount) {
          //   //   return "color-scale-2";
          //   // } else if (value >= 0.2 * largestCount) {
          //   //   return "color-scale-1";
          //   // } else {
          //   //   return "color-empty";
          //   // }
          // }}
        />
      )}
      <ReactMarkdown plugins={[wikiLinkPluginDetails]} renderers={renderers}>
        {note.markdownContent}
      </ReactMarkdown>
      {backlinks.length > 0 && (
        <>
          <hr />
          <div>
            <p>Backlinks:</p>
            <ul>
              {backlinks.map((backlink) => (
                <li key={backlink.fileName}>
                  <GardenLink href={hrefForFileName(backlink.fileName)}>
                    {backlink.frontMatter.title ?? backlink.fileName}
                  </GardenLink>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </>
  );
}

export default GardenNote;
