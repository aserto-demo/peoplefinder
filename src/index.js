import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Auth0Provider } from '@auth0/auth0-react'
import { AsertoProvider } from '@aserto/aserto-react'
import config from './utils/auth_config.json'
import history from './utils/history'
import { UsersProvider } from './utils/users'

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
  <Auth0Provider
    domain={config.domain}
    clientId={config.clientId}
    audience={config.audience}
    redirectUri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
  >
    <AsertoProvider>
      <UsersProvider>
        <App />
      </UsersProvider>
    </AsertoProvider>
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
