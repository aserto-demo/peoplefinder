import React from 'react'
import { FormControl } from 'react-bootstrap'
import './Filter.css'

const Filter = ({value, setValue, placeholder, ...props}) => 
  <FormControl 
    className='filter'
    placeholder={placeholder}
    value={value} 
    onChange={(e) => setValue(e.target.value)} 
    {...props}
  />

  export default Filter
