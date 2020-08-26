import React, { useState, useEffect } from 'react';
import {
  Service,
  getUrlParameter,
  Stepper,
  Page,
  Panel,
  Title,
  Card
} from 'rsi-react-web-components';

import OccupancyPermitInitial from "./OccupancyPermitInitial";
import OccupancyType from "./OccupancyType";
import PlannedVsActual from "./PlannedVsActual";
import ActualCost from "./ActualCost";
import OtherCost from "./OtherCost";
import Professionals from "./Professionals";
import Confirm from "./Confirm";

const svc = Service.lookup("OnlineOccupancyPermitService", "obo");

const pages = [
  { step: 0, component: null },
  { step: 1, name: 'apptype', caption: 'Application Type', component: OccupancyType },
  { step: 2, name: 'plannedactual', caption: 'Planned vs Actual', component: PlannedVsActual },
  { step: 3, name: 'actualcost', caption: 'Actual Cost', component: ActualCost },
  { step: 4, name: 'othercost', caption: 'Other Cost', component: OtherCost },
  { step: 5, name: 'professionals', caption: 'Professionals', component: Professionals },
  { step: 6, name: 'confirm', caption: 'Confirm', component: Confirm },
]

const OccupancyPermitWebController = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("init");
  const [appType, setAppType] = useState("full");
  const [appno, setAppno] = useState(getUrlParameter(props.location, "appid"));
  const [app, setApp] = useState({});
  const [step, setStep] = useState(0)

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

  const onCompleteInitial = ({appType, appno}) => {
    if (appType !== "new") {
      setAppno(appno);
      setStep(step + 1);
      setMode("processing");
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

  const onSubmitOccupancyType = (appType) => {
    setAppType(appType);
    moveNextStep();
  }

  const handleStep = (step) => {
    setStep(step);
  }

  if (mode === "init") {
    return (
      <OccupancyPermitInitial {...props} appService={svc} onComplete={onCompleteInitial} onCancel={()=>{ setMode("init")}}/>
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
    stepCompleted: step < app.step,
    onSubmitOccupancyType
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
