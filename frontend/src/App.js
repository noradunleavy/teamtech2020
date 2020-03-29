import React from 'react';
import { Link, Switch, Route, BrowserRouter } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import DataVisualization from './components/datavis.js';
import Settings from './components/settings.js';


  export default class App extends React.Component {
    render() {
      return (
        <div className="App">
          <BrowserRouter>
            <div>
              <Nav>
              <Switch>
                <Route component={DataVisualization} pattern='./components/datavis.js' />
                <Route component={Settings} pattern='./components/settings.js' />
              </Switch>
              </Nav>
            </div>
          </BrowserRouter>
        </div>
      );
    }
  }
