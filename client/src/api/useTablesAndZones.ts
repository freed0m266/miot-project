import { useState, useEffect } from 'react';
import { mockTables, mockZones } from '../mockData.ts';

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
// const fetcher = (url: string) => fetch(url).then(res => res.json());

const useTablesAndZones = () => {
  // TODO: add SWR
  // const { data: zones, error: zonesError } = useSWR('/api/zones', fetcher);
  // const { data: tables, error: tablesError } = useSWR('/api/tables', fetcher);


  const [zones, setZones] = useState<Zone[]>([]);
  const [tables, setTables] = useState<Table[]>([]);


  useEffect(() => {
    setTimeout(() => {
      setZones(mockZones);
      setTables(mockTables);
    }, 1000);
  }, []);

  return {
    zones,
    tables,
    // isLoading: !zones && !tables && !zonesError && !tablesError,
    // isError: zonesError || tablesError
  };
};

export default useTablesAndZones;
