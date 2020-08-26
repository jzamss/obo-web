import React, { useState } from "react";
import {
  Subtitle2,
  Button,
  Checkbox,
  ActionBar,
  BackLink,
  Spacer,
  Subtitle,
  Error
} from 'rsi-react-web-components';


const Confirmation = ({
  partner,
  title="New Permit Application",
  onCancel,
  onContinue,
  error
}) => {
  const [agreeDisclaimer, setAgreeDisclaimer] = useState(false);

  return (
    <React.Fragment>
      <Subtitle>{title}</Subtitle>
      <Spacer height={30} />
      <Error msg={error} />
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
        <BackLink caption="Cancel" action={onCancel} />
        <Button caption='Continue' action={onContinue} disableWhen={!agreeDisclaimer} />
      </ActionBar>
  </React.Fragment>
  )
}

export default Confirmation;
