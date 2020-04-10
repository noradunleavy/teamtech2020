import React, {Component} from 'react';
import { Helmet } from "react-helmet";
import './Components.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route, Router, BrowserRouter, Redirect, UseHistory } from 'react-router-dom';
import Settings from './settings.js';
import { render } from '@testing-library/react';
import Sunburst from 'react-sunburst-d3-v4';
import data from './data';

export const DataVisualization = (props) => (

    <header className="App-header">
        <p>
            Welcome to our data visualization!
        </p>
    </header>
);

//export const DataVisualizationTwo = (props) => (
 
    export default class App extends Component {
        onSelect(event){
          console.log(event);
        }
        render() {
          return (
            <div className="App">
              <Sunburst
                data={data}
                onSelect={this.onSelect}
                scale="linear" // or exponential
                tooltipContent={<div class="sunburstTooltip" style="position:absolute; color:'black'; z-index:10; background: #e2e2e2; padding: 5px; text-align: center;" />} // eslint-disable-line
                tooltip
                tooltipPosition="right"
                keyId="anagraph"
                width="480"
                height="400"
              />
            </div>
          );
        }
      }
      