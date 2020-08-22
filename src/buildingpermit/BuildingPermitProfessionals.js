import React, { useState, useEffect } from "react";
import {
  ActionBar,
  Button,
  Panel,
  Error,
  Subtitle,
  MsgBox,
  Table,
  TableColumn,
  DeleteButton,
  EditButton,
  FormPanel,
  Text,
  Label,
  BackLink,
  Spacer,
} from "rsi-react-web-components";

import { Person, IdEntry } from "rsi-react-filipizen-components";

import ProfessionalList from "../components/ProfessionList";

const initialProfessional = {
  entity: {resident: 1},
}

const BuildingPermitProfessionals = ({
  partner,
  appno,
  appService,
  moveNextStep
}) => {

  const [error, setError] = useState();
  const [errors, setErrors] = useState({});
  const [confirm, setConfirm] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState();
  const [action, setAction] = useState();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("initial");
  const [professionals, setProfessionals] = useState([]);
  const [professional, setProfessional] = useState(initialProfessional);

  const loadProfessionals = () => {
    setLoading(true);
    appService.getProfessionalList({appid: appno}, (err, professionals) => {
      if (err) {
        setError(errr)
      } else {
        setProfessionals(professionals);
        setLoading(false);
      }
    });
  }

  useEffect(() => {
    if (mode === "list") {
      loadProfessionals();
    }
  }, [mode]);

  const viewList = () => {
    setMode("list");
  }

  const viewInitial = () => {
    setMode("initial");
  }

  const addNewEntry = () => {
    setProfessional(initialProfessional)
    setMode("add-edit-entry");
  }

  const editItem = (item) => {
    console.log("EDITITEM", item)
    appService.getProfessional({objid: item.objid}, (err, professional) => {
      if (err) {
        setError(err)
      } else {
        setProfessional(professional);
        setMode("add-edit-entry");
      }
    });
  }

  const confirmDelete = (item) => {
    setProfessional(item);
    setConfirm(true);
    setAction("delete");
    setConfirmMessage("Delete selected item?");
  }

  const cancelConfirm = () => {
    setConfirm(false);
  }

  const removeItem = () => {
    appService.removeProfessional(professional, (err, item) => {
      if (err) {
        setError(err)
      } else {
        loadProfessionals();
      }
      setConfirm(false);
    });
  }

  const findRefno = () => {
    setErrors({});
    if (!professional.idno) {
      setErrors({idno: "Kindly specify a PRC No."});
    } else {
      //TODO: service
      setMode("entry-not-found");
    }
  }

  const cancelEdit = () => {
    setMode("list");
  }

  const save = () => {
    setLoading(true);
    setError(null);
    const prof = {...professional, appid: appno};
    appService.saveProfessional(prof, (err, professional) => {
      if (err) {
        setError(err);
      } else {
        setProfessional(professional);
        setMode("list")
      }
      setLoading(false);
    });
  }

  const actionHandlers = {
    delete: removeItem,
  }

  const confirmHandler = actionHandlers[action];

  return (
    <Panel>
      <Subtitle>List Licensed Professionals</Subtitle>
      <Error msg={error} />
      <MsgBox type="confirm" msg={confirmMessage}
        open={confirm}
        onAccept={confirmHandler}
        onCancel={cancelConfirm}
      />

      <Panel visibleWhen={mode === "initial"}>
        <FormPanel context={professional} handler={setProfessional}>
          <p>
          Specify technical person involved who will require signature
          on the project (e.g. architect, civil engineer, etc):
          </p>
          <Text name="idno" caption="Search PRC No." error={errors.idno} fullWidth={false} variant="outlined"/>
          <ActionBar>
            <BackLink caption="Go to List" action={viewList} />
            <Button caption="Next" action={findRefno} />
          </ActionBar>
        </FormPanel>
      </Panel>

      <Panel visibleWhen={mode === "entry-not-found"}>
        <Label>
          <p>Name with PRC No <b>#{professional.idno}</b> not found.</p>
        </Label>
        <ActionBar>
          <BackLink caption="Cancel" action={viewInitial} />
          <Button caption="Add New" action={addNewEntry} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === "list"}>
        <Table items={professionals} size="small" showPagination={false} >
          <TableColumn caption="PRC No." expr="prc.idno" />
          <TableColumn caption="Profession" expr="profession" />
          <TableColumn caption="Name" expr="entity.name" />
          <TableColumn caption="Address" expr="entity.address.text" />
          <TableColumn>
            <Panel row>
              <EditButton action={editItem} size="small" />
              <DeleteButton action={confirmDelete} size="small" />
            </Panel>
          </TableColumn>
        </Table>
        <ActionBar>
          <Button caption="Add New Entry" action={addNewEntry} />
          <Button caption="Next" action={moveNextStep} />
        </ActionBar>
      </Panel>

      <Panel visibleWhen={mode === "add-edit-entry"}>
        <FormPanel context={professional} handler={setProfessional}>
          <p>Please fill in the necessary data below. Text marked with * are required fields. </p>
          <ProfessionalList name="profession" required={true} />
          <Person name="entity" person={professional.entity} showAddress={true} orgcode={partner.id} />
          <Spacer />
          <IdEntry caption="Professional Regulation Commission [PRC]" name="prc" showIdTypes={false} />
          <IdEntry caption="Professional Tax Receipt [PTR]" name="ptr" showIdTypes={false} />
          <ActionBar>
            <BackLink caption="Cancel" action={cancelEdit} />
            <Button caption="Save and Add to List" action={save} />
          </ActionBar>
        </FormPanel>
      </Panel>
    </Panel>
  )
}

export default BuildingPermitProfessionals;
