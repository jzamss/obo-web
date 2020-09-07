import React, { useState, useEffect } from "react";
import {
  Subtitle,
  Error,
  FormPanel,
  Spacer,
  Text,
  Email,
  Mobileno,
  ActionBar,
  Button,
  BackLink,
  Panel,
  Service
} from 'rsi-react-web-components';

import { VerifyEmailCode } from "rsi-react-filipizen-components";
import ProfessionList from "../components/ProfessionList";

const svc = Service.lookup("OboProfessionalService", "obo");


const Initial = ({
  partner,
  onCancel,
  onVerified
}) => {

  const [mode, setMode] = useState("init");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [key, setKey] = useState();
  const [professionList, setProfessionList] = useState([]);

  useEffect(() => {
    svc.getProfessionList((err, list) => {
      setProfessionList(list);
    })
  }, []);

  const handleError = (err) => {
    setError(err);
    setLoading(false);
  }

  const verifyInfo = () => {
    setLoading(true);
    svc.verifyInfo(info, (err, res) => {
      if (err) {
        handleError(err)
      } else {
        setError(null);
        setKey(res.key);
        setMode("verify");
      }
    })
  }

  return (
    <React.Fragment>
      <FormPanel visibleWhen={mode === "init"} context={info} handler={setInfo}>
        <Subtitle>Please specify initial information</Subtitle>
        <Spacer />
        <Error msg={error} />
        <Text name="prc.idno" caption="PRC No." required />
        <ProfessionList caption="Profession (Copy profession in the PRC card" name="profession" expr={item => item} professions={professionList} required={true} />
        <Email name="email" required />
        <Mobileno name="mobileno" required />
        <ActionBar>
          <BackLink action={onCancel} />
          <Button caption="Next" action={verifyInfo} />
        </ActionBar>
      </FormPanel>

      <Panel visibleWhen={mode === "verify"}>
        <Subtitle>Email Verification</Subtitle>
        <Spacer />
        <Error msg={error} />
        <p>Please enter the key code sent to your email at {info.email}.</p>
        <VerifyEmailCode
          partner={partner}
          hiddenCode={key}
          email={info.email}
          onCancel={() => setMode("init")}
          onVerified={() => onVerified(info)}
          width={200}
        />
      </Panel>
    </React.Fragment>
  );
}

export default Initial;
