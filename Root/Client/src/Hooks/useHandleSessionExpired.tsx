import { useNavigate } from 'react-router-dom';

export default function useHandleSessionExpired() {
  const navigate = useNavigate();
  const handleSessionExpired = (startLocation?: string) => {
    startLocation && navigate(startLocation);
  };
  return handleSessionExpired;
}
