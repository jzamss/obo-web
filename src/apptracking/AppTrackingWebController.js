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
  Spacer,
  Text,
  ActionBar,
  Button,
  BackLink
} from 'rsi-react-web-components'
import { EmailVerification } from 'rsi-react-filipizen-components'

const AppTrackingWebController = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [mode, setMode] = useState('init')
  const [appno, setAppno] = useState()
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
    console.log("contact", contact);
    setMode('info');
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
        <Panel visibleWhen={mode === 'info'}>
          <Subtitle>Building Permit Application Status</Subtitle>
          <Spacer />
        </Panel>
      </Card>
    </Page>
  )
}

export default AppTrackingWebController
