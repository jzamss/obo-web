<script type="text/javascript">
\$put("location", new function(){
	var self = this;
	this.mode = "initial";
	this.refno ;
  this.prop;
  this.rpus = [];
  this.searchtype = "tdno";
  this.selectedItem;
  this.editmode;
  this.barangayList;

	var app = \$get("app").code;

  this.appid = app.appid;

  this.findProperty = function() {
    var svc = Service.lookup( app.orgcode + ":OboOnlineService" );
    return svc.findLocation( {refno: self.refno}, function(s,o) {
      if( s.status == "ERROR" ) {
        alert("Error " + s.msg);
      }
      else {
        self.mode = "view-lot";
        self.prop = o;
        if(self.prop.owner.address.type == 'local' ) {
          self.prop.owner.resident = 1;
        }
        else {
          self.prop.owner.resident = 0;
        }
        if( self.prop.owner.address.city ) self.prop.owner.address.citymunicipality = self.prop.owner.address.city;
        if( self.prop.owner.address.municipality ) self.prop.owner.address.citymunicipality = self.prop.owner.address.municipality;        
        self.prop.owner.ctc = {};      //allocate ctc
      }
      self._controller.refresh();
    });
  }

  this.reloadList = function() {
    self.rpus = app.service.getRpus( {appid: app.appid} );
  }

  this.viewList = function() {  
    self.reloadList();
    self.mode = 'view-rpus'; 
  }

  this.onload = function() {
    //check if there is a location set.
    self.viewList();
    app.updateStepNavbar();
  }

  this.viewInitial = function() { self.refno=""; self.editmode = "edit"; self.mode = "initial";}
  this.viewLot = function() { self.mode = "view-lot";}  
  
  this.editOwnerInfo = function() {
    if(self.prop.bill !=null && self.prop.bill.amtdue !=null &&  self.prop.bill.amtdue > 0 ) {
      throw new Error("Please settle all unpaid balances first before proceeding");
    }
    self.mode = "edit-owner-info"; 
    if(!self.barangayList) {
      var bsvc = Service.lookup("CloudPartnerService", "partner");
      self.barangayList =  bsvc.getBarangayList( {orgcode: app.orgcode} );     
    }
    if(self.prop.owner.resident == null )self.prop.owner.resident = 1;
    if(!self.prop.owner.address.citymunicipality) self.prop.owner.address.citymunicipality = app.orgname;
    if(!self.prop.owner.address.province) self.prop.owner.address.province = app.province;
  }

  this.saveRpu = function() {
    if( !self.prop.owner.id ) {
      throw new Error("Please provide proof of identity for owner/administrator of property");
    }
    self.prop.appid = app.appid;
    app.service.saveRpu( self.prop );
    self.reloadList();
    self.mode = 'view-rpus';
  }

  this.attachId = function() {
    var h = function(v) {
      self.prop.owner.id = v;
      self._controller.refresh();
    }
    return new PopupOpener( "id_entry", { onselect: h, entry: self.prop.owner.id },  {width:'500', title:'Select Proof of Identity'} );
  }

  this.viewInfo = function() {
    if(!self.selectedItem) throw new Error("Please select an item");
    self.prop = self.selectedItem;
    self.mode = "view-lot";
    self.editmode = "view";
  }

  this.editInfo = function() {
    if(!self.selectedItem) throw new Error("Please select an item");
    self.prop = self.selectedItem;
    self.editOwnerInfo();
  }

  this.removeRpu = function() {
    if(!self.selectedItem) throw new Error("Please select an item");
    var c = confirm("Are you sure you want to remove this property?");
    if(!c) return;
    var s = self.selectedItem;
    app.service.removeRpu( {objid: s.objid} );
    self.reloadList();
  }

  this.moveNextStep = function() {
    if(self.rpus.length == 0 )  {
      throw new Error( "Please include at least one property in the project");
    }
    else {
      app.moveNextStep(  {appid: app.appid } );
    }
  }

});

\$register( {id:'id_entry',  page:"${PAGE.parentPath}/id_entry", context: 'id_entry' } );
</script>


<style>
  .form{width:100%; height:100%;padding-bottom:20px;}
  .section{float:left;display:inline-block;}
  .pl10 { padding-left:20px; }
  .output-class { font-weight:normal;}
  .input-class { font-weight:normal;}  
  .caption-class {width:150px;}
  .attachId { color:blue; }
  .wStreet { width: 450px;}
</style>

