/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/support/Plugin","sap/ui/core/support/Support","sap/ui/core/util/reflection/JsControlTreeModifier","sap/ui/model/json/JSONModel","sap/ui/fl/FlexController","sap/ui/fl/ChangePersistenceFactory","sap/ui/fl/Utils","sap/ui/fl/support/apps/uiFlexibilityDiagnostics/helper/Extractor"],function(q,P,S,J,a,F,C,U,E){"use strict";var b=P.extend("sap.ui.fl.support.Flexibility",{constructor:function(s){P.apply(this,["sapUiSupportFlexibility","Flexibility",s]);this._oStub=s;if(this.runsAsToolPlugin()){this._aEventIds=[this.getId()+"SetApps",this.getId()+"SetChangesMaps"];}else{this._aEventIds=[this.getId()+"GetApps",this.getId()+"GetChangesMaps"];}}});b.prototype.sDelimiter=";";b.prototype.sNoDebug="noDebug";b.prototype.init=function(s){P.prototype.init.apply(this,arguments);var n="<div class='sapUiSmallMargin'>sapui5 has to be in <b>debug mode</b> or at least the "+"library \'<b> sap.ui.fl</b>\' has to be debugged.</div>"+"<div class='sapUiSmallMargin'>To set the debug sources use the URL parameter '<b>sap-ui-debug</b> "+"with general debug setting <b>sap-ui-debug=true</b> or to debug single libraries by naming the libraries "+"<b>sap-ui-debug=lib1, lib2, ...</b> (including '<b>sap/ui/fl</b>' like '<b>sap-ui-debug=sap/ui/fl</b>').</div>"+"<div class='sapUiSmallMargin'>Another option is to enable the debugging in this 'Diagnostics' window by "+"toggle the <b>Debug Sources</b> under the <b>Technical Info</b> panel.</div>";var p="<div class='sapUiSmallMargin'>The applications listed below have been handled by the sap.ui.fl library in this session.</div>"+"<div class='sapUiSmallMarginBegin'>You can download a file containing the data that has been applied to an application as well as "+"relevant runtime information, and then upload this file to the UI Flexibility Diagnostics application for further investigation.</div>"+"<div class='sapUiSmallMarginBegin'>The UI Flexibility Diagnostics application displays graphs and is only available with SAPUI5.</div>";if(s.isToolStub()){this.addStylesheet("sap/ui/fl/support/flexibility");this.oChangesModel=new a();this.oAppModel=new a();this.oToolSettings=new a({hideDependingChanges:false,flInDebug:true,noDebugInfoText:n,panelInfoText:p});this.oChangeDetails=new a();this._renderToolPlugin([]);S.getStub().sendEvent(this.getId()+"GetApps",{});}else{this.onsapUiSupportFlexibilityGetApps();}};b.prototype._renderToolPlugin=function(){var t=this;var _=function(){var r=sap.ui.getCore().createRenderManager();r.write("<div id='"+t.getId()+"-FlexCacheArea' class='sapUiSizeCompact' />");r.flush(t.$().get(0));r.destroy();};var c=function(){t.oView=sap.ui.view({viewName:"sap.ui.fl.support.diagnostics.Flexibility",type:sap.ui.core.mvc.ViewType.XML,viewData:{plugin:t}});t.oView.placeAt(t.getId()+"-FlexCacheArea");t.oView.setModel(t.oAppModel,"flexApps");t.oView.setModel(t.oToolSettings,"flexToolSettings");t.oView.setModel(t.oChangesModel,"flexChanges");t.oView.setModel(t.oChangeDetails,"flexChangeDetails");};_();c();};b.prototype.onRefresh=function(){S.getStub().sendEvent(this.getId()+"GetApps",{});};b.prototype.onsapUiSupportFlexibilityGetApps=function(){if(U.isDebugEnabled()){var t=this;var A=[];if(C._instanceCache){q.each(C._instanceCache,function(r,i){q.each(i,function(v,c){A.push({key:r+t.sDelimiter+v,text:r,additionalText:v,data:E.extractData(c)});});});}this._oStub.sendEvent(this.getId()+"SetApps",A);}else{this._oStub.sendEvent(this.getId()+"SetApps",this.sNoDebug);}};b.prototype.onsapUiSupportFlexibilityGetChangesMaps=function(e){var A=e.mParameters.appKey;var c=A.split(this.sDelimiter);var s=c[0];var d=c[1];this._getChangesMapForApp(s,d);};b.prototype.onsapUiSupportFlexibilitySetApps=function(e){var A=e.getParameters();var f=A!==this.sNoDebug;this.oToolSettings.setProperty("/flInDebug",f);if(f){this.oAppModel.setData(A);}};b.prototype.onsapUiSupportFlexibilitySetChangesMaps=function(e){var c=e.getParameters();this.oChangesModel.setData(c);this.oView.byId("Tree").expandToLevel(1000);};b.prototype.exit=function(){P.prototype.exit.apply(this,arguments);};b.prototype._getChangesMapForApp=function(A,s){function _(m,j){h[j]=[];var k=i[j];var l=sap.ui.getCore().byId(j);var n=[];var p=[];var r=[];if(l){if(l.data(F.appliedChangesCustomDataKey)){n=l.data(F.appliedChangesCustomDataKey).split(",");}if(l.data(F.failedChangesCustomDataKeyJs)){p=l.data(F.failedChangesCustomDataKeyJs).split(",");}if(l.data(F.failedChangesCustomDataKeyXml)){r=l.data(F.failedChangesCustomDataKeyXml).split(",");}}h[j]=k.map(c.bind(this,l,n,p,r,m));}function c(j,k,l,n,m,p){var r={id:p.getId(),changeType:p.getChangeType(),selector:p.getSelector(),controlPresent:!!j,indexInAppliedChanges:undefined,indexOfFirstFailing:undefined,dependentControls:[],dependentChanges:[],someDirectDependingChangesFailed:false,someDirectDependingChangesNotApplied:false,isInSubTree:false};var u=l.concat(n);if(r.controlPresent&&k.indexOf(p.getId())>-1){r.indexInAppliedChanges=k.indexOf(p.getId());}if(r.controlPresent&&l.indexOf(p.getId())>-1){r.modifier="JS";r.indexOfFirstFailing=u.indexOf(p.getId());}if(r.controlPresent&&n.indexOf(p.getId())>-1){r.modifier="XML";r.indexOfFirstFailing=u.indexOf(p.getId());}if(p._aDependentSelectorList){var v=E.getAppComponentInstance(A);r.dependentControls=p._aDependentSelectorList.map(function(w){return{id:w.id,controlPresent:J.bySelector(w,v)};});}m[p.getId()]=r;return r;}function d(j,k,l){var n=l.dependencies;if(n.indexOf(j.id)!==-1){var p=JSON.stringify(m[k].selector)===JSON.stringify(j.selector);j.isInSubTree=j.isInSubTree||p;}}function e(j,k){k.forEach(function(l){q.each(D,d.bind(this,l));l.allDependendingControlsPresent=l.dependentControls.every(function(n){return n.controlPresent;});if(D[l.id]&&D[l.id].dependencies){D[l.id].dependencies.forEach(function(n){var p=m[n];var r=p.indexInAppliedChanges===undefined;p=m[n];l.someDirectDependingChangesNotApplied=l.someDirectDependingChangesNotApplied||r;var u=p.indexOfFirstFailing===undefined;var v=u&&r;l.someDirectDependingChangesFailed=l.someDirectDependingChangesFailed||u;l.someDirectDependingChangesNotSuccessfulApplied=l.someDirectDependingChangesNotSuccessfulApplied||v;l.dependentChanges.push(p);});}l.isApplicable=!l.someDirectDependingChangesNotApplied&&l.controlPresent&&l.allDependendingControlsPresent&&!l.someDirectDependingChangesNotApplied;l.isPossibleRootCause=l.isApplicable&&l.indexInAppliedChanges===undefined;});}function f(j){j=j.filter(function(k){return!j.some(function(l){return l.dependentChanges.some(function(n){return n.id===k.id;});});});return j.map(function(k){return{id:k.id,text:k.changeType,nodes:k.dependentChanges?f(k.dependentChanges):[]};});}function g(j,k){t.push({text:j,nodes:f(k)});}var m={};var h={};var t=[];var o=C.getChangePersistenceForComponent(A,s);var i=o._mChanges.mChanges;var D=o._mChangesInitial.mDependencies;Object.keys(i).forEach(_.bind(this,m));q.each(h,e);q.each(h,g);this._oStub.sendEvent(this.getId()+"SetChangesMaps",{changes:m,tree:t});};return b;});
