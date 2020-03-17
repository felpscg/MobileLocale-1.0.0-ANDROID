sap.ui.define(["sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils","sap/suite/ui/generic/template/designtime/library.designtime"],function(D){"use strict";var O={};O.getObjectPageLayoutProperties=function(l){var p=D.ignoreAllProperties(l);var P={showHeaderContent:{ignore:false},showAnchorBar:{ignore:false},useIconTabBar:{ignore:false},alwaysShowContentHeader:{ignore:false}};return jQuery.extend(true,{},p,P);};O.getHBoxProperties=function(h){var p=D.ignoreAllProperties(h);var P={visible:{ignore:false}};return jQuery.extend(true,{},p,P);};O.getDesigntime=function(e){var r=sap.ui.getCore().getModel("i18nDesigntime").getResourceBundle();return{name:{singular:function(){return r.getText("FE_OBJECT_PAGE_LAYOUT");}},properties:function(e){return O.getObjectPageLayoutProperties(e);},aggregations:{_headerContent:{ignore:false},headerContent:{ignore:true},headerTitle:{ignore:false,aggregations:{navigationBar:{ignore:false}},propagateMetadata:function(e){if(e.getMetadata().getElementName()==="sap.m.Bar"){return{aggregations:{contentRight:{propagateMetadata:function(e){switch(e.getMetadata().getElementName()){case"sap.m.HBox":return{actions:{},properties:function(e){return O.getHBoxProperties(e);}};}}}}};}}},sections:{actions:{move:"moveSection",createContainer:{changeType:"addSection",changeOnRelevantContainer:true,getCreatedContainerId:function(n){return n;}}},beforeMove:function(O){}},footer:{propagateRelevantContainer:true,propagateMetadata:function(e){if(e.getMetadata().getElementName()==="sap.m.OverflowToolbar"){return{name:{singular:function(){return r.getText("FE_FOOTER_TOOLBAR");}},aggregations:{content:{propagateRelevantContainer:true,propagateMetadata:function(e){switch(e.getMetadata().getElementName()){case"sap.m.ToolbarSpacer":return{actions:null};}}}}};}}}},scrollContainers:[{domRef:"> .sapUxAPObjectPageWrapper",aggregations:["sections","_headerContent"]},{domRef:function(e){return e.$("vertSB-sb").get(0);}}]};};return O;});
