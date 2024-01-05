import { Desk } from "../models/desk.model";

export function getDesksSer(): Desk[] {
  console.log("Fetching desks");
  return [
    {
      id: 0,
      status: "Inactive",
      lastUsed: new Date("2023-12-20"),
      averageWorkhoursUsage10days: 8,
      averageDailyUsage10days: 5,
      shortUsagesCount10days: 4,
    },
    {
      id: 1,
      status: "Active",
      lastUsed: new Date("2024-01-3"),
      averageWorkhoursUsage10days: 16,
      averageDailyUsage10days: 9,
      shortUsagesCount10days: 2,
    },
    {
      id: 2,
      status: "Archived",
      lastUsed: new Date("2021-01-01"),
      averageWorkhoursUsage10days: 0,
      averageDailyUsage10days: 0,
      shortUsagesCount10days: 0,
    },
  ];
}
