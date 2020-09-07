import React, { useState } from "react";
import {
  Subtitle,
  Error,
  Spacer,
} from 'rsi-react-web-components';

import { VerifyEmailCode } from "rsi-react-filipizen-components";

const VerifyEmail = ({
  partner,
  appService,
  onCancel,
  moveNextStep
}) => {

  const [mode, setMode] = useState("init");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [professional, setProfessional] = useState({});
  const [key, setKey] = useState();

  const handleError = (err) => {
    setError(err);
    setLoading(false);
  }

  const verifyInfo = () => {
    setLoading(true);
    appService.verifyInfo(professional, (err, res) => {
      if (err) {
        handleError(err)
      } else {
        setKey(res.key);
        setMode("verify");
      }
    })
  }

  return (
    <React.Fragment>
      <Subtitle>Email Verification</Subtitle>
      <Spacer />
      <Error msg={error} />
      <VerifyEmailCode
        partner={partner}
        hiddenCode={key}
        email={professional.email}
        onCancel={() => setMode("init")}
        onVerified={moveNextStep}
      />
    </React.Fragment>
  );
}

export default VerifyEmail;
