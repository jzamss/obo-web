const BuildingPermitAddProfessional = (props) => {
  let professional = { entity: {address: {barangay:{}}, resident: 1} };
  const professionList = [
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

  const saveProfessional = () => {
    appService.saveProfessional( professional );
  }

}

const BuildingPermitProfessionals = (props) => {
  const {appno, appService, moveNextStep } = props;

  const [mode, setMode] = useState("list");
  const professionalList =  appService.getProfessionalList( {appid: appno } );
  let selectedItem;

  setMode("list");

  const addNewEntry = () => {
    setMode("edit");    
  }
  const editItem = () => {
    setMode("edit");    
  }
  const removeItem = () => {
    appService.removeProfessional( selectedItem );
    setMode("edit");
  }

  <BuildingPermitAddProfessional visible={mode === "edit"} />

  <DataTable items={ professionalList } visible={mode==="list"}>
    <Column label="PRC No" name="prc.idno" />
    <Column label="Profession" name="profession" />
    <Column label="Name" name="entity.name" />
    <Column label="Address" name="entity.address.text" />
    <Column>
      <Link label="Edit" onClick={editItem()} />
      <Link label="Remove" onClick={removeItem()} />
    </Column>
  </DataTable>

  <Button label="Add New Entry" onClick={addNewEntry()} visible={mode==="list"}/>
  <ActionBar>
    <Button label="Next" onClick={moveNextStep()} visible={mode==="list"}/>
  </ActionBar>

}  

  /*
  this.onload = function() {
    loadList();
    self.mode = "view-list";
    app.updateStepNavbar();
  }

  this.attachPRC = function() {
    var h = function(v) {
      self.prof.prc = v;
      self._controller.refresh();
    }
    var p = { onselect:h, idtype:'prc', idtitle:'Professional Regulation Commission', idcaption:'PRC No', show_validitydate: 'true' }
    var pop = new PopupOpener( "id_entry", p , {width:'500', title:'Professional Regulation Commission'} ); 
    return pop;
  }

  this.attachPTR = function() {
    var h = function(v) {
      self.prof.ptr = v;
      self._controller.refresh();
    }
    var p = { onselect: h, idtype:'ptr', idtitle:'Professional Tax Receipt', idcaption:'PTR No'}    
    return new PopupOpener( "id_entry", p,  {width:'500', title:'Professional Tax Receipt'} );
  }


});

\$register( {id:'id_entry',  page:"${PAGE.parentPath}/id_entry", context: 'id_entry' } );
</script>

<style>
  .caption-class { width: 200px;}
  .subcaption-class { width : 100px; }
</style>


<legend>List of Licensed Professionals</legend>

<div r:context="professional" r:visibleWhen="#{mode=='initial'}">
	<p style="padding-bottom:10px">Specify technical persons involved who will require signature on the project (e.g. architect, civil engineer, etc):</p> 
  <div class="form">
    @wx:text(caption:'Search PRC No', context:'professional', name:'idno', required: true, captionClass: '+w150')
  </div>
  @wx:button( caption:'Next', context:'professional', name:'findRefno')
</div>

<div r:context="professional" r:visibleWhen="#{mode=='entry-not-found'}">
  <div  style="padding-bottom:10px">
    <label r:context="professional"> 
      <p>Name with PRC No <b>#{idno}</b> not found. Add New Entry?</p> 
    </label>
  </div>
  @wx:button( caption:'Cancel', context:'professional', name:'viewInitial')
  @wx:button( caption:'Add New', context:'professional', name:'addNew')
</div>

<div  r:context="professional" r:visibleWhen="#{mode == 'view-list'}">
  <table r:context="professional" r:items="professionalList" r:varName="item" r:name="selectedItem"  style="width:100%" class="customtable">
    <thead>
      <tr>
        <td class="lp-prcno">PRC No</td>
        <td class="lp-profession">Profession</td>        
        <td class="lp-name">Name</td>
        <td class="lp-address">Address</td>
        <td class="lp-action">Actions</td>        
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="lp-prcno">#{item.prc.idno}</td>
        <td class="lp-profession">#{item.profession}</td>        
        <td class="lp-name">#{item.entity.name}</td>
        <td class="lp-address">#{item.entity.address.text}</td>
        <td class="lp-action">
          <a href="#" r:context="professional" r:name="editItem" class="link-edit-action">Edit</a> 
          &nbsp;&nbsp;
          <a href="#" r:context="professional" r:name="removeItem" class="link-edit-action">Remove</a> 
        </td>
      </tr>
    </tbody>
  </table>
  <br>
  @wx:button( caption:'Add New Entry', context:'professional', name:'addNew')
  @wx:button( caption:'Next', context:'professional', name:'finish')
</div>


<div r:context="professional" r:visibleWhen="#{mode=='edit-entry'}" style="display:none">
  <p>Please fill in the necessary data below. Text marked with * are required fields. </p>
  <div class="form">
    @wx:combo(caption:'Primary Profession', context:'professional', name:'prof.profession', required: true, inputClass:'+w250', 
      attrs:[items:'professions', emptyText:'-', allowNull: true ])
    @wx:text(caption:'Last Name', context:'professional', name:'prof.entity.lastname', required: true, hint:'Last Name')
    @wx:text(caption:'First Name', context:'professional', name:'prof.entity.firstname', required: true, hint:'First Name' )
    @wx:text(caption:'Middle Name', context:'professional', name:'prof.entity.middlename', required: true, hint:'Middle Name')

    @wx:radiolist( caption:'Resident', context:'professional', name:'prof.entity.resident', required:true, items: [ [key:'1', value:'Resident'], [key:'0', value:'Non-resident' ] ] )
    @wx:address_local( caption: 'Address', context:'professional', name:'prof.entity.address', depends: 'prof.entity.resident', visibleWhen: '#{ prof.entity.resident == \'1\' }', required:true )
    @wx:address_nonlocal( caption: 'Address', context:'professional', name:'prof.entity.address', depends: 'prof.entity.resident', visibleWhen: '#{ prof.entity.resident == \'0\' }', required:true )

    @wx:email(context:'professional', name:'prof.entity.email')
    @wx:mobile(context:'professional', name:'prof.entity.mobileno' )

    <br>
    @wx:idproof( context:'professional', name:'prof.prc', action:'attachPRC', caption:'Professional Regulation Commission [PRC]' )
    <br>
    @wx:idproof( context:'professional', name:'prof.ptr', action:'attachPTR', caption: 'Professional Tax Receipt [PTR]' )

  </div>  
  @wx:button( caption:'Cancel', context:'professional', name:'cancelEdit', attrs:[immediate:true])
  @wx:button( caption:'Save and Add To List', context:'professional', name:'save')
</div>
*/
