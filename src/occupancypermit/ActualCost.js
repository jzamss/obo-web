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

const ActualCost = ({
  appno,
  appService,
  moveNextStep,
  movePrevStep,
  stepCompleted
}) => {

  const costs = [
    { caption: "Total Materials Cost", field: "totalmaterialcost", value: 0.0, },
    { caption: "Total Direct Cost", field: "totaldirectlaborcost", value: 0.0, },
    { caption: "Total Equipment Cost", field: "totalequipmentcost", value: 0.0, },
    { caption: "Total Other Cost", field: "totalothercost", value: 0.0, },
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
      <Subtitle>Actual Costs</Subtitle>
      <Label>Please indicate the actual cost of construction.</Label>
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

export default ActualCost;
