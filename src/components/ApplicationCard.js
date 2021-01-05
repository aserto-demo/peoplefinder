import React from 'react'
import { Card } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import logo from '../assets/logo.png'

const ApplicationCard = withRouter(({application, history}) => 
  <Card onClick={() => history.push(`/applications/${application}`)}
    style={{
    maxWidth: 200,
    minWidth: 200,
    margin: 10    
  }}>
    <center>
      <Card.Img src={logo} alt="logo" style={{ margin: 20, width: 160 }} />
      <Card.Body>
        <Card.Title as="h5">{application}</Card.Title>
      </Card.Body>
    </center>
  </Card>
  )

export default ApplicationCard