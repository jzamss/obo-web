import React from 'react'
import {
  Checkbox,
  Panel,
  Label,
  Decimal,
  Integer,
}
from "rsi-react-web-components";

const CheckboxInfo = (props) => {
  return (
    <div style={styles.checkInfo}>
      <Checkbox {...props} />
    </div>
  )
}

const components = {
  "decimal": Decimal,
  "integer": Integer,
  "boolean": CheckboxInfo
}

const InfoComponent = ({
  category,
  dataType="integer",
  caption,
  unit,
  name,
}) => {
  const HandlerComponent = components[dataType];
  let label = caption.toLowerCase();
  if (dataType !== "boolean") {
    label += " (" + unit.toLowerCase() + ")";
  }

  return (
    <Panel>
      {category &&
        <Label style={styles.category}>{category}</Label>
      }
      <div style={styles.infoContainer}>
        <label>{label}</label>
        <HandlerComponent
          name={name}
          fullWidth={false}
          variant='outlined'
          size='small'
          width={120}
          style={{ flexBasis: 100 }}
        />
      </div>
    </Panel>
  )
}

const styles = {
  infoContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: 20,
  },
  category: {
    fontSize: 16,
    fontWeight: 600,
    border: "1px solid #aaa",
    backgroundColor: "#eee",
    padding: "2px 10px",
    margin: "10px 0px"
  },
  checkInfo: {
    width: 100,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 3,
  },
}

export default InfoComponent
