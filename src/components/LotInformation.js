import React from "react";
import { Subtitle2, Text, Panel } from "rsi-react-web-components";

const LotInformation = ({editable, ...rest} ) => {
  const title = rest.title || "Lot Information";
  const showTitle = rest.showTitle || true;
  return (
    <React.Fragment>
      {showTitle && <Subtitle2>{title}</Subtitle2>}
      <Panel row>
        <Text caption="PIN" name="pin" editable={editable} />
        <Text caption="Lot No." name="lotno" editable={editable} />
        <Text caption="Block No." name="blockno" editable={editable} />
      </Panel>
      <Panel row>
        <Text caption="Street" name="street" editable={editable} />
        <Text caption="Barangay" name="barangay" editable={editable} />
      </Panel>
      <Panel row>
        <Text caption="TD No." name="tdno" editable={editable} />
        <Text caption="Title No." name="titleno" editable={editable} />
      </Panel>
      <Panel row>
        <Text caption="Classification" name="classcode" editable={editable} />
        <Text caption="Area" name="areasqm" editable={editable} />
      </Panel>
    </React.Fragment>
  )
}

export default LotInformation
