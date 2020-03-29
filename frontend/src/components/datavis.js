import React from 'react';
import { Helmet } from "react-helmet";
import './Components.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route, Router, BrowserRouter, Redirect, UseHistory } from 'react-router-dom';
import Settings from './settings.js';


var Link = require('react-router-dom').Link

function routeToSettings() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <Nav>
          <Switch>
            <Route exactly component={Settings} pattern='./settings.js' />
          </Switch>
          </Nav>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default class DataVisualization extends React.Component {
  render() {
  return (
    <div className="DataVisualization">
      <Helmet>
        <title> Productivity </title>
        <meta name="keywords" content="HTML,CSS,JavaScript" />
        <meta
          name="description"
          content="Ideas page using react helmet very easy to implement "
          />
      </Helmet>

      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="">Productivity</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="visualization">Data Visualization</Nav.Link>
            <Nav.Link href='./settings' onClick={routeToSettings()}>Settings</Nav.Link>
          </Nav>
        <Form inline>
      <FormControl type="text" placeholder="Location" className="mr-sm-2" />
      <Button variant="outline-info">Search</Button>
    </Form>
  </Navbar>

      <header className="App-header">
        <p>
          Welcome to our data visualization!
        </p>
      </header>
    </div>
  );
}
}
