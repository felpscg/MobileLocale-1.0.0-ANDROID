/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2","sap/ui/fl/changeHandler/HideControl"],function(U,A,H){"use strict";var R={};R.applyChange=function(c,C,p){var s=c.getContent().customChanges[0].oSelector;var e=p.modifier.bySelector(s);if(e){H.applyChange(c,e,p);}};R.completeChangeContent=function(c,s,p){var r=s.removedElement.id;var m=U.getMetaModel(s,p);var o=p.modifier.bySelector(r,p.appComponent);var S=p.modifier.getSelector(r,p.appComponent);var a=s.custom.fnGetRelevantElement?s.custom.fnGetRelevantElement(o):o;var C={};var e="";var E={};var b=[];var d=[];var f="";var t=U.getTemplatingInfo(a);if(t&&t.target&&t.annotation){if(o.getId().indexOf("ObjectPage")>-1&&o.getId().indexOf("LineItem")>-1){var g=o.getParent().getParent().getEntitySet();e=o.getParent().getParent().getModel().getMetaModel().getODataEntitySet(g).entityType;}else{e=t.target;}E=m.getODataEntityType(e);f=t.annotation;b=E[f];}else{if(o.getId().indexOf("ObjectPage")>-1&&o.getId().indexOf("LineItem")>-1){var g=o.getParent().getParent().getEntitySet();e=o.getParent().getParent().getModel().getMetaModel().getODataEntitySet(g).entityType;}else{e=U.getEntityType(o);}E=m.getODataEntityType(e);f=s.custom.annotation;b=E[f];}d=b.slice();var i=s.custom.fnGetAnnotationIndex&&s.custom.fnGetAnnotationIndex(o);H.completeChangeContent(c,s,p);if(s.custom.fnPerformCustomRemove){s.custom.fnPerformCustomRemove(a,b);C=A.createCustomAnnotationTermChange(e,b,d,f);}else if(i>=0){b.splice(i,1);C=A.createCustomAnnotationTermChange(e,b,d,f);}C.removedElementId=r;C.oSelector=S;var h=A.createCustomChanges(C);h.noRefreshOnChange=true;jQuery.extend(true,c.getContent(),h);};return R;},true);
