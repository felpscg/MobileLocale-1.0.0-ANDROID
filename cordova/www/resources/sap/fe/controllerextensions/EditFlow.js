/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/ControllerExtension","sap/fe/actions/messageHandling","sap/ui/core/XMLTemplateProcessor","sap/ui/core/util/XMLPreprocessor","sap/ui/core/Fragment","sap/fe/actions/sticky","sap/base/Log","sap/m/Text","sap/m/Button","sap/m/Dialog","sap/ui/model/json/JSONModel","sap/ui/core/routing/HashChanger","sap/fe/core/CommonUtils"],function(C,m,X,a,F,s,L,T,B,D,J,H,b){"use strict";var f="sap.fe.controls.field.DraftPopOverAdminData",p=X.loadTemplate(f,"fragment"),u={};var E=C.extend("sap.fe.controllerextensions.EditFlow",{syncTask:function(t){var n;if(t instanceof Promise){n=function(){return t;};}else if(typeof t==="function"){n=t;}this._pTasks=this._pTasks||Promise.resolve();if(!!n){this._pTasks=this._pTasks.then(n).catch(function(){return Promise.resolve();});}return this._pTasks;},createDocument:function(l,P){var t=this;function h(o,c){c.then(function(n){var d=t.base.getView().getBindingContext();if(!b.hasTransientContext(o)){t.requestSideEffects(o.getPath(),d);}});}return this.syncTask().then(function(){return new Promise(function(r,c){var g,d,o,M;P=P||{};if(typeof l==="object"){g=Promise.resolve(l);}else{g=t.base.getView().getModel().getBindingForReference(l);}g.then(function(e){o=e;M=o.getModel();var i=P.creationMode;if((!i||i==="NewPage")&&t.base.getView().getViewData()._creationMode==="Inplace"){i="Inline";}return t.base.transaction.getProgrammingModel(o).then(function(j){d=j;if(i&&i!=="NewPage"){return i;}else{switch(d){case"Draft":case"Sticky":if(!o.isRelative()){var k=M.getMetaModel(),n=o.getPath(),N=d==="Draft"?k.getObject(n+"@com.sap.vocabularies.Common.v1.DraftRoot/NewAction"):k.getObject(n+"@com.sap.vocabularies.Session.v1.StickySessionSupported/NewAction"),q=(N&&k.getObject("/"+N+"/@$ui5.overload/0/$Parameter"))||[];if(q.length>1){return"Deferred";}}return"Async";case"NonDraft":return"Sync";}}});}).then(function(e){var i,A,j=P.creationRow,k,v=Promise.resolve();if(e!=="Deferred"){if(e==="CreationRow"){P.data=P.creationRow.getBindingContext().getObject();k=j.getBindingContext();v=t.checkForValidationErrors(k);}if(e==="CreationRow"||e==="Inline"){P.keepTransientContextOnFailed=true;P.busyMode="Local";if(e==="CreationRow"){P.busyMode="None";}if(e==="Inline"){P.keepTransientContextOnFailed=false;}t.handleCreateEvents(o);}i=v.then(function(){return t.base.transaction.createDocument(o,P);});}switch(e){case"Deferred":t.base.routing.navigateToContext(o,{deferredContext:true,noHistoryEntry:P.noHistoryEntry,editable:true});break;case"Async":t.base.routing.navigateToContext(o,{asyncContext:i,noHistoryEntry:P.noHistoryEntry,editable:true});break;case"Sync":A={noHistoryEntry:P.noHistoryEntry,editable:true};if(d=="Sticky"){A.transient=true;}i.then(function(n){t.base.routing.navigateToContext(n,A);});break;case"Inline":h(o,i);break;case"CreationRow":v.then(function(){var n=k.getBinding(),N;h(o,i);N=n.create();j.setBindingContext(N);k.created().then(undefined,function(){L.trace("transient fast creation context deleted");});k.delete("$direct");});break;}if(i){i.then(function(n){if(n){t.base.routing.setDirtyState(n,true);if(d==="Sticky"){t._handleStickyOn(n);}}r();},c);}else{r();}});});});},editDocument:function(c){var t=this;this.base.transaction.editDocument(c).then(function(n){t.base.transaction.getProgrammingModel(c).then(function(P){var N;if(P==="Sticky"){t._handleStickyOn(n);N=true;}if(n!==c){t.handleNewContext(n,true,N,true);}});});},saveDocument:function(c){var t=this;return(this.syncTask().then(this._submitOpenChanges.bind(this,c)).then(this.checkForValidationErrors.bind(this,c)).then(this.base.transaction.saveDocument.bind(this.base.transaction,c)).then(function(A){return t.base.transaction.getProgrammingModel(c).then(function(P){var n;if(P==="Sticky"){var h=A.getModel().bindContext(A.getPath(),undefined,{$$groupId:"$auto"});A=h.getBoundContext();t._handleStickyOff(c);if(c.getPath()===A.getPath()){n=true;}}if(A!==c){t.handleNewContext(A,true,n,false);}});}));},cancelDocument:function(c,P){var t=this;this.syncTask().then(this.base.transaction.cancelDocument.bind(this.base.transaction,c,P)).then(function(A){t.base.transaction.getProgrammingModel(c).then(function(d){var n;if(d==="Sticky"){t._handleStickyOff(c);n=true;var r=t.getView().getModel("relatedAppsModel");r.setProperty("/visibility",r.getProperty("/visibilityBeforeEdit"));}if(!A){t.base.routing.setDirtyState(c,true);window.history.back();}else{t.handleNewContext(A,true,n,false);}});});},requestSideEffects:function(n,o){var M=this.base.getView().getModel().getMetaModel(),c="/"+M.getObject(M.getMetaPath(o.getPath()))["$Type"],A=M.getObject(c+"@"),S=Object.keys(A).filter(function(i){return i.indexOf("@com.sap.vocabularies.Common.v1.SideEffects")>-1;}),d=[],P,e=[],g=[],h;S.forEach(function(i){var j=A[i];if(j.SourceEntities){j.SourceEntities.forEach(function(k){if(k["$NavigationPropertyPath"]===n){d.push(i);}});}if(j.SourceProperties&&d.indexOf(i)===-1){j.SourceProperties.forEach(function(k){if(d.indexOf(i)===-1&&k["$PropertyPath"].indexOf(n+"/")===0){d.push(i);}});}});d.forEach(function(i){var j=[],k=A[i],t=k.TargetProperties||[],l=k.TargetEntities||[];t=t.map(function(q){return q["$PropertyPath"];}).filter(function(q){return e.indexOf(q)<0;});t.forEach(function(q){var r=M.getObject(c+"/"+q+"@com.sap.vocabularies.Common.v1.Text");if(r&&r["$Path"]){j.push(r["$Path"]);}});l=l.map(function(q){return q["$NavigationPropertyPath"];}).filter(function(q){return g.indexOf(q)<0;});e=e.concat(t).concat(j);g=g.concat(l);});P=e.map(function(i){return{"$PropertyPath":i};}).concat(g.map(function(i){return{"$NavigationPropertyPath":i};}));if(P.length){h=b.getContextForSideEffects(o);h.requestSideEffects(P);}},deleteDocument:function(c,P){var t=this,l=this.base.getView().getModel("localUI"),o;P=P||{};this.syncTask().then(this.base.transaction.deleteDocument.bind(this.base.transaction,c,P,l)).then(function(){var d=t.base.getView().getBindingContext();var e=t.getView().byId(P.controlId);if(e&&e.isA("sap.ui.mdc.Table")){e.clearSelection();}if(d&&Array.isArray(c)){o=c[0].getBinding();if(!b.hasTransientContext(o)){t.requestSideEffects(o.getPath(),d);}}if(!Array.isArray(c)){t.base.routing.setDirtyState(c,true);window.history.back();}});},applyDocument:function(c){var U=this.base.getView().getModel("ui");var i=this.base.getView().getModel("sap.fe.i18n");U.setProperty("/busy",true);return this._submitOpenChanges(c).then(function(){U.setProperty("/busy",false);m.showUnboundMessages();window.history.back();return true;}).catch(function(e){var d=[];d.push({text:i.getResourceBundle().getText("SAPFE_APPLY_ERROR"),type:"Error"});U.setProperty("/busy",false);m.showUnboundMessages(d);return false;});},_submitOpenChanges:function(c){var M=c.getModel();var P=[];P.push(M.submitBatch("$auto"));P.push(M.submitBatch("$auto.associations"));return Promise.all(P).then(function(){if(M.hasPendingChanges("$auto")||M.hasPendingChanges("$auto.associations")){return Promise.reject("submit of open changes failed");}});},_handleStickyOn:function(c){if(!this.bStickyOn){this.bStickyOn=true;var r=H.getInstance().getHash(),h=r;if(sap.ushell){this.fnDirtyStateProvider=function(){var d=H.getInstance().getHash(),e;if(h===d){e=true;}else if(d!==""&&r.indexOf(d.split("/")[0])===0){h=d;e=false;}else{e=true;}if(e){setTimeout(function(){sap.ushell.Container.setDirtyFlag(false);},0);}return e;};sap.ushell.Container.registerDirtyStateProvider(this.fnDirtyStateProvider);}var i=this.base.getView().getModel("sap.fe.i18n"),t=this;this.fnHandleSessionTimeout=function(){m.removeBoundTransitionMessages();m.removeUnboundTransitionMessages();var d=new D({title:"{sap.fe.i18n>OBJECT_PAGE_SESSION_EXPIRED_DIALOG_TITLE}",state:"Warning",content:new T({text:"{sap.fe.i18n>OBJECT_PAGE_SESSION_EXPIRED_DIALOG_MESSAGE}"}),beginButton:new B({text:"{sap.fe.i18n>SAPFE_OK}",type:"Emphasized",press:function(){t._handleStickyOff();window.history.back();}}),afterClose:function(){d.destroy();}});d.addStyleClass("sapUiContentPadding");d.setModel(i,"sap.fe.i18n");t.base.getView().addDependent(d);d.open();};this.base.getView().getModel().attachSessionTimeout(this.fnHandleSessionTimeout);this.fnStickyDiscard=function(){var d=H.getInstance().getHash();if(!d||r.indexOf(d.split("/")[0])===-1){s.discardDocument(c);t._handleStickyOff();}};this.base.routing.attachOnAfterNavigation(this.fnStickyDiscard);}},_handleStickyOff:function(){if(sap.ushell){if(this.fnDirtyStateProvider){sap.ushell.Container.deregisterDirtyStateProvider(this.fnDirtyStateProvider);this.fnDirtyStateProvider=null;}}if(this.base.getView().getModel()&&this.fnHandleSessionTimeout){this.base.getView().getModel().detachSessionTimeout(this.fnHandleSessionTimeout);}this.base.routing.detachOnAfterNavigation(this.fnStickyDiscard);this.fnStickyDiscard=null;this.bStickyOn=false;},handleNewContext:function(c,n,N,e){this.base.routing.setDirtyState(c,true);this.base.routing.navigateToContext(c,{noHistoryEntry:n,noHashChange:N,editable:e});},onCallAction:function(A,P){var t=this,c;return this.syncTask().then(t.base.transaction.onCallAction.bind(t.base.transaction,A,P)).then(function(){if(P.contexts){c=Array.isArray(P.contexts)?P.contexts[0]:P.contexts;t.base.routing.setDirtyState(c,true);}});},formatDraftOwnerText:function(d,c,e,g,h){var i="",r=sap.ui.getCore().getLibraryResourceBundle("sap.fe");var U=c||d||g||e;if(h){i+=d?r.getText("DRAFTINFO_GENERIC_LOCKED_OBJECT_POPOVER_TEXT")+" ":r.getText("DRAFTINFO_LAST_CHANGE_USER_TEXT")+" ";}i+=U?r.getText("DRAFTINFO_OWNER",[U]):r.getText("DRAFTINFO_ANOTHER_USER");return i;},formatDraftOwnerTextInline:function(d,c,e,g){return this.formatDraftOwnerText(d,e,c,g,false);},formatDraftOwnerTextInPopover:function(d,c,e,g){return this.formatDraftOwnerText(d,e,c,g,true);},onDraftLinkPressed:function(e,c){var t=this,o=e.getSource(),d=o.getBindingContext(),v=this.base.getView(),M=v.getModel().getMetaModel(),g=v.getController(),O=function(){var P=t._oPopover.getModel("draftInfo");P.setProperty("/bIsActive",d.getProperty("IsActiveEntity"));P.setProperty("/bHasDraft",d.getProperty("HasDraftEntity"));t._oPopover.getModel().bindContext(d.getPath(),undefined,{$$groupId:"$auto"});t._oPopover.openBy(o);};if(!this._oPopover||!this._oPopover.oPopup){Promise.resolve(t._oFragment||a.process(p,{},{bindingContexts:{entitySet:M.createBindingContext("/"+c)},models:{entitySet:M}})).then(function(h){t._oFragment=h;return F.load({definition:h,controller:g});}).then(function(P){t._oPopover=P;v.addDependent(t._oPopover);var h=new J({bIsActive:undefined,bHasDraft:undefined});t._oPopover.setModel(h,"draftInfo");O();});}else{O();}},closeDraftAdminPopover:function(){this._oPopover.close();},handlePatchEvents:function(o){var t=this.transactionStateModel;t.setProperty("/draftStatus","Clear");var c=this;return c.base.transaction.getProgrammingModel(o).then(function(P){o=(o.getBinding&&o.getBinding())||o;o.attachEvent("patchSent",function(){c.base.transaction.handleDocumentModifications();c.base.routing.setDirtyState((o.getBoundContext&&o.getBoundContext())||"",true);if(P==="Draft"){t.setProperty("/draftStatus","Saving");}});o.attachEvent("patchCompleted",function(e){if(P==="Draft"){t.setProperty("/draftStatus",e.getParameter("success")?"Saved":"Clear");}m.showUnboundMessages();});});},handleCreateEvents:function(o){var t=this.transactionStateModel;t.setProperty("/draftStatus","Clear");var c=this;return c.base.transaction.getProgrammingModel(o).then(function(P){o=(o.getBinding&&o.getBinding())||o;o.attachEvent("createSent",function(){c.base.transaction.handleDocumentModifications();if(P==="Draft"){t.setProperty("/draftStatus","Saving");}});o.attachEvent("createCompleted",function(e){if(P==="Draft"){t.setProperty("/draftStatus",e.getParameter("success")?"Saved":"Clear");}m.showUnboundMessages();});});},handleErrorOfTable:function(e){if(e.getParameter("error")){setTimeout(m.showUnboundMessages,0);}},getUIStateModel:function(){var A,t=this;if(!this.editFlowStateModel){A=this.base.getView().getController().getOwnerComponent().getId();if(!u[A]){u[A]=this.base.transaction.getUIStateModel();}else{this.base.transaction.setUIStateModel(u[A]);}this.transactionStateModel=u[A];this.editFlowStateModel=new J(this.transactionStateModel.getData());this.transactionStateModel.bindList("/").attachChange(function(){var c=t.editFlowStateModel.getProperty("/createMode");t.editFlowStateModel.setJSON(t.transactionStateModel.getJSON());t.editFlowStateModel.setProperty("/createMode",c);});}return this.editFlowStateModel;},computeEditMode:function(c){var t=this;return new Promise(function(r,d){var e=t.getUIStateModel(),o=t.transactionStateModel;t.base.transaction.getProgrammingModel(c).then(function(P){if(P==="Draft"){c.requestObject("IsActiveEntity").then(function(i){if(i===false){o.setProperty("/editable","Editable");c.requestObject("HasActiveEntity").then(function(h){if(h){e.setProperty("/createMode",false);}else{e.setProperty("/createMode",true);}r();});}else{o.setProperty("/editable","Display");r();}});}else{r();}});});},setEditMode:function(e,c){var o=this.getUIStateModel(),t=this.transactionStateModel;if(e){t.setProperty("/editable",e);}if(c!==undefined){o.setProperty("/createMode",c);}},checkForValidationErrors:function(c){return this.syncTask().then(function(){var P=c.getPath(),M=sap.ui.getCore().getMessageManager().getMessageModel().getData(),o,d;for(var i=0;i<M.length;i++){d=M[i];if(d.validation){o=sap.ui.getCore().byId(d.getControlId());if(o&&o.getBindingContext()&&o.getBindingContext().getPath().indexOf(P)===0){return Promise.reject("validation errors exist");}}}});}});return E;});
