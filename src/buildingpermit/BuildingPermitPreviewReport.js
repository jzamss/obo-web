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
  Button
} from "rsi-react-web-components";


const BuildingPermitPreviewReport = ({
  partner,
  appno,
  appService,
  moveNextStep,
  stepCompleted
}) => {

  const [href, setHref] = useState();

  const viewReport = (href) => {
    setHref("/jreports/obo/electricalpermit?refid=OBOBPANC25cf462e:174704f4c30:-7fcf");
  }

  return (
    <Panel>
      <Panel>
        <Button
          caption="permit"
          icon=""
          action={viewReport} />
      </Panel>
      <div>
        <iframe type="text/html" src={href} />
      </div>
    </Panel>
  )
}

const styles = {

}


export default BuildingPermitPreviewReport
