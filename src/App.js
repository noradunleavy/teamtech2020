import React, {Component} from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import DataVisualization from './components/DataVis/datavis.js';
import {Settings} from './components/settings.js';
import {NavigationBar} from './components/NavigationBar.js'
import {useEffect, useState} from "react";
//import {DataVisualizationTwo} from './components/datavis.js';
//import Sunburst from 'react-sunburst-d3-v4';
//import data from './data';
import {api} from '../api/api.py'


  export default class App extends React.Component {

    /* const [CurrentData, setCurrentData] = useState(0)

        useEffect(()=> {
            fetch('/framework').then(res => res.json()).then(data=> {
                setCurrentData(data.request);
            });
        }, []); */   
    render() {
      var data = api.get_all_frameworks().data  

      return (
          <React.Fragment>
            <Router>
              <NavigationBar />
              <Switch>
                <Route exact path="/" component={DataVisualization} />
                <Route path="/settings" component={Settings} />
              </Switch>
            </Router>
             <p>The data is {data}</p> 

          </React.Fragment>
      );
    }
  }


  


