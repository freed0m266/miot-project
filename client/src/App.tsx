import ZonePage from './pages/ZonePage.tsx';
// import useWebSocket from './websockets/useWebSocket.ts';
import  { useEffect, useState } from 'react';
import useWebSocket from './websockets/useWebSocket.ts';
import { CustomNotification } from './components/Nofication.tsx';


const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.log('Notification permission denied.');
  }
};

const App = () => {
  const { lastMessage } = useWebSocket();
  const [showNotification, setShowNotification] = useState(false);
  useEffect(() => {
    if (lastMessage) {
      setShowNotification(true);
    }
  }, [lastMessage]);
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <>
      {showNotification && (
        <CustomNotification
          message={lastMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
      <div className='min-h-screen bg-gray-100'>
        <nav className='bg-blue-500 text-white p-4 w-full'>
          <h1 className='text-center'>IoT - Current</h1>
        </nav>

        <div className='flex justify-center px-4 py-2'>
          <div className='max-w-5xl w-full'>
            <ZonePage />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
