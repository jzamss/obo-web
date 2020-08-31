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
  BackLink,
  Service,
  Integer,
  Decimal,
  Number,
  Date
} from "rsi-react-web-components";

const svc = Service.lookup("OboMiscListService", "obo");

const RadioItem = ({item}) => {
  return (
    <Panel style={{paddingBottom: 5}}>
      <Subtitle2>{item.title}</Subtitle2>
      <label>{item.description}</label>
    </Panel>
  )
}

const initialWorkTypes = [
  { name: "addition", caption: "ADDITION", value: "ADDITION" },
  { name: "alteration", caption: "ALTERATION", value: "ALTERATION" },
  { name: "demolition", caption: "DEMOLITION", value: "DEMOLITION" },
  { name: "original", caption: "ORIGINAL", value: "ORIGINAL" },
  { name: "renovation", caption: "RENOVATION", value: "RENOVATION" },
];

const BuildingPermitProject = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {
  const initialProject = {
    appid: appno,
    apptype: "NEW",
    worktypes: initialWorkTypes,
    occupancytype: {
      objid: null,
      group: {},
      division: {},
    }
  }

  const [error, setError] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(stepCompleted ? "project-detail" : "select-apptype");
  const [occupancyMode, setOccupancyMode] = useState("group");
  const [project, setProject] = useState(initialProject);
  const [occupancyGroups, setOccupancyGroups] = useState([]);
  const [occupancyDivisions, setOccupancyDivisions] = useState([]);
  const [occupancyTypes, setOccupancyTypes] = useState([]);

  const loadOccupancyGroups = () => {
    svc.getOccupancyTypeGroups((err, groups) => {
      if (err) {
        setError(err)
      } else {
        setOccupancyGroups(groups);
      }
    });
  }

  const loadOccupancyDivisions = () => {
    const groupid = project.occupancytype.group.objid;
    svc.getOccupancyTypeDivisions({groupid} ,(err, divisions) => {
      if (err) {
        setError(err)
      } else {
        setOccupancyDivisions(divisions);
      }
    });
  }

  const loadOccupancyTypes = () => {
    const divisionid = project.occupancytype.division.objid;
    svc.getOccupancyTypes({divisionid} ,(err, types) => {
      if (err) {
        setError(err)
      } else {
        setOccupancyTypes(types);
      }
    });
  }

  useEffect(() => {
    appService.getProjectInfo({appid: appno}, (err, project) => {
      if (err) {
        setError(err);
      } else {
        if (project.worktypes.length === 0) {
          project.worktypes = initialWorkTypes;
        }
        setProject(project);
        setMode("select-apptype");
      }
    });
  }, [])

  useEffect(() => {
    if (occupancyMode === "group")
      loadOccupancyGroups();
    else if (occupancyMode === "division")
      loadOccupancyDivisions();
    else if (occupancyMode === "type")
      loadOccupancyTypes();
  }, [occupancyMode])

  const submitAppType = () => {
    setMode("select-worktype");
  }

  const validWorkTypes = () => {
    const idx = project.worktypes.findIndex(wt => wt.checked === true);
    return idx >= 0;
  }

  const submitWorkType = () => {
    setError(null);
    if (validWorkTypes()) {
      setMode("select-occupancytype");
    } else {
      setError("Please check at least one work type.")
    }
  }

  const submitOccupancyGroup = () => {
    if (!project.occupancytype.group.objid) {
      setError("Kindly select an occupancy group.")
    } else {
      setOccupancyMode("division");
    }
  }

  const submitOccupancyDivision = () => {
    if (!project.occupancytype.division.objid) {
      setError("Kindly select an occupancy division group.")
    } else {
      setOccupancyMode("type");
    }
  }

  const submitOccupancyType = () => {
    if (!project.occupancytype.objid) {
      setError("Kindly select an occupancy type.")
    } else {
      let occupancytype = {appid: appno, ...project.occupancytype};
      const occupancyTypeInfo = occupancyTypes.find(o => o.objid === occupancytype.objid)
      occupancytype = {...occupancytype, ...occupancyTypeInfo};
      setProject({...project, occupancytypeid: occupancytype.objid, occupancytype});
      setMode("project-detail");
    }
  }

  const updateProject = () => {
    setLoading(true);
    setError(null);
    const updatedProject = {appid: appno, ...project};
    appService.updateProjectInfo(updatedProject, (err, proj) => {
      if (err) {
        setError(err);
      } else {
        moveNextStep();
      }
      setLoading(false);
    });
  }

  const backToOccupancy = () => {
    setMode("select-occupancytype");
    setOccupancyMode("type");
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
            <Item caption="Renovation" value="RENOVATION" disabled={true} />
            <Item caption="Demolition" value="DEMOLITION" disabled={true}  />
          </Radio>
        </Panel>
        <ActionBar>
          <Button caption="Next" action={submitAppType} />
        </ActionBar>
      </FormPanel>

      <FormPanel visibleWhen={mode === "select-worktype"} context={project} handler={setProject} >
        <Subtitle2>Select Work Type</Subtitle2>
        <Panel style={styles.column}>
          {project.worktypes.map((worktype, idx) => (
            <Checkbox
              caption={worktype.caption}
              name={`worktypes[${idx}].checked`}
              value={worktype.value} />
          ))}
        </Panel>
        <ActionBar>
          <BackLink action={() => setMode("select-apptype")} />
          <Button caption="Next" action={submitWorkType} />
        </ActionBar>
        <p>{JSON.stringify(project.worktypes)}</p>
      </FormPanel>

      <Panel visibleWhen={mode === "select-occupancytype"}>
        <FormPanel visibleWhen={occupancyMode === "group"} context={project} handler={setProject}>
          <Subtitle2>Select Occupancy Group</Subtitle2>
          <Radio name="occupancytype.group.objid" list={occupancyGroups} Control={RadioItem}/>
          <ActionBar>
            <BackLink action={() => setMode("select-worktype")} />
            <Button caption="Next" action={submitOccupancyGroup} />
          </ActionBar>
        </FormPanel>

        <FormPanel visibleWhen={occupancyMode === "division"} context={project} handler={setProject}>
          <Subtitle2>Select Occupancy Group Division</Subtitle2>
          <Radio name="occupancytype.division.objid" list={occupancyDivisions} Control={RadioItem}/>
          <ActionBar>
            <BackLink caption="Back" action={() => setOccupancyMode("group")} />
            <Button caption="Next" action={submitOccupancyDivision} />
          </ActionBar>
        </FormPanel>

        <FormPanel visibleWhen={occupancyMode === "type"} context={project} handler={setProject}>
          <Subtitle2>Select Occupancy Type</Subtitle2>
          <Radio name="occupancytype.objid" list={occupancyTypes} Control={RadioItem}/>
          <ActionBar>
            <BackLink caption="Back" action={() => setOccupancyMode("division")} />
            <Button caption="Next" action={submitOccupancyType} />
          </ActionBar>
        </FormPanel>
      </Panel>

      <FormPanel visibleWhen={mode === "project-detail"} context={project} handler={setProject}>
        <Text caption="Project Title" name="title" required={true} readOnly={stepCompleted} />
        <Text caption="Project Description" name="description" required={true} readOnly={stepCompleted} />
        <Spacer/>
        <Text caption="Occupancy Type" name="occupancytype.title" required={true} readOnly={stepCompleted} />
        <Integer caption="No of Units" name="numunits" required={true} readOnly={stepCompleted} />
        <Decimal caption="Total Floor Area [sq.meter]" name="totalfloorarea" required={true} readOnly={stepCompleted} />
        <Decimal caption="Building Height [meter]" name="height" required={true} readOnly={stepCompleted} />
        <Integer caption="No of Storeys" name="numfloors" required={true} readOnly={stepCompleted} />
        <Spacer/>
        <Decimal caption="Estimated Cost [Php]" name="projectcost" required={true} readOnly={stepCompleted} decimalScale={2}/>
        <Panel row>
          <Date caption="Proposed Construction Date" name="dtproposedconstruction" readOnly={stepCompleted} />
          <Date caption="Expected Completion Date" name="dtexpectedcompletion" readOnly={stepCompleted} />
        </Panel>
        <ActionBar visibleWhen={!stepCompleted}>
          <BackLink action={backToOccupancy} />
          <Button caption="Next" action={updateProject} />
        </ActionBar>
      </FormPanel>
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
