import React, {Component} from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import DataVisualization from './components/DataVis/datavis.js';
import {Settings} from './components/settings.js';
import {NavigationBar} from './components/NavigationBar.js'
<<<<<<< HEAD
import {APIClient} from './components/axioswrapper.js'
import API from './api'

  export default class App extends React.Component {

    render() {
        //var data = getAllSamples();
        // var myApi = new APIClient({url: 'http://localhost:5000/api'})
        // myApi.getAllSamples()
        const myAPI = new API({url: 'http://localhost:5000'})
        console.log("DATA FROM ENDPOINT: ")
        myAPI.endpoints.get.getAllSamples()
            .then(({data}) => console.log(data))

        //myAPI.createEntity({name: '/api'})
        // myAPI.endpoints.getAllSamples()
        //     .then(({data}) => console.log(data))

=======
import {useEffect, useState} from "react";
//import {DataVisualizationTwo} from './components/datavis.js';
//import Sunburst from 'react-sunburst-d3-v4';
//import data from './data';
import {APIClient} from './components/axioswrapper.js'


  export default class App extends React.Component {

    /* const [CurrentData, setCurrentData] = useState(0)

        useEffect(()=> {
            fetch('/framework').then(res => res.json()).then(data=> {
                setCurrentData(data.request);
            });
        }, []); */
        var data = getAllSamples()
    render() {           
      
>>>>>>> e62af9bc5e4664d055560d7490ecddcf5dcda8f5
      return (
          <React.Fragment>
            <Router>
              <NavigationBar />
              <Switch>
                <Route exact path="/" component={DataVisualization} />
                <Route path="/settings" component={Settings} />
              </Switch>
              <p>The data is {data.text} </p>
            </Router>
<<<<<<< HEAD
=======
             

>>>>>>> e62af9bc5e4664d055560d7490ecddcf5dcda8f5
          </React.Fragment>
      );
    }
  }


  


