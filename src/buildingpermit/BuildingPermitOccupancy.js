import React, { useState, useEffect } from "react";
import {
  ActionBar,
  Button,
  Panel,
  Radio,
  Error,
  Subtitle,
  Subtitle2,
  FormPanel,
  Spacer,
  BackLink,
  Service,
  MsgBox,
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

const BuildingPermitOccupancy = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("select-occupancytype");
  const [occupancyMode, setOccupancyMode] = useState("group");
  const [project, setProject] = useState({});
  const [occupancyGroups, setOccupancyGroups] = useState([]);
  const [occupancyDivisions, setOccupancyDivisions] = useState([]);
  const [occupancyTypes, setOccupancyTypes] = useState([]);
  const [prevOccupancyId, setPrevOccupancyId] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  useEffect(() => {
    appService.getApplication({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {
        setProject({occupancytype: app.occupancytype});
        setPrevOccupancyId(app.occupancytype.objid);
      }
    })
  }, [])

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
    if (occupancyMode === "group")
      loadOccupancyGroups();
    else if (occupancyMode === "division")
      loadOccupancyDivisions();
    else if (occupancyMode === "type")
      loadOccupancyTypes();
  }, [occupancyMode])

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

  const updateOccupancyType = () => {
    let occupancytype = {appid: appno, occupancytype: project.occupancytype};
    appService.updateOccupancyType(occupancytype, (err, res) => {
      if (err) {
        setError(err);
      } else {
        clearStatus();
        setShowConfirm(false);
        moveNextStep();
      }
    });
  }

  const submitOccupancyType = () => {
    if (!project.occupancytype.objid) {
      setError("Kindly select an occupancy type.")
    } else {
      updateOccupancyType();
    }
  }
  const clearStatus = () => {
    setError(null);
    setLoading(false);
  }


  return (
    <Panel>
      <Subtitle>Occupancy Type</Subtitle>
      <Spacer />
      <Error msg={error} />

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

    </Panel>
  )
}

export default BuildingPermitOccupancy
