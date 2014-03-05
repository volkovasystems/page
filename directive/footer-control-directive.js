define( "footerControlDirective",
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
				"footerControlStyle": staticBaseURL + "/half-page/style/footer-control-style",
				"footerControlController": staticBaseURL + "/half-page/controller/footer-control-controller"
			}
		} );

		requirejs( [
				"footerControlStyle",
				"footerControlController",
				"appDetermine",
				"onRender"
			],
			function construct( footerControlStyle, 
								footerControlController )
			{
				appDetermine( "HalfPage" )
					.directive( "footerControl",
						[
							"bindDOM",
							"safeApply",
							"$timeout",
							function directive( bindDOM, safeApply, $timeout ){
								return {
									"restrict": "A",
									"controller": footerControlController,
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
												scope.GUID = attribute.footerControl;
												console.log( "footer: " + scope.GUID );
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												footerControlStyle( scope.GUID );
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
				Arbiter.publish( "module-loaded:footer-control-directive", null, { "persist": true } );
			} );
	} );
