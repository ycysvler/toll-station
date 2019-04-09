import React from 'react';
import ReactDOM from "react-dom";
import {HashRouter as Router,Redirect, Switch, Route} from 'react-router-dom';


import {Main} from './main/main.js';

import './index.less';

ReactDOM.render((
    <Router>
        <Switch>
            <Redirect exact from='/' to='/main'/>
            <Route path="/main" component={Main}/>
        </Switch>
    </Router>
), document.getElementById('root'));


