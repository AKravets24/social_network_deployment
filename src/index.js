import React from 'react';
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import { store } from "./redux/redux-store";
import { Provider } from 'react-redux';
import { AppTimeDeterminationContainer } from "./components/App";
import './index.css';

let reRender = (store) => {
  let publicUrl
  if (process.env.PUBLIC_URL.includes('social_network_deployment')) {
    publicUrl = 'social_network_deployment'
  } else if (process.env.PUBLIC_URL === '') { publicUrl = '' }

  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter basename={publicUrl}>
        <Provider store={store} >
          <AppTimeDeterminationContainer />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>, document.getElementById('root')
  )


};

reRender(store);
