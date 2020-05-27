import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

 export const NavigationBar = () => (
         <Navbar bg="dark" variant="dark">
             <Navbar.Brand href="/">SWE Illinois Team Tech x Cisco</Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav"/>
             <Navbar.Collapse id="basic-navbar-nav">
                 <Nav className="mr-auto">
                     <Nav.Item><Nav.Link href="/">Data Visualization</Nav.Link></Nav.Item>
                     <Nav.Item><Nav.Link href="/settings">Settings</Nav.Link>
                     </Nav.Item>
                 </Nav>
             </Navbar.Collapse>
         </Navbar>
 );
