sap.ui.define(["sap/ui/core/mvc/OverrideExecution","sap/suite/ui/generic/template/lib/TemplateAssembler","sap/suite/ui/generic/template/lib/TemplateComponent","sap/suite/ui/generic/template/detailTemplates/detailUtils","sap/suite/ui/generic/template/ObjectPage/controller/ControllerImplementation","sap/suite/ui/generic/template/ObjectPage/controllerFrameworkExtensions"],function(O,T,a,d,C,c){"use strict";function g(o,b){var v={};var B=d.getComponentBase(o,b,v);var s={oControllerSpecification:{getMethods:C.getMethods.bind(null,v),oControllerDefinition:c,oControllerExtensionDefinition:{provideExtensionStateData:function(S){},restoreExtensionStateData:function(G,i){},ensureFieldsForSelect:function(e,f){},addFilters:function(A,e){}}},getTemplateSpecificParameters:function(){return{breadCrumb:b.getBreadCrumbInfo()};},refreshBinding:function(u,r){if(u){b.refreshBindingUnconditional();}else{v.refreshFacets(r);}},presetDisplayMode:function(D,i){if(i){return;}var t=b.getTemplatePrivateModel();t.setProperty("/objectPage/displayMode",D);},showConfirmationOnDraftActivate:function(){return o.getShowConfirmationOnDraftActivate();},beforeRebind:function(){v.beforeRebind();},afterRebind:function(){v.afterRebind();},enhanceExtensionAPI4Reuse:function(e,E){e.setSectionHidden=function(h){var t=b.getTemplatePrivateModel();t.setProperty("/generic/embeddedComponents/"+E.key+"/hidden",h);};e.setTagsInHeader=function(t){var f=v.oController.byId("template::ObjectPage::OverflowToolbar");if(f){var h=f.getContent()[0];f.removeContent(h);f.destroyContent();f.addContent(h);for(var i=0;i<t.length;i++){f.addContent(t[i]);}}};}};return Object.assign(B,s);}return T.getTemplateComponent(g,"sap.suite.ui.generic.template.ObjectPage",{metadata:{library:"sap.suite.ui.generic.template",properties:{"templateName":{"type":"string","defaultValue":"sap.suite.ui.generic.template.ObjectPage.view.Details"},"showRelatedApps":{"type":"boolean","defaultValue":"false"},"showConfirmationOnDraftActivate":{"type":"boolean","defaultValue":false},"hideChevronForUnauthorizedExtNav":{"type":"boolean","defaultValue":"false"},"multiSelect":"boolean","allTableMultiSelect":"boolean","editableHeaderContent":{"type":"boolean","defaultValue":"false"},"gridTable":"boolean","tableType":"string",tableSettings:{type:"object",properties:{type:{type:"string",defaultValue:undefined},multiSelect:{type:"boolean",defaultValue:false},selectAll:{type:"boolean",defaultValue:false},selectionLimit:{type:"int",defaultValue:200}}},"condensedTableLayout":"boolean","sections":"object","simpleHeaderFacets":{"type":"boolean","defaultValue":"false"},"allowDeepLinking":"boolean","navToListOnSave":"boolean","designtimePath":{"type":"string","defaultValue":"sap/suite/ui/generic/template/designtime/ObjectPage.designtime"},"flexibilityPath":{"type":"string","defaultValue":"sap/suite/ui/generic/template/ObjectPage/flexibility/ObjectPage.flexibility"}},"manifest":"json"}});});