<script>
\$put("confirm", new function() {
	
	var self = this;
	this.error;
	this.mode = "initial";
	this.info;	

	var app = \$get("app").code;
	this.orgname = app.orgname;
	this.appid = app.appid;
	this.selectedItem;

	this.onload = function() {
		var svc = Service.lookup("OnlineBuildingPermitService", "obo");	
		this.info = svc.getApplication({appid: this.appid});
		app.updateStepNavbar();	
	}

	this.finish = function() {
		if(!confirm("You are about to complete this application. Once submitted you cannot make any more changes. Continue?")) return;
		app.service.moveNextStep( {appid: self.appid } );
		window.location.reload();
	}
});
</script>

<style>
	.caption-class {
		width:200px;
	}
</style>

<div r:context="confirm" r:visibleWhen="#{mode == 'initial'}">
	<div class="form">
		<legend>Confirm</legend>
		<label r:context="confirm" style="font-weight:normal;padding-bottom:20px;">
		Please check the application information carefully before sending data. You can go back and edit 
		the information. Once ready, click on Finish to complete the application. 	
		</label>
	</div>
	
	  @wx:label(caption:'Tracking No', context:'confirm', expr:'#{info.objid}')
	  @wx:label(caption:'Applicant', context:'confirm', expr:'#{info.applicant.name}')  	
	  @wx:label(caption:'Applicant Address', context:'confirm', expr:'#{info.applicant.address.text}')  	
	  @wx:label(caption:'Project Location', context:'confirm', expr:'Lot No. #{info.location.lotno}, Block No:#{info.location.blockno} #{info.location.street} #{info.location.barangay.name}')

	  @wx:label(caption:'Project Title', context:'confirm', expr:'#{info.title}')
	  @wx:label(caption:'Project Description', context:'confirm', expr:'#{info.description}')
	  @wx:label(caption:'Occupancy Type', context:'confirm', expr:'#{info.occupancytype.title}')

     <div style="padding-top:20px"></div>
	@wx:button(caption: 'Finish', context:'confirm', name: 'finish')
</div>

