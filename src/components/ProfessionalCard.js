import React from "react";
import {
  Panel,
  Label,
  Image,
} from "rsi-react-web-components";

import "./ProfessionalCard.css";
import ProfessionalLookup from "./ProfessionalLookup";

const ProfessionalCard = ({ professional  ={}, caption, onSelectProfessional, photoUrl }) => {
  let name = "";
  if (professional.lastname) {
    name = `${professional.lastname}, ${professional.firstname} ${professional.middlename}`
  };
  let address = "";
  if (professional.address) {
    address = professional.address.text;
  }

  return (
    <div style={styles.container}>
      <Panel style={styles.lookupContainer}>
        <Label captionStyle={styles.caption} caption={caption} />
        <ProfessionalLookup hideSearchText={true}
          onSelect={onSelectProfessional}
          fullWidth={false}
        />
      </Panel>
      <div style={{margin: 10, padding: 10}}>
        <div style={styles.nameContainer}>
          <Panel>
            <Label labelStyle={styles.name}>{name}</Label>
            <Label labelStyle={styles.profession}>{professional.profession}</Label>
          </Panel>
          <Image src={photoUrl}/>
        </div>
        <Panel style={styles.row}>
          <Panel>
            <Label style={styles.label} captionStyle={{width: 120}} caption="PRC ID No.">{professional.prc.idno}</Label>
            <Label style={styles.label} captionStyle={{width: 120}} caption="Date Issued">{professional.prc.dtissued}</Label>
            <Label style={styles.label} captionStyle={{width: 120}} caption="Valid Until">{professional.prc.dtvalid}</Label>
            <Label style={styles.label} captionStyle={{width: 120}} caption="Place Issued">{professional.prc.placeissued}</Label>
          </Panel>
          <Panel>
            <Label style={styles.label} captionStyle={{width: 120}} caption="PTR ID No.">{professional.ptr.refno}</Label>
            <Label style={styles.label} captionStyle={{width: 120}} caption="Date Issued">{professional.ptr.dtissued}</Label>
            <Label style={styles.label} captionStyle={{width: 120}} caption="Place Issued">{professional.ptr.placeissued}</Label>
          </Panel>
        </Panel>
      </div>
    </div>
  );
};

const styles = {
  container: {
    borderWidth: 1,
    borderColor: "#aaa",
    boxShadow: "0px 5px 7px -7px rgba(0,0,0,0.75)",
    backgroundColor: "#eee",
  },
  caption: {
    fontSize: 18,
    width: "100%"
  },
  lookupContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "lightgray",
    paddingTop: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  nameContainer: {
    dipslay: "flex",
    justifyContent: "space-between",
    marginBottom: 5
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
  },
  profession: {
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: "#ddd",
    width: "100%",
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    paddingBottom: 2,
  }
}


export default ProfessionalCard;
