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
  LinkIcon,
  ButtonLink,
  Subtitle2,
  PageviewIcon,
  CloudDownloadIcon,
  ReportViewer
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
  const [showPreview, setShowPreview] = useState(false);

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

  const submitConfirmation = () => {
    setConfirm(true);
  }

  const submit = () => {
    setConfirm(false);
    moveNextStep();
  }

  const onCloseViewer = () => {
    setShowPreview(false);
  }

  let items = [];
  ancillaryPermits.forEach(permit => {
    items.push({
      title: permit.permittypeid.toUpperCase(),
      Icon: PageviewIcon,
      href: `/jreports/obo/${permit.permittypeid}permit?refid=${permit.objid}`,
      // href: `/jreports/obo/electricalpermit?refid=OBOBPANC25cf462e:174704f4c30:-7fcf`,
    })
  })

  return (
    <Panel>
      <Subtitle>Confirm Application</Subtitle>
      <Spacer />

      <ReportViewer
        title="Building Permit Application"
        items={items}
        open={showPreview}
        style={{}}
        onClose={onCloseViewer}
      />

      <MsgBox
        open={confirm}
        type="confirm"
        msg="Permit processing will now be completed. Make sure that all information are correct."
        onAccept={submit}
        onCancel={() => setConfirm(false)}
      />
      { /* <Error msg={error} /> */}
      <Loading visibleWhen={loading} />
      <p>Please confirm the info and preview each permit application before submitting</p>
      <FormPanel visibleWhen={!loading} context={app} handler={setApp}>
        <Panel style={styles.container}>
          <Panel style={styles.linkContainer}>
          {/**
            <Button caption="Preview Reports" action={() => setShowPreview(true)} />
           */}
            <ButtonLink
              caption="Preview"
              href={`/jreports/obo/bldgpermit?refid=${appno}`}
              Icon={PageviewIcon}
            />
            <ButtonLink
              caption="Download"
              href={`/jreports/download/obo/bldgpermit?refid=${appno}`}
              Icon={CloudDownloadIcon}
            />
          </Panel>
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
        <Panel style={styles.ancillaryContainer}>
          <Subtitle2 style={styles.label}>Other Permits</Subtitle2>
          <Panel visibleWhen={ancillaryPermits.length > 0}>
            {ancillaryPermits.map((permit) =>
              <Panel style={styles.ancillaryItem}>
                <label style={{marginLeft: 20}}>{permit.type.title}</label>
                <Panel row>
                  <ButtonLink
                    caption="Preview"
                    href={`/jreports/obo/${permit.permittypeid}permit?refid=${permit.objid}`}
                    Icon={PageviewIcon}
                  />
                  <ButtonLink
                    caption="Download"
                    href={`/jreports/download/obo/${permit.permittypeid}permit?refid=${permit.objid}`}
                    Icon={CloudDownloadIcon}
                  />
                </Panel>
              </Panel>
            )}
          </Panel>
        </Panel>
        <ActionBar>
          <Button caption="Submit" action={submitConfirmation} />
        </ActionBar>
      </FormPanel>
    </Panel>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyConent: "flex-start",
    border: "1px solid #aaa",
    padding: 20,
    borderRadius: 3,
  },
  linkContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
  },
  ancillaryContainer: {
    marginRight: 15,
    marginBottom: 20,
  },
  ancillaryItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 5,
    marginRight: 10,
    border: "1px solid #aaa",
  },
}

export default BuildingPermitConfirm;
