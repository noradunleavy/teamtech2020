import React from 'react';
import { Helmet } from "react-helmet";
import './Components.css';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import {NewForm} from './Form.js'
import {SketchExample} from './ColorPicker.js'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'



export const Settings = () => (
    <header className="App-header">
      <br />
                <Container >
                    <Row>
                        <Container>
                            <Col >
                            <h> Login Settings </h>
                            </Col >
                            <br />
                            <Col >
                              <Row><NewForm /></Row>
                              <Row> </Row>
                            </Col>
                        </Container>
                      </Row>
                </Container>
    </header>
);
