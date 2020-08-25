import React, { useState, useEffect } from 'react';
import {
  Service,
  getUrlParameter,
  Stepper,
  Page,
  Panel,
  Title
} from 'rsi-react-web-components';

import OccupancyPermitInitial from "./OccupancyPermitInitial";
import PlannedActual from "./PlannedActual";
import ActualCost from "./ActualCost";
import OtherCost from "./OtherCost";
import Professionals from "./Professionals";
import Confirm from "./Confirm";

const svc = Service.lookup("OnlineOccupancyPermitService", "obo");

const pages = [
  { step: 0, component: null },
  { step: 1, name: 'plannedactual', caption: 'Planned vs Actual', component: PlannedActual },
  { step: 2, name: 'actualcost', caption: 'Actual Cost', component: ActualCost },
  { step: 3, name: 'othercost', caption: 'Other Cost', component: OtherCost },
  { step: 4, name: 'professionals', caption: 'Professionals', component: Professionals },
  { step: 5, name: 'confirm', caption: 'Confirm', component: Confirm },
]

const OccupancyPermitWebController = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("new");
  const [appType, setAppType] = useState("new");
  const [appno, setAppno] = useState(getUrlParameter(props.location, "appid"));
  const [app, setApp] = useState({});
  const [step, setStep] = useState(0)
  const [errorText, setErrorText] = useState({});

  const { partner, service } = props

  const handleError = (err) => {
    setLoading(false);
    setError(err.toString());
  }

  const findCurrentApp = () => {
    svc.findCurrentInfo({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {
        if(!app) {
          setError("Application no. does not exist");
        }
        if( partner.orgcode != app.orgcode ) {
          setError("The application number provided is not for this local government");
        }
        setApp(app);
        setStep(app.step);
        setMode("processing");
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    findCurrentApp();
  }, [appno]);

  const onCreateNewApp = (appno) => {
    setAppno(appno);
    setStep(step + 1);
    setMode("processing");
  }

  const processAppType = ({appType, appno}) => {
    if (appType === "new") {
      setMode(appType);
    } else {
      setAppno(appno);
    }
  }

  const moveNextStep = () => {
    svc.moveNextStep({appid: appno}, (err, updatedApp) => {
      if (err) {
        setError(err);
      } else {
        setStep(updatedApp.step);
        setApp({...app, step: updatedApp.step});
      }
    });
  }

  const handleStep = (step) => {
    setStep(step);
  }

  if (mode === "init") {
    return <ApplicationTypeSelect service={service} onSubmit={processAppType} />
  }

  if (mode === "new") {
    return (
      <OccupancyPermitInitial {...props} handler={onCreateNewApp} onCancel={()=>{ setMode("init")}}/>
    )
  }

  const page = pages[step];
  const PageComponent = page.component;
  const compProps = {
    partner,
    appno,
    pages,
    moveNextStep,
    appService: svc,
    saveHandler,
    stepCompleted: step < app.step
  };

  return (
    <Page>
      <Panel target="left" style={styles.stepperContainer} >
        <Stepper steps={pages} completedStep={app.step} activeStep={step} handleStep={handleStep} />
      </Panel>
      <Card>
        <Title>{service.title}</Title>
        <PageComponent page={page} {...compProps} />
      </Card>
    </Page>
  )
}

const styles = {
  stepperContainer: {
    paddingTop: 30,
    paddingLeft: 40,
  }
}

export default OccupancyPermitWebController
