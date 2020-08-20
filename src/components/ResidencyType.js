import React from "react";
import { Radio, Item } from "rsi-react-web-components";

const ResidencyType = ({ name, ...rest }) => {
  return (
    <Radio caption="Resident" name={name} {...rest}>
      <Item caption="Resident" value="1" />
      <Item caption="Non-Resident" value="0" />
    </Radio>
  );
};

export default ResidencyType;
