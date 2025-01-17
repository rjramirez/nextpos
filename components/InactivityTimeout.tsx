import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const InactivityTimeout = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      logout();
      alert('You have been logged out due to inactivity');
    }, 3600000); // 1 hour timeout

    const resetTimer = () => {
      clearTimeout(timeout);
      setTimeout(() => {
        logout();
        alert('You have been logged out due to inactivity');
      }, 3600000);
    };

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('keydown', resetTimer);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mousemove', resetTimer);
      document.removeEventListener('keydown', resetTimer);
    };
  }, [logout]);

  return null;
};

export default InactivityTimeout;
