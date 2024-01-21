import useTablesAndZones from '../api/useTablesAndZones.ts';
import { TablesDisplay } from '../components/TableDisplay.tsx';
import { ZoneSelector } from '../components/ZoneSelector.tsx';
import { FC, useState } from 'react';

const ZonePage: FC = () => {

  const { zones, tables } = useTablesAndZones();
  const [currentZone, setCurrentZone] = useState<number>(zones?.[0]?.id);

  if (!zones.length || !tables.length) return <p>Načítání...</p>;

  // if (isLoading) return <p>Načítání...</p>;
  // if (isError) return <p>Došlo k chybě při načítání dat.</p>;

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='mb-4'>
        <ZoneSelector zones={zones} onSelectZone={setCurrentZone} />
      </div>
      <div className='w-full'>
        <TablesDisplay tables={tables.filter(table => table.zoneId === currentZone)} />
      </div>
    </div>
  );
};

export default ZonePage;