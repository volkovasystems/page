try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "page", 
		[
			"async",
			"amplify",
			"requirejs",
			"underscore",
			"angular",
			"jquery",
			"moduleLoader"
		],
		function construct( async ){
			requirejs.config( {
				"paths": {
					"pageComponentTemplate": staticBaseURL + "/page/template/page-component-template",
					"pageDirective": staticBaseURL + "/page/directive/page-directive"
				}
			} );
			requirejs( [ 
					"pageComponentTemplate",
					"pageDirective",
					"bindDOMFactory",
					"safeApplyFactory",
					"autoResizeDirective",
					"appDetermine"
				],
				function construct( pageComponentTemplate ){
					var pageApp = angular.module( "Page", [ ] );
					var appNamespace = appDetermine( "Page" ).name;
					
					safeApplyFactory( appNamespace );
					bindDOMFactory( appNamespace );
					autoResizeDirective( appNamespace );

					var Page = function Page( namespace, view ){
						
						this.namespace = namespace;
						this.view = view;

						//These are non-child pages associated to this page.
						this.boundPageList = { };
					};

					Page.prototype.overrideGUID = function overrideGUID( GUID ){
						this.GUID = GUID;
					};

					Page.prototype.attachComponent = function attachComponent( component ){
						var componentObject;
						if( typeof component == "string" ){
							componentObject = $( component );	
						}else if( component instanceof $ ){
							componentObject = component;
						}else{
							throw new Error( "invalid component" );
						}

						if( componentObject.length > 1 ){
							throw new Error( "component refers to many elements" );
						}

						if( componentObject.length == 0 ){
							throw new Error( "component does not exists" );
						}

						if( componentObject.hasClass( "page-attached" ) ){
							return;
						}

						this.pageContainer = componentObject;
						pageComponent = $( pageComponentTemplate );

						pageComponent.attr( "app-name", appNamespace );
						pageComponent.data( "page-object", self );
						
						componentObject.append( pageComponent );
						this.pageComponent = pageComponent;

						var self = this;
						pageComponent.ready( function onReady( ){
							if( appNamespace == "Page" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "page-attached" );
						} );
					};

					Page.prototype.loadView = function loadView( ){

					};

					Page.prototype.unloadView = function unloadView( ){

					};

					//Note that replacing a view automatically loads the view.
					Page.prototype.replaceView = function replaceView( view ){

					};

					Page.prototype.setCurrentGroup = function setCurrentGroup( group ){

					};

					Page.prototype.removeFromGroup = function removeFromGroup( group ){

					};

					/*
						Bound pages states the association of other pages across.
						This enable the page to control its associated pages.
					*/
					Page.prototype.bindPage = function bindPage( page ){
						if( page instanceof Page ){
							this.boundPageList[ page.namespace ] = page;
						}else{
							throw new Error( "invalid page" );
						}
					}

					Page.prototype.unbindPage = function unbindPage( page ){
						if( page instanceof Page ){
							if( page.namespace in this.boundPageList ){
								delete this.boundPageList[ page.namespace ];	
							}
						}else{
							throw new Error( "invalid page" );
						}
					}

					Page.prototype.checkIfAttached = function checkIfAttached( ){
						return ( "pageContainer" in this )
							&& this.pageContainer.hasClass( "page-attached" );
					};

					Page.prototype.getHeaderControlComponent = function getHeaderControlComponent( ){
						return this.pageComponent.find( "> header-control" );
					};

					Page.prototype.getFooterControlComponent = function getFooterControlComponent( ){
						return this.pageComponent.find( "> footer-control" );	
					};

					Page.prototype.getPageContentComponent = function getPageContentComponent( ){
						return this.pageComponent.find( "> page-content" );
					};

					/*
						This is the default layout method for retrieving
							the x distance for the page.

						By attaching a layout calibration this can be changed.
					*/
					Page.prototype.getX = function getX( ){
						return 0;
					};

					/*
						This is the default layout method for retrieving
							the y distance for the page.

						By attaching a layout calibration this can be changed.
					*/
					Page.prototype.getY = function getY( ){
						return 0;
					};

					/*
						This is the default dimension method for retrieving
							the height for the page.

						By attaching a dimension calibration this can be changed.
					*/
					Page.prototype.getHeight = function getHeight( ){
						var parentElement = this.scope.element.parent( );
						return parentElement.height( );
					};

					/*
						This is the default dimension method for retrieving
							the height for the page.

						By attaching a dimension calibration this can be changed.
					*/
					Page.prototype.getWidth = function getWidth( ){
						var parentElement = this.scope.element.parent( );
						return parentElement.width( );
					};

					/*
						The base default z-index for any element is 1. 

						We may be retrieving value as "auto" this is due
							to the fact that the position is not "absolute".

						Though this method will not check it any component
							belonging to the page component concept must be
							configured with "absolute" position.

						The default z-index now is the parent's z-index + 1.

						By attaching a layout calibration this can be changed.
					*/
					Page.prototype.getZIndex = function getZIndex( ){
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

					/*
						This will return the header control object.
					*/
					Page.prototype.getHeaderControl = function getHeaderControl( ){
						return scope.element.find( "div[header-control='" + this.GUID + "']" )
							.data( "header-control-object" );
					};

					/*
						This will return the footer control object.
					*/
					Page.prototype.getFooterControl = function getFooterControl( ){
						return scope.element.find( "div[footer-control='" + this.GUID + "']" )
							.data( "footer-control-object" );
					};

					/*
						This will return the page content object.
					*/
					Page.prototype.getPageContent = function getPageContent( ){
						return scope.element.find( "div[page-content='" + this.GUID + "']" )
							.data( "page-content-object" );
					};

					base.Page = Page;
				}  );
			
			return moduleLoader( "page-directive",
				"page-content-directive",
				"header-control-directive",
				"footer-control-directive" )
				.notify;
		} );
} )( base );
