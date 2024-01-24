import { DeskDto, DeskStatus } from "../models/desk.model";
import fs from "fs";
import * as path from "path";
import { parse } from "csv-parse";
import { DataPoint } from "../client/influx.client";
import {
  getLatestActiveDataPoint,
  getLatestDataPoint,
  getStats,
} from "./influx.service";

type GetDesksServiceParams = {
  zoneId: string;
  deskIds?: string[];
  count?: number;
  unit?: "days" | "weeks" | "months" | "years";
};

type ManageDeskServiceParams = {
  zoneId: string;
  deskId: string;
};

export function getDesksService({
  zoneId,
  deskIds = [],
  count,
  unit,
}: GetDesksServiceParams): DeskDto[] {
  console.log("Fetching desks");
  return [
    {
      id: "18eebf7a-7e72-4a5a-8b6a-ad26694283ab",
      zoneId: "floor-1",
      status: "inactive",
      lastUsed: new Date("2023-12-20"),
      averageWorkHoursUsage: 8,
      averageDailyUsage: 5,
      shortUsagesCount: 4,
    },
    {
      id: "04814482-d1fb-4d96-ae11-813181dfc15f",
      zoneId: "floor-1",
      status: "active",
      lastUsed: new Date("2024-01-3"),
      averageWorkHoursUsage: 16,
      averageDailyUsage: 9,
      shortUsagesCount: 2,
    },
    {
      id: "c5dbe9ef-c9f5-467d-b212-4f53cabe3b6c",
      zoneId: "floor-2",
      status: "offline",
      lastUsed: new Date("2021-01-01"),
      averageWorkHoursUsage: 0,
      averageDailyUsage: 0,
      shortUsagesCount: 0,
    },
  ];
}

export async function getDesksServiceReal({
  zoneId,
  deskIds = [],
  count = 10,
  unit = "days",
}: GetDesksServiceParams): Promise<DeskDto[]> {
  const desksResult: DeskDto[] = [];

  if (Array.isArray(deskIds) && deskIds.length > 0) {
    for (const deskId of deskIds) {
      let stats = await getStats(zoneId, deskId, count, unit)[0];
      let latestDataPoint = await getLatestDataPoint(
        zoneId,
        deskId,
        count,
        unit,
      )[0];
      let latestActiveDataPoint = await getLatestActiveDataPoint(
        zoneId,
        deskId,
        count,
        unit,
      )[0];
      desksResult.push(
        mapToDeskDto(stats, latestDataPoint, latestActiveDataPoint),
      );
    }
    return desksResult;
  } else {
    const allDesks = await getDesksFromCsv();
    const allZoneDesks = allDesks.filter((i) => i.zoneId === zoneId);
    for (const desk of allZoneDesks) {
      let stats = await getStats(zoneId, desk.deskId, count, unit)[0];
      let latestDataPoint = await getLatestDataPoint(
        zoneId,
        desk.deskId,
        count,
        unit,
      )[0];
      let latestActiveDataPoint = await getLatestActiveDataPoint(
        zoneId,
        desk.deskId,
        count,
        unit,
      )[0];
      desksResult.push(
        mapToDeskDto(stats, latestDataPoint, latestActiveDataPoint),
      );
    }
    return desksResult;
  }
}

export async function createDesksService({
  zoneId,
  deskId,
}: ManageDeskServiceParams): Promise<number> {
  console.log("Creating desk");

  const exists = await doesDeskAlreadyExist(zoneId, deskId);
  if (exists) {
    return 400;
  }

  fs.appendFile(
    "../server/src/persistence/desks.csv",
    `\n${deskId}, ${zoneId}`,
    function (err) {
      if (err) throw err;
    },
  );

  return 201;
}

