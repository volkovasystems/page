define( "headerControlDirective",
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

				/*
					This is not exposed in the outside world because this is intended to
						be accessible via an interface.

					This class is designed like this so that the page is the only
						object that can manipulate the header control container.
				*/
				var HeaderControl = function HeaderControl( scope ){
					this.scope = scope;
					this.reconstructDOMID( );
				};

				HeaderControl.prototype.reconstructDOMID = function reconstructDOMID( ){
					var parent = this.scope.element.parent( );
					var parentDOMID = parent.attr( "domid" );
					this.DOMID = parentDOMID + "-header-control";
					this.scope.element.attr( "domid", this.DOMID );
					this.scope.DOMID = this.DOMID;
				};

				HeaderControl.prototype.getX  = function getX( ){
					return 0;
				};

				HeaderControl.prototype.getY = function getY( ){
					return 0;
				};

				HeaderControl.prototype.getHeight = function getHeight( ){
					return 0;
				};

				HeaderControl.prototype.getWidth = function getWidth( ){
					return scope.element.parent( ).width( );
				};

				HeaderControl.prototype.getZIndex = function getZIndex( ){
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
					.directive( "headerControl",
						[
							"bindDOM",
							"safeApply",
							function construct( bindDOM, safeApply ){
								return {
									"restrict": "A",
									"controller": headerControlController,
									"priority": 1,
									"scope": {
										"appName": "@",
										"name": "@"
									},
									"link": function link( scope, element, attribute ){
										safeApply( scope );
										bindDOM( scope, element, attribute );
										
										var headerControlObject = new HeaderControl( scope );
										scope.element.data( "header-control-object", headerControlObject );
										scope.headerControlObject = headerControlObject;

										onRender( element,
											function handler( ){
												scope.GUID = attribute.headerControl;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												headerControlStyle( scope.GUID );

												Arbiter.subscribe( "on-resize:" + scope.namespace,
													"on-resize:" + scope.DOMID,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"top": scope.headerControlObject.getY( ),
															"left": scope.headerControlObject.getX( ),
															"z-index": scope.headerControlObject.getZIndex( ),
															"height": scope.headerControlObject.getHeight( ),
															"width": scope.headerControlObject.getWidth( )
														} );
													} );
											} );
									}
								}
							}
						] );
				
				moduleLoadNotifier( "header-control-directive" ).notifyModuleLoaded( );
			} );
	} );
