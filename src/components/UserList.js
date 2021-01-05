import React from 'react'
import { CardDeck } from 'react-bootstrap'
import UserCard from './UserCard'

const UserList = ({users, setUsers}) => {
  return (
    users ? 
      <CardDeck>
        { users.map(u => <UserCard key={u.user_id} user={u} />) }
      </CardDeck> :
      <div />
  )
}

export default UserList