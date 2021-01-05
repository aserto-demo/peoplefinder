import React from 'react'
import { Card } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

const UserCard = withRouter(({user, history}) => 
  <Card onClick={() => history.push(`/users/${user.user_id}`)}
    style={{
    maxWidth: 220,
    minWidth: 220,
    margin: 10    
  }}>
    <Card.Img src={user.picture} alt="Card image cap" />
    <Card.Body>
      <Card.Title as="h5">{user.nickname}</Card.Title>
      <Card.Text>{user.email}</Card.Text>
    </Card.Body>
  </Card>
  )

export default UserCard