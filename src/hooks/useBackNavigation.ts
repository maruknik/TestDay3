import { useNavigate } from 'react-router-dom';

export function useBackNavigation(defaultPath: string) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(defaultPath);
  };

  return goBack;
}
