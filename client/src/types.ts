type Zone = {
  id: number;
  name: string;
};

type Table = {
  id: number;
  zoneId: number;
  name: string;
  isOccupied: boolean;
  lastOccupiedAt?: Date;
};


export type { Zone, Table };