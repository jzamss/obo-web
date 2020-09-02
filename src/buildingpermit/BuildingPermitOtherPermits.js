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

// import ProfessionalLookup from "../components/ProfessionalLookup";

// const svc = Service.lookup("OboMiscListService", "obo");

const BuildingPermitOtherPermits = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {

  // const [error, setError] = useState();
  // const [loading, setLoading] = useState(false);
  // const [mode, setMode] = useState("initial");
  // const [permitTypes, setPermitTypes] = useState([]);

  // useEffect(() => {
  //   if (svc) {
  //     svc.
  //   }
  // }, [])

  return (
    <h1>Other Permits</h1>
    // <Panel>
    //   <Subtitle>Other Permits</Subtitle>
    //   <Spacer />
    //   <Error msg={error} />

    //   <FormPanel visibleWhen={mode === "project-detail"} context={project} handler={setProject}>
    //   </FormPanel>
    // </Panel>
  )
}

export default BuildingPermitOtherPermits;
