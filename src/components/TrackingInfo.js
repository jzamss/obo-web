import React from "react";
import {
  Subtitle2,
  Button,
  ActionBar,
  Spacer,
  Subtitle
} from 'rsi-react-web-components';

const TrackingInfo = ({
  title="New Permit Application",
  appno,
  onContinue
}) => {
  return (
    <React.Fragment>
      <Subtitle>{title}</Subtitle>
      <Spacer height={30} />
      <Subtitle2>Application created</Subtitle2>
      <p>
      Please take note of the tracking number for this application.
      This will be your tracking reference for completing
      and follow up for this application.
      </p>
      <Subtitle2>{appno}</Subtitle2>
      <ActionBar>
        <Button caption='Continue' action={onContinue} />
      </ActionBar>
    </React.Fragment>
  )
}

export default TrackingInfo;
