import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'
import { Button } from './Button'
import Highlight from './Highlight'
import ResourceTable from './ResourceTable'

import config from '../utils/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

// access map resource path
const resourcePath = '/applications/__id';

const ApplicationDetails = withRouter(({application, history}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [error, setError] = useState();

  if (error) {
    return (
      <Container className="mb-5">
        <h1>Error</h1>
        <Highlight>{JSON.stringify(error, null, 2)}</Highlight>
      </Container>
    )
  }
  
  const resourceState = resourceMap(resourcePath);
  if (!resourceState.GET.visible) {
    return (
      <Container className="mb-5">
        <h1>Error</h1>
        <h2>You don't have sufficient permissions to view this application.</h2>
      </Container>
    )
  }

  // default displayState 
  const display = { visible: true, enabled: true };

  return (
    <Container className="mb-5">
      <ResourceTable application={application} />
    </Container>
  )
})

export default ApplicationDetails
