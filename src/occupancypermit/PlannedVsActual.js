import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  Spacer,
  ActionBar,
  Button,
  FormPanel,
  Text,
  Label,
  Decimal,
  Date,
  BackLink
} from 'rsi-react-web-components';

const PlannedVsActual = ({
  appno,
  appService,
  moveNextStep,
  movePrevStep,
  stepCompleted
}) => {

  const [error, setError] = useState();
  const [app, setApp] = useState({});

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
    <Panel style={{maxWidth: 600}}>
      <Subtitle>Planned vs. Actual</Subtitle>
      <Label>Please indicate the actual values of construction.</Label>
      <Spacer />
      <FormPanel context={app} handler={setApp} style={styles.container}>
        <Panel style={styles.row}>
          <Label caption="" style={styles.label}  />
          <div style={styles.columnTitle}>Planned</div>
          <div style={styles.columnTitle}>Actual</div>
        </Panel>
        <Panel style={styles.row}>
          <Label caption="Total Floor Area (sqm)" style={styles.label}  />
          <Decimal name="bldgpermit.totalfloorarea" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Decimal name="actualtotalfloorarea" style={styles.item} fullWdith={false} variant="outlined"/>
        </Panel>
        <Panel style={styles.row}>
          <Label caption="Project Total Cost" style={styles.label} />
          <Decimal name="bldgpermit.projectcost" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Decimal name="actualprojectcost" style={styles.item} fullWdith={false} variant="outlined" />
        </Panel>
        <Panel style={styles.row}>
          <Label caption="No. of Units" style={styles.label} />
          <Decimal name="bldgpermit.numunits" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Decimal name="actualnumunits" style={styles.item} fullWdith={false} variant="outlined" />
        </Panel>
        <Panel style={styles.row}>
          <Label caption="No. of Floors" style={styles.label} />
          <Decimal name="bldgpermit.numfloors" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Decimal name="actualnumfloors" style={styles.item} fullWdith={false} variant="outlined" />
        </Panel>
        <Panel style={styles.row}>
          <Label caption="Height (m)" style={styles.label} />
          <Decimal name="bldgpermit.height" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Decimal name="actualheight" style={styles.item} fullWdith={false} variant="outlined" />
        </Panel>
        <Panel style={styles.row}>
          <Label caption="Start Date" style={styles.label} />
          <Date name="bldgpermit.dtproposedconstruction" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Date name="dtactualstarted" style={styles.item} fullWdith={false} variant="outlined" />
        </Panel>
        <Panel style={styles.row}>
          <Label caption="Completion Date" style={styles.label} />
          <Date name="bldgpermit.dtexpectedcompletion" disabled={true} variant="outlined" style={styles.item} fullWdith={false} />
          <Date name="dtactualcompleted" style={styles.item} fullWdith={false} variant="outlined" />
        </Panel>
      </FormPanel>
      <ActionBar>
        <BackLink action={movePrevStep} />
        <Button caption="Next" action={updatePermit} />
      </ActionBar>
    </Panel>
  )
}

const styles = {
  container: {
    display: "flext",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  columnTitle: {
    fontWeight: "bold",
    textAlign: "center",
    width: 300,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    width: "100%",
  },
  item: {
    width: 300,
    marginRight: 10,
  }
}

export default PlannedVsActual;
