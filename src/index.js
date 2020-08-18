import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import GroupsPage from './Components/GroupsPage/GroupsPage'
import ManagersPage from './Components/ManagersPage/ManagersPage'
import MessagesPage from './Components/MessagesPage/MessagesPage'
import SettingsPage from './Components/SettingsPage/SettingsPage'

const TOKEN = 'test_token'
const DURATION_START = 60

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path='/admin/messages' component={ MessagesPage }/>
        <Route exact path='/admin/managers' component={ ManagersPage }/>
        <Route exact path='/admin/groups' component={ GroupsPage }/>
        <Route exact path='/admin/settings' render={ (props) => <SettingsPage token={ TOKEN } durationStart={ DURATION_START } {...props}/> }/>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
