define( "headerControlStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var headerControlStyle = function headerControlStyle( GUID ){
			var style = { };
			var selector =  "div[header-control='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"top": "0px !important",
				"left": "0px !important"
			};
			absurd.add( style ).compile( absurdCompiler( "header-control", GUID ) );
			return style[ selector ];
		};
		return headerControlStyle;
	} );