import React, { useState, useEffect } from 'react'
import {
  FormPanel,
  Combobox,
  Text,
  Button,
  ActionBar,
  Panel,
  Error,
  Subtitle,
  Spacer
} from 'rsi-react-web-components'

import { BarangayList } from "rsi-react-filipizen-components";

const BuildingPermitLocation = (props) => {
  const { partner, appno, appService, moveNextStep, stepCompleted } = props
  const [location, setLocation] = useState({ appno, appid: appno })
  const [error, setError] = useState()

  useEffect(() => {
    appService.getLocation({ appid: appno }, (err, location) => {
      if (err) {
        setError(err)
      } else {
        location.appid = appno;
        setLocation(location)
      }
    })
  }, [])

  const updateLocation = () => {
    setError(null)
    appService.saveLocation(location, (err, app) => {
      if (err) {
        setError(err)
      } else {
        moveNextStep()
      }
    })
  }

  return (
    <Panel>
      <Subtitle>Specify Project Location</Subtitle>
      <Spacer />
      <Error msg={error} />
      <FormPanel context={location} handler={setLocation}>
        <Panel row>
          <Text name='lotno' caption='Lot No.' />
          <Text name='blockno' caption='Block No.' />
        </Panel>
        <Panel row>
          <Text name='unitno' caption='Unit No.' />
          <Text name='bldgno' caption='Building No.' />
        </Panel>
        <Text name='bldgname' caption='Building Name' />
        <Text name='street' caption='Street' />
        <Text name='subdivision' caption='Subdivision' />
        <BarangayList orgcode={partner.id} name='barangay' caption='Barangay' />
      </FormPanel>
      <ActionBar visibleWhen={!stepCompleted}>
        <Button caption='Next' action={updateLocation} />
      </ActionBar>
    </Panel>
  )
}

export default BuildingPermitLocation
