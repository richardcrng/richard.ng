import { AsyncReturnType } from "type-fest";
import { useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { getCommitDatesForGardenNote } from "../lib/api/github";

interface CalendarPoint {
  date: string;
  count: number;
}

interface GardenHeatmapProps {
  commitData: AsyncReturnType<typeof getCommitDatesForGardenNote>;
}

const commitDataToCount = (
  commitData: GardenHeatmapProps["commitData"]
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

function GardenHeatmap({ commitData }: GardenHeatmapProps) {
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

  return (
    <>
      <p>
        <i>
          This note has changed {numberOfChanges} time
          {numberOfChanges === 1 ? " " : "s "}
          in the past year.
        </i>
      </p>
      <CalendarHeatmap
        startDate={dateRangeStart}
        endDate={currentDate}
        values={heatmapData}
        classForValue={(value: CalendarPoint) => {
          if (!value) return "color-empty";

          if (value.count >= 0.8 * largestCount) {
            return `color-scale-4`;
          } else if (value.count >= 0.6 * largestCount) {
            return "color-scale-3";
          } else if (value.count >= 0.4 * largestCount) {
            return "color-scale-2";
          } else if (value.count >= 0.2 * largestCount) {
            return "color-scale-1";
          } else {
            return "color-empty";
          }
        }}
      />
    </>
  );
}

export default GardenHeatmap;
