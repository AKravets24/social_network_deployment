import React from 'react';
import { HashRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import { store } from "./redux/redux-store";
import { Provider } from 'react-redux';
import { AppTimeDeterminationContainer } from "./components/App";
import './index.css';

let reRender = (store) => {

  ReactDOM.render(
    <React.StrictMode>
      <HashRouter >
        <Provider store={store} >
          <AppTimeDeterminationContainer />
        </Provider>
      </HashRouter>
    </React.StrictMode>, document.getElementById('root')
  )


};

reRender(store);
