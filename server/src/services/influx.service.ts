import {
  DataPoint,
  flushToInflux,
  queryInflux,
  writeToInflux,
} from "../client/influx.client";
import { createDesksService, getDesksFromCsv } from "./desks.service";

const valueMin: number = 45;
const valueMax: number = 400;

export async function saveDataPoint(
  timestamp: number,
  deskId: string,
  value: number,
): Promise<void> {
  let desks = await getDesksFromCsv();
  let real_desk = desks.find((i) => i.deskId === deskId);
  if (real_desk == undefined) {
    await createDesksService({ zoneId: "zone1", deskId: deskId });
    desks = await getDesksFromCsv();
    real_desk = desks.find((i) => i.deskId === deskId);
  }

  real_desk.deskId;

  // Write data of real desk (current) to influx
  writeToInflux({
    timestamp: timestamp,
    deskId: real_desk.deskId,
    zoneId: real_desk.zoneId,
    value: value,
  });

  desks
    .filter(
      (i) => i.deskId !== real_desk.deskId || i.zoneId !== real_desk.zoneId,
    )
    .forEach((desk) => {
      // Write data of other desks (virtual) to influx
      writeToInflux({
        timestamp: timestamp,
        deskId: desk.deskId,
        zoneId: desk.zoneId,
        value: Math.floor(Math.random() * (valueMax - valueMin + 1) + valueMin),
      });
    });

  flushToInflux();
}

export async function getStats(
  zoneId: string,
  deskId: string,
  count: number = 10,
  unit: "days" | "weeks" | "months" | "years" = "days",
): Promise<DataPoint[]> {
  let fluxQuery = `from(bucket: "current")
      |> range(start: ${convertTimeRange(count, unit)})
      |> filter(fn: (r) => r["_measurement"] == "current")
      |> filter(fn: (r) => r["_field"] == "rms_avg")
      |> filter(fn: (r) => r["zoneId"] == "${zoneId}")
      |> filter(fn: (r) => r["deskId"] == "${deskId}")
      |> aggregateWindow(every: ${getAggregateWindow(
        count,
        unit,
      )}, fn: mean, createEmpty: false)
      |> yield(name: "mean")`;

  console.log(fluxQuery);

  return queryInflux(fluxQuery);
}

export async function getLatestDataPoint(
  zoneId: string,
  deskId?: string,
  count: number = 10,
  unit: "days" | "weeks" | "months" | "years" = "days",
): Promise<DataPoint[]> {
  let fluxQuery = `from(bucket: "current")
      |> range(start: ${convertTimeRange(count, unit)})
      |> filter(fn: (r) => r["_measurement"] == "current")
      |> filter(fn: (r) => r["_field"] == "rms_avg")
      |> filter(fn: (r) => r["zoneId"] == "${zoneId}")
      |> filter(fn: (r) => r["deskId"] == "${deskId}")
      |> last()`;

  console.log(fluxQuery);

  return queryInflux(fluxQuery);
}

export async function getLatestActiveDataPoint(
  zoneId: string,
  deskId?: string,
  count: number = 10,
  unit: "days" | "weeks" | "months" | "years" = "days",
): Promise<DataPoint[]> {
  let fluxQuery = `from(bucket: "current")
      |> range(start: ${convertTimeRange(count, unit)})
      |> filter(fn: (r) => r["_measurement"] == "current")
      |> filter(fn: (r) => r["_field"] == "rms_avg")
      |> filter(fn: (r) => r["zoneId"] == "${zoneId}")
      |> filter(fn: (r) => r["deskId"] == "${deskId}")
      |> filter(fn: (r) => r["_value"] > 300)
      |> last()`;

  console.log(fluxQuery);

  return queryInflux(fluxQuery);
}

function convertTimeRange(
  count: number,
  unit: "days" | "weeks" | "months" | "years",
): string {
  switch (unit) {
    case "days": {
      return `-${count.toString()}d`;
    }
    case "weeks": {
      return `-${count.toString()}w`;
    }
    case "months": {
      return `-${count.toString()}mo`;
    }
    case "years": {
      return `-${count.toString()}y`;
    }
  }
}

function getAggregateWindow(
  count: number,
  unit: "days" | "weeks" | "months" | "years",
): string {
  switch (unit) {
    case "days": {
      return `${(count + 1).toString()}d`;
    }
    case "weeks": {
      return `${(count + 1).toString()}w`;
    }
    case "months": {
      return `${(count + 1).toString()}mo`;
    }
    case "years": {
      return `${(count + 1).toString()}y`;
    }
  }
}