<div  r:context="location" r:visibleWhen="#{mode=='view-rpus'}" style='display:none'>
  <legend>Lot Information</legend>
  <table r:context="location" r:items="rpus" r:varName="item"  r:name="selectedItem" width="100%" class="customtable">
    <thead>
      <tr>
        <td style="width:100px;">TD No</td>
        <td style="width:60px;">Title No</td>        
        <td style="width:160px;">PIN</td>
        <td style="width:50px;">Address</td>
        <td style="width:40px;">Class</td>
        <td style="width:100px;">Area (sqm)</td>        
        <td style="width:130px;">Owner</td>
        <td>Actions</td>
      </tr>
    </thead>
    <tbody>
        <tr>
          <td style="width:100px;">#{item.tdno}</td>
          <td style="width:60px;">#{item.titleno}</td>        
          <td style="width:160px;">#{item.pin}</td>
          <td style="width:50px;">Lot:#{item.lotno} Block:#{item.blockno} Street:#{item.street} Barangay: #{item.barangay}</td>
          <td style="width:40px;">#{item.classcode}</td>
          <td style="width:100px;">#{item.areasqm}</td>        
          <td style="width:130px;">#{item.owner.name}</td>
          <td>
            <a href="#" r:context="location" r:name="viewInfo" class="link-edit-action">View</a> 
            &nbsp;&nbsp;
            <a href="#" r:context="location" r:name="editInfo" class="link-edit-action">Edit</a> 
            &nbsp;&nbsp;
            <a href="#" r:context="location" r:name="removeRpu" class="link-edit-action">Remove</a>
          </td>
        </tr>
    </tbody>
  </table>  
  <br>
  <br>
  @wx:button( context:'location', name:'viewInitial', caption: 'Add Lot Info')
  @wx:button( context:'location', name:'moveNextStep', caption: 'Next' )
</div>

<div r:context="location" r:visibleWhen="#{mode=='initial'}" style='display:none'>
  <div class="subtitle">Specify the Site Location/Property</div>
  <div class="form">
    @wx:text( caption:'Tax Declaration No.', context:'location', name:'refno', captionClass:'+w100' )
  </div>
  @wx:button( context:'location', name:'viewList', caption: 'Back to List' )
  @wx:button( context:'location', name:'findProperty', caption: 'Search' )

  <div style="padding-top:20px;">
    Cant remember the tax declaration number? Click <a href="/partners/${PARAMS.name}/services/rptis/searchproperty" 
    target="rptis/searchproperty"><u>here</u></a> to search your property.
  </div>
</div>

<div r:context="location" r:visibleWhen="#{mode=='view-lot'}" style='display:none'>
    <p>Please check carefully if the information is correct. If not, please contact the Assessor's Office before proceeding.<br>
    <label r:context="location">
      <a href="mailto:assessor@filipizen.com?subject=Building Application Inquiry No: #{appid}&body=Please state your concern: ">[Click Here to Send Message] </a></p>
    </label>

    <div class="form">
      <div style="min-width:60px;border:1px solid grey;width:710px; padding:10px;margin-bottom:15px;" r:context="location" r:visibleWhen="#{prop.bill!=null && prop.bill.amtdue > 0 }">
        <div style="padding-bottom:10px;">
          <label r:context="location" style="color:red;font-weight:bold;">
            Note: There is still an unpaid balance of <u>Php #{prop.bill.amtdue}</u>.
            You can settle this by paying online <a  href="/partners/${PARAMS.name}/services/rptis/billing#viewbill?refno=#{refno}" target="0"><u>here</u></a>
          </label>
        </div>
        <div>
          <label r:context="location">
            <div>To request for tax clearance, click <a  href="/partners/${PARAMS.name}/services/rptis/rptclearance?refno=#{refno}" target="0">here</a> </div>
            <div>To request for certificate of true copy, click <a  href="/partners/${PARAMS.name}/services/rptctc?refno=#{refno}" target="0">here</a> </div>
          </label>
        </div>
      </div>  

      <h2>Lot Information</h2>

      <div>
        @wx:label( caption:'PIN', context:'location', expr:'#{prop.pin}' )
        @wx:label( caption:'Lot No', context:'location', expr:'#{prop.lotno}')
        @wx:label( caption:'Block No', context:'location', expr:'#{prop.blockno}')
        @wx:label( caption:'Street', context:'location', expr:'#{prop.street}' )
        @wx:label( caption:'Barangay', context:'location', expr:'#{prop.barangay}' )
        @wx:label( caption:'Area &#40;Sqm&#41;', context:'location', expr:'#{prop.areasqm}' )
        @wx:label( caption:'TD No', context:'location', expr:'#{prop.tdno}')
        @wx:label( caption:'Title No', context:'location', expr:'#{prop.titleno}' )
        @wx:label( caption:'Class Code', context:'location', expr:'#{prop.classcode}' )
      </div>

      <h2 style="padding-top:20px;">Lot ownership</h2>
      <div style="padding-bottom:10px;">
        <input type="radio" r:context="location" r:name="prop.lotowned" value="1" disabled>&nbsp;Lot Owned &nbsp;&nbsp;
        <input type="radio" r:context="location" r:name="prop.lotowned" value="0" disabled>&nbsp;Leased &nbsp;&nbsp;          
      </div>

     <h2 style="padding-top:20px;">Lot Owner Information</h2>
     <div>
          @wx:label( caption:'Profile No', context:'location', expr:'#{prop.owner.profileno}' )              
          @wx:label( caption:'Type', context:'location', expr:'#{prop.owner.entitytype}' )
          <div r:context="location" r:visibleWhen="#{prop.owner.entitytype != 'INDIVIDUAL' }">
            @wx:label( caption:'Lot Owner Name', context:'location', expr:'#{prop.owner.name}')
            <div style="padding-top:20px;padding-bottom:10px;">
            Name of administrator/contact of property owner  
            </div>
          </div>
          @wx:label( caption:'Last Name', context:'location', expr:'#{prop.owner.lastname}' ) 
          @wx:label( caption:'First Name', context:'location', expr:'#{prop.owner.firstname}' )
          @wx:label( caption:'Middle Name', context:'location', expr:'#{prop.owner.middlename}')
          @wx:address_nonlocal( caption:'Address', context:'location', name:'prop.owner.address', readonly:true)
      </div>
    </div> 

    @wx:button( context:'location', name:'viewInitial', caption: 'Back', visibleWhen:'#{editmode == \'edit\' }', attrs:[immediate:true]  )
    @wx:button( context:'location', name:'editOwnerInfo', caption: 'Next' , visibleWhen:'#{editmode == \'edit\' }')
    @wx:button( context:'location', name:'viewList', caption: 'Back', visibleWhen:'#{editmode == \'view\' }', attrs:[immediate:true] )
