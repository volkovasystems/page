define( "footerControlStyle",
	[
		"absurd",
		"jquery",
		"absurdCompiler"
	],
	function construct( ){
		var absurd = Absurd( );
		var footerControlStyle = function footerControlStyle( GUID ){
			var style = { };
			var selector =  "div[footer-control='" + GUID + "']";
			style[ selector ] = {
				"position": "absolute !important",
				"bottom": "0px !important",
				"left": "0px !important"
			};
			absurd.add( style ).compile( absurdCompiler( "footer-control", GUID ) );
			return style[ selector ];
		};
		return footerControlStyle;
	} );