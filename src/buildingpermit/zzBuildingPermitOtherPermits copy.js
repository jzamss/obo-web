import React, { useState, useEffect } from "react";
import {
  ActionBar,
  Button,
  Checkbox,
  Panel,
  Radio,
  Error,
  Subtitle,
  Subtitle2,
  FormPanel,
  Text,
  Spacer,
  BackLink,
  Service,
  Integer,
  Decimal,
  Number,
  Date,
  Card,
  Label
} from "rsi-react-web-components";

import ProfessionalLookup from "../components/ProfessionalLookup";

const svc = Service.lookup("OboMiscListService", "obo");

const BuildingPermitOtherPermits = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("initial");
  const [accessoryOccupancyTypes, setAccessoryOccupancyTypes] = useState([]);
  const [permitTypes, setPermitTypes] = useState([]);

  const loadAccessoryOccupancyTypes = () => {
    if (svc) {
      svc.getAccessoryOccupancyTypes((err, list) => {
        if (err) {
          setError(err);
        } else {
          setAccessoryOccupancyTypes(list);
        }
      })
    }
  }

  useEffect(() => {
    loadAccessoryOccupancyTypes()
  }, [])

  return (
    <Panel>
      <Subtitle>Other Permits</Subtitle>
      <Spacer />
      <Error msg={error} />
      <Panel visibleWhen={mode === "initial"}>
        <Subtitle2>Select accessory to add if applicable</Subtitle2>
        <FormPanel context={permitTypes} handler={setPermitTypes}>
          {occupancyTypes.map(ot =>
            <Checkbox key={ot.objid} caption={ot.title} name={`${ot.objid.toLowerCase()}`} />
          )}
        </FormPanel>
        <ActionBar>
          <BackLink action={() => setMode("initial")} />
          <Button caption="Next" action={submitAccessoryTypes} />
        </ActionBar>
      </Panel>
    </Panel>
  )
}

export default BuildingPermitOtherPermits;
