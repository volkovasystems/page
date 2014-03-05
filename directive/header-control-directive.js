define( "headerControlDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular"
	],
	function construct( ){
		requirejs.config( {
			"paths": {
				"headerControlStyle": staticBaseURL + "/half-page/style/header-control-style",
				"headerControlController": staticBaseURL + "/half-page/controller/header-control-controller"
			}
		} );

		requirejs( [
				"headerControlStyle",
				"headerControlController",
				"appDetermine",
				"onRender"
			],
			function construct( headerControlStyle, 
								headerControlController )
			{
				appDetermine( "HalfPage" )
					.directive( "headerControl",
						[
							"bindDOM",
							"safeApply",
							"$timeout",
							function directive( bindDOM, safeApply, $timeout ){
								return {
									"restrict": "A",
									"controller": headerControlController,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@",
										"container": "@" 
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
										
										onRender( $timeout, element,
											function handler( ){
												scope.GUID = attribute.headerControl;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												headerControlStyle( scope.GUID );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													function handler( ){
														var parentElement = scope.element.parent( );
														var parentZIndex = parentElement.css( "z-index" );
														scope.element.css( {
															"position": "absolute !important",
															"top": "0px !important",
															"left": "0px !important",
															//"z-index": " !important",
															//"height": parentElement.height( ) + "px",
															//"width": parentElement.width( ) + "px"
														} );
													} );
											} );
									}
								}
							}
						] );
				Arbiter.publish( "module-loaded:header-control-directive", null, { "persist": true } );
			} );
	} );
