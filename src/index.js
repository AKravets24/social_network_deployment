import React from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import { store } from "./redux/redux-store";
import { Provider } from 'react-redux';
import { AppTimeDeterminationContainer } from "./components/App";
import './index.css';


let reRender = (store) => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Provider store={store} >
          <AppTimeDeterminationContainer />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>, document.getElementById('root')
  )
};

reRender(store);
