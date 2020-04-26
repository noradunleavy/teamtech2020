import axios from 'axios';
import React, {Component} from 'react';

const BASE_URI = 'http://localhost:5000';

const client = axios.create({
 baseURL: BASE_URI,
 json: true 
});

class APIClient extends Component{

 constructor(accessToken) {
   this.accessToken = accessToken;
 }

 getOneCategory() {
   return this.perform('get', '/categories/<processName>')
 }
 getAllSamples() {
  return this.perform('get', '/samples')
}
getOneUser() {
  return this.perform('get', '/samples/<uuid>')
}


 async perform (method, resource, data) {
   return client({
     method,
     url: resource,
     data,
     headers: {
       Authorization: `Bearer ${this.accessToken}`
     }
   }).then(resp => {
     return resp.data ? resp.data : [];
   })
 }
}
export default APIClient;
