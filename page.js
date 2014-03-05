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

					var Page = function Page( namespace ){
						
					};

					Page.prototype.attachComponent = function attachComponent( componentID ){
						var componentObject = $( "#" + componentID );
						var componentElement = componentObject[ 0 ];
						if( !componentElement ){
							throw new Error( "failed to attach page component" );
						}

						if( componentObject.hasClass( "page-attached" ) ){
							return;
						}

						this.pageContainer = componentObject;
						pageComponent = $( pageComponentTemplate );
						pageComponent.attr( "app-name", appNamespace );
						componentObject.append( pageComponent );

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
