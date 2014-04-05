define( "pageComponentTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( DIV( {
			"page": "",
			"auto-resize": "",
			"name": "page"
		} ) );
	} );