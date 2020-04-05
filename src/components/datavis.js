import React from 'react';
import { Helmet } from "react-helmet";
import './Components.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import { Switch, Route, Router, BrowserRouter, Redirect, UseHistory } from 'react-router-dom';
import Settings from './settings.js';

export const DataVisualization = (props) => (
    <header className="App-header">
        <p>
            Welcome to our data visualization!
        </p>
    </header>
);
