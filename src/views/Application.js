import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'

import Highlight from '../components/Highlight'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
//import ApplicationDetails from '../components/ApplicationDetails'
import Permissions from '../components/Permissions'

import config from '../utils/auth_config.json'
const { 
  policyServiceUrl = "http://localhost:9002" 
} = config;

export const ApplicationView = () => {
  let { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState();
  const pageTitle = id;
  const displayState = resourceMap('/applications/__id').GET;

  const load = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch(`${policyServiceUrl}/api/v1/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const responseData = await response.json();
      setApplication(responseData);
      setLoading(false);
    } catch (error) {
      setApplication(null);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!application && !error && displayState.visible) {
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
        <h2>You don't have sufficient permissions to view application.</h2>
      </Container>
    )
  }

  return (application ?
    <Container>
      <PageHeader 
        title={pageTitle}
        breadcrumbText='Applications'
        breadcrumbUrl='/applications'
        load={load} loading={loading} />
      <Permissions application={application} />
    </Container> :
    <div />
  )
}

export default withAuthenticationRequired(ApplicationView, {
  onRedirecting: () => <Loading />,
})
