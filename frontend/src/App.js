import React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import DataVisualization from './components/DataVis/datavis.js';
import {NavigationBar} from './components/NavigationBar.js'

export default class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router>
                    <div className="App">
                        <NavigationBar />
                        <Switch>
                            <Route exact path="/" component={DataVisualization} />
                        </Switch>
                    </div>
                </Router>
            </React.Fragment>
        );
    }
  }


  


