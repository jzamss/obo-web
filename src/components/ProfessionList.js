import React from "react";
import { Combobox } from "rsi-react-web-components";

const ProfessionList = ({
  name="profession",
  caption="Profession",
  professions,
  ...rest
}) => {
    return (
    <Combobox
      name={name}
      caption={caption}
      items={professions}
      {...rest}
    />
  );
};

export default ProfessionList;
