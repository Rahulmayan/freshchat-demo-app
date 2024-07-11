import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import reactLogo from '../assets/logo.svg';
import icon from '../assets/icon.svg'

const HelloUser = (props) => {
  const [name, setName] = useState('')

  props.client.iparams.get('contact').then((data) => {
    setName(data.contact.name)
  })

  useEffect(() => {
    firstnameChange()
  },[])

  async function firstnameChange() {
    try{
      const response = await client.request.invoke("getCrmData", props);
      console.log("CRM data response:", response);
    }catch{
      console.error("Attempt", attempt, "Error fetching CRM data:", error);
    }
  }

  return (
    <div>
      <img src={icon} className="App-logo" alt="logo" />
      <img src={reactLogo} className="App-logo" alt="logo" />
      <h3>Hi {name},</h3>
      <p>Welcome to your first react app in Freshdesk</p>
    </div>
  )
}

HelloUser.propTypes = {
  client: PropTypes.object
}
export default HelloUser
