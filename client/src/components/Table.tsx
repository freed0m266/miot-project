import React from 'react';

interface TableProps {
  status: 'active' | 'inactive';
}

const Table: React.FC<TableProps> = ({ status }) => {
  const tableStyle: React.CSSProperties = {
    backgroundColor: '#deb887', // A realistic wood color for the table top
    width: '120px',
    height: '20px',
    margin: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    boxShadow: '0 8px 6px -6px black', // Deeper shadow for a 3D effect
    borderRadius: '8px',
    border: '1px solid #8b4513',
  };

  const legStyle: React.CSSProperties = {
    backgroundColor: '#8b4513', // Dark wood color for legs
    width: '12px',
    height: '50px',
    position: 'absolute',
    bottom: '-50px',
  };

  const statusStyle: React.CSSProperties = {
    color: status === 'active' ? 'green' : 'red',
    fontWeight: 'bold',
    marginTop: '5px',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={tableStyle}>
        <div style={{ ...legStyle, left: '10px' }}></div>
        {/* Left leg */}
        <div style={{ ...legStyle, right: '10px' }}></div>
        {/* Right leg */}
        <span style={statusStyle}>{status === 'active' ? 'Active' : 'Inactive'}</span>
      </div>
    </div>
  );
};

interface TableClassProps {
  tables: TableProps[];
}

const TableClass: React.FC<TableClassProps> = ({ tables }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {tables.map((table, index) => (
        <Table key={index} status={table.status} />
      ))}
    </div>
  );
};

export default TableClass;
