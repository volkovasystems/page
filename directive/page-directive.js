define( "pageDirective",
	[
		"amplify",
		"arbiter",
		"chance",
		"jquery",
		"requirejs",
		"angular",
		"moduleLoadNotifier"
	],
	function construct( ){
		requirejs.config( {
			"paths": {
				"pageStyle": staticBaseURL + "/half-page/style/page-style",
				"pageTemplate": staticBaseURL + "/half-page/template/page-template",
				"pageController": staticBaseURL + "/half-page/controller/page-controller",
				"headerControlDirective": staticBaseURL + "/half-page/directive/header-control-directive",
				"pageContentDirective": staticBaseURL + "/half-page/directive/page-content-directive",
				"footerControlDirective": staticBaseURL + "/half-page/directive/footer-control-directive"
			}
		} );
		requirejs( [
				"pageStyle",
				"pageTemplate",
				"pageController",
				"headerControlDirective",
				"pageContentDirective",
				"footerControlDirective",
				"appDetermine"
			],
			function construct( pageStyle,
								pageTemplate, 
								pageController )
			{
				appDetermine( "HalfPage" )
					.directive( "page",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": pageController,
									"template": pageTemplate,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
										
										//This will bind the page object to the page directive.
										var pageObject = scope.element.data( "page-object" );
										scope.pageObject = pageObject;
										pageObject.scope = scope;

										/*
											A note on the GUID of the pages.

											A main page is a page currently shown on the user.
											Main pages have 2 sub pages in the header and footer.
											This includes the title of the main page and
												the controls used in the main page.

											Now the GUID of the main page should match
												the GUID of the sub pages.

											AND more importantly, the GUID of the halfpage
												must not be the same with any page.

											AND much more importantly, the GUID of every
												page that can be a main page must not be the same.
										*/
										scope.GUID = pageObject.GUID || attribute.page;
										scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
										scope.safeApply( );

										scope.DOMID = pageObject.namespace;
										scope.element.attr( "domid", scope.DOMID );

										scope.element.attr( "namespace", scope.namespace );
										pageStyle( scope.GUID );
										
										Arbiter.subscribe( "on-resize:" + scope.namespace,
											"on-resize:" + scope.DOMID, 
											function handler( ){
												scope.element.css( {
													"position": "absolute !important",
													"top": scope.pageObject.getY( ),
													"left": scope.pageObject.getX( ),
													"z-index": scope.pageObject.getZIndex( ),
													"height": scope.pageObject.getHeight( ),
													"width": scope.pageObject.getWidth( )
												} );
											} );
									}
								}
							}
						] );

				moduleLoadNotifier( "page-directive" ).notifyModuleLoaded( );
			} );
	} );