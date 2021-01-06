import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Auth0Provider } from '@auth0/auth0-react'
import { AsertoProvider } from '@aserto/aserto-react'
import config from './config/auth_config.json'
import history from './utils/history'

// import bootstrap, font-awesome
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'

// import local styles after default styles so they take precedence
import './theme.css'
import './index.css'

const onRedirectCallback = async (appState) => {
  history.push(
    appState && appState.returnTo !== '/'
      ? appState.returnTo
      : '/people' //window.location.pathname
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      audience={config.audience}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <AsertoProvider>
        <App />
      </AsertoProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
