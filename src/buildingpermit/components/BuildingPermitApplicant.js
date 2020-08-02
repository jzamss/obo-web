import React, { useState, useEffect } from 'react'
import {
  FormPanel,
  Label,
  Text,
  Email,
  Mobileno,
  Spacer,
  Checkbox,
  Combobox,
  Button,
  ActionBar,
  Panel,
  Card
} from 'rsi-react-web-components'
import { LocalAddress } from 'rsi-react-filipizen-components'

const entityTypes = ['INDIVIDUAL', 'CORPORATION', 'GOVERNMENT', 'OTHER']

const BuildingPermitApplicant = (props) => {
  const { appno, partner, appService, moveNextStep } = props

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [editmode, setEditmode] = useState()
  const [profileno, setProfileno] = useState()
  const [entityType, setEntityType] = useState()
  const [resident, setResident] = useState(1)
  const [applicant, setApplicant] = useState({
    entitytype: 'INDIVIDUAL',
    resident: true,
  })
  const [barangays, setBarangays] = useState([
    {name: "POBLACION I", objid: "000-0001", citymunicipality: "LEGAZPI CITY", province: "ALBAY"},
    {name: "POBLACION II", objid: "000-0002", citymunicipality: "LEGAZPI CITY", province: "ALBAY"},
    {name: "POBLACION III", objid: "000-0003", citymunicipality: "LEGAZPI CITY", province: "ALBAY"},
  ]);

  const handleError = (err) => {
    setLoading(false)
    setError(err.toString())
  }

  // useEffect(() => {
  //   setLoading(true);
  //   setError(null);
  //   // appService.getApplicant({appid: appno}).then(applicant => {
  //   //   if(applicant) {
  //   //     setApplicant(applicant);
  //   //     setEntityType(applicant.entitytype);
  //   //     setResident(applicant.resident);
  //   //     setEditmode("create");
  //   //   }
  //   //   else {
  //   //     setEditmode("read");
  //   //   }
  //   //   setLoading(false);
  //   // }).catch(handleError);
  //   const applicant = {entitytype: "INDIVIDUAL", resident: true, localaddress: {bldgno: 'aaa', bldgname: "bbb"}}
  //   setEntityType(applicant.entitytype);
  //   setResident(applicant.resident);
  //   setApplicant(applicant)
  //   setEditmode("create");
  // }, []);

  const findApplicant = () => {
    setLoading(true)
    setError(null)
    const profileSvc = Service.lookup(
      partnerInfo.orgcode + ':RemoteEntityProfileService'
    )
    const p = { idno: profileno }
    profileSvc.findByIdno(p, (s, o) => {
      if (s.status === 'ERROR') {
        setError(s.msg)
      } else {
        setApplicant(o)
      }
      setLoading(false)
      setEditmode('read')
    })
  }

  const saveApplicant = () => {
    setLoading(true)
    setError(null)
    const a = { ...applicant }
    a.appid = appno
    a.entitytype = entityType
    a.resident = resident
    appService.saveApplicant(a, (s, o) => {
      if (s.status === 'ERROR') {
        setError(s.msg)
      } else {
        setEditmode('read')
      }
      setLoading(false)
    })
  }

  return (
    <React.Fragment>
      <p>{JSON.stringify(applicant, null, 2)}</p>
      <FormPanel context={applicant} handler={setApplicant}>
        <Label caption='Profile No'>{applicant.profileno}</Label>
        <Combobox items={entityTypes} name='entitytype' caption='Type of Applicant' />

        <Text caption='Name' name='name' visibleWhen={entityType === 'INDIVIDUAL'} />
        <Label visibleWhen={entityType === 'INDIVIDUAL'}>
          Enter administrator or contact name of applicant
        </Label>
        <Spacer />

        <Text caption='Last Name' name='lastname' required={true} />
        <Text caption='First Name' name='firstname' required={true} />
        <Text caption='Middle Name' name='middlename' required={true} />

        <Email name='email' />
        <Mobileno name='mobileno' />

        <Spacer />
        <Checkbox caption='Resident' name='resident' />
        <LocalAddress name='localaddress' caption='Address' barangays={barangays}  />
        {/*
            <Address caption="Address" visibleWhen={resident == 0 } />
          */}

        <Spacer />
        <Label>Proof of Identity</Label>
        {/*
            <IdEntry caption="ID" name="id" />
          */}
      </FormPanel>

      <ActionBar>
        <Button caption='Save' action={saveApplicant} visibleWhen={editmode != 'read'} />
        <Button caption='Edit' action={() => setEditmode('edit')} visibleWhen={editmode == 'read'} />
        <Button caption='Next' action={moveNextStep} visibleWhen={editmode == 'read'} />
      </ActionBar>
    </React.Fragment>
  )
}

export default BuildingPermitApplicant
