import React from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import {DataVisualization} from './components/datavis.js';
import {Settings} from './components/settings.js';
import {NavigationBar} from './components/NavigationBar.js'


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