export type Desk = {
  id: number;
  status: DeskStatus;
  lastUsed: Date;
  averageWorkhoursUsage10days: number;
  averageDailyUsage10days: number;
  shortUsagesCount10days: number;
};

export type DeskStatus = "Active" | "Inactive" | "Archived";
