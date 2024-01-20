import TableClass from './components/Table';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-500 text-white p-4 w-full">
        <h1 className="text-center">IoT - Current</h1>
      </nav>

      <div className="flex justify-center px-4 py-2">
        <div className="max-w-5xl w-full">
          <div className='flex flex-wrap justify-center'>
            <TableClass
              tables={[
                { status: 'active' },
                { status: 'inactive' },
                { status: 'active' },
                { status: 'active' },
                { status: 'inactive' },
                { status: 'active' }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
