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
        <Combobox items={entityTypes} name='entitytype' caption='Type of Applicant'/>
        <Text caption='Applicant Name' name='name' visibleWhen={applicant.entitytype !== 'INDIVIDUAL'}/>

        <Spacer />
        <Panel visibleWhen={applicant.entitytype === 'INDIVIDUAL'}>
          <Subtitle2>Administrator or contact name of applicant</Subtitle2>
          <Text caption='Last Name' name='lastname' required={true}/>
          <Text caption='First Name' name='firstname' required={true}/>
          <Text caption='Middle Name' name='middlename' required={true}/>
          <Email name='email'/>
          <Mobileno name='mobileno'/>
        </Panel>

        <Spacer />
        <Subtitle2>Applicant Address</Subtitle2>
        <Checkbox caption='Resident' name='resident' onChange={residentHandler}/>
        {applicant.resident ?
          <LocalAddress orgcode={partner.id} name='address' caption='Address' />
          :
          <NonLocalAddress name='address' caption='Address'  />
        }
        <Spacer />
        <Subtitle2>Proof of Identity</Subtitle2>
        <IdEntry name="id" />
      </FormPanel>

      <ActionBar>
        <Button caption='Next' action={saveApplicant}  />
      </ActionBar>
    </Panel>
  )
}

export default BuildingPermitApplicant
