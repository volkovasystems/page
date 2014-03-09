try{ var base = window; }catch( error ){ base = exports; }
( function module( base ){
	define( "page", 
		[
			"async",
			"amplify",
			"requirejs",
			"underscore",
			"angular",
			"jquery"
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
						componentObject.append( pageComponent );
						this.pageComponent = pageComponent;

						var self = this;
						pageComponent.ready( function onReady( ){
							if( appNamespace == "Page" ){	
								appDetermine.bootstrap( componentObject, appNamespace );
							}
							componentObject.attr( "ng-bound-app", appNamespace );
							componentObject.addClass( "page-attached" );
							pageComponent.data( "page-object", self );
						} );
					};

					Page.prototype.loadView = function loadView( ){

					};

					Page.prototype.unloadView = function unloadView( ){

					};

					//Note that replacing a view automatically loads the view.
					Page.prototype.replaceView = function replaceView( view ){

					};

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

					base.Page = Page;
				}  );
			
			return ( function onModuleLoad( handler ){
				async.parallel( [
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:page-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:page-content-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:footer-control-directive", callback );
						},
						function handler( callback ){
							Arbiter.subscribe( "module-loaded:header-control-directive", callback );
						}
					], handler );
			} );
		} );
} )( base );
