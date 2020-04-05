import React from 'react';
import { Helmet } from "react-helmet";
import './Components.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route, BrowserRouter } from 'react-router-dom';

export const Settings = () => (
    <header className="App-header">
        <p>
            Settings Page
        </p>
    </header>
);

/*import styled from 'styled-components';
const GridWrapper = styled.div`

  display: grid;
  grid-gap: 10px;
  margin-top: 1em;
  margin-left: 6em;
  margin-right: 6em;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(25px, auto);
`; */

/* var Link = require('react-router-dom').Link

export default class Settings extends React.Component {
  render() {
  return (
    <div className="Settings">
      <Helmet>
        <title> Settings </title>
        <meta name="keywords" content="HTML,CSS,JavaScript" />
        <meta
          name="description"
          content="Ideas page using react helmet very easy to implement "
          />
      </Helmet>

      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Productivity</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/home">Data Visualization</Nav.Link>
            <Nav.Link href="settings">Settings</Nav.Link>
          </Nav>
        <Form inline>
      <FormControl type="text" placeholder="Location" className="mr-sm-2" />
      <Button variant="outline-info">Search</Button>
    </Form>
  </Navbar>

      <header className="App-header">
        <p>
          Settings
        </p>
      </header>
    </div>
  );
  }
} */


