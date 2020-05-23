import React from 'react';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

 export const NewForm = () => (
   <Form.Group>
     <Form.Row>
       <Form.Label column="lg" lg={2.5}>
         Username
       </Form.Label>
       <Col>
         <Form.Control size="lg" type="text" placeholder="Username" />
       </Col>
     </Form.Row>
     <br />
     <Form.Row>
       <Form.Label column="lg" lg={2.5}>
         Password
       </Form.Label>
       <Col>
         <Form.Control size="lg" type="text" placeholder="Password" />
       </Col>
     </Form.Row>
     <br />
     <Form.Row>
       <Form.Label column="lg" lg={2.5}>
         First name
       </Form.Label>
       <Col>
         <Form.Control size="lg" type="text" placeholder="First name" />
       </Col>
     </Form.Row>
     <br />
   </Form.Group>
 );
