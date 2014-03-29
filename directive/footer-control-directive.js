define( "footerControlDirective",
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
				/*
					This is not exposed in the outside world because this is intended to
						be accessible via an interface.

					This class is designed like this so that the page is the only
						object that can manipulate the footer control container.
				*/
				var FooterControl = function FooterControl( scope ){
					this.scope = scope;
					this.reconstructDOMID( );
				};

				FooterControl.prototype.reconstructDOMID = function reconstructDOMID( ){
					var parent = this.scope.element.parent( );
					var parentDOMID = parent.attr( "domid" );
					this.DOMID = parentDOMID + "-footer-control";
					this.scope.element.attr( "domid", this.DOMID );
					this.scope.DOMID = this.DOMID;
				};

				FooterControl.prototype.getDOMID = function getDOMID( ){
					return this.DOMID;
				}

				FooterControl.prototype.getX  = function getX( ){
					return 0;
				};

				FooterControl.prototype.getY = function getY( ){
					return 0;
				};

				FooterControl.prototype.getHeight = function getHeight( ){
					return 0;
				};

				FooterControl.prototype.getWidth = function getWidth( ){
					return scope.element.parent( ).width( );
				};

				FooterControl.prototype.getZIndex = function getZIndex( ){
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

				appDetermine( "Page" )
					.directive( "footerControl",
						[
							"bindDOM",
							"safeApply",
							function directive( bindDOM, safeApply ){
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

										var footerControlObject = new FooterControl( scope );
										scope.element.data( "footer-control-object", footerControlObject );
										scope.footerControlObject = footerControlObject;
										
										onRender( element,
											function handler( ){
												scope.GUID = attribute.footerControl;
												scope.namespace = scope.name + "-" + scope.appName.toLowerCase( );
												scope.safeApply( );

												scope.element.attr( "namespace", scope.namespace );
												footerControlStyle( scope.GUID );
												
												Arbiter.subscribe( "on-resize:" + scope.namespace,
													"on-resize:" + scope.DOMID,
													function handler( ){
														scope.element.css( {
															"position": "absolute !important",
															"bottom": scope.footerControlObject.getY( ),
															"left": scope.footerControlObject.getX( ),
															"z-index": scope.footerControlObject.getZIndex( ),
															"height": scope.footerControlObject.getHeight( ),
															"width": scope.footerControlObject.getWidth( )
														} );
													} );
											} );
									}
								}
							}
						] );

				moduleLoader( "footer-control-directive" ).onLoad( );
			} );
	} );
