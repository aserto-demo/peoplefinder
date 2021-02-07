import React, { useState } from 'react'
import { Container } from 'react-bootstrap'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'
import { useUsers } from '../utils/users'

import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import UserList from '../components/UserList'
import Filter from '../components/Filter'

export const UsersView = () => {
  const { resourceMap } = useAserto();
  const { users, setUsers, loadUsers, loading } = useUsers();
  const [filter, setFilter] = useState('');
  const pageTitle = 'People';
  const displayState = resourceMap('GET', '/api/users');
  const userList = (filter && users) ? users.filter(u => u.display_name.toLowerCase().includes(filter)) : users;

  if (!displayState.visible) {
    return (
      <Container className="mb-5">
        <h1>Error</h1>
        <h2>You don't have sufficient permissions to view people.</h2>
      </Container>
    )
  }

  return (
    <Container>
      <PageHeader title={pageTitle} load={loadUsers} loading={loading}>
        <Filter 
          placeholder='Filter'
          value={filter}
          setValue={setFilter}
        />
      </PageHeader>
      <UserList users={userList} setUsers={setUsers} />
    </Container>
  )
}

export default withAuthenticationRequired(UsersView, {
  onRedirecting: () => <Loading />,
})
