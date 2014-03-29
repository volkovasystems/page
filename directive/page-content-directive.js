define( "pageContentDirective",
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
				/*
					This is not exposed in the outside world because this is intended to
						be accessible via an interface.

					This class is designed like this so that the page is the only
						object that can manipulate the page content container.
				*/
				var PageContent = function PageContent( scope ){
					this.scope = scope;
					this.reconstructDOMID( );
				};

				PageContent.prototype.reconstructDOMID = function reconstructDOMID( ){
					var parent = this.scope.element.parent( );
					var parentDOMID = parent.attr( "domid" );
					this.DOMID = parentDOMID + "-page-content";
					this.scope.element.attr( "domid", this.DOMID );
					this.scope.DOMID = this.DOMID;
				};

				PageContent.prototype.getX  = function getX( ){
					return 0;
				};

				PageContent.prototype.getY = function getY( ){
					return 0;
				};

				PageContent.prototype.getHeight = function getHeight( ){
					return 0;
				};

				PageContent.prototype.getWidth = function getWidth( ){
					return scope.element.parent( ).width( );
				};

				PageContent.prototype.getZIndex = function getZIndex( ){
					var parentElement = this.scope.element.parent( );
					var zIndex = parentElement.css( "z-index" );
					if( zIndex === "auto" ){
						return 1;
					}else if( typeof zIndex == "string" ){
						zIndex = parseInt( zIndex );
					}
					if( isNaN( zIndex ) ){
						throw new Error( "invalid z-index value" );
					}
					return zIndex + 1;
				};

				appDetermine( "HalfPage" )
					.directive( "pageContent",
						[
							"bindDOM",
							"safeApply",
							function construct( bindDOM, safeApply ){
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

										var pageContentObject = new PageContent( scope );
										scope.element.data( "page-content-object", pageContentObject );
										scope.pageContentObject = pageContentObject;
										
										onRender( element,
											function handler( ){
												scope.GUID = attribute.pageContent;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												pageContentStyle( scope.GUID );
												
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													"on-resize:" + scope.DOMID,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"top": scope.pageContentObject.getY( ),
															"left": scope.pageContentObject.getX( ),
															"z-index": scope.pageContentObject.getZIndex( ),
															"height": scope.pageContentObject.getHeight( ),
															"width": scope.pageContentObject.getWidth( )
														} );
													} );
											} );
									}
								}
							}
						] );

				moduleLoadNotifier( "page-content-directive" ).notifyModuleLoaded( );
			} );
	} );
