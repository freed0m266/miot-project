import React from 'react';
import { Zone } from '../types.ts';

type ZoneSelectorProps = {

  zones: Zone[];
  onSelectZone: (zoneId: number) => void;
};

export const ZoneSelector: React.FC<ZoneSelectorProps> = ({ zones, onSelectZone }) => {
  return (
    <div className='flex space-x-2'>
      {zones.map(zone => (
        <button
          key={zone.id}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          onClick={() => onSelectZone(zone.id)}
        >
          {zone.name}
        </button>
      ))}
    </div>
  );
};
