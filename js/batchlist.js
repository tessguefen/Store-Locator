function StoreLocator_Batchlist() {
	var self = this;
	Load_Additional_Fields( function( response) {
		if ( response.success ) {
			self.additional_fields = response.data;
			self.additional_fields_length = self.additional_fields.length;
			
			MMBatchList.call( self, 'jsStoreLocator_Batchlist' );

			self.SetDefaultSort( 'id', '-' );
			self.Feature_Add_Enable('Add Location');
			self.Feature_Edit_Enable('Edit Location(s)');
			self.Feature_Delete_Enable('Delete Location(s)');
			self.Feature_RowDoubleClick_Enable();
			self.Feature_SearchBar_SetPlaceholderText( 'Search Locations...' );
			self.Feature_Buttons_AddButton_Persistent( 'Settings', 'Settings', 'settings', self.Settings );
			self.processingdialog = new ProcessingDialog();

		}
	});
}

DeriveFrom( MMBatchList, StoreLocator_Batchlist );

StoreLocator_Batchlist.prototype.onLoad = StoreLocator_Load_Query;

StoreLocator_Batchlist.prototype.onCreateRootColumnList = function() {
		var self = this;
		var i, i_len;
		var columnlist = [];

		columnlist.push(

			new MMBatchList_Column_Name( 'ID', 'id', 'id')
			.SetAdvancedSearchEnabled(false)
			.SetDisplayInMenu(false)
			.SetDisplayInList(false),
			new MMBatchList_Column_CheckboxSlider('Active', 'active', 'active', function( item, checked, delegator ) {
				self.Update_Active( item, checked, delegator );
			} ),
			new MMBatchList_Column_Code( 'Code', 'code', 'code'),
			new MMBatchList_Column_Name( 'Name', 'name', 'name'),
			new MMBatchList_Column_Name( 'Address 1', 'addr1', 'addr1'),
			new MMBatchList_Column_Name( 'Address 2', 'addr2', 'addr2'),
			new MMBatchList_Column_Name( 'City', 'city', 'city'),
			new MMBatchList_Column_Name( 'State', 'state', 'state'),
			new MMBatchList_Column_Name( 'Zip/ Postal Code', 'zip', 'zip'),
			new MMBatchList_Column_Name( 'Country', 'cntry', 'cntry'),
			new MMBatchList_Column_Name( 'Latitude', 'lat', 'lat' ),
			new MMBatchList_Column_Name( 'Longitude', 'lng', 'lng' )
		);

		for ( i = 0, i_len = self.additional_fields_length; i < i_len; i++ ) {
			columnlist.push( new MMBatchList_Column_Text( 'Field: ' + self.additional_fields[ i ].name, 'AdditionalFields_' + self.additional_fields[ i ].code, 'AdditionalFields:' + self.additional_fields[ i ].code ).SetAdvancedSearchEnabled(false).SetSortByField( '' ) );
		}

	return columnlist;
}

StoreLocator_Batchlist.prototype.onCreate = function() {
	var self = this;
	var i, i_len;
	var record;
	record = new Object();
	record.id = 0;
	record.active = 0;
	record.code = '';
	record.name = '';
	record.addr1 = '';
	record.addr2 = '';
	record.city = '';
	record.state = '';
	record.zip = '';
	record.cntry = '';
	record.lat = '';
	record.lng = '';
	for ( i = 0, i_len = self.additional_fields_length; i < i_len; i++ ) {
		var code = 'AdditionalFields_' + self.additional_fields[ i ].code;
		record[code] = '';
	}
	return record;
}

StoreLocator_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	StoreLocator_Batchlist_Function( 'Location_Insert', item.record.mmbatchlist_fieldlist, callback, delegator );
}

StoreLocator_Batchlist.prototype.onSave = function( item, callback, delegator ) {
	StoreLocator_Batchlist_Function( 'Location_Update', item.record.mmbatchlist_fieldlist, callback, delegator );
}

StoreLocator_Batchlist.prototype.Update_Active = function( item, checked, delegator ) {
	item.record.mmbatchlist_fieldlist.find( function( element ) {
		if( element.name == 'active' ) {
			element.value = checked ? 1 : 0;
			return;
		}
	});
	StoreLocator_Batchlist_Function( 'Location_Update', item.record.mmbatchlist_fieldlist, function( response ) {}, delegator );
}

StoreLocator_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	StoreLocator_Batchlist_Function( 'Location_Delete', item.record.mmbatchlist_fieldlist, callback, delegator );
}

StoreLocator_Batchlist.prototype.Settings = function() {
	var self = this;
	var dialog;

	dialog			= new StoreLocatorSettingsDialog();
	dialog.onsave	= function() { self.Refresh(); };

	dialog.Show();
}

function StoreLocatorSettingsDialog() {
	var self = this;

	this.dialog			= document.getElementById( 'TGSL_Settings' );

	this.wrapper		= document.getElementById( 'TGSL_Settings_Wrapper' );

	this.button_cancel	= document.getElementById( 'TGSL_Settings_dialog_button_cancel' );
	this.button_save	= document.getElementById( 'TGSL_Settings_dialog_button_save' );

	if ( this.button_cancel )	this.button_cancel.onclick		= function() { self.Cancel(); }
	if ( this.button_save )		this.button_save.onclick		= function() { self.Save(); }
}

StoreLocatorSettingsDialog.prototype.Show = function() {
	Modal_Show( this.dialog, this.button_save.onclick, this.button_cancel.onclick );
}

StoreLocatorSettingsDialog.prototype.Hide = function() {
	Modal_Hide();
}

StoreLocatorSettingsDialog.prototype.Cancel = function(){
	this.Hide();
	this.oncancel();
}

StoreLocatorSettingsDialog.prototype.Save = function(){
	var self = this;

	var data = self.SerializeInputs( self.wrapper.getElementsByTagName( 'input' ) );

	console.log( data );

	//StoreLocatorSettings_Save( this.data, function( response ) { self.Save_Callback( response ); } );
}

StoreLocatorSettingsDialog.prototype.SerializeInputs = function( inputs ) {
	var len = inputs.length;
	console.log( inputs );
	var s = [];
	for ( var i = 0; i < len; i++ ) {
		field = inputs[i];
		if ( field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button' ) {
			if ( field.type == 'select-multiple' ) {
				l = form.elements[i].options.length; 
				for ( j=0; j<l; j++ ) {
					if( field.options[j].selected )
						s[s.length] = { name: field.name, value: field.options[j].value };
				}
			} else if ( ( field.type != 'checkbox' && field.type != 'radio' ) || field.checked ) {
				s[s.length] = { name: field.name, value: field.value };
			}
		}
	}
	return s;
}

StoreLocatorSettingsDialog.prototype.onerror	= function( error )	{ Modal_Alert( error ); }
StoreLocatorSettingsDialog.prototype.oncancel	= function()		{ ; }
StoreLocatorSettingsDialog.prototype.onsave		= function()		{ ; }
StoreLocatorSettingsDialog.prototype.ondelete	= function()		{ ; }