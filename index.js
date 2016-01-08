// import 'todomvc-app-css/index.css';
import React from 'react';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

import * as dataActions from './actions/DataActions'
import * as userActions from './actions/UserActions'

store.dispatch(dataActions.load())
store.dispatch(userActions.restore())

render(
  <Root store={store} />,
  document.getElementById('root')
);
