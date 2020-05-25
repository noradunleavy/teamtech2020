import React from 'react';
import './Components.css';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import UUID from './UUID.js';
import UserForm from './UUIDForm';

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
                              <Row>
                                  <UUID /> 
                                  <UserForm />
                              </Row>
                              <Row> </Row>
                            </Col>
                        </Container>
                      </Row>
                </Container>
    </header>
);
