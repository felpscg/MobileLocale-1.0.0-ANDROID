/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/changeHandler/ChangeHandlerMediator","sap/ui/fl/Utils"],function(C,F){"use strict";function g(e){var s=[];var l;var t;if(e.getMetadata().getName()==="sap.ui.layout.form.FormElement"){l=e.getLabel();if(l){s.push(l);}s=s.concat(e.getFields());}else if(e.getMetadata().getName()==="sap.ui.layout.form.FormContainer"){t=e.getTitle()||e.getToolbar();if(t){s[0]=t;}e.getFormElements().forEach(function(d){l=d.getLabel();if(l){s.push(l);}s=s.concat(d.getFields());});}else if(e.getMetadata().getName()==="sap.ui.layout.form.Form"){s.push(e);}return s;}function a(d){if(d.getMetadata().getName()==="sap.ui.layout.form.SimpleForm"){return d;}else if(d.getParent()){return a(d.getParent());}}function c(d){var s=a(d);return s&&s.getContent().every(function(e){return F.checkControlId(e);});}var f={aggregations:{formContainers:{childNames:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},getIndex:function(d,e){var h=d.getFormContainers();if(e){return h.indexOf(e)+1;}if(h.length>0&&h[0].getFormElements().length===0&&h[0].getTitle()===null){return 0;}return h.length;},beforeMove:function(s){if(s){s._bChangedByMe=true;}},afterMove:function(s){if(s){s._bChangedByMe=false;}},actions:{move:function(d){if(c(d)){return{changeType:"moveSimpleFormGroup"};}},createContainer:{changeType:"addSimpleFormGroup",changeOnRelevantContainer:true,isEnabled:function(d){var e=d.getFormContainers();for(var i=0;i<e.length;i++){if(e[i].getToolbar&&e[i].getToolbar()){return false;}}return true;},getCreatedContainerId:function(n){var t=sap.ui.getCore().byId(n);var p=t.getParent().getId();return p;}}}}},getStableElements:g};var o={name:{singular:"GROUP_CONTROL_NAME",plural:"GROUP_CONTROL_NAME_PLURAL"},aggregations:{formElements:{childNames:{singular:"FIELD_CONTROL_NAME",plural:"FIELD_CONTROL_NAME_PLURAL"},beforeMove:function(s){if(s){s._bChangedByMe=true;}},afterMove:function(s){if(s){s._bChangedByMe=false;}},actions:{move:function(d){if(c(d)){return{changeType:"moveSimpleFormField"};}},addODataProperty:function(d){var m=C.getAddODataFieldWithLabelSettings(d);if(m){return{changeType:"addSimpleFormField",changeOnRelevantContainer:true,changeHandlerSettings:m};}}}}},actions:{rename:function(r){return{changeType:"renameTitle",changeOnRelevantContainer:true,isEnabled:!(r.getToolbar()||!r.getTitle()),domRef:function(d){if(d.getTitle&&d.getTitle()){return d.getTitle().getDomRef();}}};},remove:function(r){return{changeType:"removeSimpleFormGroup",changeOnRelevantContainer:true,isEnabled:!!(r.getToolbar()||r.getTitle()),getConfirmationText:function(r){var d=false;if(r.getMetadata().getName()==="sap.ui.layout.form.FormContainer"&&r.getToolbar&&r.getToolbar()){var t=r.getToolbar().getContent();if(t.length>1){d=true;}else if((t.length===1)&&(!t[0].getMetadata().isInstanceOf("sap.ui.core.Label")&&!t[0]instanceof sap.ui.core.Title&&!t[0]instanceof sap.m.Title)){d=true;}}if(d){var T=sap.ui.getCore().getLibraryResourceBundle("sap.ui.layout.designtime");return T.getText("MSG_REMOVING_TOOLBAR");}}};}},getStableElements:g};var b={name:{singular:"FIELD_CONTROL_NAME",plural:"FIELD_CONTROL_NAME_PLURAL"},actions:{rename:{changeType:"renameLabel",changeOnRelevantContainer:true,domRef:function(d){return d.getLabel().getDomRef();}},remove:{changeType:"hideSimpleFormField",changeOnRelevantContainer:true},reveal:{changeType:"unhideSimpleFormField",changeOnRelevantContainer:true}},getStableElements:g};return{palette:{group:"LAYOUT",icons:{svg:"sap/ui/layout/designtime/form/SimpleForm.icon.svg"}},aggregations:{content:{ignore:true},title:{ignore:true},toolbar:{ignore:function(s){return!s.getToolbar();},domRef:function(s){return s.getToolbar().getDomRef();}},form:{ignore:false,propagateMetadata:function(e){var t=e.getMetadata().getName();if(t==="sap.ui.layout.form.Form"){return f;}else if(t==="sap.ui.layout.form.FormContainer"){return o;}else if(t==="sap.ui.layout.form.FormElement"){return b;}else{return{actions:null};}},propagateRelevantContainer:true}}};},false);
