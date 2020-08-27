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
  Date
} from 'rsi-react-web-components';

const Professionals = ({
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {
  return <h1>Professionals</h1>
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

export default Professionals;
