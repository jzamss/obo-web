import React, { useState, useEffect } from 'react';
import {
  FormPanel,
  Panel,
  Card,
  Subtitle2,
  Button,
  ActionBar,
  BackLink,
  Title,
  Spacer,
  Service,
  Text,
  Subtitle,
  Page,
  Radio,
  Item
} from 'rsi-react-web-components';

const svc = Service.lookup("OnlineBuildingPermitService", "obo");

import { EmailVerification } from 'rsi-react-filipizen-components'
import Confirmation from "../components/Confirmation";
import TrackingInfo from "../components/TrackingInfo";

const steps = [
  {name: "email", caption: "Email Verification"},
  {name: "select-apptype", caption: "Select Application Type"},
  {name: "project-name", caption: "Project Name"},
  {name: "confirmation", caption: "Confirmation"},
  {name: "newapp", caption: "New Application "},
]

const BuildingPermitInitial = (props) => {
  const [contact, setContact] = useState({})
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false)
  const [appType, setAppType] = useState("new")
  const [projectName, setProjectName] = useState()
  const [appno, setAppno] = useState()
  const [app, setApp] = useState({apptype: "NEW"})
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState();

  const { partner, service, handler, history, onCancel } = props
  const step = steps[activeStep];

  // useEffect(() => {
  //   const hash = steps[activeStep].name;
  //   // props.history.push({hash});
  // }, [activeStep])

  const moveNextStep = () => {
    setActiveStep(cs => cs + 1);
  }

  const movePrevStep = () => {
    setActiveStep(cs => cs-1);
  }

  const saveApp = () => {
    const newApp = {
      ...app,
      orgcode: partner.orgcode || partner.id,
      apptype: appType,
      contact,
      worktypes: [],
    }

    svc.create(newApp, (err, app) => {
      if (err) {
        setError(err);
      } else {
        setAppno(app.objid)
        moveNextStep();
      }
    });
  }

  const exitInitial = () => {
    handler(appno);
  }

  const onVerifyEmail = (contact) => {
    setContact(contact);
    moveNextStep();
  }

  return (
    <Page>
      <Card>
        <Title>{service.title}</Title>
        <EmailVerification visibleWhen={step.name === "email"} showName={true} onCancel={onCancel} onVerify={onVerifyEmail}  />

        <FormPanel visibleWhen={step.name === "select-apptype"} context={app} handler={setApp} >
          <Subtitle>Select Application Type</Subtitle>
          <Panel style={{marginLeft: 20}}>
            <Radio name="apptype">
              <Item caption="New Construction" value="NEW" />
              <Item caption="Renovation" value="RENOVATION" editable={false} />
              <Item caption="Demolition" value="DEMOLITION" editable={false}  />
            </Radio>
          </Panel>
          <ActionBar>
            <BackLink caption="Back" action={onCancel} />
            <Button caption="Next" action={moveNextStep} />
          </ActionBar>
        </FormPanel>

        <FormPanel visibleWhen={step.name === "project-name"} context={app} handler={setApp}>
          <Subtitle>New Building Permit Application</Subtitle>
          <Spacer height={30} />
          <Subtitle2>Project Information</Subtitle2>
          <Text caption="Project Name" name="title"  autoFocus={true} />
          <ActionBar>
            <BackLink action={movePrevStep} />
            <Button caption='Next' action={moveNextStep} />
          </ActionBar>
        </FormPanel>

        <Panel visibleWhen={step.name === "confirmation"}>
          <Confirmation partner={partner} error={error} onCancel={props.goBack} onContinue={saveApp} />
        </Panel>

        <Panel visibleWhen={step.name === "newapp"} width={400}>
          <TrackingInfo appno={appno} onContinue={exitInitial} />
        </Panel>

      </Card>
    </Page>
  )
}

export default BuildingPermitInitial;
