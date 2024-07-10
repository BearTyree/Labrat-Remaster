import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionExpired = () => {
  const navigate = useNavigate();

  const handleSessionExpired = async () => {
    if (localStorage.getItem('token')) {
      localStorage.clear();
      navigate('/login');
      alert('session expired');
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const checkSessionExpired = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/authenticateToken',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          handleSessionExpired();
        }
      } catch (err) {}
    };

    checkSessionExpired();

    return () => {
      controller.abort();
    };
  }, []);

  return { handleSessionExpired };
};

export default useSessionExpired;
