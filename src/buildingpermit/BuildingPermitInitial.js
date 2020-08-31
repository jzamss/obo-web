import React, { useState, useEffect } from 'react';
import {
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
  Page
} from 'rsi-react-web-components';

const svc = Service.lookup("OnlineBuildingPermitService", "obo");

import { EmailVerification } from 'rsi-react-filipizen-components'
import Confirmation from "../components/Confirmation";
import TrackingInfo from "../components/TrackingInfo";

const steps = [
  {name: "email", caption: "Email Verification"},
  {name: "apptype", caption: "Application Type"},
  {name: "confirmation", caption: "Confirmation"},
  {name: "newapp", caption: "New Application "},
]

const BuildingPermitInitial = (props) => {
  const [contact, setContact] = useState({})
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false)
  const [appType, setAppType] = useState("new")
  const [projectName, setProjectName] = useState()
  const [appno, setAppno] = useState()
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState();

  const { partner, service, handler, history, onCancel } = props
  const step = steps[activeStep];

  useEffect(() => {
    const hash = steps[activeStep].name;
    // props.history.push({hash});
  }, [activeStep])

  const moveNextStep = () => {
    setActiveStep(cs => cs + 1);
  }

  const movePrevStep = () => {
    setActiveStep(cs => cs-1);
  }

  const saveApp = () => {
    const newApp = {
      orgcode: partner.orgcode || partner.id,
      contact,
      apptype: appType,
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

  const onverifyEmail = (contact) => {
    setContact(contact);
    moveNextStep();
  }

  return (
    <Page>
      <Card>
        <Title>{service.title}</Title>
        <EmailVerification showName={true} onCancel={onCancel} onVerify={onverifyEmail} visibleWhen={step.name === "email"} />

        <Panel visibleWhen={step.name === "apptype"}>
          <Subtitle>New Building Permit Application</Subtitle>
          <Spacer height={30} />
          <Subtitle2>Project Information</Subtitle2>
          <Text caption="Project Name" value={projectName} onChange={setProjectName} autoFocus={true} />
          <ActionBar>
            <BackLink action={movePrevStep} />
            <Button caption='Next' action={moveNextStep} />
          </ActionBar>
        </Panel>

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
