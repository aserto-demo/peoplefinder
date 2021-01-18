import React, { useState } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Container, Row, Col, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'
import { Button } from './Button'
import Highlight from './Highlight'
import { useUsers } from '../utils/users'

import config from '../utils/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

// access map resource path
const resourcePath = '/api/users/__id';

const attrKey = 'attr';
// const attrKey = 'user_metadata'; //auth0

const UserDetails = withRouter(({user, setUser, history}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap, identity, setIdentity } = useAserto();
  const { users, loadUsers } = useUsers();
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(false);   // edit name property
  const [updating, setUpdating] = useState(false); // update title and dept
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [department, setDepartment] = useState();
  const [title, setTitle] = useState();
  const [error, setError] = useState();

  // retrieve the manager name
  const managerId = user && user[attrKey] && user[attrKey].manager;
  const manager = managerId && users.find(u => u.id === managerId);
  const managerName = manager && manager.display_name;

  const update = async (method) => {
    try {
      const token = await getAccessTokenSilently();

      // prepare the payload
      const body = { ...user, display_name: name, email };
      body[attrKey] = { ...user[attrKey], department, title };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      if (identity) {
        headers.identity = identity;
      }
      const response = await fetch(`${apiOrigin}/api/users/${user.id}`, {
        body: JSON.stringify(body),
        headers,
        method
      });

      if (!response.ok) {
        const responseData = await response.text();
        setError(responseData);
        return;
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      setUser(null);
      setError(error);
    }
  };  

  // used for both edit and update (PUT and POST)
  const updateUser = (getter, setter, method) => {
    // if in update mode, call the update function
    if (getter) {
      setter(false);
      update(method);
    } else {
      // set update mode
      setter(true);
      setEmail(user.email || '');
      setName(user.display_name || '');
      setDepartment(user[attrKey].department || '');
      setTitle(user[attrKey].title || '');
    }
  };

  const deleteUser = () => {
    const del = async () => {
      try {
        const token = await getAccessTokenSilently();
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        if (identity) {
          headers.identity = identity;
        }
        const response = await fetch(`${apiOrigin}/api/users/${user.user_id}`, {
          headers,
          method: 'DELETE'
        });
  
        if (!response.ok) {
          const responseData = await response.text();
          setError(responseData);
          return;
        }
  
        await response.json();
        loadUsers();
        history.push('/people');        
      } catch (error) {
        setUser(null);
        setError(error);
      }
    };  
    del();
  };

  const hide = () => {
    // reset state
    setError(null);
    setName(user.display_name);
    setEmail(user.email);
    setDepartment(user[attrKey].department);
    setTitle(user[attrKey].title);
  };

  const impersonate = () => {
    setIdentity(user.id);
  }
  
  if (!resourceMap('GET', resourcePath).visible) {
    return (
      <Container className="mb-5">
        <h2>Error</h2>
        <h3>You don't have sufficient permissions to view this user.</h3>
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
          { editing ? 
            <div>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text style={{ minWidth: 60 }}>Name</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={name} onChange={(e) => setName(e.target.value)} />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text style={{ minWidth: 60 }}>Email</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={email} onChange={(e) => setEmail(e.target.value)} />
              </InputGroup>        
            </div> :
            <div>
              <h2>{user.display_name}</h2>
              <p className="lead text-muted">{user.email}</p>
            </div>
          }
        </Col>
        <Col md>
          <Button 
            style={{ marginRight: 30, width: 110 }} 
            displayState={resourceMap('PUT', resourcePath)} 
            onClick={() => updateUser(editing, setEditing, 'PUT')}
          >
            { editing ? 'Save' : 'Edit' }
          </Button>
          <Button 
            style={{ marginRight: 30, width: 115 }} 
            displayState={display} 
            onClick={() => setShowDetail(!showDetail)}
          >
            {showDetail ? 'Hide' : 'Show'} Detail
          </Button>
          <Button 
            style={{ width: 115 }} 
            displayState={resourceMap('IMPERSONATE', resourcePath)} 
            onClick={impersonate}
          >
            Impersonate
          </Button>          
        </Col>
      </Row>

      { updating ? 
        <>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text style={{ minWidth: 120 }}>Department</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={department} onChange={(e) => setDepartment(e.target.value)} />
              </InputGroup>
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text style={{ minWidth: 120 }}>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl value={title} onChange={(e) => setTitle(e.target.value)} />
              </InputGroup>        
            </Col>
          </Row>
          <br />
        </> :
        <div>
          <Row>
            <Col md={2}>
              <h4>Department:</h4>
            </Col>
            <Col md>
              <p className="lead text-muted">{user[attrKey].department}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <h4>Title:</h4>
            </Col>
            <Col md>
              <p className="lead text-muted">{user[attrKey].title}</p>
            </Col>
          </Row>
          <Row>
            <Col md={2}>
              <h4>Manager:</h4>
            </Col>
            <Col md>
              <Link to={`/people/${user[attrKey].manager}`} className="lead text-muted">
                { managerName || user[attrKey].manager }
              </Link>
            </Col>
          </Row>
        </div>
      }

      <br />

      <Row>
        <Col md={2}>
          <Button 
            style={{ width: 110 }} 
            displayState={resourceMap('POST', resourcePath)} 
            onClick={() => updateUser(updating, setUpdating, 'POST')}
          >
            {updating ? 'Save' : 'Update' }
          </Button>
        </Col>
        <Col md={2}>
          <Button 
            style={{ width: 110 }} 
            displayState={resourceMap('DELETE', resourcePath)} 
            onClick={deleteUser}
          >
            Delete
          </Button>
        </Col>
      </Row>

      <hr />

      {showDetail && 
      <Row>
        <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
      </Row>
      } 

      <Modal className="danger" show={error?true:false} size="sm" onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        { error }
        </Modal.Body>
        <Modal.Footer>
          <Button displayState={display} variant="primary" onClick={hide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>      
    </Container>
  )
})

export default UserDetails
