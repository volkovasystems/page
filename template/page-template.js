define( "pageTemplate",
	[
		"domo",
		"domoStringify"
	],
	function construct( ){
		return domoStringify( [
				DIV( {
					"header-control": "{{ GUID }}",
					"container": "{{ container }}",
					"app-name": "{{ appName }}",
					"name": "header-control",
					"auto-resize": ""
				} ),
				DIV( {
					"page-content": "{{ GUID }}",
					"container": "{{ container }}",
					"app-name": "{{ appName }}",
					"name": "page-content",
					"auto-resize": ""
				} ),
				DIV( {
					"footer-control": "{{ GUID }}",
					"container": "{{ container }}",
					"app-name": "{{ appName }}",
					"name": "footer-control",
					"auto-resize": ""
				} )
			] );
	} );