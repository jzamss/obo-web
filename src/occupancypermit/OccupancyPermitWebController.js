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

import ApplicationTypeSelect from "../components/ApplicationTypeSelect";
import OccupancyPermitInitial from "./OccupancyPermitInitial";
import OccupancyType from "./OccupancyType";
import PlannedVsActual from "./PlannedVsActual";
import ActualCost from "./ActualCost";
import OtherCost from "./OtherCost";
import Contractor from "./Contractor";
import Professionals from "./Professionals";
import Confirmation from "./Confirmation";


const svc = Service.lookup("OnlineOccupancyPermitService", "obo");

const pages = [
  { step: 0, component: null },
  { step: 1, name: 'apptype', caption: 'Application Type', component: OccupancyType },
  { step: 2, name: 'plannedactual', caption: 'Planned vs Actual', component: PlannedVsActual },
  { step: 3, name: 'actualcost', caption: 'Actual Cost', component: ActualCost },
  { step: 4, name: 'othercost', caption: 'Other Cost', component: OtherCost },
  { step: 5, name: 'contractor', caption: 'Contractor', component: Contractor },
  // { step: 6, name: 'professionals', caption: 'Professionals', component: Professionals },
  { step: 6, name: 'confirmation', caption: 'Confirmation', component: Confirmation },
]

const OccupancyPermitWebController = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("apptype");
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
    if (!appno) return;
    svc.findCurrentInfo({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {
        if(!app) {
          setError("Application no. does not exist");
        }
        console.log("partner", partner)
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
    setAppno(appno);
    setStep(step + 1);
    setMode("processing");
  }

  const moveNextStep = () => {
    const stepCompleted = step < app.step;
    if (stepCompleted) {
      setStep(ps => ps + 1);
    } else {
      svc.moveNextStep({appid: appno}, (err, updatedApp) => {
        if (err) {
          setError(err);
        } else {
          setStep(updatedApp.step);
          setApp({...app, step: updatedApp.step});
        }
      });
    }
  }

  const movePrevStep = () => {
    setStep(ps => ps - 1);
  }

  const onSubmitOccupancyType = (appType) => {
    setAppType(appType);
    moveNextStep();
  }

  const handleStep = (step) => {
    setStep(step);
  }

  const submitAppType = ({appType, appno}) => {
    if (appType === "new") {
      setMode("init");
    } else {
      svc.findCurrentInfo({appid: appno}, (err, app) => {
        if (err) {
          setError(err);
        } else if (!app) {
          setError("Application no. does not exist.")
        } else {
          onCompleteInitial({appType, appno});
        }
      })
    }
  }

  const onComplete = () => {
    moveNextStep();
    props.history.goBack();
  }

  if (mode === "apptype") {
    return (
      <ApplicationTypeSelect service={props.service} error={error} onCancel={history.goBack} onSubmit={submitAppType}  />
    )
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
    movePrevStep,
    appService: svc,
    stepCompleted: step < app.step,
    onSubmitOccupancyType,
    onComplete
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
