// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/UIComponent","sap/ushell/ui/shell/ToolAreaItem","./FlpMeasure","sap/ushell/Config","sap/ushell/components/applicationIntegration/AppLifeCycle","sap/ui/Device","sap/ui/model/json/JSONModel","sap/ushell/components/SharedComponentUtils","sap/ushell/services/AppConfiguration","sap/ushell/services/AppType","sap/ushell/resources","sap/base/util/UriParameters","sap/ui/thirdparty/jquery","sap/base/Log","sap/base/util/ObjectPath","sap/ui/core/library","sap/ushell/ui/shell/ShellHeadItem","sap/m/NotificationListItem","./RendererExtensions"],function(U,T,f,C,A,D,J,s,a,b,r,c,q,L,O,d,S,N){"use strict";var V=d.mvc.ViewType;var R=U.extend("sap.ushell.renderers.fiori2.Renderer",{metadata:{version:"1.71.12",dependencies:{version:"1.71.12",libs:["sap.ui.core","sap.m"],components:[]},routing:{config:{path:"sap.ushell.components",async:true,controlId:"viewPortContainer",clearAggregation:false,controlAggregation:"pages"},routes:[{name:"appfinder-legacy",pattern:"Shell-home&/appFinder/:menu:/:filter:"},{name:"home",pattern:["Shell-home?:hashParameters:","Shell-home&/:innerHash*:","Shell-home"],target:"home"},{name:"appfinder",pattern:["Shell-appfinder?:hashParameters:&/:innerHash*:","Shell-appfinder?:hashParameters*:","Shell-appfinder&/:innerHash*:","Shell-appfinder"],target:"appfinder"}],targets:{home:{name:"homepage",type:"Component",title:r.i18n.getText("homeBtn_tooltip"),id:"Shell-home-component",options:{manifest:false,asyncHints:{preloadBundles:C.last("/core/home/featuredGroup/enable")?["sap/fiori/flp-controls.js","sap/ushell/components/homepage/cards-preload.js"]:["sap/fiori/flp-controls.js"]},componentData:{config:{enablePersonalization:true,enableHomePageSettings:false}}}},appfinder:{name:"appfinder",type:"Component",id:"Shell-appfinder-component",options:{manifest:false,asyncHints:{preloadBundles:["sap/fiori/flp-controls.js"]},componentData:{config:{enablePersonalization:true,enableHomePageSettings:false}}}}}}},init:function(){U.prototype.init.apply(this,arguments);var t=this,o=this.getRouter();o.getRoute("home").attachMatched(function(){if(a.getCurrentApplication()){sap.ushell.Container.getService("ShellNavigation").setIsInitialNavigation(false);}var h=r.i18n.getText("homeBtn_tooltip");A.switchViewState("home",false,"Shell-home");t.setCurrentCoreView("home");a.setCurrentApplication(null);A.getShellUIService().setTitle(h);A.getShellUIService().setHierarchy();A.getShellUIService().setRelatedApps();A.getAppMeta().setAppIcons();});o.getRoute("appfinder-legacy").attachMatched(function(E){o.navTo("appfinder",{},true);});o.getRoute("appfinder").attachMatched(function(E){var g=sap.ui.getCore().getComponent(t.createId("Shell-appfinder-component")),h=E.getParameter("arguments");if(sap.ushell.Container.getRenderer("fiori2")){A.getShellUIService().setBackNavigation();sap.ushell.Container.getRenderer("fiori2").setCurrentCoreView("appFinder");}a.setCurrentApplication(null);var i=g.getRouter();g.getRootControl().loaded().then(function(){i.parse(h["innerHash*"]||"");});A.switchViewState("app",false,"Shell-appfinder");A.getAppMeta().setAppIcons();});var e=new J(D);e.setDefaultBindingMode("OneWay");this.setModel(e,"device");this.setModel(r.i18nModel,"i18n");s.initializeAccessKeys();}});R.prototype.createContent=function(){var p=new c(window.location.href).get("appState")||new c(window.location.href).get("sap-ushell-config"),w,v=this.getComponentData()||{},o={applications:{"Shell-home":{}},rootIntent:"Shell-home"},e;w=(p==="headerless-opt")?"headerless":p;if(w){if(!v.config){v.config={};}v.config.appState=w;v.config.appStateOrig=p;v.config.inHeaderLessOpt=(p==="headerless-opt");}if(v.config){if(v.config.rootIntent===undefined){v.config.migrationConfig=true;}v.config=q.extend(true,o,v.config);q.extend(v.config.applications["Shell-home"],C.last("/core/home"),C.last("/core/catalog"));if(v.config.appState==="headerless"||v.config.appState==="merged"||v.config.appState==="blank"){v.config.enablePersonalization=false;C.emit("/core/shell/enablePersonalization",false);}else{v.config.enablePersonalization=C.last("/core/shell/enablePersonalization");}if(!v.config.enablePersonalization){v.config.moveEditHomePageActionToShellHeader=false;v.config.moveAppFinderActionToShellHeader=false;}}f.start(0,"Creating Shell",0);if(v.config&&v.config.customViews){Object.keys(v.config.customViews).forEach(function(h){var e=v.config.customViews[h];sap.ui.view(h,{type:e.viewType,viewName:e.viewName,viewData:e.componentData});});}var g=C.createModel("/core/shell/model",J);v.shellModel=g;e=sap.ui.view("mainShell",{type:V.JS,viewName:"sap.ushell.renderers.fiori2.Shell",height:"100%",viewData:v});e.setModel(g);this._oShellView=e;this.oShellModel=A.getElementsModel();e.loaded().then(function(e){sap.ushell.renderers.fiori2.utils.init(e.getController());this.shellCtrl=e.oController;}.bind(this));return e;};R.prototype.createExtendedShellState=function(e,g){return A.shellElements().createExtendedShellState(e,g);};R.prototype.applyExtendedShellState=function(e,g){this.oShellModel.applyExtendedShellState(e,g);};R.prototype.showLeftPaneContent=function(i,e,g){if(e){A.shellElements().addShellModelForApplications("paneContent",typeof i==="string"?[i]:i);}else{this.oShellModel.addLeftPaneContent(typeof i==="string"?[i]:i,false,g);}};R.prototype.showHeaderItem=function(i,e,g){if(e){A.shellElements().addShellModelForApplications("headItems",typeof i==="string"?[i]:i);}else{this.oShellModel.addHeaderItem(typeof i==="string"?[i]:i,false,g);}};R.prototype.showRightFloatingContainerItem=function(i,e,g){if(e){A.shellElements().addShellModelForApplications("RightFloatingContainerItems",typeof i==="string"?[i]:i);}else{this.oShellModel.addRightFloatingContainerItem(typeof i==="string"?[i]:i,false,g);}};R.prototype.showRightFloatingContainer=function(e){A.shellElements().setShellModelForApplications("showRightFloatingContainer",e);};R.prototype.showToolAreaItem=function(i,e,g){this.oShellModel.addToolAreaItem(i,true,e,g);};R.prototype.showActionButton=function(i,e,g){var B=[],h=[],o;if(typeof i==="string"){i=[i];}B=i.filter(function(I){o=sap.ui.getCore().byId(I);return o instanceof sap.m.Button&&!(o instanceof sap.ushell.ui.launchpad.ActionItem);});h=i.filter(function(I){o=sap.ui.getCore().byId(I);return o instanceof sap.ushell.ui.launchpad.ActionItem;});if(B.length){this.convertButtonsToActions(B,e,g);}if(h.length){if(e){A.shellElements().addShellModelForApplications("actions",i);}else{this.oShellModel.addActionButton(i,false,g);}}};R.prototype.showFloatingActionButton=function(i,e,g){if(e){A.shellElements().addShellModelForApplications("floatingActions",typeof i==="string"?[i]:i);}else{this.oShellModel.addFloatingActionButton(typeof i==="string"?[i]:i,false,g);}};R.prototype.showHeaderEndItem=function(i,e,g){if(e){A.shellElements().addShellModelForApplications("headEndItems",typeof i==="string"?[i]:i);}else{this.oShellModel.addHeaderEndItem(typeof i==="string"?[i]:i,false,g);}};R.prototype.setHeaderVisibility=function(v,e,g){if(e){A.shellElements().setShellModelForApplications("headerVisible",v);}else{this.oShellModel.setHeaderVisibility(v,false,g);}};R.prototype.showSubHeader=function(i,e,g){if(e){A.shellElements().addShellModelForApplications("subHeader",typeof i==="string"?[i]:i);}else{this.oShellModel.addSubHeader(typeof i==="string"?[i]:i,false,g);}};R.prototype.showSignOutItem=function(e,g){if(e){A.shellElements().addShellModelForApplications("actions",["logoutBtn"],false);}else{this.oShellModel.showSignOutButton(e,g);}};R.prototype.showSettingsItem=function(e,g){this.oShellModel.showSettingsButton(e,g);};R.prototype.setFooter=function(F){this.shellCtrl.setFooter(F);};R.prototype.setShellFooter=function(p){var o=new q.Deferred(),t=this,e,g,h=p.controlType,i=p.oControlProperties;if(i&&i.id&&sap.ui.getCore().byId(i.id)){g=sap.ui.getCore().byId(i.id);if(g){if(this.lastFooterId){this.removeFooter();}this.lastFooterId=oInnerControl.getId();this.shellCtrl.setFooter(g);o.resolve(g);}}if(h){e=h.replace(/\./g,"/");sap.ui.require([e],function(j){g=new j(i);if(t.lastFooterId){t.removeFooter();}t.lastFooterId=g.getId();t.shellCtrl.setFooter(g);o.resolve(g);});}else{L.warning("You must specify control type in order to create it");}return o.promise();};R.prototype.setFooterControl=function(e,o){var g=e.replace(/\./g,"/"),h=sap.ui.require(g),i,j,k=false;if(h){k=true;}else if(!O.get(e||"")){q.sap.require(e);}j=function(o){if(e){if(k){return new h(o);}var l=O.get(e||"");return new l(o);}L.warning("You must specify control type in order to create it");};i=this.createItem(o,undefined,j);if(this.lastFooterId){this.removeFooter();}this.lastFooterId=i.getId();this.shellCtrl.setFooter(i);return i;};R.prototype.hideHeaderItem=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeHeaderItem([i],e,g);}else{this.oShellModel.removeHeaderItem(i,e,g);}};R.prototype.removeToolAreaItem=function(i,e,g){if(typeof i==="string"){i=[i];}this.oShellModel.removeToolAreaItem(i,e,g);};R.prototype.removeRightFloatingContainerItem=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeRightFloatingContainerItem([i],e,g);}else{this.oShellModel.removeRightFloatingContainerItem(i,e,g);}};R.prototype.hideActionButton=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeActionButton([i],e,g);}else{this.oShellModel.removeActionButton(i,e,g);}};R.prototype.hideLeftPaneContent=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeLeftPaneContent([i],e,g);}else{this.oShellModel.removeLeftPaneContent(i,e,g);}};R.prototype.hideFloatingActionButton=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeFloatingActionButton([i],e,g);}else{this.oShellModel.removeFloatingActionButton(i,e,g);}};R.prototype.hideHeaderEndItem=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeHeaderEndItem([i],e,g);}else{this.oShellModel.removeHeaderEndItem(i,e,g);}};R.prototype.hideSubHeader=function(i,e,g){if(typeof i==="string"){this.oShellModel.removeSubHeader([i],e,g);}else{this.oShellModel.removeSubHeader(i,e,g);}};R.prototype.removeFooter=function(){this.shellCtrl.removeFooter();if(this.lastFooterId){var F=sap.ui.getCore().byId(this.lastFooterId);if(F){F.destroy();}this.lastFooterId=undefined;}};R.prototype.getCurrentViewportState=function(){return this.shellCtrl.getCurrentViewportState();};R.prototype.addShellSubHeader=function(p){var o=new q.Deferred(),t=this,e,g,h=p.controlType,i=p.oControlProperties,I=p.bIsVisible,j=p.bCurrentState,k=p.aStates;if(i&&i.id&&sap.ui.getCore().byId(i.id)){g=sap.ui.getCore().byId(i.id);if(g){if(I){this.showSubHeader(g.getId(),j,k);}o.resolve(g);}}if(h){e=h.replace(/\./g,"/");sap.ui.require([e],function(l){g=new l(i);if(I){t.showSubHeader(g.getId(),j,k);t.oShellModel.addElementToManagedQueue(g);}o.resolve(g);});}else{L.warning("You must specify control type in order to create it");}return o.promise();};R.prototype.addSubHeader=function(e,o,i,g,h){var j=e.replace(/\./g,"/"),k=sap.ui.require(j),l,m,p=false;if(k){p=true;}else if(!O.get(e||"")){q.sap.require(e);}m=function(o){if(e){if(p){return new k(o);}var t=O.get(e||"");return new t(o);}L.warning("You must specify control type in order to create it");};l=this.createItem(o,g,m);if(i){this.showSubHeader(l.getId(),g,h);}return l;};R.prototype.addUserAction=function(p){var o=new q.Deferred(),t=this,e,g,h=p.controlType,i=p.oControlProperties,I=p.bIsVisible,j=p.bCurrentState,m=j?A.shellElements().getStateModelToUpdate():this.oShellModel.getModelToUpdate(),k=p.aStates,l;if(i){g=sap.ui.getCore().byId(i.id);}if(g){o.resolve(g);}if(h){if(h==="sap.m.Button"){h="sap.ushell.ui.launchpad.ActionItem";}e=h.replace(/\./g,"/");sap.ui.require([e],function(u){var v;if(j){v=A.shellElements().getStateModelToUpdate();A.shellElements().setStateModelToUpdate(m);}else{v=t.oShellModel.getModelToUpdate();t.oShellModel.setModelToUpdate(m,true);}g=g||new u(i);if(!g.getActionType){g=new u(i);}if(I){t.showActionButton(g.getId(),j,k);t.oShellModel.addElementToManagedQueue(g);}if(j){A.shellElements().setStateModelToUpdate(v);}else{t.oShellModel.setModelToUpdate(v,false);}o.resolve(g);});}else{l="You must specify control type in order to create it";L.warning(l);o.reject(l);}return o.promise();};R.prototype.addActionButton=function(e,o,i,g,h){var j,k,l,m,p=false;if(e==="sap.m.Button"){e="sap.ushell.ui.launchpad.ActionItem";}j=e.replace(/\./g,"/");k=sap.ui.require(j);if(k){p=true;}else if(!O.get(e||"")){q.sap.require(e);}m=function(o){if(e){if(p){return new k(o);}var t=O.get(e||"");return new t(o);}L.warning("You must specify control type in order to create it");};l=this.createItem(o,g,m);if(i){this.showActionButton(l.getId(),g,h);}return l;};R.prototype.addFloatingButton=function(p){var o=new q.Deferred(),t=this,e,g,h=p.controlType,i=p.oControlProperties,I=p.bIsVisible,j=p.bCurrentState,k=p.aStates;if(i&&i.id&&sap.ui.getCore().byId(i.id)){g=sap.ui.getCore().byId(i.id);if(g){if(I){t.showFloatingActionButton(oItem.getId(),j,k);t.oShellModel.addElementToManagedQueue(g);}o.resolve(g);}}if(h){e=h.replace(/\./g,"/");}else{e="sap/m/Button";}sap.ui.require([e],function(l){g=new l(i);if(I){this.showFloatingActionButton(oItem.getId(),j,k);}o.resolve(g);});return o.promise();};R.prototype.addFloatingActionButton=function(e,o,i,g,h){var j,k,l,m,p=false;if(!e){e="sap.m.Button";}j=e.replace(/\./g,"/");k=sap.ui.require(j);if(k){p=true;}else if(!O.get(e||"")){q.sap.require(e);}m=function(o){if(e){if(p){return new k(o);}var t=O.get(e||"");return new t(o);}L.warning("You must specify control type in order to create it");};l=this.createItem(o,g,m);if(i){this.showFloatingActionButton(l.getId(),g,h);}return l;};R.prototype.addSidePaneContent=function(p){var o=new q.Deferred(),t=this,e,g,h=p.controlType,i=p.oControlProperties,I=p.bIsVisible,j=p.bCurrentState,k=p.aStates;if(i&&i.id&&sap.ui.getCore().byId(i.id)){g=sap.ui.getCore().byId(i.id);if(g){o.resolve(g);}}if(h){e=h.replace(/\./g,"/");sap.ui.require([e],function(l){g=new l(i);if(I){t.oShellModel.addElementToManagedQueue(g);t.showLeftPaneContent(oItem.getId(),j,k);}o.resolve(g);});}else{L.warning("You must specify control type in order to create it");}return o.promise();};R.prototype.addLeftPaneContent=function(e,o,i,g,h){var j=e.replace(/\./g,"/"),k=sap.ui.require(j),l,m,p;if(k){p=true;}else if(!O.get(e||"")){q.sap.require(e);}m=function(o){if(e){if(p){return new k(o);}var t=O.get(e||"");return new t(o);}L.warning("You must specify control type in order to create it");};l=this.createItem(o,g,m);if(i){this.showLeftPaneContent(l.getId(),g,h);}return l;};R.prototype.addHeaderItem=function(e,o,i,g,h){if(typeof(arguments[0])==="object"&&typeof(arguments[1])==="boolean"){o=arguments[0];i=arguments[1];g=arguments[2];h=arguments[3];}else{L.warning("sap.ushell.renderers.fiori2.Renderer: The parameter 'controlType' of the function 'addHeaderItem' is deprecated. Usage will be ignored!");}var p=o;p.showSeparator=false;var j=function(o){return new S(o);},I=this.createItem(p,g,j);if(i){this.showHeaderItem(I.getId(),g,h);}return I;};R.prototype.addRightFloatingContainerItem=function(o,i,e,g){var h=function(o){return new N(o);},I=this.createItem(o,e,h);if(i){this.showRightFloatingContainerItem(I.getId(),e,g);}return I;};R.prototype.addToolAreaItem=function(o,i,e,g){o.visible=!!i;var h=function(p){return new T(p);},I=this.createItem(o,e,h);this.oShellModel.addToolAreaItem(I.getId(),!!i,e,g);return I;};R.prototype.addHeaderEndItem=function(e,o,i,g,h){var p=o;p.showSeparator=false;var j=function(o){return new S(o);},I=this.createItem(p,g,j);if(i){this.showHeaderEndItem(I.getId(),g,h);}return I;};R.prototype.getModelConfiguration=function(){return this.shellCtrl.getModelConfiguration();};R.prototype.addEndUserFeedbackCustomUI=function(o,e){this.shellCtrl.addEndUserFeedbackCustomUI(o,e);};R.prototype.addUserPreferencesEntry=function(e){return this.shellCtrl.addUserPreferencesEntry(e);};R.prototype.setHeaderTitle=function(t){this.shellCtrl.setHeaderTitle(t);};R.prototype.setLeftPaneVisibility=function(l,v){this.oShellModel.setLeftPaneVisibility(v,false,[l]);};R.prototype.showToolArea=function(l,v){this.oShellModel.showShellItem("/toolAreaVisible",l,v);};R.prototype.setHeaderHiding=function(h){return this.oShellModel.setHeaderHiding(h);};R.prototype.setFloatingContainerContent=function(o,e,g){this.shellCtrl.setFloatingContainerContent("floatingContainerContent",[o.getId()],e,g);};R.prototype.setFloatingContainerVisibility=function(v){this.shellCtrl.setFloatingContainerVisibility(v);};R.prototype.getFloatingContainerState=function(){return this.shellCtrl.getFloatingContainerState();};R.prototype.getFloatingContainerVisiblity=function(){return this.shellCtrl.getFloatingContainerVisibility();};R.prototype.getRightFloatingContainerVisibility=function(){return this.shellCtrl.getRightFloatingContainerVisibility();};R.prototype.setFloatingContainerDragSelector=function(e){this.shellCtrl.setFloatingContainerDragSelector(e);};R.prototype.makeEndUserFeedbackAnonymousByDefault=function(e){this.shellCtrl.makeEndUserFeedbackAnonymousByDefault(e);};R.prototype.showEndUserFeedbackLegalAgreement=function(e){this.shellCtrl.showEndUserFeedbackLegalAgreement(e);};R.prototype.LaunchpadState={App:"app",Home:"home"};R.prototype.createTriggers=function(t,e,g){this.oShellModel.createTriggers(t,e,g);};R.prototype.convertButtonsToActions=function(i,e,g){var p={},B,t=this;i.forEach(function(I){B=sap.ui.getCore().byId(I);p.id=B.getId();p.text=B.getText();p.icon=B.getIcon();p.tooltip=B.getTooltip();p.enabled=B.getEnabled();p.visible=B.getVisible();if(B.mEventRegistry&&B.mEventRegistry.press){p.press=B.mEventRegistry.press[0].fFunction;}B.destroy();t.addActionButton("sap.ushell.ui.launchpad.ActionItem",p,p.visible,e,g);});};R.prototype.createItem=function(o,e,g){var i;if(o&&o.id){i=sap.ui.getCore().byId(o.id);}if(!i){i=g(o);if(e){this.oShellModel.addElementToManagedQueue(i);}}return i;};R.prototype.addEntryInShellStates=function(e,g,h,i,o){this.oShellModel.addEntryInShellStates(e,g,h,i,o);};R.prototype.removeCustomItems=function(e,i,g,h){if(typeof i==="string"){this.oShellModel.removeCustomItems(e,[i],g,h);}else{this.oShellModel.removeCustomItems(e,i,g,h);}};R.prototype.addCustomItems=function(e,i,g,h){if(typeof i==="string"){this.oShellModel.addCustomItems(e,[i],g,h);}else{this.oShellModel.addCustomItems(e,i,g,h);}};R.prototype.addRightViewPort=function(v){this.shellCtrl.getViewPortContainer().addRightViewPort(v,false);};R.prototype.addLeftViewPort=function(v){this.shellCtrl.getViewPortContainer().addLeftViewPort(v,false);};R.prototype.getShellController=function(){return this.shellCtrl;};R.prototype.getViewPortContainerCurrentState=function(){return this.shellCtrl.getViewPortContainer().getCurrentState();};R.prototype.ViewPortContainerNavTo=function(e,t,g){return this.shellCtrl.getViewPortContainer().navTo(e,t,g);};function n(){}R.prototype.switchViewPortStateByControl=n;R.prototype.ViewPortContainerAttachAfterSwitchStateAnimationFinished=n;R.prototype.setMeAreaSelected=function(e){this.shellCtrl.setMeAreaSelected(e);};R.prototype.getMeAreaSelected=function(){return this.shellCtrl.getMeAreaSelected();};R.prototype.setNotificationsSelected=function(e){this.shellCtrl.setNotificationsSelected(e);};R.prototype.getNotificationsSelected=function(){return this.shellCtrl.getNotificationsSelected();};R.prototype.addShellDanglingControl=function(o){this.shellCtrl.getView().addDanglingControl(o);};R.prototype.getShellConfig=function(){return(this.shellCtrl.getView().getViewData()?this.shellCtrl.getView().getViewData().config||{}:{});};R.prototype.getEndUserFeedbackConfiguration=function(){return this.shellCtrl.oEndUserFeedbackConfiguration;};R.prototype.reorderUserPrefEntries=function(e){return this.shellCtrl._reorderUserPrefEntries(e);};R.prototype.addUserProfilingEntry=function(e){this.shellCtrl.addUserProfilingEntry(e);};R.prototype.logRecentActivity=function(o){if(!o.appType){o.appType=b.APP;}if(!o.appId){o.appId=o.url;}return this.shellCtrl._logRecentActivity(o);};R.prototype.setCurrentCoreView=function(e){this.currentCoreView=e;};R.prototype.getCurrentCoreView=function(){return this.currentCoreView;};return R;});
