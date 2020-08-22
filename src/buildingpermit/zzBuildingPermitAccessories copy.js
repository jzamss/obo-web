<%
	//if there is accessories list. display the accessories. Do not display the occupancy types
	//if the accessory is the same as occupancy type of the building, do not display the redo button
	//if there are no accessories, display the occupancy types for selection

	def oboSvc = Service.lookup("OnlineBuildingPermitService", "obo");
	def accessoryList = oboSvc.getAccessories( [appid: PARAMS.appid ] );

	boolean buildingIsAccessory = false;
	boolean hasItems = false;
	def infoList;
	def occupancyTypes = [];

	if( accessoryList ) {
		infoList = [];
		accessoryList.each { ac ->
			if( ac.app.occupancytypeid == ac.occupancytypeid ) {
				buildingIsAccessory = true;
			}
			infoList.addAll( ac.infos );
		}
		hasItems = true;
	}
	else {
		def svc = Service.lookup("OboMiscListService", "obo");
		occupancyTypes = svc.getAccessoryOccupancyTypes();
		hasItems = false;
	}
%>

<!-- comment script here -->
<script>
\$put("accessories", new function() {
	var self = this;
	//load accessories
	var app = \$get("app").code;

	<%if( hasItems == false ) {%>
	this.accessoryTypes = {};
	<%occupancyTypes.each { ot ->%>
	this.accessoryTypes.${ot.objid.toLowerCase()} = 0;
	<%}%>
	this.saveAndContinue = function() {
		var items = [];
		var deleted = [];
		for( var prop in self.accessoryTypes ) {
			if( self.accessoryTypes[prop] == 1 ) {
				items.push( prop );
			}
			else {
				deleted.push(prop);
			}
		}
		if( items.length > 0 ) {
			var p = {};
			p.appid = app.appid;
			p.items = items;
			p.deleted = deleted;
			app.service.saveAccessories( p );
			window.location.reload();
		}
		else {
			if( deleted.length > 0 ) {
				var p = {};
				p.appid = app.appid;
				p.items = [];
				p.deleted = deleted;
				app.service.saveAccessories( p );
			}
			app.moveNextStep();
		}
	}
	<%}%>

	<%if( hasItems == true ) {%>
	this.infoMap = {};
	<%infoList.each { o-> %>
	this.infoMap.${o.name.toLowerCase()} = ${o.value == null ? null : o.value};
	<%}%>
	this.saveAccesoryInfos = function() {
		var p = {appid: app.appid };
		p.infos = [];
		for( var prop in self.infoMap ) {
			p.infos.push( {name: prop, value: self.infoMap[prop ] } );
		}
		app.service.saveAccessoryInfos( p );
		app.moveNextStep();
	}
	this.redoSelection = function() {
		var b = confirm("Unchecking will remove the accessory information already encoded. Continue anyway?");
		var deleted = [];
		<%accessoryList.each { o->%>
		deleted.push("${o.occupancytypeid}");
		<%}%>
		app.service.saveAccessories( {appid: app.appid, deleted: deleted } );
		window.location.reload();
	}
	<%}%>

	this.onload = function() {
		app.updateStepNavbar();
	}

});
</script>

<legend>Accessories</legend>
<%if(hasItems == false ) {%>
	<div>
		<div style="padding-bottom:10px;">Select accessory to add if applicable</div>
		<%occupancyTypes.each { o-> %>
			<div>
				<input type="checkbox" r:context="accessories" r:name="accessoryTypes.${o.objid.toLowerCase()}" r:checkedValue="1" r:uncheckedValue="0"/>
				<span style="text-transform:capitalize;">${o.title}</span>
			</div>
		<%}%>
		<div style="padding-top:20px"></div>
		@wx:button( caption:'Next', context:'accessories', name:'saveAndContinue' )
	</div>
<%}%>

<%if(hasItems == true ) {%>
	<div>
		<% accessoryList.each { o-> %>
			<div style="padding-top:20px; text-transform:capitalize;">
				<b>${o.type.title}</b>
			</div>
			<% o.infos.each { x-> %>
				<div style="padding-left:20px">
					<label style="width:300px;font-weight:normal;text-transform:capitalize;">${x.caption.toLowerCase()} (${x.unit})</label>
					<input type="text" r:context="accessories" r:name="infoMap.${x.name.toLowerCase()}" r:datatype="${x.datatype}" style="width:100px"/>
				</div>
			<%}%>
		<%}%>
		<div style="padding-top:20px"></div>
		<%if( buildingIsAccessory == false ) {%>
			@wx:button( caption:'Redo', context:'accessories', name:'redoSelection' )
		<%}%>
		@wx:button( caption:'Next', context:'accessories', name:'saveAccesoryInfos' )
	</div>
<%}%>

