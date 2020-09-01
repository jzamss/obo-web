import React, { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import {
  Lookup,
  ActionBar,
  Button,
  Panel,
  Error,
  Subtitle,
  Subtitle2,
  MsgBox,
  Table,
  TableColumn,
  DeleteButton,
  EditButton,
  FormPanel,
  Text,
  Label,
  BackLink,
  Spacer,
  Table,
  Column
} from "rsi-react-web-components";

const BuildingPermitProfessionals = ({
  partner,
  appno,
  appService,
  moveNextStep
}) => {

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [professionals, setProfessionals] = useImmer([
    {name: "JUAN", address: "LEGAZPI", prc: "093939", ptr: "992929"},
    {name: "SHARON", address: "LEGAZPI", prc: "093939", ptr: "992929"},
    {name: "ALBERT", address: "LEGAZPI", prc: "093939", ptr: "992929"},
  ]);

  const onSelectProfessional = (professional) => {
    setProfessionals(professionals => {
      professionals.push(professional
    )});
  }

  return (
    <Panel>
      <Subtitle2>Professionals</Subtitle2>
      <Spacer />
      <Error msg={error} />
      <Lookup caption="Search Professionals" onSelect={onSelectProfessional} />
      <Spacer />
      <Table items={professionals}>
        <Column caption="Name" expr="name" />
        <Column caption="Address" expr="address" />
        <Column caption="PRC" expr="prc" />
        <Column caption="PTR" expr="ptr" />
      </Table>
    </Panel>
  )
}

export default BuildingPermitProfessionals;
