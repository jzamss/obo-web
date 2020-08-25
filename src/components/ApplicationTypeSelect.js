import React, { useState } from "react";
import {
  Button,
  Radio,
  ActionBar,
  BackLink,
  Item,
  Spacer,
  Error,
  Text,
  Subtitle,
} from 'rsi-react-web-components';

const ApplicationTypeSelect = ({
  onCancel,
  onSubmit,
}) => {
  const [error, setError] = useState();
  const [errorText, setErrorText] = useState({});
  const [appType, setAppType]= useState("new");
  const [appno, setAppno] = useState();

  return (
    <React.Fragment>
      <Subtitle>Select an action</Subtitle>
      <Spacer height={30} />
      <Error msg={error} />
      <Radio value={appType} onChange={setAppType} >
        <Item caption="Create New Application" value="new" />
        <Item caption="Resume Pending Application" value="resume" />
      </Radio>
      <Text
        caption="Application Tracking No."
        value={appno} onChange={setAppno}
        visibleWhen={appType === "resume"}
        variant="outlined"
        fullWidth={false}
        required
        style={{marginLeft: 40}}
        error={errorText.appno}
        helperText={errorText.appno}
        size="small"
        />
      <ActionBar>
        <BackLink caption="Cancel" action={onCancel} />
        <Button caption="Next" action={() => onSubmit({appType, appno})} />
      </ActionBar>
    </React.Fragment>
  )
}

export default ApplicationTypeSelect;
