/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/fe/controllerextensions/Transaction","sap/fe/controllerextensions/Routing","sap/fe/controllerextensions/EditFlow","sap/ui/model/odata/v4/ODataListBinding","sap/fe/macros/field/FieldRuntime","sap/base/Log","sap/fe/core/CommonUtils"],function(C,J,T,R,E,O,F,L,a){"use strict";var m;return C.extend("sap.fe.templates.ObjectPage.ObjectPageController",{transaction:T,routing:R,editFlow:E,onInit:function(){this.getView().setModel(this.editFlow.getUIStateModel(),"ui");this.getView().setModel(new J(),"localUI");var r=new J({visibility:false,items:null,visibilityBeforeEdit:false});this.getView().setModel(r,"relatedAppsModel");},onBeforeBinding:function(c,p){var t=this._findTables(),f,b,o=this.byId("fe::op");if(o.getBindingContext()&&o.getBindingContext().hasPendingChanges()){o.getBindingContext().getBinding().resetChanges();}for(var i=0;i<t.length;i++){f=t[i].getCreationRow();if(f){f.setBindingContext(null);}}if(p&&p.editable){if(c===null){b=true;}this.editFlow.setEditMode("Editable",b);}else{if(this.getView().getViewData().viewLevel===1){this.editFlow.setEditMode("Display",false);}else{this.editFlow.setEditMode(undefined,false);}}var s=function(e){o.scrollToSection(o.getScrollingSectionId());o.detachModelContextChange(s);};o.attachModelContextChange(s);},onAfterBinding:function(b,p){var o=this.byId("fe::op"),t=this,M=b.getModel(),c=this._findTables(),f,P;M.getBindingForReference(p.listBindingId).then(function(B){if(B.isA("sap.ui.model.odata.v4.ODataListBinding")){P=t.byId("fe::paginator");if(P&&!P.getListBinding()){P.setListBinding(B);}}});b=o.getBindingContext();f=this.editFlow.computeEditMode(b);function e(d,l){var g=d.getCreationRow(),i,j;if(g){f.then(function(){if(g.getVisible()){i=M.bindList(l.getPath(),l.getContext(),[],[],{$$updateGroupId:"doNotSubmit"});j=i.create();g.setBindingContext(j);j.created().then(undefined,function(){L.trace("transient fast creation context deleted");});}});}}o._triggerVisibleSubSectionsEvents();function h(l,d){M.getBindingForReference(l).then(function(B){t.editFlow.handlePatchEvents(B);e(d,B);});}this.editFlow.handlePatchEvents(b).then(function(){var n,d;for(var i=0;i<c.length;i++){d=c[i].getCustomData();for(var g in d){if(d[g].getKey()==="namedBindingId"){n=d[g].getValue();}}h(n,c[i]);}});},getFooterVisiblity:function(e){m=e.getParameter("iMessageLength");var l=this.getView().getModel("localUI");m>0?l.setProperty("/showMessageFooter",true):l.setProperty("/showMessageFooter",false);},showMessagePopover:function(M){var o=M.oMessagePopover,i=o.getBinding("items");if(i.getLength()>0){o.openBy(M);}},saveDocument:function(c){var t=this;return this.editFlow.saveDocument(c).then(function(){var M=t.getView().byId("MessageButton");var d={onAfterRendering:function(e){t.showMessagePopover(M);M.removeEventDelegate(t._oDelegateOnAfter);delete t._oDelegateOnAfter;}};t._oDelegateOnAfter=d;M.addEventDelegate(d,t);}).catch(function(e){var M=t.getView().byId("MessageButton");if(M){t.showMessagePopover(M);}});},_updateRelatedApps:function(){var o=this.byId("fe::op");this.transaction.getProgrammingModel(o.getBindingContext()).then(function(p){var u=o.getModel("ui").getData();var r=o.getModel("relatedAppsModel");if(p==="Sticky"&&(u.createMode||u.editable==="Editable")){r.setProperty("/visibilityBeforeEdit",r.getProperty("/visibility"));r.setProperty("/visibility",false);}else{if(a.resolveStringtoBoolean(o.data("showRelatedApps"))){a.updateRelatedAppsDetails(o);}}});},_findTables:function(){var o=this.byId("fe::op"),t=[];function f(p,d){for(var e=0;e<p.length;e++){var P=p[e].getAggregation("items")&&p[e].getAggregation("items")[0],g=P&&P.getAggregation("content");if(g&&g.isA("sap.ui.mdc.Table")){t.push(g);if(g.getType().isA("sap.ui.mdc.GridTableType")&&!d.hasStyleClass("sapUxAPObjectPageSubSectionFitContainer")){d.addStyleClass("sapUxAPObjectPageSubSectionFitContainer");}}}}var s=o.getSections();for(var b=0;b<s.length;b++){var S=s[b].getSubSections();for(var c=0;c<S.length;c++){f(S[c].getBlocks(),S[c]);f(S[c].getMoreBlocks(),S[c]);}}return t;},handlers:{onDataRequested:function(){var n=this.getView().getController().getOwnerComponent().getRootControl();n.setBusy(true);},onDataReceived:function(e){var s=e&&e.getParameter("error");var n=this.getView().getController().getOwnerComponent().getRootControl();n.setBusy(false);var t=this;if(s){sap.ui.getCore().getLibraryResourceBundle("sap.fe",true).then(function(r){t.routing.navigateToMessagePage(r.getText("SAPFE_DATA_RECEIVED_ERROR"),{title:r.getText("SAPFE_ERROR"),description:s,navContainer:n});});}else{this._updateRelatedApps();}},onFieldValueChange:function(e){this.editFlow.syncTask(e.getParameter("promise"));F.handleChange(e);},onRelatedAppsItemPressed:function(e){var c=e.getSource().getCustomData();var t,b,d;for(var i=0;i<c.length;i++){var k=c[i].getKey();var v=c[i].getValue();if(k=="targetSemObject"){t=v;}else if(k=="targetAction"){b=v;}else if(k=="targetParams"){d=v;}}var n={target:{semanticObject:t,action:b},params:d};sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(n);},onCallAction:function(v,A,p){var c=v.getController();var t=c;return c.editFlow.onCallAction(A,p).then(function(){var M=t.getView().byId("MessageButton");if(M.isActive()){t.showMessagePopover(M);}else if(m){t._oDelegateOnAfter={onAfterRendering:function(e){t.showMessagePopover(M);M.removeEventDelegate(t._oDelegateOnAfter);delete t._oDelegateOnAfter;}};M.addEventDelegate(t._oDelegateOnAfter,t);}}).catch(function(e){var M=t.getView().byId("MessageButton");if(M){t.showMessagePopover(M);}});}}});});