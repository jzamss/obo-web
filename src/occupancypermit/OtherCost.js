import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  Spacer,
  ActionBar,
  Button,
  FormPanel,
  Label,
  Decimal,
  Error,
  BackLink
} from 'rsi-react-web-components';

const OtherCost = ({
  appno,
  appService,
  moveNextStep,
  movePrevStep,
  stepCompleted
}) => {

  const costs = [
    { caption: "Fire Alarm Cost", field: "firealarmcost", value: 0.0, },
    { caption: "Sprinkler Cost", field: "sprinklercost", value: 0.0, },
    { caption: "LPG Piping Cost", field: "lpgpipingcost", value: 0.0, },
    { caption: "Fire Suppression System Cost", field: "firesuppcost", value: 0.0, },
  ]

  const [error, setError] = useState();
  const [app, setApp] = useState({});
  const [cost, setCost] = useState({items: costs})

  useEffect(() => {
    appService.getApplication({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {{
        setApp(app);
        const updatedCost = {...cost};
        updatedCost.items.forEach(item => {
          item.value = app[item.field];
        });
        setCost(updatedCost);
      }}
    });
  }, [appno])

  const updatePermit = () => {
    const updatedApp = { ...app };
    cost.items.forEach(item => {
      updatedApp[item.field] = item.value;
    });
    appService.update(updatedApp, (err, app) => {
      if (err) {
        setError(err)
      } else {
        moveNextStep();
      }
    })
  }

  return (
    <Panel style={{maxWidth: 600}}>
      <Subtitle>Other Costs</Subtitle>
      <Label>Please indicate the other cost of construction.</Label>
      <Spacer />
      <Error msg={error} />
      <FormPanel context={cost} handler={setCost} style={styles.container}>
        {cost.items.map((cost, idx) => (
          <Panel key={cost.field} style={styles.row}>
            <Label caption={cost.caption} style={styles.label}  />
            <Decimal name={`items[${idx}].value`} variant="outlined" style={styles.item} fullWdith={false} />
          </Panel>
        ))}
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

export default OtherCost;
