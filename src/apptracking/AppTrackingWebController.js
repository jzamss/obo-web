import React, { useState, useEffect } from 'react'
import {
  Service,
  Page,
  Panel,
  Title,
  Card,
  Error,
  FormPanel,
  Subtitle,
  Subtitle2,
  Spacer,
  Text,
  ActionBar,
  Button,
  BackLink,
  Date,
  Label,
  getDuration
} from 'rsi-react-web-components'
import { VerifyEmailCode, EmailVerification } from 'rsi-react-filipizen-components'

const AppTrackingWebController = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mode, setMode] = useState('init')
  const [trackingno, setTrackingno] = useState()
  const [app, setApp] = useState({subtasks: []})
  const [verifiedInfo, setVerifiedInfo] = useState({})
  const [contact, setContact] = useState()

  const { partner, service, history } = props

  const verifyTrackingNo = () => {
    setError(null)
    if (!trackingno) {
      setError('Tracking No. is required.')
    } else {
      const svc = Service.lookup(`${partner.id}:OboOnlineService`);
      svc.verifyApplication({ trackingno }, (err, info) => {
        if (err) {
          setError(err);
        } else {
          setVerifiedInfo(info);
          setMode('verification');
        }
      });
    }
  }

  const onEmailVerified = (contact) => {
    setContact(contact);
    getApplicationStatus();
  }

  const resetStatus = () => {
    setError(null);
    setLoading(false);
  }

  const getApplicationStatus = () => {
    setLoading(true);
    const svc = Service.lookup(`${partner.id}:OboOnlineService`);
    svc.findApplicationStatus({ trackingno }, (err, app) => {
      if (err) {
        setError(err);
      } else {
        setApp(app);
        setMode('info');
        resetStatus();
      }
    })
  };

  const getLocation = () => {
    if (!app.location) return "";

    const location = [];
    if (app.location.lotno) location.push(`Lot: ${app.location.lotno}`);
    if (app.location.blockno) location.push(`Block: ${app.location.blockno}`);
    if (app.location.street) location.push(`Street: ${app.location.street}`);
    if (app.location.barangay.name) location.push(`Barangay: ${app.location.barangay.name}`);
    return location.join(" ");
  }

  const getWorkTypes = () => {
    let worktypes = "";
    if (app.worktypes && app.worktypes.length > 0) {
      worktypes = app.worktypes?.join(",");
    }
    return worktypes;
  }

  let duration = "";
  if (app && app.task) {
    duration = getDuration(app.task.dtcreated);
  }



  return (
    <Page>
      <Card>
        <Title>{service.title}</Title>
        <Panel visibleWhen={mode === 'init'}>
          <Subtitle>Building Permit Tracking No.</Subtitle>
          <Spacer />
          <Text
            caption='Tracking No.'
            name='trackingno'
            value={trackingno}
            onChange={setTrackingno}
            required
            error={error}
            helperText={error}
            fullWidth={false}
            variant='outlined'
          />
          <ActionBar>
            <BackLink action={() => history.goBack()} />
            <Button caption='Next' action={verifyTrackingNo} />
          </ActionBar>
        </Panel>

        <Panel visibleWhen={mode === 'verification'}>
          <Subtitle>Account Verification</Subtitle>
          <Spacer />

          <VerifyEmailCode
            partner={partner}
            hiddenCode={verifiedInfo.key}
            email={verifiedInfo.email}
            onCancel={() => setMode("init")}
            onVerified={onEmailVerified}
          />
        </Panel>
        <FormPanel visibleWhen={mode === 'info'} context={app} handler={setApp}>
          <Subtitle>Building Permit Application Status</Subtitle>
          <Spacer />
          <Panel>
            <Panel row>
              <Text caption="Tracking No." name="trackingno" readOnly={true} />
              <Text caption="Application No." name="appno" readOnly={true} />
            </Panel>
            <Text caption="Project Title" name="title" readOnly={true} />
            <Text caption="Project Location" expr={getLocation} readOnly={true} />
            <Spacer />
            <Text caption="Applicant" name="applicant.name" readOnly={true} />
            <Text caption="Occupancy Type" name="occupancytype.title" readOnly={true} />
            <Text caption="Type of Work" expr={getWorkTypes} readOnly={true} />
          </Panel>
          <Spacer />

          <Panel style={styles.currentTask}>
            <div style={styles.title}>
              <Subtitle2>Current Task (ongoing)</Subtitle2>
            </div>
            <div style={styles.taskInfo}>
              <h3>{app && app.task && app.task.title}</h3>
              <Label caption="Date Endorsed" expr="task.dtcreated" />
              {app && app.task && app.task.assignee.name &&
                <Label caption="Assigned To" expr="task.assignee.name" />
              }
              <Label caption="Duration" context={app} expr={ctx => duration} />
            </div>
          </Panel>
        </FormPanel>
        <Panel visibleWhen={mode === 'info'}>
          <Spacer />
          <Subtitle2>Activity Summary</Subtitle2>
          <table style={styles.table}>
              <tr style={styles.trth}>
                <th style={styles.tableText}>Responsibility</th>
                <th style={styles.tableText}>Name</th>
                <th style={styles.tableText}>Date Endorsed</th>
                <th style={styles.tableText}>Duration</th>
              </tr>
              <tbody>
                {app.subtasks.map(st => (
                  <tr key={st.objid} style={styles.trth}>
                    <td style={styles.tableText}>{st.typeid}</td>
                    <td style={styles.tableText}>{st.task.title}</td>
                    <td style={styles.tableText}>{st.task.startdate || "Not yet started"}</td>
                    <td style={styles.tableText}>{getDuration(st.task.startdate)}  </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </Panel>
      </Card>
    </Page>
  )
}

const styles = {
  currentTask: {
    border: "1px solid #aaa",
    borderRadius: 5,
    boxShadow: "0px 5px 7px -7px rgba(0,0,0,0.75)",
  },
  taskInfo: {
    padding: "0px 10px",
  },
  title: {
    padding: "5px 10px",
    backgroundColor: "#ddd",
    borderBottom: "1px solid #aaa",
    borderRadius: 5,
  },
  table: {
    width: "100%",
    borderSpacing: 0,
  },
  tableText: {
    fontSize: 12,
    border: "1px solid #ddd",
    padding: 5,
  },
  trth: {
    border: "1px solid #ddd",
    cellSpacing: 0,
    padding: 5,
  }
}

export default AppTrackingWebController
