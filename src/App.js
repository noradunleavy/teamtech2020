import React, {Component} from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import DataVisualization from './components/DataVis/datavis.js';
import {Settings} from './components/settings.js';
import {NavigationBar} from './components/NavigationBar.js'
//import {DataVisualizationTwo} from './components/datavis.js';
//import Sunburst from 'react-sunburst-d3-v4';
//import data from './data';


  export default class App extends React.Component {
    render() {
      return (
          <React.Fragment>
            <Router>
              <NavigationBar />
              <Switch>
                <Route exact path="/" component={DataVisualization} />
                <Route path="/settings" component={Settings} />
              </Switch>
            </Router>
          </React.Fragment>
      );
    }
  }


  


