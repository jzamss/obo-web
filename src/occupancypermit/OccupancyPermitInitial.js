import React, { useState } from "react";
import {
  Panel,
  Card,
  Title,
  Page,
  Text,
  Subtitle,
  Spacer,
  ActionBar,
  BackLink,
  Button,
  FormPanel,
  Decimal,
  Radio,
  Item
} from 'rsi-react-web-components';

import { EmailVerification } from 'rsi-react-filipizen-components'
import ApplicationTypeSelect from "../components/ApplicationTypeSelect";
import Confirmation from "../components/Confirmation";
import TrackingInfo from "../components/TrackingInfo";


const steps = [
  {name: "email", title: "Email Verification"},
  {name: "apptype", title: "Application Type"},
  {name: "specifybldgpermit", title: "Specify Building Permit"},
  {name: "verifybldgpermit", title: "Verify Building Permit Information"},
  {name: "occupancytype", title: "Select Type of Occupancy Permit"},
  {name: "confirmation", title: "Confirmation"},
  {name: "newapp", title: "New Application "},
]

const OccupancyPermitInitial = ({
  partner,
  service,
  handler,
  history
}) => {

  //TODO: remove temp email
  const [error, setError] = useState();
  const [errorText, setErrorText] = useState({});
  const [contact, setContact] = useState({name: "peter", address: "cebu", email: "peter@gmail.com"});
  const [appType, setAppType] = useState("new");
  const [appno, setAppno] = useState();
  const [bldgPermitNo, setBldgPermitNo] = useState();
  const [bldgPermit, setBldgPermit] = useState({});
  const [occupancyType, setOccupancyType] = useState({});
  const [activeStep, setActiveStep] = useState(1);

  const step = steps[activeStep];

  const moveNextStep = () => {
    setActiveStep(cs => cs + 1);
  }

  const movePrevStep = () => {
    setActiveStep(cs => cs-1);
  }

  const submitAppType = ({appType, appno}) => {
    if (appType === "new") {
      moveNextStep();
    } else {
      setAppno(appno);
    }
  }

  const exitInitial = () => {
    handler(appno);
  }

  const onverifyEmail = (contact) => {
    setContact(contact);
    moveNextStep();
  }

  const loadBuildingPermit = () => {
    if (bldgPermitNo) {
      //TODO: load building permit info
      setBldgPermit({
        permitno: "BP-121-01111",
        applicant: "NAZARENO, ELMO",
        project: {
          title: "Two Bedroom Apartment",
          location: "Talisay, Cebu",
          cost: 1250000.00
        }
      })
      moveNextStep();
    } else {
      setErrorText({bldgPermitNo: "Please specify the Building Permit No."});
    }
  }

  const submitBuildingPermit = () => {
    moveNextStep();
  }

  const submitOccupancyType = () => {
    moveNextStep();
  }

  const saveApp = () => {
    setAppno("137-CXAG-1212");
    moveNextStep();
    //TODO: save app
    // svc.create(newApp, (err, app) => {
    //   if (err) {
    //     setError(err);
    //   } else {
    //     setAppno(app.objid)
    //     moveNextStep();
    //   }
    // });
  }

  return (
    <Page>
      <Card>
        <Title>{service.title}</Title>
        <Panel visibleWhen={step.name === "email"}>
          <EmailVerification showName={true} onVerify={onverifyEmail}  />
        </Panel>

        <Panel visibleWhen={step.name === "apptype"}>
          <ApplicationTypeSelect service={service} onCancel={history.goBack} onSubmit={submitAppType}  />
        </Panel>

        <Panel visibleWhen={step.name === "specifybldgpermit"}>
          <Subtitle>{step.title}</Subtitle>
          <Spacer height={30} />
          <Text
            caption="Building Permit No."
            value={bldgPermitNo} onChange={setBldgPermitNo}
            variant="outlined"
            fullWidth={false}
            required
            error={errorText.bldgPermitNo}
            helperText={errorText.bldgPermitNo}
            size="small"
            />
          <ActionBar>
            <BackLink action={movePrevStep} />
            <Button caption="Next" action={loadBuildingPermit} />
          </ActionBar>
        </Panel>

        <FormPanel visibleWhen={step.name === "verifybldgpermit"} context={bldgPermit} handler={setBldgPermitNo}>
          <Subtitle>Verify Building Permit Information</Subtitle>
          <Spacer height={30} />
          <Text caption="Building Permit No." name="permitno" readOnly={true} />
          <Text caption="Applicant" name="applicant" readOnly={true} />
          <Spacer />
          <Text caption="Project Title" name="project.title" readOnly={true} />
          <Text caption="Location" name="project.location" readOnly={true} />
          <Decimal caption="Project Cost" name="project.cost" readOnly={true} />
          <ActionBar>
            <BackLink action={movePrevStep} />
            <Button caption="Next" action={submitBuildingPermit} />
          </ActionBar>
        </FormPanel>

        <FormPanel visibleWhen={step.name === "occupancytype"} context={occupancyType} handler={setOccupancyType}>
          <Subtitle>{step.title}</Subtitle>
          <Spacer height={30} />
          <Radio name="apptype">
            <Item caption="Full (Completed)" value="full" />
            <Item caption="Partial" value="partial" />
          </Radio>
          <ActionBar>
            <BackLink action={movePrevStep} />
            <Button caption="Next" action={submitOccupancyType} />
          </ActionBar>
        </FormPanel>

        <Panel visibleWhen={step.name === "confirmation"}>
          <Confirmation partner={partner} onCancel={movePrevStep} onContinue={saveApp} />
        </Panel>

        <Panel visibleWhen={step.name === "newapp"} width={400}>
          <TrackingInfo appno={appno} onContinue={exitInitial} />
        </Panel>
      </Card>
    </Page>
  )
}


export default OccupancyPermitInitial;
