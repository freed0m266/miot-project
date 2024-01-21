import { Table, Zone } from './types.js';

const mockZones: Zone[] = [
  { id: 1, name: 'Zóna 1' },
  { id: 2, name: 'Zóna 2' },
  { id: 3, name: 'Zóna 3' },
];

const mockTables: Table[] = [
  { id: 1, zoneId: 1, name: 'Stůl 1', isOccupied: false, lastOccupiedAt: new Date() },
  { id: 2, zoneId: 1, name: 'Stůl 2', isOccupied: true, lastOccupiedAt: new Date() },
  { id: 3, zoneId: 2, name: 'Stůl 5', isOccupied: false, lastOccupiedAt: new Date() },
  { id: 4, zoneId: 2, name: 'Stůl 4', isOccupied: true, lastOccupiedAt: new Date() },
  { id: 5, zoneId: 1, name: 'Stůl 3', isOccupied: true, lastOccupiedAt: new Date() },
];

export { mockZones, mockTables };
