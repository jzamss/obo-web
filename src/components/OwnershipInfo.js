import React from "react";
import { Subtitle, Panel, Text, Label } from "rsi-react-web-components";
import { ResidenceAddress, IdEntry } from "rsi-react-filipizen-components";

const OwnershipInfo = ({ owner, editable, orgcode, ...rest }) => {
  const title = rest.title || "Lot Owner Information";
  const showTitle = rest.showTitle || true;
  const showIdEntry =  rest.showIdEntry || false;

  return (
    <React.Fragment>
      {showTitle && <Subtitle>{title}</Subtitle> }
      <Panel>
        <Text caption="Profile No." name="owner.profileno" editable={editable} />
        <Text caption="Type" name="owner.entitytype" editable={editable} />
        {owner.entitytype !== "INDIVIDUAL" && (
          <React.Fragment>
            <Text caption="Lot Owner Name" name="owner.name" editable={editable} />
            <Label>Name of administrator/contact of property owner</Label>
          </React.Fragment>
        )}

        <Text caption="Last Name" name="owner.lastname" editable={editable} />
        <Text caption="First Name" name="owner.firstname" editable={editable} />
        <Text caption="Middle Name" name="owner.middlename" editable={editable} />
        <ResidenceAddress owner={owner} orgcode={orgcode} name="owner.address" editable={editable} />
        {showIdEntry && <IdEntry name="id" editable={editable} /> }
      </Panel>
    </React.Fragment>
  );
};

export default OwnershipInfo;
