import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  Spacer,
  ActionBar,
  Button,
  FormPanel,
  Label,
  Text,
  Date,
  Email,
  Checkbox,
  BackLink
} from 'rsi-react-web-components';

const Contractor = ({
  appno,
  appService,
  moveNextStep,
  movePrevStep,
  stepCompleted
}) => {

  const [error, setError] = useState();
  const [app, setApp] = useState({});
  const [isContracted, setIsContracted] = useState(false);

  useEffect(() => {
    appService.getApplication({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {{
        setApp(app);
      }}
    });
  }, [appno])

  const updatePermit = () => {
    appService.update(app, (err, updatedApp) => {
      if (err) {
        setError(err)
      } else {
        moveNextStep();
      }
    })
  }

  return (
    <Panel>
      <Subtitle>Contractor</Subtitle>
      <Label>Please specify contractor if available</Label>
      <Spacer />
      <Checkbox value={isContracted} onChange={setIsContracted} caption="Is undertaken by a Contractor?" />
      <FormPanel visibleWhen={isContracted} context={app} handler={setApp}>
        <Text name="contractor.name" caption="Contractor" required={true} />
        <Text name="contractor.address" caption="Address" required={true} />
        <Text name="contractor.pcabno" caption="PCAB License No." required={true} />
        <Date name="contractor.pcabvalidaty" caption="Validity Date" required={true} />
        <Text name="contractor.tin" caption="TIN" required={true} />
        <Text name="contractor.managingofficer.name" caption="Authorized Managing Officer" required={true} />
        <Email name="contractor.managingofficer.email" required={true} />
      </FormPanel>
      <ActionBar>
        <BackLink action={movePrevStep} />
        <Button caption="Next" action={updatePermit} />
      </ActionBar>
    </Panel>
  )
}

export default Contractor;
