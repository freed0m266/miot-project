import './App.css';
import TableClass from './components/Table.tsx';

function App() {

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <TableClass
        tables={[{ status: 'active' }, { status: 'inactive' }, { status: 'active' }, { status: 'active' }, { status: 'inactive' }, { status: 'active' }]} />
    </div>

  );
}

export default App;
