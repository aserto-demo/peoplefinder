import React, { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'

import Highlight from '../components/Highlight'

import config from '../utils/auth_config.json'
const { 
  policyServiceUrl = "http://localhost:9002" 
} = config;

export const PermissionDetail = ({permission, setLoading}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [error, setError] = useState();
  const [policy, setPolicy] = useState();
  const displayState = resourceMap('/applications/__id').GET;

  const load = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch(`${policyServiceUrl}/api/v1/permissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const responseData = await response.json();
      setPolicy(responseData);
      setLoading(false);
    } catch (error) {
      setPolicy(null);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permission && !error && displayState.visible) {
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
        <h2>You don't have sufficient permissions to view policy.</h2>
      </Container>
    )
  }

  return (policy ?
    <Highlight>{policy}</Highlight> :
    <div />
  )
}
