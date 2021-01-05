import React from 'react'
import { Button as BootstrapButton } from 'react-bootstrap'

const Button = ({displayState, ...props}) => {
  if (displayState && displayState.visible) {
    if (displayState.enabled) {
      return <BootstrapButton { ...props } />
    }
    return <BootstrapButton disabled { ...props } />
  }
  return null;
}

export { Button }
export default Button
