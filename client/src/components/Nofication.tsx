import React, { useEffect } from 'react';

type NotificationProps = {
  message: string;
  onClose: () => void;
};

const CustomNotification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className='fixed top-5 right-5 bg-white border border-gray-300 shadow-lg rounded-md p-4'>
      <button onClick={onClose} className='float-right text-gray-600 text-lg font-bold'>&times;</button>
      <p>{message}</p>
    </div>
  );
};

export { CustomNotification };
