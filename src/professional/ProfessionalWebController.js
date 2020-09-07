import React, { useState, useEffect } from 'react';
import {
  Service,
  Stepper,
  Page,
  Panel,
  Title,
  Card,
  Error
} from 'rsi-react-web-components';

import { Disclaimer } from "rsi-react-filipizen-components";

import Initial from "./Initial";
import NewProfessional from "./NewProfessional";

const svc = Service.lookup("OboProfessionalService", "obo");

const steps = [
  { step: 1, name: "initial", caption: "Initial" },
  { step: 2, name: "newprofessional", caption: "New Professional" },
  { step: 3, name: "disclaimer", caption: "Disclaimer" },
]

const ProfessionalWebController = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState({});
  const [mode, setMode] = useState("new");
  const [step, setStep] = useState(0);
  const [key, setKey] = useState();
  const [info, setInfo] = useState();
  const [professional, setProfessional] = useState();

  const { partner, service, history } = props;

  console.log("PARTNER", partner);

  const handleError = (err) => {
    setLoading(false);
    setError(err.toString());
  }

  const moveNextStep = () => {
    setStep(cs => cs+1);
  }

  const movePrevStep = () => {
    setStep(cs => cs-1);
  }

  const activeStep = steps[step];

  const verifiedInfoHandler = (info) => {
    setInfo(info);
    moveNextStep();
  }


  const getReconciledProfessional = () => {
    const address = {...professional.entity.address};
    if (professional.entity.resident) {
      address.citymunicipality = partner.citymunicipality || "MUNICIPALITY";
      address.province = partner.province || "PROVINCE";
    }
    const entity = {...professional.entity, address};
    const prof = {...entity, ...professional};
    delete prof.entity;
    return prof;
  }

  const submitProfessional = (professional) => {
    setProfessional(professional);
    moveNextStep();
  }

  const saveProfessional = () => {
    setLoading(true);
    const reconciledProf = getReconciledProfessional();
    svc.create(reconciledProf, (err, prof) => {
      if (err) {
        handleError(err);
      } else {
        history.goBack();
      }
    })
  }



  return (
    <Page>
      <Panel target="left" style={styles.stepperContainer} >
        <Stepper steps={steps} activeStep={step} />
      </Panel>
      <Card>
        <Title>{service.title}</Title>
        <Error msg={error} />
        <Panel visibleWhen={activeStep.name === "initial"}>
          <Initial partner={partner} onCancel={history.goBack} onVerified={verifiedInfoHandler} />
        </Panel>
        <Panel visibleWhen={activeStep.name === "newprofessional"}>
          <NewProfessional partner={partner} info={info} onSubmit={submitProfessional} />
        </Panel>
        <Panel visibleWhen={activeStep.name === "disclaimer"}>
          <Disclaimer partner={partner} onCancel={movePrevStep} onSubmit={saveProfessional} />
        </Panel>
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

export default ProfessionalWebController
