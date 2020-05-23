import React, {Component} from 'react';
import { Link, Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav'
import DataVisualization from './components/DataVis/datavis.js';
import {Settings} from './components/settings.js';
import {NavigationBar} from './components/NavigationBar.js'
import API from './api'


export default class App extends React.Component {
    render() {
        const myAPI = new API({url: 'http://localhost:5000'})
        myAPI.createEntity({ name: 'get'})
        myAPI.endpoints.get.sunburstData({uuid: '5ebd070c717f9c1ca90906f41543437a30514f86546931a8acf85f38bf78edbe'}, {start_timestamp: 1512468142 }, {end_timestamp: 1512512500 })
            

        // myAPI.endpoints.get.getAllSamples()
        //     .then(({data}) => console.log(data))
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


  


