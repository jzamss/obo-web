import React, { useState, useEffect } from 'react'
import {
  Error,
  FormPanel,
  Text,
  Email,
  Mobileno,
  Spacer,
  Checkbox,
  Combobox,
  Button,
  ActionBar,
  Panel,
  Subtitle,
  Subtitle2
} from 'rsi-react-web-components'

import { LocalAddress, NonLocalAddress, IdEntry } from 'rsi-react-filipizen-components';

const entityTypes = ['INDIVIDUAL', 'CORPORATION', 'GOVERNMENT', 'OTHER']

const BuildingPermitApplicant = (props) => {
  const { appno, partner, appService, moveNextStep, stepCompleted } = props

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [editmode, setEditmode] = useState("read");
  const [applicant, setApplicant] = useState({
    appno,
    appid: appno,
    entitytype: 'INDIVIDUAL',
    resident: false,
  })

  const handleError = (err) => {
    setLoading(false)
    setError(err.toString())
  }

  useEffect(() => {
    setLoading(true);
    setError(null);
    appService.getApplicant({appid: appno}, (err, applicant) => {
      if (err) {
        setError(err)
      } else if(!applicant) {
        setEditmode("create");
      }
      else {
        setApplicant(applicant);
        setEditmode("read");
      };
      setLoading(false);
    })
  }, []);

  const saveApplicant = () => {
    setError(null);
    appService.saveApplicant(applicant, (err, app) => {
      if (err) {
        setError(err)
      } else {
        moveNextStep();
      }
      setLoading(false)
    })
  }

  const residentHandler = () => {
    const updatedApplicant = {...applicant, resident: !applicant.resident, address: {}};
    setApplicant(updatedApplicant);
  }

  return (
    <Panel>
      <Subtitle>Building Applicant Details</Subtitle>
      <Spacer />
      <Error msg={error} />
      <FormPanel context={applicant} handler={setApplicant} >
        <Combobox items={entityTypes} name='entitytype' caption='Type of Applicant' editable={editmode !== "read"}/>
        <Text caption='Applicant Name' name='name' visibleWhen={applicant.entitytype !== 'INDIVIDUAL'} editable={editmode !== "read"}/>

        <Spacer />
        <Panel visibleWhen={applicant.entitytype === 'INDIVIDUAL'}>
          <Subtitle2>Administrator or contact name of applicant</Subtitle2>
          <Text caption='Last Name' name='lastname' required={true} editable={editmode !== "read"}/>
          <Text caption='First Name' name='firstname' required={true} editable={editmode !== "read"}/>
          <Text caption='Middle Name' name='middlename' required={true} editable={editmode !== "read"}/>
          <Email name='email' editable={editmode !== "read"}/>
          <Mobileno name='mobileno' editable={editmode !== "read"}/>
        </Panel>

        <Spacer />
        <Subtitle2>Applicant Address</Subtitle2>
        <Checkbox caption='Resident' name='resident' onChange={residentHandler} editable={editmode !== "read"}/>
        {applicant.resident ?
          <LocalAddress orgcode={partner.id} name='address' caption='Address' editable={editmode !== "read"} />
          :
          <NonLocalAddress name='address' caption='Address' editable={editmode !== "read"}  />
        }
        <Spacer />
        <Subtitle2>Proof of Identity</Subtitle2>
        <IdEntry name="id" editable={editmode !== "read"} />
      </FormPanel>

      <ActionBar visibleWhen={!stepCompleted}>
        <Button caption='Edit' action={() => setEditmode('edit')} visibleWhen={editmode == 'read'} />
        <Button caption='Save' action={saveApplicant} visibleWhen={editmode !== 'read'} />
        <Button caption='Next' action={moveNextStep} visibleWhen={editmode === 'read'} />
      </ActionBar>
    </Panel>
  )
}

export default BuildingPermitApplicant
