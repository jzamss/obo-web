import React, { useState } from 'react'
import {
  Panel,
  Subtitle,
  Label,
  Spacer,
} from 'rsi-react-web-components'

const BuildingPermitConfirm = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {

  const [app, setApp] = useState({});

  const getLocation = () => {
    const location = [];
    if (app.location.lotno) location.push(`Lot: ${app.location.lotno}`);
    if (app.location.blockno) location.push(`Block: ${app.location.blockno}`);
    if (app.location.street) location.push(`Street: ${app.location.street}`);
    if (app.location.barangay) location.push(`Barangay: ${app.location.barangay}`);
    return location.join(" ");
  }

  const contractor = `${app.contractor.lastname}, ${app.contractor.firstname} ${app.contractor.middlename} `


  return (
    <Panel>
      <Subtitle>Confirm Application</Subtitle>
      <Spacer />
      <p>Please confirm the info and preview each permit application before submitting</p>
      <Panel>
        <Label caption="Tracking No." value={app.appno} />
        <Label caption="Project Title" value={app.title} />
        <Label caption="Project Location" value={getLocation()} />
        <Spacer />
        <Label caption="Applicant" value={app.applicant.name} />
        <Label caption="Occupancy Type" value={app.occupancytype.title} />
        <Label caption="Type of Work" value={app.worktypes} />
        <Label caption="Supervisor in Charge of Construction" value={getLocation()} />
      </Panel>
    </Panel>
  )
}

export default BuildingPermitConfirm;
