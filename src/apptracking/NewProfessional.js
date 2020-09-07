import React, { useState, useEffect } from "react";
import {
  ActionBar,
  Button,
  Panel,
  Error,
  Subtitle,
  FormPanel,
  BackLink,
  Spacer,
  Text,
} from "rsi-react-web-components";

import { Person, IdEntry, PrcCard, PtrCard } from "rsi-react-filipizen-components";

const NewProfessional = ({
  info = {},
  partner,
  onSubmit
}) => {

  const initialProfessional = {
    entity: {...info, resident: true},
    prc: info.prc,
    resident: true
  }

  const [error, setError] = useState();
  const [professional, setProfessional] = useState(initialProfessional);

  const submitHandler = () => {
    //TODO:
    //validate here
    onSubmit(professional);
  }

  return (
    <Panel>
      <Subtitle>Register New Professional</Subtitle>
      <Spacer />
      <Error msg={error} />

      <Panel>
        <FormPanel context={professional} handler={setProfessional}>
          <p>Please fill in the necessary data below. Text marked with * are required fields. </p>
          <Text caption="Profession" name="entity.profession" readOnly={true} />
          <Person name="entity" person={professional} showAddress={true} orgcode={partner.id} />
          <Spacer />
          <PrcCard name="prc" disableIdNo={true} />
          <PtrCard name="ptr" />
          <IdEntry caption="Primary Identification" name="id" />
          <ActionBar>
            <Button caption="Next" action={submitHandler} />
          </ActionBar>
        </FormPanel>
      </Panel>
    </Panel>
  )
}

export default NewProfessional;
