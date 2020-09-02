import React, { useState, useEffect } from 'react';
import {
  Panel,
  Card,
  Title,
  Service,
  Stepper,
  getUrlParameter,
  Page
} from 'rsi-react-web-components';

const svc = Service.lookup("OnlineBuildingPermitService", "obo");

import ApplicationTypeSelect from "../components/ApplicationTypeSelect";
import BuildingPermitInitial from "./BuildingPermitInitial";
import BuildingPermitApplicant from "./BuildingPermitApplicant";
import BuildingPermitLocation from "./BuildingPermitLocation";
import BuildingPermitProject from "./BuildingPermitProject";
import BuildingPermitOccupancy from "./BuildingPermitOccupancy";
import BuildingPermitAccessories from "./BuildingPermitAccessories";
import BuildingPermitOtherPermits from "./BuildingPermitOtherPermits";
import BuildingPermitConfirm from "./BuildingPermitOtherPermits";

const pages = [
  { step: 0, component: null },
  { step: 1, name: 'applicant', caption: 'Applicant', component: BuildingPermitApplicant },
  { step: 2, name: 'location', caption: 'Project Location', component: BuildingPermitLocation },
  { step: 3, name: 'project', caption: 'Project Details', component: BuildingPermitProject },
  { step: 4, name: 'project', caption: 'Occupancy Type', component: BuildingPermitOccupancy },
  { step: 5, name: 'accessories', caption: 'Accessories', component: BuildingPermitAccessories },
  { step: 6, name: 'ancillarylist', caption: 'Other Permits', component: BuildingPermitOtherPermits },
  { step: 7, name: 'confirm', caption: 'Confirm', component: BuildingPermitConfirm },
  { step: 8, name: 'finish', caption: 'Finish', component: BuildingPermitInitial }
]

const BuildingPermitWebController = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mode, setMode] = useState("apptype");
  const [appType, setAppType] = useState("new");
  const [appno, setAppno] = useState(getUrlParameter(props.location, "appid"));
  const [app, setApp] = useState({step: 1});
  const [step, setStep] = useState(1)
  const [errorText, setErrorText] = useState({});

  const { partner, service, history } = props

  const handleError = (err) => {
    setLoading(false);
    setError(err.toString());
  }

  const findCurrentApp = () => {
    svc.findCurrentInfo({appid: appno}, (err, app) => {
      const orgcode = partner.orgcode || partner.id;
      if (err) {
        setError(err);
      } else {
        if(!app) {
          setError("Application no. does not exist");
        } else if( orgcode != app.orgcode ) {
          setError("The application number provided is not for this local government");
        } else {
          setApp(app);
          setStep(app.step);
          setMode("processing");
        }
      }
      setLoading(false);
    });
  }

  useEffect(() => {
    if (appno) {
      setLoading(true);
      findCurrentApp();
    }
  }, [appno]);

  const onCreateNewApp = (appno) => {
    setAppno(appno);
    setMode("processing");
  }

  const processAppType = ({appType, appno}) => {
    if (appType === "new") {
      setMode(appType);
    } else {
      if (appno) {
        setAppno(appno);
      } else {
        setErrorText({...errorText, appno: "Tracking No. is required"})
      }
    }
  }

  const saveHandler = () => {
    console.log("SAVE HANDLER");
  }

  const moveNextStep = () => {
    const stepCompleted = step < app.step && step !== 1;
    if (stepCompleted) {
      setStep(ps => ps + 1);
    } else {
      svc.update({appid: appno, step: step+1}, (err, updatedApp) => {
        if (err) {
          setError(err);
        } else {
          setStep(updatedApp.step);
          setApp({...app, step: updatedApp.step});
        }
      });
    }
  }

  const handleStep = (step) => {
    setStep(step);
  }


  if (mode === "apptype") {
    return (
      <ApplicationTypeSelect service={service} error={error} onCancel={history.goBack} onSubmit={processAppType}  />
    )
  }

  if (mode === "new") {
    return (
      <BuildingPermitInitial {...props} handler={onCreateNewApp} onCancel={()=>{ setMode("apptype")}}/>
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

export default BuildingPermitWebController
