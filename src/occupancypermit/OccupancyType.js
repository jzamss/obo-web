import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  Spacer,
  ActionBar,
  Button,
  Radio,
  Item,
  FormPanel,
  Error
} from 'rsi-react-web-components';

const OccupancyType = ({
  appno,
  appService,
  onSubmitOccupancyType
}) => {
  const [error, setError] = useState();
  const [app, setApp] = useState({});

  useEffect(() => {
    appService.getApplication({appid: appno}, (err, app) => {
      if (err) {
        setError(err);
      } else {{
        setApp(app);
      }}
    });
  }, [])

  return (
    <Panel>
      <Subtitle>Application Type</Subtitle>
      <Spacer />
      <Error msg={error} />
      <FormPanel context={app} handler={setApp}>
        <Radio name="apptype">
          <Item caption="Full (Completed)" value="full" />
          <Item caption="Partial" value="partial" />
        </Radio>
      </FormPanel>
      <ActionBar>
        <Button caption="Next" action={() => onSubmit(onSubmitOccupancyType)} />
      </ActionBar>
    </Panel>
  )
}

export default OccupancyType;
