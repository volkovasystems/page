define( "pageContentDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular",
		"moduleLoader"
	],
	function construct( ){
		requirejs.config( {
			"paths": {
				"pageContentStyle": staticBaseURL + "/half-page/style/page-content-style",
				"pageContentController": staticBaseURL + "/half-page/controller/page-content-controller"
			}
		} );
		requirejs( [
				"pageContentStyle",
				"pageContentController",
				"appDetermine",
				"onRender"
			],
			function construct( pageContentStyle, 
								pageContentController )
			{
				appDetermine( "HalfPage" )
					.directive( "pageContent",
						[
							"bindDOM",
							"safeApply",
							"$timeout",
							function construct( bindDOM, safeApply, $timeout ){
								return {
									"restrict": "A",
									"controller": pageContentController,
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
												scope.GUID = attribute.pageContent;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												pageContentStyle( scope.GUID );
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													function handler( ){
														var parentElement = scope.element.parent( );
														var parentZIndex = parentElement.css( "z-index" );
														scope.element.css( {
															"position": "absolute !important",
															"top": "0px !important",
															"left": "0px !important",
															//"z-index": " !important",
															"height": parentElement.height( ) + "px",
															"width": parentElement.width( ) + "px"
														} );
													} );
											} );
									}
								}
							}
						] );

				moduleLoader( "page-content-directive" ).onLoad( );
			} );
	} );
