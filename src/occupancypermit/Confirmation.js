import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  Spacer,
  ActionBar,
  Button,
  Label,
  BackLink,
  PreviewButton
} from 'rsi-react-web-components';

const Confirmation = ({
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

  const confirmPermit = () => {
    appService.update(app, (err, updatedApp) => {
      if (err) {
        setError(err)
      } else {
        moveNextStep();
      }
    })
  }

  const viewOccupancyPermit = () => {

  }

  const viewCompletionCertificate = () => {

  }

  return (
    <Panel>
      <Subtitle>Confirm Entry</Subtitle>
      <p>
        Before sending please check first the generated
        application info. If everything is in order, you can
        click Submit button to complete the transaction.
      </p>
      <Spacer />
      <Panel style={styles.container}>
        <Panel  style={styles.row}>
          <Label style={styles.label}>Application for Occupancy Permit</Label>
          <Button caption="View" action={viewOccupancyPermit} variant="outlined" />
        </Panel>
        <Panel style={styles.row}>
          <Label style={styles.label}>Certificate of Completion</Label>
          <Button caption="View" action={viewCompletionCertificate} variant="outlined" />
        </Panel>
      </Panel>
      <ActionBar>
        <BackLink action={movePrevStep} />
        <Button caption="Submit" action={confirmPermit} />
      </ActionBar>
    </Panel>
  )
}

const styles = {
  container: {
    maxWidth: 350,
    marginLeft: 50,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontWeight: "bold",
  }
}

export default Confirmation;
