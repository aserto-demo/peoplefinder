# PeopleFinder sample application 

[Aserto](https://aserto.com) is an authorization framework that provides fine-grained authorization for API's and applications. Aserto can be used in the service / API to make allow/deny decisions based on an authorization policy.

This sample demonstrates the integration of the [Aserto Express middleware](https://github.com/aserto-dev/express-jwt-aserto) with an API, and the [Aserto React SDK](https://github.com/auth0/auth0-react) into a React application created using [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html). 

The sample shows how to secure an API (defined in `service/users-api.js`) using the [Aserto Express middleware](https://github.com/aserto-dev/express-jwt-aserto).

The Aserto React SDK helps solve a related problem: what UI elements should be rendered, and in what state, based on the logged-in user and the authorization policy they are subject to.

Aserto defines an <strong>Access Map</strong> that defines three possible states for UI components:
1. Visible and enabled
2. Visible and disabled
3. Not visible

This sample also shows how the Access Map returned by the Aserto custom hook can be used to dynamically render UI components based on those three states.

## Project setup

Use `yarn` to install the project dependencies:

```bash
yarn install 
```

## Configuration

This project is based on Auth0 as an identity provider, and therefore requires an Auth0 account.  You can provision a free Auth0 account at [auth0.com](https://auth0.com).

This project contains both a React single-page application (SPA) as well as a node.js API.  The Default Application that is provisioned with a new Auth0 account can be used as the basis for the SPA.  

### Create an API

You will need to [create an API](https://auth0.com/docs/apis) using the [management dashboard](https://manage.auth0.com/#/apis). This will give you an API identifier that you can use in the `audience` configuration field below.

### Configure credentials

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `src/auth_config.json.example` into a new file in the same folder called `src/auth_config.json`, and replace the values with your own Auth0 application credentials, and optionally the base URLs of your application and API:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}",
  "audience": "{YOUR AUTH0 API_IDENTIFIER}",
  "authorizerServiceUrl": "{URL FOR YOUR ASERTO AUTHORIZER SERVICE (default: https://localhost:8383)}",
  "appOrigin": "{OPTIONAL: THE BASE URL OF YOUR APPLICATION (default: http://localhost:3000)}",
  "apiOrigin": "{OPTIONAL: THE BASE URL OF YOUR API (default: http://localhost:3001)}"
}
```

## Run the sample

### Compile and hot-reload for development

This compiles and serves the React app at localhost:3000, and starts the backend API server on port 3001.

```bash
yarn run dev
```

To run the api-server on its own, run `yarn run api-server`.  To run the single-page application on its own, run `yarn run spa`.

## Deployment

### Compiles and minifies for production

```bash
yarn run build
```

### Docker build

To build and run the Docker image, run `exec.sh`.

### Run your tests

```bash
yarn run test
```

## Author

[Aserto](https://aserto.com) 

## License

This project is licensed under the MIT license. See the [LICENSE](./LICENSE) file for more info.
