import React, { useState } from "react";
import { Combobox } from "rsi-react-web-components";
import useBarangayList from "../hooks/useBarangayList";

const BarangayList = (props) => {
  const { partner } = props;
  const barangays = useBarangayList(partner.id);

  return (
    <Combobox
      name="barangay"
      caption="Barangay"
      items={barangays}
      expr={(item) => item.name}
    />
  );
};

export default BarangayList;
