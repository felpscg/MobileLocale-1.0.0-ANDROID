sap.ui.define(["sap/ui/fl/changeHandler/ChangeHandlerMediator","sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils","sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils","./library.designtime"],function(C,U,D){"use strict";var F="com.sap.vocabularies.UI.v1.Facets";var g={getDesigntime:function(e,o){var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();var s={name:{singular:function(){return r.getText("FE_GROUP");},plural:function(){return r.getText("FE_GROUPS");}},properties:function(e){return D.ignoreAllProperties(e);},actions:null};if(o){return s;}var E={getCommonInstanceData:function(e){var t=U.getTemplatingInfo(e);if(t&&t.path){var T=t.target+'/'+t.path.substr(t.path.indexOf(F));return{target:T,annotation:t.annotation,qualifier:null};}},links:{developer:[{href:"/topic/facfea09018d4376acaceddb7e3f03b6",text:function(){return r.getText("FE_SDK_GUIDE_SECTIONS");}}]},aggregations:{formElements:{properties:function(e){return D.ignoreAllProperties(e);},actions:{addODataProperty:function(){var c=C.getAddODataFieldSettings(e).then(function(m){if(m){m.content.requiredLibraries="";}return m;});return{changeType:"addGroupElement",changeOnRelevantContainer:true,changeHandlerSettings:c};},move:"moveGroupElement"}}},actions:{remove:{changeType:"removeGroup",changeOnRelevantContainer:true},rename:null},annotations:{referenceFacet:{namespace:"com.sap.vocabularies.UI.v1",annotation:"ReferenceFacet",whiteList:{properties:["Target","Label","ID"],mandatory:["Target"],expressionTypes:{Label:["String"]}},links:{developer:[{href:"/topic/facfea09018d4376acaceddb7e3f03b6.html",text:"Smart Form"}]},appliesTo:["SmartForm/Groups"]}}};return jQuery.extend(true,s,E);}};return g;});
