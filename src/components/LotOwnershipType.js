import React from "react";
import { Subtitle, Radio, Item  } from "rsi-react-web-components";

const LotOwnershipType = ({ name, caption, ...rest }) => {
  const title = rest.title || "Lot Ownership";
  const showTitle = rest.showTitle || true;

  return (
    <React.Fragment>
      {showTitle && <Subtitle>{title}</Subtitle>}
      <Radio name={name} {...rest}>
        <Item caption="Lot Owned" value="1" />
        <Item caption="Leased" value="0" />
      </Radio>
    </React.Fragment>
  );
};

export default LotOwnershipType;
