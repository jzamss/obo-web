import React, { useState, useEffect } from "react";
import {
  Panel,
  Subtitle,
  BackLink,
  ActionBar,
  Button,
  Spacer,
  Error,
  Text,
  Table,
  TableColumn,
  Service,
  Label,
  FormPanel
} from 'rsi-react-web-components';

import LotOwnershipType from "../components/LotOwnershipType";
import OwnershipInfo from "../components/OwnershipInfo";
import LotInformation from "../components/LotInformation";

const BuildingPermitRealProperty = (props) => {
  const { partner, service, moveNextStep } = props;

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("view-rpus");
  const [editmode, setEditmode] = useState("view")
  const [searchtype, setSearchtype] = useState("tdno");

	const [app, setApp] = useState();
	const [refno, setRefno] = useState(props.appno);
  const [rpus, setRpus] = useState([]);
  const [selectedItem, setSelectedItem] = useState()
  const [property, setProperty] = useState({})

  const viewInitial = () => {
    setRefno();
    setEditmode("edit");
    setMode("initial");
  }

  const findProperty = () => {
    const svc = Service.lookup( partner.id + ":OboOnlineService" );
    svc.findLocation( {refno }, (err, property) => {
      console.log("property", property)
      if (err) {
        setError(err);
      } else {
        if(property.owner.address.type == 'local' ) {
          property.owner.resident = 1;
        }
        else {
          property.owner.resident = 0;
        }
        if( property.owner.address.city ) property.owner.address.citymunicipality = property.owner.address.city;
        if( property.owner.address.municipality ) property.owner.address.citymunicipality = property.owner.address.municipality;
        property.owner.ctc = {};      //allocate ctc
        property.lotowned = 1;
        setProperty(property || {});
        setMode("view-lot");
      }
    });
  }

  const reloadList = () => {
    service.getRpus({appid: app.appid}, (err, rpus) => {
      if (err) {
        setError(err);
      } else {
        setRpus(rpus);
      }
    } );
  }

  const viewList = () => {
    reloadList();
    setMode('view-rpus');
  }

  const editOwnerInfo = props => {
    if(property.bill !== null && property.bill.amtdue != null &&  property.bill.amtdue > 0 ) {
      setError("Please settle all unpaid balances first before proceeding");
    } else {
      setError(null);
      setMode("edit-owner-info");
    }
  }

  return (
    <React.Fragment>
      <Panel visibleWhen={mode === "view-rpus"}>
        <Spacer />
        <Subtitle>Lot Information</Subtitle>
        <Table items={rpus} size="small" showPagination={false} >
          <TableColumn caption="TD No." expr="tdno" />
          <TableColumn caption="Title No." expr="titleno" />
          <TableColumn caption="PIN" expr="pin" />
          <TableColumn caption="Address" expr={item => `Lot: {item.lotno} Block: {item.blockno} Street:{item.street} Barangay: {item.barangay}`} />
          <TableColumn caption="Class" expr="classcode" />
          <TableColumn caption="Area" expr="areasqm" />
          <TableColumn caption="Owner" expr="owner.name" />
          <TableColumn>
            <Button caption="View" action={()=>{}} />
            <Button caption="Edit" action={()=>{}} />
            <Button caption="Remove" action={()=>{}} />
          </TableColumn>
        </Table>
        <ActionBar>
          <Button caption="Add Lot Info" action={viewInitial} />
          <Button caption="Next" action={moveNextStep} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === "initial"}>
        <Subtitle>Specify the Site Location/Property</Subtitle>
        <Spacer />
        <Error msg={error} />
        <Text caption="Tax Declaration No." value={refno} onChange={setRefno} />
        <ActionBar>
          <Button caption="Back to List" action={viewList} variant="text" />
          <Button caption="Search" action={findProperty} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === "view-lot"}>
        <p>Please check carefully if the information is correct. If not, please contact the Assessor's Office before proceeding.</p>
        <Label>
          <a href="mailto:assessor@filipizen.com?subject=Building Application Inquiry No: #{appid}&body=Please state your concern: ">[Click Here to Send Message] </a>
        </Label>

        {(property && property.appno)  &&
          <Label style={styles.balanceText}>
            Note: There is still an unpaid balance of <u>Php #{property.bill.amtdue}</u>.
            You can settle this by paying online <a  href="/partners/${partner.name}/services/rptis/billing#viewbill?refno=#{refno}" target="0"><u>here</u></a>
          </Label>
        }

        <FormPanel context={property} handler={setProperty}>
          <LotInformation editable={false} />
          <LotOwnershipType property={property} name="lotowned" row editable={false} />
          <OwnershipInfo name="owner" orgcode={partner.id} owner={property.owner} editable={false} />
        </FormPanel>
        <ActionBar>
          <BackLink action={viewInitial} caption='Back' visibleWhen={editmode === "edit" } />
          <Button action={editOwnerInfo} caption='Next'  visibleWhen={editmode == "edit"} />
          <Button action={viewList} caption='Back' visibleWhen={editmode === "view" } />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === "edit-owner-info"}>
        <Subtitle>Lot Owner Details</Subtitle>
        <p>Please update the information if necessary</p>
        <FormPanel context={property} handler={setProperty}>
          <LotOwnershipType name="lotowned" row />
          <OwnershipInfo name="owner" owner={property.owner} orgcode={partner.id} showIdEntry={true} />
        </FormPanel>
        <ActionBar>
          <BackLink action="viewLot" caption="Back" />
          <Button action="saveRpu" caption="Next" />
        </ActionBar>
      </Panel>
      <p>{JSON.stringify(property, null, 2)}</p>
    </React.Fragment>
  );
}

const styles = {
  balanceText: {
    color: "red",
    fontWeight: "bold",
  }
}

export default BuildingPermitRealProperty;

