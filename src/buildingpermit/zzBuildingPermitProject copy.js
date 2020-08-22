import React, {useState} from "react";
import {
    DataForm,Radio,Label,CheckBox,Text,Panel,ActionBar,Link,Button,RadioList,
    Decimal,Integer
} from "rsi-react"

const SpecifyAppType = (props) => {
  const { handler } = props;
  const [appType, setAppType] = useType("NEW");

  <Panel>
    <Label>Select Application Type</Label>
    <Radio label="New Construction" name="apptype" value="NEW" />
    <Radio label="Renovation" name="apptype" value="RENOVATION" />
    <Radio label="Demolition" name="apptype" value="DEMOLITION" />
  </Panel>
  <ActionBar>
    <Link  />
    <Button label="Next" onclick={ handler(appType) } />
  </ActionBar>
}

const SpecifyWorkType = (props) => {
  const { handler } = props;
  let worktypes = [];

  const addType = (worktype, checked) => {
    if(checked) {
      worktypes.push( worktype );
    }
    else {
      worktypes.remove( worktype );
    }
  }

  <Panel>
    <Label>Select Application Type</Label>
    <CheckBox label="ADDITION" value="ADDITION" handler={addType}/>
    <CheckBox label="ALTERATION" value="ALTERATION" handler={addType}/>
    <CheckBox label="DEMOLITION" value="DEMOLITION" handler={addType}/>
    <CheckBox label="ORIGINAL" value="ORIGINAL" handler={addType}/>
    <CheckBox label="RENOVATION" value="RENOVATION" handler={addType}/>
  </Panel>
  <ActionBar>
    <Link />
    <Button label="Next" onclick={ handler(worktypes) } />
  </ActionBar>
}

const SpecifyOccupancyType = (props) => {
    const {handler, occupancytype} = props;
    const [step, setStep ] = useType(0);
    const svc = Service.lookup("obo/OboMiscListService");
    let typeGroup;
    let typeDivision;
    let occupancytype;

    if(occupancytype) {
      typeGroup = occupancytype.group;
      typeDivision = occupancytype.division;
      setStep(2);
    }
    else {
      setStep(0);
    }

    const moveBackStep = () => {
      step = (step<0)? 0: step - 1;
      setStep(step);
    }

    const moveNextStep = () => {
      step = step + 1;
      if( step > 2 ) {
        handler( occupancytype );
      }
      else {
        setStep(step);
      }
    }

    const getOccTypeGroups = () => {
      return svc.getOccupancyTypeGroups();
    }

    const getOccTypeGroups = () => {
      return svc.getOccupancyTypeDivisions( {groupid: typeGroup } );
    }

    const getOccTypes = () => {
      return svc.getOccupancyTypes( {divisionid: typeDivision} );
    }

    <RadioList list={getOccTypes()} name="typeGroup" visible={step===0}/>
    <RadioList list={getOccTypeGroups()} name="typeDivision" visible={step===1}/>
    <RadioList list={ getOccTypes() } name="occupancytype" visible={step===2}/>

    <ActionBar>
        <Link label="Back" onclick=""/>
        <Button label="Next" onclick={moveNextStep()}/>
    </ActionBar>
}

const BuildingPermitProject = (props) => {
  const {appService, moveNextStep} = props;

  const [step, setStep] = useType(0);
  let project = {numunits: 1};

  const setAppType =(appType) => {
    project.apptype = appType;
    setStep(1);
  }
  const setWorkType =(worktypes) => {
    project.worktypes = worktypes;
    setStep(2);
  }
  const setOccupancyType =(occupancytype) => {
    project.occupancytype = occupancytype;
    setStep(3);
  }

  const updateProject = () => {
     appService.updateProjectInfo( project );
  }

  <SpecifyAppType visible={ step === 0 } handler={setAppType}/>
  <SpecifyWorkType visible={ step === 1 } handler={setWorkType}/>
  <SpecifyOccupancyType visible={ step === 2 } handler={setOccupancyType}/>

  <DataForm context={project} visible={ step > 2 }>
    <Label>Project Details</Label>
    <Text label='Project Title' name='title' required={true}/>
    <Text label='Project Description' name='description' required={true}/>
    <Spacer/>
    <Integer label="No of Units" name="numunits" required/>
    <Decimal label="Total Floor Area [sq.meter]" name="totalfloorarea" />
    <Decimal label="Building Height [meter]" name="height" />
    <Integer label="No of Storeys" name="numfloors" />

    <Spacer/>
    <Decimal label="Estimated Cost [Php]" name="projectcost" />
    <Date label="Proposed Construction Date" name="dtproposedconstruction" />
    <Date label="Expected Completion Date" name="dtexpectedcompletion" />
  </DataForm>

  <ActionBar>
      <Link label="Back" onclick=""/>
      <Button label="Next" onclick={updateProject()}/>
  </ActionBar>

}
