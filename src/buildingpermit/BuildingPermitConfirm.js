import React, { useState, useEffect } from 'react'
import {
  MsgBox,
  ActionBar,
  Button,
  FormPanel,
  Panel,
  Subtitle,
  Spacer,
  Loading,
  Error,
  Text,
  Decimal,
  Integer,
  LinkIcon
} from 'rsi-react-web-components'

const BuildingPermitConfirm = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {

  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState({});
  const [ancillaryPermits, setAncillaryPermits] = useState([]);

  const resetStatus = () => {
    setError(null);
    setLoading(false);
  }

  const loadApplication = () => {
    setLoading(true);
    appService.getApplication({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {
        setApp(app);
        resetStatus();
      }
    })
  };

  const loadAncillaryPermits = () => {
    setLoading(true);
    appService.getAncillaryPermits({appid: appno}, (err, ancillaryPermits) => {
      if (err) {
        setError(err);
      } else {
        setAncillaryPermits(ancillaryPermits);
        resetStatus();
      }
    })
  };

  useEffect(() => {
    loadApplication();
    loadAncillaryPermits();
  }, []);


  const getLocation = () => {
    if (!app.location) return "";

    const location = [];
    if (app.location.lotno) location.push(`Lot: ${app.location.lotno}`);
    if (app.location.blockno) location.push(`Block: ${app.location.blockno}`);
    if (app.location.street) location.push(`Street: ${app.location.street}`);
    if (app.location.barangay.name) location.push(`Barangay: ${app.location.barangay.name}`);
    return location.join(" ");
  }

  const getContractor = () => {
    let contractor = "";
    if (app.contractor) {
      contractor = `${app.contractor.lastname}, ${app.contractor.firstname} ${app.contractor.middlename}`;
    }
    return contractor;
  }

  const getWorkTypes = () => {
    let worktypes = "";
    if (app.worktypes && app.worktypes.length > 0) {
      worktypes = app.worktypes?.join(",");
    }
    return worktypes;
  }

  const viewPermit = (permit) => {

  }

  const submitConfirmation = () => {
    setConfirm(true);
  }

  const submit = () => {
    setConfirm(false);
    moveNextStep();
  }

  return (
    <Panel>
      <Subtitle>Confirm Application</Subtitle>
      <Spacer />
      <MsgBox
        open={confirm}
        type="confirm"
        msg="Permit processing will now be completed. Make sure that all information are correct."
        onAccept={submit}
        onCancel={() => setConfirm(false)}
      />
      <Error msg={error} />
      <Loading visibleWhen={loading} />
      <p>Please confirm the info and preview each permit application before submitting</p>
      <FormPanel visibleWhen={!loading} context={app} handler={setApp}>
        <Panel>
          <Panel>
            <Text caption="Tracking No." name="objid" readOnly={true} />
            <Text caption="Project Title" name="title" readOnly={true} />
            <Text caption="Project Location" expr={getLocation} readOnly={true} />
            <Spacer />
            <Text caption="Applicant" name="applicant.name" readOnly={true} />
            <Text caption="Occupancy Type" name="occupancytype.title" readOnly={true} />
            <Text caption="Type of Work" expr={getWorkTypes} readOnly={true} />
            <Text caption="Supervisor in Charge of Construction" expr={getContractor} readOnly={true} />
          </Panel>
          <Panel>
            <Panel row>
              <Integer caption="No. of Units" name="numunits" readOnly={true} />
              <Integer caption="No. of Floors" name="numfloors" readOnly={true} />
              <Decimal caption="Bldg. Height" name="height" readOnly={true} textAlign="left"/>
            </Panel>
            <Spacer />
            <Panel row>
              <Decimal caption="Total Area (sqm)" name="totalfloorarea" readOnly={true} textAlign="left" fullWidth={true} />
              <Decimal caption="Project Cost" name="projectcost" readOnly={true} textAlign="left" fullWidth={true} />
            </Panel>
            <Panel row>
              <Text caption="Est. Start Date" name="dtproposedconstruction" readOnly={true} />
              <Text caption="Est. Completion Date" name="dtexpectedcompletion" readOnly={true} />
            </Panel>
          </Panel>
        </Panel>
        <Spacer />
        <h3>Ancillary and Other Permits</h3>
        <Panel visibleWhen={ancillaryPermits.length > 0} style={styles.ancillaryContainer}>
          {ancillaryPermits.map(permit => (
            <LinkIcon
                key={permit.objid}
                title={permit.type.title}
                href={`/jreports/obo/${permit.permittypeid}permit?refid=${permit.objid}`}
              />
          ))}
        </Panel>
        <ActionBar>
          <Button caption="Submit" action={submitConfirmation} />
        </ActionBar>
      </FormPanel>
    </Panel>
  )
}

const styles = {
  ancillaryContainer: {
    marginLeft: 20,
  },
  permitRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  permitTitle: {
    padding: "1px 1px",
  }
}

export default BuildingPermitConfirm;
