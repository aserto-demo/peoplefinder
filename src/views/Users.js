import React, { useState, useEffect } from 'react'
import { Container, FormControl } from 'react-bootstrap'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'

import Highlight from '../components/Highlight'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import UserList from '../components/UserList'

import config from '../utils/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

export const UsersView = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState();
  const [filter, setFilter] = useState('');
  const pageTitle = 'People';
  const displayState = resourceMap('/users').GET;
  const userList = (filter && users) ? users.filter(u => u.display_name.toLowerCase().includes(filter)) : users;

  const load = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiOrigin}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const responseData = await response.json();
      setUsers(responseData);
      setLoading(false);
    } catch (error) {
      setUsers(null);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!users && !error && displayState.visible) {
      load();
    }
  //eslint-disable-next-line react-hooks/exhaustive-deps  
  }, []);

  if (error) {
    return (
      <Container className="mb-5">
        <h1>Error</h1>
        <Highlight>{JSON.stringify(error, null, 2)}</Highlight>
      </Container>
    )
  }

  if (!displayState.visible) {
    return (
      <Container className="mb-5">
        <h1>Error</h1>
        <h2>You don't have sufficient permissions to view users.</h2>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader title={pageTitle} load={load} loading={loading}>
        <FormControl style={{
          width: 220,
          marginLeft: 107,
          }}
          placeholder="Filter"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)} 
        />
      </PageHeader>
      <UserList users={userList} setUsers={setUsers} />
    </Container>
  )
}

export default withAuthenticationRequired(UsersView, {
  onRedirecting: () => <Loading />,
})
