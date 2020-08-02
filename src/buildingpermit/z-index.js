import React, { useState } from 'react'
import { Panel, Checkbox, Text } from 'rsi-react-web-components'

const BuildingPermitWebController = (props) => {
  const [name, setName] = useState("peter")
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(true)
  console.log("disclaimer", agreeDisclaimer)
  return (
    <Panel>
      <Checkbox
        text='Agree'
        value={agreeDisclaimer}
        name='agreeDisclaimer'
        onChange={setAgreeDisclaimer}
      />
      <Text name="name" value={name} onChange={setName}/>
      <h1>{agreeDisclaimer ? "AGREE" : "NO"}</h1>
      <h1>{name}</h1>
    </Panel>
  )
}

const styles = {}

export default BuildingPermitWebController
