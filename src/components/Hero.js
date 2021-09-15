import React from 'react'
import config from '../utils/config'
import logo from '../assets/logo.svg'

const Hero = () =>
  <div className="text-center hero my-3">
    <img className="mb-3 app-logo" src={logo} alt="Aserto logo" width="120" />
    <h1 className="mb-4">PeopleFinder</h1>

    <p className="lead">
      Find and manage users.
    </p>

    <p>
      Version: {process.env.REACT_APP_VERSION || 'development'}
      <br />
      Auth0 domain: <a href={`https://${config.domain}`} target='_'>{config.domain}</a>
      <br />
      Policy root: {config.policyRoot}
    </p>
  </div>

export default Hero
