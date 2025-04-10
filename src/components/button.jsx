import React from 'react'
import PropTypes from 'prop-types'
import '../styles/button.css'
const Button = ({style,text = 'jean trolo',action, deshabilitar = false}) =>{
    return (
      <button onClick={action} style ={style} disabled={deshabilitar} className='buttonGen'>{text}</button>
  )
}

Button.propTypes = {}

export default Button
