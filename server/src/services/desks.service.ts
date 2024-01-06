import { DeskDto } from '../models/desk.model';


type DesksServiceParams = {
  tableIds?: string[]
  interval: { count: number, unit: 'day' | 'week' | 'month' | 'year' }
}

export function getDesksService({ tableIds = [], interval: { count, unit } }: DesksServiceParams): DeskDto[] {
  console.log('Fetching desks');
  return [
    {
      id: 0,
      status: 'inactive',
      lastUsed: new Date('2023-12-20'),
      averageWorkHoursUsage: 8,
      averageDailyUsage: 5,
      shortUsagesCount: 4,
    },
    {
      id: 1,
      status: 'active',
      lastUsed: new Date('2024-01-3'),
      averageWorkHoursUsage: 16,
      averageDailyUsage: 9,
      shortUsagesCount: 2,
    },
    {
      id: 2,
      status: 'offline',
      lastUsed: new Date('2021-01-01'),
      averageWorkHoursUsage: 0,
      averageDailyUsage: 0,
      shortUsagesCount: 0,
    },
  ];
}
