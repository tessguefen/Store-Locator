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
				StoreLocator_Batchlist.Update_Active( item, checked, delegator );
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

StoreLocator_Batchlist.prototype.Settings = function() {
	var self = this;
	var dialog;

	dialog			= new StoreLocatorSettingsDialog();
	dialog.onsave	= function() { self.Refresh(); };

	dialog.Show();
}