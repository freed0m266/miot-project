import React from 'react';
import { Table } from '../types';

type TablesDisplayProps = {
  tables: Table[];
};

const TablesDisplay: React.FC<TablesDisplayProps> = ({ tables }) => {
  return (
    <div>
      {tables.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
          {tables.map(table => (
            <div
              key={table.id}
              className={`p-4 border rounded ${table.isOccupied ? 'bg-red-200' : 'bg-green-200'}`}
            >
              {table.name}
              {table.isOccupied && <p>Last occupied at: {table.lastOccupiedAt?.toLocaleString()}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className='text-center p-4'>
          <p>Tato zóna nemá žádné stoly</p>
        </div>
      )}
    </div>
  );
};

export { TablesDisplay };
