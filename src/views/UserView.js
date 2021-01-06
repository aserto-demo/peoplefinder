import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'

import Highlight from '../components/Highlight'
import PageHeader from '../components/PageHeader'
import UserDetails from '../components/UserDetails'

import config from '../config/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

const UserView = () => {
  let { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const pageTitle = user ? user.name : '';
  const displayState = resourceMap('/users').GET;

  const load = async () => {
    try {
      setLoading(true);
      const token = await getAccessTokenSilently();
      const response = await fetch(`${apiOrigin}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      const userData = await response.json();

      // augment userData
      if (!userData.user_id) {
        // aserto style result
        userData.name = userData.display_name;
        userData.title = userData.attr.title;
        userData.department = userData.attr.department;
      } else {
        // auth0 style result
        userData.id = userData.user_id;
        userData.name = userData.nickname;
        userData.title = userData.user_metadata.title;
        userData.department = userData.user_metadata.department;
      }
      setUser(userData);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // only retrieve the users if the user has the right permissions
    if (!user && !error && displayState.visible) {
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
        <h2>You don't have sufficient permissions to view this user.</h2>
      </Container>
    )
  }

  return (user ?
    <Container>
      <PageHeader 
        title={pageTitle}
        breadcrumbText='People'
        breadcrumbUrl='/people'
        load={load} loading={loading} />
      <UserDetails user={user} setUser={setUser} />
    </Container> :
    <div />
  )
}

export default UserView
