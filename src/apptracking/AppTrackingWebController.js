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
} from 'rsi-react-web-components'
import { EmailVerification } from 'rsi-react-filipizen-components'

const svc = Service.lookup("OnlineBuildingPermitService", "obo");


const AppTrackingWebController = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mode, setMode] = useState('init')
  const [appno, setAppno] = useState()
  const [app, setApp] = useState()
  const [contact, setContact] = useState()

  const { partner, service, history } = props

  const submitTrackingNo = () => {
    setError(null)
    if (!appno) {
      setError('Tracking No. is required.')
    } else {
      setMode('verification')
    }
  }

  const onEmailVerified = (contact) => {
    setContact(contact);
    loadApplication();

  }

  const resetStatus = () => {
    setError(null);
    setLoading(false);
  }

  const loadApplication = () => {
    setLoading(true);
    svc.getApplication({appid: appno}, (err, app) => {
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

  return (
    <Page>
      <Card>
        <Title>{service.title}</Title>
        <Error msg={error} />
        <Panel visibleWhen={mode === 'init'}>
          <Subtitle>Building Permit Tracking No.</Subtitle>
          <Spacer />
          <Text
            caption='Tracking No.'
            name='appno'
            value={appno}
            onChange={setAppno}
            required
            error={error}
            helperText={error}
            fullWidth={false}
            variant='outlined'
          />
          <ActionBar>
            <BackLink action={() => history.goBack()} />
            <Button caption='Next' action={submitTrackingNo} />
          </ActionBar>
        </Panel>

        <Panel visibleWhen={mode === 'verification'}>
          <EmailVerification
            partner={partner}
            onCancel={() => setMode('init')}
            onVerify={onEmailVerified}
            width={200}
          />
        </Panel>
        <FormPanel visibleWhen={mode === 'info'} context={app} handler={setApp}>
          <Subtitle>Building Permit Application Status</Subtitle>
          <Spacer />
          <Panel>
          <Panel>
            <Text caption="Tracking No." name="objid" readOnly={true} />
            <Text caption="Project Title" name="title" readOnly={true} />
            <Text caption="Project Location" expr={getLocation} readOnly={true} />
            <Spacer />
            <Text caption="Applicant" name="applicant.name" readOnly={true} />
            <Text caption="Occupancy Type" name="occupancytype.title" readOnly={true} />
            <Text caption="Type of Work" expr={getWorkTypes} readOnly={true} />
          </Panel>
        </Panel>
        </FormPanel>
      </Card>
    </Page>
  )
}

export default AppTrackingWebController
