import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useIsLogged = () => {
  const [isLogged, setIsLogged] = useState(false);
  const loggedUserId = useSelector((store) => store.user.loggedUserId);

  useEffect(() => setIsLogged(!!loggedUserId), [loggedUserId]);

  return isLogged;
};

export default useIsLogged;
