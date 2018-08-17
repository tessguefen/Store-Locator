function StoreLocator_Batchlist() {
	var self = this;
	Load_AdditionalFields( function( response) {
		if ( response.success ) {
			self.additionalfields = response.data.data;
			self.additionalfields_length = self.additionalfields.length;
			
			MMBatchList.call( self, 'jsStoreLocator_Batchlist' );

			self.SetDefaultSort( 'id', '-' );
			self.Feature_Add_Enable('Add Location');
			self.Feature_Edit_Enable('Edit Location(s)');
			self.Feature_Delete_Enable('Delete Location(s)');
			self.Feature_RowDoubleClick_Enable();
			self.Feature_SearchBar_SetPlaceholderText( 'Search Locations...' );
			self.Feature_Buttons_AddButton_Persistent( 'Settings', 'Settings', 'logging', self.Settings );
			self.Feature_Buttons_AddButton_Persistent( 'Manage Additional Fields', 'Manage Additional Fields', '', self.AddAdditionalFields );
			self.Feature_Persistent_Filters_Enable( 'TGStoreLocator' );
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
				self.Update_Active( 'active', item, checked, delegator );
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

		for ( i = 0, i_len = self.additionalfields_length; i < i_len; i++ ) {
			columnlist.push( new MMBatchList_Column_Text( 'Field: ' + self.additionalfields[ i ].name, 'AdditionalFields_' + self.additionalfields[ i ].code, 'AdditionalFields:' + self.additionalfields[ i ].code ).SetAdvancedSearchEnabled(false).SetSortByField( '' ) );
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
	for ( i = 0, i_len = self.additionalfields_length; i < i_len; i++ ) {
		record[ 'AdditionalFields_' + self.additionalfields[ i ].code ] = '';
	}
	return record;
}

StoreLocator_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	StoreLocator_Batchlist_Function( 'Location_Insert', item.record.mmbatchlist_fieldlist, callback, delegator );
}

StoreLocator_Batchlist.prototype.onSave = function( item, callback, delegator ) {
	StoreLocator_Batchlist_Function( 'Location_Update', item.record.mmbatchlist_fieldlist, callback, delegator );
}

StoreLocator_Batchlist.prototype.Update_Active = function( key, item, checked, delegator ) {
	item.record.mmbatchlist_fieldlist.find( function( element ) {
		if( element.name == key ) {
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
	var data = self.SerializeInputs( self.wrapper.getElementsByTagName( '*' ) );
	console.log( data );
	StoreLocator_Settings_Update( data, function( response ) { self.Save_Callback( response ); } );
}
StoreLocatorSettingsDialog.prototype.Save_Callback = function( response ) {
	console.log( response );
}

StoreLocatorSettingsDialog.prototype.SerializeInputs = function( inputs ) {
	var len = inputs.length;
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

function StoreLocatorAdditionalFields_Dialog() {
	var self = this;
	var addlfields_mmbatchlist;
	
	addlfields_mmbatchlist = new AdditionalFields_Batchlist();
	addlfields_mmbatchlist.onConstruct = function() {
		self.SetBatchList( addlfields_mmbatchlist );
		var batchlistWrapper = document.getElementById( 'js_batchlistdialog_additionalfields' );
		batchlistWrapper.style.height = '';
	};

	MMBatchListDialog.call( self, 'mm9_batchlistdialog_additionalfields', 900, 600 );
	
	self.button_cancel		= self.ActionItem_Add( 'Cancel', function() { self.Hide(); } );

	self.SetTitle( 'Additional Fields' );
	self.SetResizeEnabled();
}
DeriveFrom( MMBatchListDialog, StoreLocatorAdditionalFields_Dialog );

StoreLocatorAdditionalFields_Dialog.prototype.onok = function( item ) { ; };

StoreLocator_Batchlist.prototype.AddAdditionalFields = function() {
	var self = this;
	var dialog;

	dialog			= new StoreLocatorAdditionalFields_Dialog();
	dialog.onhide	= function() {
		// If someone deletes or adds a field... we need to update the batchlist basically.
		new StoreLocator_Batchlist();
	};

	dialog.Show();
}



