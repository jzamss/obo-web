import React, { useState, useEffect } from "react";
import {
  ActionBar,
  Button,
  Checkbox,
  Panel,
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
  Date,
} from "rsi-react-web-components";

const svc = Service.lookup("OboMiscListService", "obo");

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
    numfloors: 1,
    numunits: 1,
    occupancytype: {
      objid: null,
      group: {},
      division: {},
    }
  }

  const [error, setError] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  //TOOD: remove mode only
  const [mode, setMode] = useState("project-detail");
  const [occupancyMode, setOccupancyMode] = useState("group");
  const [project, setProject] = useState(initialProject);
  const [occupancyGroups, setOccupancyGroups] = useState([]);
  const [occupancyDivisions, setOccupancyDivisions] = useState([]);
  const [occupancyTypes, setOccupancyTypes] = useState([]);
  const [professional, setProfessional] = useState();

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
        } else {
          const workTypes = initialWorkTypes.map(wt => {
            let workType = project.worktypes.find(pwt => wt.value === pwt)
            if (workType) {
              return {...wt, checked: true};
            }
            return wt;
          })
          project.worktypes = workTypes;
        }
        setProfessional(project.contractor);
        setProject(project);
        setMode("project-detail");
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

  const submitProjectDetail = () => {
    setError(null);
    const detail = {
      appid: appno,
      title: project.title,
      description: project.description,
      numunits: project.numunits,
      totalfloorarea: project.totalfloorarea,
      height: project.height,
      numfloors: project.numfloors,
      projectcost: project.projectcost,
      dtproposedconstruction: project.dtproposedconstruction,
      dtexpectedcompletion: project.dtexpectedcompletion,
    };
    appService.update(detail, (err, proj) => {
      if (err) {
        setError(err);
      } else {
        clearStatus();
        setMode("select-worktype");
      }
    });
  }

  const validWorkTypes = () => {
    const idx = project.worktypes.findIndex(wt => wt.checked === true);
    return idx >= 0;
  }

  const submitWorkType = () => {
    setError(null);
    if (validWorkTypes()) {
      setError(null);
      const updatedWorkTypes = {
        appid: appno,
        worktypes: project.worktypes.filter(wt => wt.checked).map(wt => wt.value),
      };
      appService.update(updatedWorkTypes, (err, proj) => {
        if (err) {
          setError(error);
        } else {
          setLoading(false);
          moveNextStep();
        }
      });
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
      let occupancytype = {appid: appno, occupancytype: project.occupancytype};
      appService.updateOccupancyType(occupancytype, (err, res) => {
        if (err) {
          setError(err);
        } else {
          clearStatus();
          moveNextStep();
        }
      })
    }
  }
  const clearStatus = () => {
    setError(null);
    setLoading(false);
  }

  return (
    <Panel>
      <Subtitle>Project Details</Subtitle>
      <Spacer />
      <Error msg={error} />

      <FormPanel visibleWhen={mode === "project-detail"} context={project} handler={setProject}>
        <Text caption="Project Title" name="title" required={true} readOnly={stepCompleted} autoFocus={true}/>
        <Text caption="Project Description" name="description" required={true} readOnly={stepCompleted} />
        {project.occupancytypeid &&
          <Text caption="Occupancy Type" name="occupancytype.title" required={true} readOnly={stepCompleted} />
        }
        <Spacer/>
        <Integer caption="No of Units" name="numunits" required={true} readOnly={stepCompleted} />
        <Panel row>
          <Decimal caption="Total Floor Area [sq.meter]" name="totalfloorarea" required={true} readOnly={stepCompleted} fullWidth textAlign="left" />
          <Decimal caption="Building Height [meter]" name="height" required={true} readOnly={stepCompleted} fullWidth textAlign="left" />
        </Panel>
        <Integer caption="No. of Storeys" name="numfloors" required={true} readOnly={stepCompleted} />
        <Spacer/>
        <Decimal caption="Estimated Cost [Php]" name="projectcost" required={true} readOnly={stepCompleted} decimalScale={2} textAlign="left" />
        <Panel row>
          <Date caption="Proposed Construction Date" name="dtproposedconstruction" readOnly={stepCompleted} />
          <Date caption="Expected Completion Date" name="dtexpectedcompletion" readOnly={stepCompleted} />
        </Panel>
        <ActionBar>
          <Button caption="Next" action={submitProjectDetail} />
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
          <BackLink action={() => setMode("project-detail")} />
          <Button caption="Next" action={submitWorkType} />
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
