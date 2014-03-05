define( "pageStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var pageStyle = function pageStyle( GUID ){
			var style = { };
			var selector =  "div[page='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"top": "0px !important",
				"left": "0px !important"
			};
			absurd.add( style ).compile( absurdCompiler( "page", GUID ) );
			return style[ selector ];
		};
		return pageStyle;
	} );