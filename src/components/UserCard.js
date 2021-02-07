import React from 'react'
import { Card } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'

const UserCard = withRouter(({user, history}) => {
  const id = user.id; 
  const name = user.display_name;
  /* auth0 fields
  const id = user.user_id; 
  const name = user.nickname;
  */
  return (
    <Card onClick={() => history.push(`/people/${id}`)}
      style={{
      maxWidth: 200,
      minWidth: 200,
      margin: 10    
    }}>
      <Card.Img src={user.picture} alt="picture" />
      <Card.Body>
        <Card.Title as="h5">{name}</Card.Title>
        <Card.Text>{user.email}</Card.Text>
      </Card.Body>
    </Card>
  )
})

export default UserCard