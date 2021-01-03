import { AsyncReturnType } from "type-fest";
import { ReactNode, useState } from "react";
import ReactTooltip from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { getCommitDatesForGardenNote } from "../lib/api/github";
import { Spacer } from "@geist-ui/react";

const COLOUR_SCALE_COUNT = 14;

interface CalendarPoint {
  date: Date;
  count: number;
}

interface GardenHeatmapProps {
  commitData: AsyncReturnType<typeof getCommitDatesForGardenNote>;
  commitDenominator: number;
  changeUnit?: ReactNode;
}

const commitDataToCount = (
  commitData: GardenHeatmapProps["commitData"]
): CalendarPoint[] => {
  const dateDict = commitData.reduce((acc, commitDatum) => {
    if (commitDatum.date) {
      const commitDate = new Date(commitDatum.date);
      // calendar works off en-US
      const commitDateKey = commitDate.toLocaleDateString("en-US");
      if (acc[commitDateKey]) {
        acc[commitDateKey].count += 1;
        return acc;
      } else {
        return {
          ...acc,
          [commitDateKey]: { date: commitDate, count: 1 },
        };
      }
    } else {
      return acc;
    }
  }, {} as Record<string, CalendarPoint>);
  return Object.values(dateDict);
};

const readableDate = (date: Date): string =>
  date.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function GardenHeatmap({
  commitData,
  changeUnit = "here",
  commitDenominator,
}: GardenHeatmapProps) {
  const [currentDate] = useState(new Date());
  const [dateRangeStart] = useState(() => {
    const d = new Date();
    // d.setMonth(d.getMonth() - 3);
    d.setFullYear(d.getFullYear() - 1);
    return d;
  });

  const heatmapData = commitDataToCount(commitData);
  const numberOfChanges = heatmapData.reduce(
    (acc, point) => acc + point.count,
    0
  );

  const contributionDates = heatmapData.map((point) => point.date);
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
                } on ${value.date.toLocaleDateString("en-GB", {
                  month: "numeric",
                  day: "numeric",
                  year: "2-digit",
                })}`,
              };
            }}
            classForValue={(value: CalendarPoint) => {
              if (!value || value.count === 0) return "color-empty";

              const relativeCommitLevel = value.count / commitDenominator;

              const level =
                relativeCommitLevel > 1
                  ? COLOUR_SCALE_COUNT
                  : Math.floor(COLOUR_SCALE_COUNT * relativeCommitLevel);

              return `color-scale-${level}`;
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
                  {commit.message}{" "}
                  <small>
                    {new Date(commit.date as string).toLocaleDateString(
                      "en-GB",
                      {
                        month: "numeric",
                        day: "numeric",
                        year: "2-digit",
                      }
                    )}
                  </small>
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
