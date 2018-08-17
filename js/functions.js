function Load_AdditionalFields( callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGStoreLocator',
								'Load_Additional_Fields',
								'',
								delegator );
}
function StoreLocator_Load_Query( filter, sort, offset, count, callback, delegator ) {
	return AJAX_Call_Module(	callback,
								'admin',
								'TGStoreLocator',
								'StoreLocator_Load_Query',
								'&Filter=' + EncodeArray( filter ) +
								'&Sort=' + encodeURIComponent( sort ) +
								'&Offset=' + encodeURIComponent( offset ) +
								'&Count=' + encodeURIComponent( count ),
								delegator );
}
function StoreLocator_Batchlist_Function( function_name, fieldlist, callback, delegator ) { 
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGStoreLocator',
									   function_name,
									   '',
									   fieldlist,
									   delegator );
}
function StoreLocator_Settings_Update( fields, callback, delegator ) {
	return AJAX_Call_Module_FieldList( callback,
									   'admin',
									   'TGStoreLocator',
									   'StoreLocator_Settings_Update',
									   '',
									   fields,
									   delegator );
}