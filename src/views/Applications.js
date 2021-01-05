import React, { useState, useEffect } from 'react'
import { Container, CardDeck } from 'react-bootstrap'
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'

import Highlight from '../components/Highlight'
import Loading from '../components/Loading'
import PageHeader from '../components/PageHeader'
import ApplicationCard from '../components/ApplicationCard'

import config from '../utils/auth_config.json'
const { 
  policyServiceUrl = "http://localhost:9002" 
} = config;

export const ApplicationsView = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState();
  const pageTitle = 'Applications';
  const displayState = resourceMap('/applications').GET;

  const load = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch(`${policyServiceUrl}/api/v1/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const responseData = await response.json();
      setApplications(responseData);
      setLoading(false);
    } catch (error) {
      setApplications(null);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applications && !error && displayState.visible) {
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

  return (applications ?
    <Container>
      <PageHeader title={pageTitle} load={load} loading={loading} />
      <CardDeck>
        { applications.map(a => <ApplicationCard key={a} application={a} />)}
      </CardDeck>
    </Container> :
    <div />
  )
}

export default withAuthenticationRequired(ApplicationsView, {
  onRedirecting: () => <Loading />,
})
