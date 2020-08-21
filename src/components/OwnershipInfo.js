import React from "react";
import { Subtitle2, Panel, Text, Label, Combobox } from "rsi-react-web-components";
import { ResidenceAddress, IdEntry } from "rsi-react-filipizen-components";

const entityTypes = ['INDIVIDUAL', 'CORPORATION', 'GOVERNMENT', 'OTHER']

const OwnershipInfo = ({ owner, editable, orgcode, ...rest }) => {
  const title = rest.title || "Lot Owner Information";
  const showTitle = rest.showTitle || true;
  const showIdEntry =  rest.showIdEntry || false;

  return (
    <React.Fragment>
      {showTitle && <Subtitle2>{title}</Subtitle2> }
      <Panel>
        <Text caption="Profile No." name="owner.profileno" editable={editable} />
        <Combobox items={entityTypes} name="owner.entitytype" caption='Ownership Type' editable={editable}/>
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
        {showIdEntry && <IdEntry name="owner.id" editable={editable} /> }
      </Panel>
    </React.Fragment>
  );
};

export default OwnershipInfo;
