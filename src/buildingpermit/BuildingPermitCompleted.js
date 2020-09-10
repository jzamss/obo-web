import React, { useState, useEffect } from "react";
import {
  Panel,
  Error,
  Subtitle,
  FormPanel,
  Text,
  Spacer,
  Decimal,
  Date,
  ButtonLink,
  PageviewIcon,
  CloudDownloadIcon,
  LinkIcon,
  Subtitle2,
} from "rsi-react-web-components";


const BuildingPermitCompleted = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState({});
  const [ancillaryPermits, setAncillaryPermits] = useState([]);


  const resetStatus = () => {
    setError(null)
    setLoading(false)
  }

  const loadApplication = () => {
    setLoading(true)
    appService.getProjectInfo({ appid: appno }, (err, app) => {
      if (err) {
        setError(err)
      } else {
        setApp(app)
        resetStatus()
      }
    })
  }

  const loadAncillaryPermits = () => {
    setLoading(true)
    appService.getAncillaryPermits(
      { appid: appno },
      (err, ancillaryPermits) => {
        if (err) {
          setError(err)
        } else {
          setAncillaryPermits(ancillaryPermits)
          resetStatus()
        }
      }
    )
  }

  useEffect(() => {
    loadApplication()
    loadAncillaryPermits()
  }, [])



  const location = [];
  if (app.location) {
    if (app.location.lotno) location.push(`Lot: ${app.location.lotno}`);
    if (app.location.blockno) location.push(`Block: ${app.location.blockno}`);
    if (app.location.street) location.push(`Street: ${app.location.street}`);
    if (app.location.barangay.name) location.push(`Barangay: ${app.location.barangay.name}`);
  }

  let contractor = "";
  if (app.contractor) {
    contractor = `${app.contractor.lastname}, ${app.contractor.firstname} ${app.contractor.middlename}`;
    contractor += `\n${app.contractor.profession}`;
    contractor += ` PRC NO.: ${app.contractor.prc.idno} Issued: ${app.contractor.prc.dtissued}`;
  }

  return (
    <Panel>
      <Spacer />
      <Error msg={error} />
      <FormPanel context={app} handler={setApp}>
        <label>
        Please download and print the Building and Ancillary Permit forms, prepare the
        requirements listed below, and submit at the receiving window of our One-Stop
        Shop for Construction Permits (OSCP) at the Ground Floor, City of Engineering
        Office, Miguel Lopez del Legazpi Boulevard, Dapdap, Legazpi City.
        </label>
        <Spacer height={10} />
        <Panel style={styles.container}>
          <Panel style={styles.linkContainer}>
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
          <Panel style={styles.infoContainer}>
            <Text caption="Tracking No." name="objid" readOnly={true} />
            <Text caption="Project Title" name="title" readOnly={true} />
            <Text caption="Location" expr={() => location.join(" ,")} readOnly={true} />
            <Text caption="Applicant" name="applicant.name" readOnly={true} />
            <Decimal caption="Project Cost" name="projectcost" readOnly={true} textAlign="left" />
            <Panel row>
              <Date caption="Est. Start Date" name="dtproposedconstruction" readOnly={true} />
              <Date caption="Est. End Date" name="dtexpectedcompletion" readOnly={true} />
            </Panel>
            <Text
              caption="Supervisor/In Charge of Project"
              expr={() => contractor}
              readOnly={true}
              multiline={true}
              rows={2}
            />
          </Panel>
        </Panel>
      </FormPanel>
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
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    marginRight: 10,
    width: "100%",
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


export default BuildingPermitCompleted
