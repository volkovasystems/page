define( "pageContentStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var pageContentStyle = function pageContentStyle( GUID ){
			var style = { };
			var selector =  "div[page-content='" + GUID + "']";
			style[ selector ] = {
				"overflow": "hidden",
				"position": "absolute !important",
				"top": "0px !important",
				"left": "0px !important",
				"padding": "1.5px !important" 
			};
			absurd.add( style ).compile( absurdCompiler( "page-content", GUID ) );
			return style[ selector ];
		};
		return pageContentStyle;
	} );