</div>

<div  r:context="location" r:visibleWhen="#{mode=='edit-owner-info'}" style='display:none'> 
  <h2>Lot Owner Details</h2>
  <p>Please update the information if necessary</p>
  <div class="form">
    <div style="padding-bottom:10px;">
      <div>Lot ownership</div>
      <input type="radio" r:context="location" r:name="prop.lotowned" value="1">&nbsp;Lot Owned &nbsp;&nbsp;
      <input type="radio" r:context="location" r:name="prop.lotowned" value="0">&nbsp;Leased &nbsp;&nbsp;          
    </div>

    @wx:label( caption:'Profile No', context:'location', expr:'#{prop.owner.profileno}', captionClass:'+w200' )
    @wx:label( caption:'Type', context:'location', expr:'#{prop.owner.entitytype}' )  
    <div  r:context="location" r:visibleWhen="#{prop.owner.entitytype != 'INDIVIDUAL' }">  
      @wx:label( caption:'Name', context:'location', expr:'#{prop.owner.name}' , captionClass:'+w200')  
      <div style="padding-top:20px;padding-bottom:10px;">
            Name of administrator/contact of property owner  
      </div>
    </div>
    @wx:text( caption:'Last Name', context:'location', name:'prop.owner.lastname', required:true, inputClass: '+w200', captionClass:'+w200')
    @wx:text( caption:'First Name', context:'location', name:'prop.owner.firstname',required:true, inputClass: '+w200', captionClass:'+w200')
    @wx:text( caption:'Middle Name', context:'location', name:'prop.owner.middlename', inputClass: '+w200', captionClass:'+w200')

    @wx:email( context:'location', name:'prop.owner.email', inputClass: '+w200', captionClass:'+w200')
    @wx:mobile(context:'location', name:'prop.owner.mobileno', inputClass: '+w200', captionClass:'+w200' )

    @wx:radiolist( caption:'Resident', context:'location', name:'prop.owner.resident', items: [ [key:'1', value:'Resident'], [key:'0', value:'Non-resident' ] ] )
     @wx:address_local( caption: 'Address', context:'location', name:'prop.owner.address', depends: 'prop.owner.resident', visibleWhen: '#{ prop.owner.resident != \'0\' }', required:true )
    @wx:address_nonlocal( caption: 'Address', context:'location', name:'prop.owner.address', depends: 'prop.owner.resident', visibleWhen: '#{ prop.owner.resident == \'0\' }', required:true )
    <br>
    <br>
    @wx:idproof( context:'location', name:'prop.owner.id', action:'attachId' )
  </div>

  @wx:button( context:'location', name:'viewLot', caption: 'Back', attrs:[immediate:true] )   
  @wx:button( context:'location', name:'saveRpu', caption: 'Next' )
</div>


