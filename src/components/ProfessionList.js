import React, { useState } from "react";
import { Combobox } from "rsi-react-web-components";

const professions = [
  "ARCHITECT",
  "CIVIL/STRUCTURAL ENGINEER",
  "PROFESSIONAL ELECTRICAL ENGINEER",
  "REGISTERED ELECTRICAL ENGINEER",
  "PROFESSIONAL MECHANICAL ENGINEER",
  "REGISTERED MECHANICAL ENGINEER",
  "SANITARY ENGINEER",
  "MASTER PLUMBER",
  "ELECTRONICS ENGINEER",
  "GEODETIC ENGINEER",
];

const ProfessionList = ({name="profession", caption="Profession", ...rest}) => {
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
