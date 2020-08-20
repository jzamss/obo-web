<%
	def svc1 = Service.lookup("OboMiscListService", "obo");
	def list = svc1.getAncillaryPermitTypes();
%>


 <script>
\$put("ancillarylist", new function() {
	var self = this;
	this.mode;
	this.permits = {};
	this.permitList;
	this.selectedItem;

	var app = \$get("app").code;

	this.fetchPermitList = function() {
		self.permitList = app.service.getAncillaryPermits( {appid: app.appid } );
		for( var i=0; i < self.permitList.length; i++ ) {
			this.permits[ self.permitList[i].permittypeid ] = 1;
		}
		if( self.permitList.length > 0 ) {
			self.mode = "view";
		}
		else {
			self.mode = "select";
		}
	}

	this.onload = function() {
		self.fetchPermitList();
		app.updateStepNavbar();
	}

	this.saveAncillaryPermits = function() {
		var p = {
			appid: app.appid,
			permits: this.permits
		}
		app.service.saveAncillaryPermits( p );
		self.fetchPermitList();
		self._controller.refresh();
	}

	this.addAncillary = function() {
		this.mode = "select";
		self._controller.refresh();
	}

	this.lookupProfessional = function( fldname ) {
		var h = function(v) {
		  	self.selectedItem[fldname] = v;
		}
		return new PopupOpener( "professional_lookup", { appid: app.appid, onselect: h },
		  {width:'700', height:'300', title: 'Lookup Professional'}  )
	}

	this.lookupDesignProfessional = function() {
		return self.lookupProfessional( "designprofessional" )
	}

	this.lookupSupervisor = function() {
		return self.lookupProfessional( "supervisor" )
	}

	this.submitAncillary = function() {
		app.moveNextStep();
	}
});

</script>


<legend>Ancillary and Other Permits</legend>

<div r:context="ancillarylist" r:visibleWhen="#{mode=='select'}">
	<p>Select ancillary and other permits to apply for the project</p>
	<br>
	<%list.each {o-> %>
		<input type="checkbox" r:context="ancillarylist" r:name="permits.${o.objid}" r:checkedValue="1" r:uncheckedValue="0"/>&nbsp;&nbsp;${o.title}<br>
		<%}%>
	<br>
	<br>
	@wx:button( caption:'Next', context:'ancillarylist', name:'saveAncillaryPermits' )
</div>

<style>
	table tbody a{font-size:14px;}
</style>

<div r:context="ancillarylist" r:visibleWhen="#{mode=='view'}">
	<p>Specify all ancillary permit applications and print when finished</p>
	<table r:context="ancillarylist" r:items="permitList" r:varName="item" r:name="selectedItem" style="width:100%" class="customtable"
		cellpadding="0" cellspacing="0">
		<thead>
			<tr>
				<td class="ap-permit">Permit Type</td>
				<td class="ap-status">Status</td>
				<td class="ap-design">Design Professional</td>
				<td class="ap-supervisor">Supervisor In Charge</td>
				<td class="ap-view">Actions</td>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td class="ap-permit">#{item.type.title}</td>
				<td class="ap-status">#{item.state}</td>
				<td class="ap-design">#{item.designprofessional.name}</td>
				<td class="ap-supervisor">#{item.supervisor.name}</td>
				<td class="ap-view"><%def backtarget = PAGE.parentPath + "?appid="+ PARAMS.appid + "#" + PAGE.pagename;%>
						<a href="buildingpermit/ancillary?reftype=#{item.type.objid}&refid=#{item.objid}&backtarget=${backtarget}" class="link-edit-action">Edit</a>
				</td>
			</tr>
		</tbody>
	</table>

	<br>
	@wx:button( caption:'Change Permits to Include', context:'ancillarylist', name:'addAncillary')
	@wx:button( caption:'Next', context:'ancillarylist', name:'submitAncillary')
</div>




