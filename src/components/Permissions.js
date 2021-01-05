import React from 'react'
import { Tab, Row, Col, Nav, Jumbotron } from 'react-bootstrap'
//import PermissionDetail from './PermissionDetail'
import Highlight from './Highlight'
import './Permissions.css'

const Permissions = ({application}) => {
  const permissions = application && Object.keys(application).map(p => application[p]);

  // bail if no operations
  if (!permissions || !permissions.length) {
    return <Jumbotron><h2 className="text-center">None</h2></Jumbotron>
  }

  // get the first key
  const firstKey = permissions[0].name;
  return (
    <Tab.Container defaultActiveKey={firstKey}>
      <Row>
        <Col sm={3}>
          <h5 style={{ marginLeft: 10, fontSize: 18 }}>Name</h5>
        </Col>
        <Col sm={9}>
          <h5 style={{ marginLeft: 10, fontSize: 18 }}>Definition</h5>          
        </Col>
      </Row>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            { permissions && permissions.map(p =>
              <Nav.Item key={p.name}>
                <Nav.Link className="light-pills" eventKey={p.name}><span>{p.name}</span></Nav.Link>
              </Nav.Item>)
            }
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content style={{ top: 0 }}>
            { permissions && permissions.map(p =>
              <Tab.Pane eventKey={p.name} key={p.name}>
                <Highlight>{p.data}</Highlight> 
              </Tab.Pane>)
            }
          </Tab.Content>
        </Col>
      </Row>      
    </Tab.Container>
  )
}

export default Permissions