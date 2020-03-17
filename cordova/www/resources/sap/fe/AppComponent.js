/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/m/NavContainer","sap/fe/core/BusyHelper","sap/fe/model/DraftModel","sap/fe/controllerextensions/Routing","sap/ui/core/routing/HashChanger","sap/ui/model/resource/ResourceModel","sap/base/Log"],function(U,N,B,D,R,H,a,L){"use strict";var A=U.extend("sap.fe.AppComponent",{metadata:{config:{fullWidth:true},manifest:{"sap.ui5":{services:{resourceModel:{factoryName:"sap.fe.services.ResourceModelService","startup":"waitFor","settings":{"bundleName":"sap/fe/messagebundle","modelName":"sap.fe.i18n"}},namedBindingModel:{factoryName:"sap.fe.services.NamedBindingModelService","startup":"waitFor"}}}},designtime:"sap/fe/designtime/AppComponent.designtime",routing:{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","controlId":"appContent","controlAggregation":"pages","async":true,"containerOptions":{"propagateModel":true}}},library:"sap.fe"},_getText:function(i){var r=sap.ui.getCore().getLibraryResourceBundle("sap.fe");return r.getText(i);},constructor:function(){this._oRouting=new R();this._oTemplateContract={oAppComponent:this};U.apply(this,arguments);return this.getInterface();},init:function(){var s;s=sap.ui.core.service.ServiceFactoryRegistry.get("sap.ushell.ui5service.ShellUIService");this._oTemplateContract.oShellServicePromise=(s&&s.createInstance())||Promise.reject();this._oTemplateContract.oShellServicePromise.catch(function(){L.warning("No ShellService available");});var m=this.getModel();if(m){U.prototype.init.apply(this,arguments);if(this._oTemplateContract.oBusyHelper){this._oTemplateContract.oBusyHelper.setBusy(this._oTemplateContract.oShellServicePromise);this._oTemplateContract.oBusyHelper.setBusyReason("initAppComponent",false);}D.isDraftModel(m).then(function(i){if(i){D.upgrade(m).then(function(){this.setModel(m.getDraftAccessModel(),"$draft");}.bind(this));}}.bind(this));m.getMetaModel().requestObject("/$EntityContainer/").catch(function(e){var n=this.getRootControl(),t=this;t._oRouting.navigateToMessagePage(t._getText("SAPFE_APPSTART_TECHNICAL_ISSUES"),{title:t._getText("SAPFE_ERROR"),description:e.message,navContainer:n});}.bind(this));}},exit:function(){this._oRouting.fireOnAfterNavigation();if(this._oTemplateContract.oNavContainer){this._oTemplateContract.oNavContainer.destroy();}},createContent:function(){if(!this._oTemplateContract.bContentCreated){var m=this.getManifestEntry("sap.ui5");if(!m.rootView){if(sap.ui.getCore().byId("appContent")){sap.ui.getCore().byId("appContent").destroy();}this._oTemplateContract.oNavContainer=new N({id:"appContent"});this._oTemplateContract.oNavContainer;}else{this._oTemplateContract.oNavContainer=U.prototype.createContent.apply(this,arguments);}this._oTemplateContract.oBusyHelper=new B(this._oTemplateContract);this._oTemplateContract.oBusyHelper.setBusyReason("initAppComponent",true,true);this._oRouting.initializeRouting(this);this._oTemplateContract.bContentCreated=true;}return this._oTemplateContract.oNavContainer;},getMetaModel:function(){return this.getModel().getMetaModel();}});return A;});
