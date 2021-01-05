import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'
import { Button } from './Button'
import Highlight from './Highlight'

import config from '../utils/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

// access map resource path
const resourcePath = '/users/__id';

const UserDetails = withRouter(({user, setUser, history}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [showDetail, setShowDetail] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [department, setDepartment] = useState((user.user_metadata && user.user_metadata.department) || '');
  const [title, setTitle] = useState((user.user_metadata && user.user_metadata.title) || '');
  const [error, setError] = useState();

  const updateUser = () => {
    const update = async () => {
      try {
        const token = await getAccessTokenSilently();
        const body = { 
          user_metadata: {
            department,
            title
          }
        };
        const response = await fetch(`${apiOrigin}/api/users/${user.user_id}`, {
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          method: 'PUT'
        });
  
        const responseData = await response.json();
        setUser(responseData);
      } catch (error) {
        setUser(null);
        setError(error);
      }
    };  
    
    // if in update mode, call the update function
    if (updating) {
      setUpdating(false);
      update();
    } else {
      // set update mode
      setUpdating(true);
    }
  };

  const deleteUser = () => {
    const del = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${apiOrigin}/api/users/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          method: 'DELETE'
        });
  
        await response.json();
        history.push('/users');        
      } catch (error) {
        setUser(null);
        setError(error);
      }
    };  
    del();
  };

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
        <h2>You don't have sufficient permissions to view this user.</h2>
      </Container>
    )
  }

  // default displayState 
  const display = { visible: true, enabled: true };

  return (
    <Container className="mt-5 mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md={4}>
          <h2>{user.nickname}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
        <Col md>
          <Button style={{ marginRight: 30, width: 110 }} displayState={resourceState.PUT} onClick={updateUser}>
            { updating ? 'Save' : 'Edit' }
          </Button>
          <Button style={{ marginRight: 30, width: 110 }} displayState={resourceState.DELETE} onClick={deleteUser}>
            Delete
          </Button>
          {showDetail && <Button displayState={display} onClick={() => setShowDetail(false)}>Hide Detail</Button> }
          {!showDetail && <Button displayState={display} onClick={() => setShowDetail(true)}>Show Detail</Button> }
        </Col>
      </Row>
      { updating && 
        <>
          <Row>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text style={{ minWidth: 120 }}>Department</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={department} onChange={(e) => setDepartment(e.target.value)} />
            </InputGroup>
          </Row>
          <br />
          <Row>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text style={{ minWidth: 120 }}>Title</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl value={title} onChange={(e) => setTitle(e.target.value)} />
            </InputGroup>        
          </Row>
          <br />
        </>
      }
      { !updating && 
        <div>
          <Row>
            <Col md={2}>
              <h4>Department:</h4>
            </Col>
            <Col md>
              <p className="lead text-muted">{department}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <h4>Title:</h4>
            </Col>
            <Col md>
              <p className="lead text-muted">{title}</p>
            </Col>
          </Row>
        </div>
      }

      {showDetail && 
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
      } 
    </Container>
  )
})

export default UserDetails
