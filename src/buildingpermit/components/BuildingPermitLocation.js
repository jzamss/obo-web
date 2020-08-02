const BuildingPermitLocation = (props) => {
  const {appno, appService, moveNextStep } = props;

  const location = appService.getLocation( {appid: appno } );

  const updateLocation = () => {
     appService.saveLocation( location ); 
     moveNextStep(); 
  }

  <DataForm context={location}>
    <LocalAddress includeBuilding={false} editable={true}/>
  </DataForm>

  <ActionBar>
    <Button label="Next" onclick={ updateLocation() } />
  </ActionBar>

}  

