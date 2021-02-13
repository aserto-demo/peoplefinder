import React, { useEffect } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'
import { useUsers } from './utils/users'

import history from './utils/history'
import config from './utils/config'

import Loading from './components/Loading'
import NavBar from './components/NavBar'
import Home from './views/Home'
import Profile from './views/Profile'
import Users from './views/Users'
import UserView from './views/UserView'

import './App.css'

// get api origin from config
const { apiOrigin = "http://localhost:3001" } = config;

function App() {
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { init, loading, displayStateMap, error: asertoError } = useAserto();
  const { users, loadUsers, error: usersError } = useUsers();

  // use an effect to load the Aserto display state map 
  useEffect(() => {
    async function initAserto() {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          await init({ 
            serviceUrl: apiOrigin, 
            accessToken: token, 
            throwOnError: false 
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    // load the display state map when Auth0 has finished initializing
    if (!asertoError && !isLoading && isAuthenticated) {
      initAserto();
    }

    // load users 
    if (!users && !usersError && isAuthenticated) {
      loadUsers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); 

  if (error) {
    return <div><h1>Error encountered</h1><p>{error.message}</p></div>;
  }

  if (isLoading) {
    return <Loading />
  }

  if (isAuthenticated && !displayStateMap) {
    if (loading) {
      return <Loading />
    }
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-4">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/people" exact component={Users} />
            <Route path="/people/:id" component={UserView} />
          </Switch>
        </Container>
      </div>
    </Router>
  )
}

export default App
