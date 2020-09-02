import React from 'react';
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Layout = (props) => {
  return (
    <div>
      <Nav activeKey='/'>
        <Nav.Item>
          <Nav.Link as={Link} to='/'>Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to='/bets'>Bets</Nav.Link>
        </Nav.Item>
      </Nav>
    { props.children }
    </div>
  )
}

export default Layout