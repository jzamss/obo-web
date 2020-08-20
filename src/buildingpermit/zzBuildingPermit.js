import React, { useState, useEffect } from 'react';
import {
  Panel,
  Subtitle2,
  Button,
  Radio,
  Checkbox,
  ActionBar,
  BackLink,
  Title,
  Label,
  Item,
  Spacer,
  Content,
  Service,
  Error,
  Loading,
  Text,
  Stepper,
  Subtitle,
  getUrlParameter,
  Page
} from 'rsi-react-web-components';

const svc = Service.lookup("OnlineBuildingPermitService", "obo");

import { EmailVerification } from 'rsi-react-filipizen-components'
import BuildingPermitApplicant from "./BuildingPermitApplicant";

const steps = [
  {name: "email", title: "Email Verification"},
  {name: "apptype", title: "Application Type"},
  {name: "confirmation", title: "Confirmation"},
  {name: "newapp", title: "New Application "},
]

const BuildingPermitInitial = (props) => {
  const [contact, setContact] = useState({name: "peter", address: "cebu", email: "peter@gmail.com"})
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false)
  const [appType, setAppType] = useState("new")
  const [appno, setAppno] = useState()
  const [activeStep, setActiveStep] = useState(1);
  const [error, setError] = useState();

  const { partner, service, handler } = props
  const step = steps[activeStep];

  const moveNextStep = () => {
    setActiveStep(cs => cs+1);
  }

  const movePrevStep = () => {
    setActiveStep(cs => cs-1);
  }

  const saveApp = () => {
    const newApp = {
      orgcode: partner.id,
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
      <Title>{service.title}</Title>
      <Panel target="left" style={styles.stepperContainer} >
        <Stepper steps={steps} activeStep={activeStep} />
      </Panel>
      <EmailVerification showName={true} onVerify={onverifyEmail} visibleWhen={step.name === "email"} />

      <Panel visibleWhen={step.name === "apptype"}>
        <Subtitle>New Building Permit Application</Subtitle>
        <Spacer height={30} />
        <Subtitle2>Select type of application</Subtitle2>
        <Radio value={appType} onChange={setAppType} >
          <Item caption="New Construction" value="new" />
          <Item caption="Renovation, Alteration, Repair, Addition, Extension" value="modification" />
        </Radio>
        <ActionBar>
          <BackLink action={movePrevStep} />
          <Button caption='Next' action={moveNextStep} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={step.name === "confirmation"}>
        <Subtitle>New Building Permit Application</Subtitle>
        <Spacer height={30} />
        <Subtitle2>Please read thoroughly before proceeding</Subtitle2>
        <p style={{opacity: 0.8}}>
        This online service will require personal information from the applicant,
        lot owner(s) and professionals involved in this transaction. In compliance
        with the Data Privacy Act, we are securing your consent that you have been
        authorized by the aforementioned parties to act on their behalf. The data
        collected will be stored, processed and used for effectively carrying out
        legitimate transactions with the local government of {partner.title}. If you
        do not agree to these terms, you can cancel out by click on the Cancel button.
        If you agree to these terms, tick on the checkbox and click Continue.
        </p>
        <Checkbox caption='Yes, I have read and agree to the terms and conditions'
          value={agreeDisclaimer}
          name='agreeDisclaimer'
          onChange={setAgreeDisclaimer}
        />
        <ActionBar>
          <BackLink caption="Cancel" action={props.goBack} />
          <Button caption='Continue' action={saveApp} disableWhen={!agreeDisclaimer} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={step.name === "newapp"}>
        <Subtitle>New Building Permit Application</Subtitle>
        <Spacer height={30} />
        <Subtitle2>Application created</Subtitle2>
        <p>
        Please take note of the tracking number for this application.
        This will be your tracking reference for completing
        and follow up for this application.
        </p>
        <Subtitle2>{appno}</Subtitle2>
        <ActionBar>
          <Button caption='Continue' action={exitInitial} />
        </ActionBar>
      </Panel>
    </Page>
  )
}

const pages = [
  { step: 0, component: null },
  { step: 1, name: 'applicant', caption: 'Applicant', component: BuildingPermitApplicant },
  // { step: 2, name: 'location', caption: 'Location', component: BuildingPermitApplicant },
  // { step: 3, name: 'rpu', caption: 'Real Property', component: 'BuildingPermitRPT' },
  // { step: 4, name: 'professional', caption: 'Professionals', component: 'BuildingPermitProfessionals' },
  // { step: 5, name: 'project', caption: 'Project Details', component: 'BuildingPermitProject' },
  // { step: 6, name: 'accessories', caption: 'Accessories', component: 'BuildingPermitAccessories' },
  // { step: 7, name: 'ancillarylist', caption: 'Other Permits', component: 'BuildingPermitOtherPermits' },
  // { step: 8, name: 'confirm', caption: 'Confirm', component: 'BuildingPermitConfirm' },
  // { step: 9, name: 'finish', caption: 'Finish', component: 'BuildingPermitInitial' }
]

const BuildingPermitWebController = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("init");
  const [appType, setAppType] = useState("new");
  const [appno, setAppno] = useState(getUrlParameter(props.location, "appid"));
  const [app, setApp] = useState({});
  const [step, setStep] = useState(0)

  const { partner, service } = props

  const handleError = (err) => {
    setLoading(false);
    setError(err.toString());
  }

  const findCurrentApp = async () => {
    const app = await svc.findCurrentInfo({appid: appno});
    if(!app) {
      throw "Application no. does not exist";
    }
    if( partner.orgcode != app.orgcode ) {
      throw "The application number provided is not for this local government";
    }
    return app;
  }

  useEffect(() => {
    if (appno) {
      setLoading(true);
      findCurrentApp().then(app => {
        setAppType(app);
        setAppno(app.objid);
        setStep(app.step);
        setMode("processing");
      }).catch(handleError);
    }
  }, []);


  const onCreateNewApp = (appno) => {
    setAppno(appno);
    setStep(step + 1);
    setMode("processing");
  }

  const saveHandler = () => {
    console.log("SAVE HANDLER");
      // setUrlParameter({appid: appno});
  }

  const moveNextStep = async (subStep) => {
    const c = await svc.moveNextStep({appid: appno});
    setStep(c.step);
  }

  const page = pages[step];
  const PageComponent = page.component;
  const compProps = { appno, moveNextStep, appService: svc, saveHandler };

  if (mode === "new") {
    return (
      <BuildingPermitInitial {...props} handler={onCreateNewApp} goBack={()=>{ setMode("init")}}/>
    )
  }

  return (
    <Page>
      <Title>{service.title}</Title>
      <Panel visibleWhen={mode === "init"}>
        <Subtitle>Select an action</Subtitle>
        <Spacer height={30} />
        {error && <Error msg={error} /> }
        <Radio value={appType} onChange={setAppType} >
          <Item caption="Create New Application" value="new" />
          <Item caption="Resume Pending Application" value="resume" />
        </Radio>
        <ActionBar>
          <BackLink caption="Cancel" action={props.history.goBack} />
          <Button caption="Next" action={() => setMode(appType)} />
        </ActionBar>

      </Panel>

      {step > 0 &&
        <Content visibleWhen={appno != null}>
            <PageComponent page={page} {...compProps} />
        </Content>
      }
    </Page>
  )
}

const styles = {
  stepperContainer: {
    paddingTop: 30,
    paddingLeft: 40,
  }
}


export default BuildingPermitWebController


// TODO: APP 000-UY13L19W
