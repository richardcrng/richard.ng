import { AsyncReturnType } from "type-fest";
import { ReactNode, useState } from "react";
import ReactTooltip from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { getCommitDatesForGardenNote } from "../lib/api/github";
import { Spacer } from "@geist-ui/react";

interface CalendarPoint {
  date: string;
  count: number;
}

interface GardenHeatmapProps {
  commitData: AsyncReturnType<typeof getCommitDatesForGardenNote>;
  changeUnit?: ReactNode;
}

const commitDataToCount = (
  commitData: GardenHeatmapProps["commitData"]
): CalendarPoint[] => {
  const dateDict = commitData.reduce((acc, commitDatum) => {
    if (commitDatum.date) {
      const commitDate = new Date(commitDatum.date).toLocaleDateString("en-UK");
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

const readableDate = (date: Date): string =>
  date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function GardenHeatmap({
  commitData,
  changeUnit = "here",
}: GardenHeatmapProps) {
  const [currentDate] = useState(new Date());
  const [dateRangeStart] = useState(() => {
    const d = new Date();
    // d.setMonth(d.getMonth() - 3);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  });

  const heatmapData = commitDataToCount(commitData);
  const largestCount = Math.max(...heatmapData.map((point) => point.count));
  const numberOfChanges = heatmapData.reduce(
    (acc, point) => acc + point.count,
    0
  );

  const contributionDates = heatmapData.map((point) => new Date(point.date));
  const firstCreation =
    [...contributionDates].sort((a, b) => (a < b ? -1 : a === b ? 0 : 1))[0] ??
    new Date();

  return (
    <>
      <details className="notion-toggle">
        <summary>
          <i>
            There {numberOfChanges === 1 ? "has " : "have "}been{" "}
            {numberOfChanges} change
            {numberOfChanges === 1 ? " " : "s "}
            {changeUnit} since it was first created (
            {`${readableDate(firstCreation)}`}
            ).
          </i>
        </summary>
        <div>
          <Spacer y={0.5} />
          <CalendarHeatmap
            startDate={dateRangeStart}
            endDate={currentDate}
            values={heatmapData}
            tooltipDataAttrs={(value: CalendarPoint) => {
              if (!value.count) return null;

              return {
                "data-tip": `${value.count ?? 0} change${
                  value.count === 1 ? "" : "s"
                } on ${new Date(value.date).toLocaleDateString("en-UK")}`,
              };
            }}
            classForValue={(value: CalendarPoint) => {
              if (!value) return "color-empty";

              if (value.count >= 0.75 * largestCount) {
                return `color-scale-4`;
              } else if (value.count >= 0.5 * largestCount) {
                return "color-scale-3";
              } else if (value.count >= 0.25 * largestCount) {
                return "color-scale-2";
              } else if (value.count > 0.0 * largestCount) {
                return "color-scale-1";
              } else {
                return "color-empty";
              }
            }}
          />
          <ReactTooltip />
        </div>
        <details className="notion-toggle">
          <summary>Most recent changes*</summary>
          <div>
            <div style={{ marginTop: "0.5rem" }}>
              <i>
                *N.B. these change messages aren't always optimised for public
                readability
              </i>
            </div>
            <ul className="notion-list notion-list-disc">
              {commitData.slice(0, 5).map((commit) => (
                <li key={`${commit.sha}-${commit.date}-${commit.message}`}>
                  {new Date(commit.date as string).toLocaleDateString("en-UK")}:{" "}
                  {commit.message}
                </li>
              ))}
            </ul>
          </div>
        </details>
      </details>
      <style jsx>{`
        ul {
          margin-top: 0.5rem;
        }
      `}</style>
    </>
  );
}

export default GardenHeatmap;
