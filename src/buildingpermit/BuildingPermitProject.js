import React, { useState, useEffect } from "react";
import {
  ActionBar,
  Button,
  Checkbox,
  Panel,
  Radio,
  Item,
  Error,
  Subtitle,
  Subtitle2,
  FormPanel,
  Text,
  Spacer,
  Label,
  BackLink,
  Service
} from "rsi-react-web-components";

const svc = Service.lookup("OboMiscListService", "obo");

const BuildingPermitProject = ({
  partner,
  appno,
  appService,
  moveNextStep
}) => {
  const [error, setError] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("select-apptype");
  const [occupancyMode, setOccupancyMode] = useState("group");
  const [project, setProject] = useState({appid: appno, apptype: "NEW", worktypes: {}});
  const [occupancyGroups, setOccupancyGroups] = useState([]);

  useEffect(() => {
    console.log("SVC", svc)
    svc.getOccupancyTypeGroups((err, groups) => {
      if (err) {
        setError(err)
      } else {
        setOccupancyGroups(groups);
      }
    })
  }, [])

  const submitAppType = () => {
    setMode("select-worktype");
  }

  const validWorkTypes = () => {
    //check at least one worktype is selected
    let valid = false;
    const worktypes = project.worktypes;
    const idx = Object.keys(worktypes).forEach(key => {
      if (worktypes[key] === true) {
        valid = true;
      }
    });
    return valid;
  }

  const submitWorkType = () => {
    if (validWorkTypes()) {
      setMode("select-occupancytype");
    } else {
      setError("Please check at least one work type.")
    }
  }

  return (
    <Panel>
      <Subtitle>Project Details</Subtitle>
      <Spacer />
      <Error msg={error} />

      <FormPanel visibleWhen={mode === "select-apptype"} context={project} handler={setProject} >
        <Subtitle2>Select Application Type</Subtitle2>
        <Panel style={{marginLeft: 20}}>
          <Radio name="apptype">
            <Item caption="New Construction" value="NEW" />
            <Item caption="Renovation" value="RENOVATION" />
            <Item caption="Demolition" value="DEMOLITION" />
          </Radio>
        </Panel>
        <ActionBar>
          <Button caption="Next" action={submitAppType} />
        </ActionBar>
      </FormPanel>

      <FormPanel visibleWhen={mode === "select-worktype"} context={project} handler={setProject} >
        <Subtitle2>Select Work Type</Subtitle2>
        <Panel style={styles.column}>
          <Checkbox caption="ADDITION" name="worktypes.addition" value="ADDITION" />
          <Checkbox caption="ALTERATION" name="worktypes.alteration" value="ALTERATION" />
          <Checkbox caption="DEMOLITION" name="worktypes.demolition" value="DEMOLITION" />
          <Checkbox caption="ORIGINAL" name="worktypes.original" value="ORIGINAL" />
          <Checkbox caption="RENOVATION" name="worktypes.renovation" value="RENOVATION" />
        </Panel>
        <ActionBar>
          <BackLink action={() => setMode("select-apptype")} />
          <Button caption="Next" action={submitWorkType} />
        </ActionBar>
      </FormPanel>

      <Panel visibleWhen={mode === "select-occupancytype"}>
        <FormPanel visibleWhen={occupancyMode === "group"} context={project} handler={setProject}>
          <Subtitle2>Select Occupancy Group</Subtitle2>
          <Radio name="occupancygroupid" list={occupancyGroups} Control={RadioItem}/>
          <ActionBar>
            <Button caption="Next" action={() => setOccupancyMode("group")} />
          </ActionBar>
        </FormPanel>
      </Panel>

      <p>{JSON.stringify(project, null, 2)}</p>
    </Panel>
  )
}

const RadioItem = ({item}) => {
  return (
    <Panel style={{paddingBottom: 5}}>
      <Subtitle2>{item.title}</Subtitle2>
      <label>{item.description}</label>
    </Panel>
  )
}

const styles = {
  column: {
    display: "flex",
    flexDirection: "column",
    marginLeft: 20,
  },
}

export default BuildingPermitProject
