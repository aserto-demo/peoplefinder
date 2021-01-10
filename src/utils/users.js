import React, { useState, useContext } from 'react'
import { useAuth0 } from '@auth0/auth0-react'

import config from '../utils/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

export const UsersContext = React.createContext();
export const useUsers = () => useContext(UsersContext);
export const UsersProvider = ({
  children
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiOrigin}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const error = await response.text();
        setError(error);
        setUsers(null);
        setLoading(false);
        return;
      }

      const responseData = await response.json();
      setUsers(responseData);
      setLoading(false);
    } catch (error) {
      setUsers(null);
      setError(error);
      setLoading(false);
    }
  }

  return (
    <UsersContext.Provider
      value={{
        users, 
        setUsers,
        loadUsers,
        error,
        loading
      }}>
      {children}
    </UsersContext.Provider>
  );
}