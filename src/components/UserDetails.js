import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { Container, Row, Col, InputGroup, FormControl, Modal } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'
import { Button } from './Button'
import Highlight from './Highlight'

import config from '../utils/auth_config.json'
const { apiOrigin = "http://localhost:3001" } = config;

// access map resource path
const resourcePath = '/users/__id';

const attrKey = 'attr';
// const attrKey = 'user_metadata'; //auth0

const UserDetails = withRouter(({user, setUser, history}) => {
  const { getAccessTokenSilently } = useAuth0();
  const { resourceMap } = useAserto();
  const [showDetail, setShowDetail] = useState(false);
  const [editing, setEditing] = useState(false);   // edit name property
  const [updating, setUpdating] = useState(false); // update title and dept
  const [department, setDepartment] = useState((user.department) || '');
  const [title, setTitle] = useState((user.title) || '');
  const [name, setName] = useState((user.name) || '');
  const [email, setEmail] = useState((user.email) || '');
  const [error, setError] = useState();

  const update = async (method) => {
    try {
      const token = await getAccessTokenSilently();

      // prepare the payload
      const body = { ...user, display_name: name, email };
      body[attrKey] = { ...user[attrKey], department, title };
      delete body.name;
      delete body.department;
      delete body.title;

      const response = await fetch(`${apiOrigin}/api/users/${user.id}`, {
        body: JSON.stringify(body),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        method
      });

      if (!response.ok) {
        const responseData = await response.text();
        setError(responseData);
        return;
      }

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
  
        if (!response.ok) {
          const responseData = await response.text();
          setError(responseData);
          return;
        }
  
        await response.json();
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
    setDepartment(user.department);
    setTitle(user.title);
    setName(user.name);
    setEmail(user.email);
  };
  
  const resourceState = resourceMap(resourcePath);
  if (!resourceState.GET.visible) {
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
              <h2>{name}</h2>
              <p className="lead text-muted">{email}</p>
            </div>
          }
        </Col>
        <Col md>
          <Button 
            style={{ marginRight: 30, width: 110 }} 
            displayState={resourceState.PUT} 
            onClick={() => updateUser(editing, setEditing, 'PUT')}
          >
            { editing ? 'Save' : 'Edit' }
          </Button>
          <Button 
            style={{ width: 115 }} 
            displayState={display} 
            onClick={() => setShowDetail(!showDetail)}
          >
            {showDetail ? 'Hide' : 'Show'} Detail
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

      <Row>
        <Col md={2}>
          <Button 
            style={{ width: 110 }} 
            displayState={resourceState.POST} 
            onClick={() => updateUser(updating, setUpdating, 'POST')}
          >
            {updating ? 'Save' : 'Update' }
          </Button>
        </Col>
        <Col md={2}>
          <Button 
            style={{ width: 110 }} 
            displayState={resourceState.DELETE} 
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

      <Modal className="danger" show={error} size="sm" onHide={hide}>
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
