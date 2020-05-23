import React from 'react';
 import { Nav, Navbar, Form, FormControl, Button } from 'react-bootstrap';
 export const NavigationBar = () => (
         <Navbar bg="dark" variant="dark">
             <Navbar.Brand href="/">Productivity</Navbar.Brand>
             <Navbar.Toggle aria-controls="basic-navbar-nav"/>
             <Navbar.Collapse id="basic-navbar-nav">
                 <Nav className="mr-auto">
                     <Nav.Item><Nav.Link href="/">Data Visualization</Nav.Link></Nav.Item>
                     <Nav.Item><Nav.Link href="/settings">Settings</Nav.Link>
                     </Nav.Item>
                 </Nav>
                 <Form inline>
                     <FormControl type="text" placeholder="Application" className="mr-sm-2" />
                     <Button variant="outline-info">Search</Button>
                 </Form>
             </Navbar.Collapse>
         </Navbar>
 );
