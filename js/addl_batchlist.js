function AdditionalFields_Batchlist() {
	var self = this;
	this.Construct();
	setTimeout(function(){
		self.onConstruct();
	 }, 1);
}

DeriveFrom( MMBatchList, AdditionalFields_Batchlist );

AdditionalFields_Batchlist.prototype.Construct = function() {
	var self = this;
	MMBatchList.call( self, 'js_batchlistdialog_additionalfields' );
	self.Feature_SearchBar_SetPlaceholderText( 'Search Additional Fields...' );
	self.SetDefaultSort( 'id', '' );
	self.Feature_Add_Enable('Add Additional Field');
	self.Feature_Edit_Enable('Edit Additional Field(s)');
	self.Feature_Delete_Enable('Delete Additional Field(s)');
	self.Feature_RowDoubleClick_Enable();
}
AdditionalFields_Batchlist.prototype.onConstruct = function() { ; }

AdditionalFields_Batchlist.prototype.onLoad = AdditionalFields_Load_Query;

AdditionalFields_Batchlist.prototype.onCreateRootColumnList = function() {
	var columnlist =
	[
		new MMBatchList_Column_Name( 'ID', 'id', 'id')
		.SetAdvancedSearchEnabled(false)
		.SetDisplayInMenu(false)
		.SetDisplayInList(false)
		.SetAdvancedSearchEnabled(false),
		new MMBatchList_Column_Code( 'Code', 'code', 'code'),
		new MMBatchList_Column_Name( 'Name', 'name', 'name')
	];
	return columnlist;
}

AdditionalFields_Batchlist.prototype.onCreate = function() {
	var record;
	record = new Object();
	record.id = 0;
	record.code = '';
	record.name = '';
	return record;
}

AdditionalFields_Batchlist.prototype.onSave = function( item, callback, delegator ) {
	AdditionalFields_Batchlist_Function( 'AdditionalField_Update', item.record.mmbatchlist_fieldlist, callback, delegator );
}

AdditionalFields_Batchlist.prototype.onInsert = function( item, callback, delegator ) {
	AdditionalFields_Batchlist_Function( 'AdditionalField_Insert', item.record.mmbatchlist_fieldlist, callback, delegator );
}

AdditionalFields_Batchlist.prototype.onDelete = function( item, callback, delegator ) {
	AdditionalFields_Batchlist_Function( 'AdditionalField_Delete', item.record.mmbatchlist_fieldlist, callback, delegator );
}