export async function deleteDesksService({
  zoneId,
  deskId,
}: ManageDeskServiceParams): Promise<number> {
  console.log("Deleting desk");

  let response = null;
  const csvFilePath = path.resolve("../server/src/persistence/desks.csv");
  const headers = ["deskId", "zoneId"];

  const rows: ManageDeskServiceParams[] = [];

  // Read CSV and filter rows
  const stream = fs.createReadStream(csvFilePath);
  const parser = parse({
    delimiter: ",",
    columns: headers,
  });

  stream.pipe(parser);

  parser.on("data", (row: ManageDeskServiceParams) => {
    if (
      !(
        row.zoneId.trim() === zoneId.trim() &&
        row.deskId.trim() === deskId.trim()
      )
    ) {
      rows.push(row); // Exclude the row to be deleted
    } else {
      response = 200;
    }
  });

  await new Promise<void>((resolve, reject) => {
    parser.on("end", () => {
      resolve();
    });

    parser.on("error", (error) => {
      response = 500;
      reject(error);
    });
  });

  // Write the updated content back to the CSV file
  const updatedCsvContent = rows
    .map((row) => Object.values(row).join(","))
    .join("\n");
  fs.writeFileSync(csvFilePath, updatedCsvContent, { encoding: "utf-8" });

  return response;
}

export async function getDesksFromCsv(): Promise<ManageDeskServiceParams[]> {
  const csvFilePath = path.resolve("../server/src/persistence/desks.csv");
  const headers = ["deskId", "zoneId"];

  const desks: ManageDeskServiceParams[] = [];

  const stream = fs.createReadStream(csvFilePath);
  const parser = parse({
    delimiter: ",",
    columns: headers,
  });

  stream.pipe(parser);

  await new Promise<void>((resolve, reject) => {
    parser.on("data", (row: ManageDeskServiceParams) => {
      desks.push(row);
    });

    parser.on("end", () => {
      desks.shift(); // Remove headers
      resolve();
    });

    parser.on("error", (error) => {
      reject(error);
    });
  });

  return desks;
}

async function doesDeskAlreadyExist(
  zoneId: string,
  deskId: string,
): Promise<boolean> {
  const csvFilePath = path.resolve("../server/src/persistence/desks.csv");
  const headers = ["deskId", "zoneId"];

  return new Promise<boolean>((resolve, reject) => {
    const stream = fs.createReadStream(csvFilePath);

    const parser = parse({
      delimiter: ",",
      columns: headers,
    });

    stream.pipe(parser);

    let deskExists = false;

    parser.on("data", (row: ManageDeskServiceParams) => {
      if (
        row.zoneId.trim() === zoneId.trim() &&
        row.deskId.trim() === deskId.trim()
      ) {
        deskExists = true;
      }
    });

    parser.on("end", () => {
      resolve(deskExists);
    });

    parser.on("error", (error) => {
      reject(error);
    });
  });
}

function mapToDeskDto(
  stats: DataPoint,
  latestDataPoint: DataPoint,
  latestActiveDataPoint: DataPoint,
): DeskDto {
  return {
    id: stats.deskId,
    zoneId: stats.zoneId,
    status: getDeskStatus(latestDataPoint),
    lastUsed: latestActiveDataPoint.timestamp as Date,
    averageWorkHoursUsage: stats.value, // ToDo
    averageDailyUsage: stats.value, // ToDo
    shortUsagesCount: 2, // ToDo
  };
}

// If the desk has active usage (more than 300 rms_avg) and last data point is less than 5 minutes old
function getDeskStatus(dataPoint: DataPoint): DeskStatus {
  const difInSecs =
    Math.abs(dataPoint.timestamp.valueOf() - Date.now().valueOf()) / 1000;

  // Has the desk reported in last 5 minutes
  if (difInSecs < 60 * 5) {
    // ToDo: does 5 minutes make sense?
    // Has the desk rms_avg over 300
    if (dataPoint.value > 300) {
      // ToDo: set accurate limit
      return "active";
    } else {
      return "inactive";
    }
  } else {
    return "offline";
  }
}
