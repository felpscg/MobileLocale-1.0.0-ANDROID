/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/ui/mdc/designtime/Table.designtime',["sap/ui/mdc/TableSettings"],function(T){"use strict";return{name:"{name}",description:"{description}",aggregations:{_content:{domRef:":sap-domref",ignore:false,propagateRelevantContainer:true,propagateMetadata:function(e){var t=e.getMetadata().getName();if(t==="sap.m.Column"||t==="sap.ui.table.Column"){return{actions:{remove:{changeType:"removeMDCColumn",changeOnRelevantContainer:true}}};}else if(t==="sap.ui.mdc.Table"||t==="sap.ui.table.Table"||t==="sap.m.Table"||t==="sap.m.Toolbar"){return{actions:{settings:{handler:function(c,p){var m=p.contextElement.getParent();return T.showColumnsPanel(m);},changeOnRelevantContainer:true}}};}return{actions:null};}}}};},false);
sap.ui.predefine('sap/ui/mdc/designtime/base/info/PanelItem.designtime',[],function(){"use strict";return{domRef:function(p){},name:{singular:"",plural:""},actions:{remove:function(p){return{changeType:"removeLink"};},reveal:{changeType:"addLink"}}};},false);
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.predefine('sap/ui/mdc/designtime/FilterBar.designtime',["sap/m/Dialog","sap/m/Button",'sap/ui/mdc/base/ConditionModel','sap/ui/mdc/experimental/P13nFilterPanel','sap/ui/mdc/experimental/P13nFilterItem',"sap/ui/mdc/FilterField"],function(D,B,C,P,a,F){"use strict";return{actions:{settings:function(){return{"addFilter":{name:"Add Filter",isEnabled:function(s){return true;},handler:function(f){return new Promise(function(r,R){var c=f.getModel(f.getConditionModelName());var o=c.clone();var b,A,d,h,e,g,s,H;var p=new P();f.oAdaptUIAddFiltersDialog=e=new D({title:"Add Filter",contentHeight:"75%",content:p,verticalScrolling:true,resizable:true,draggable:true,endButton:new B({text:'{$i18n>filterbar.ADAPT_CANCEL}',press:function(){e.close();}}),beginButton:new B({text:'{$i18n>filterbar.ADAPT_OK}',type:'Emphasized',press:function(){var b=g.getObject("/filters");var I=p.getItems();var S,j;I.forEach(function(k){if(!!k.getSelected()){S=k;}});b.forEach(function(k){if(S.getColumnKey()===k.columnKey){j=k;}});e.close();r(j);}}),afterClose:function(){e.getModel("p13n").destroy();e.destroyContent();e.destroy();}});H=[];s=[];h=[];d=[];g=f._getAdaptFilterModel(e);A=g.getObject("/filters");A.forEach(function(j){d.push(j.columnKey);});b=f._getFilterFieldControls();b.forEach(function(j){s.push(j.getFieldPath());});d.forEach(function(j){if(s.indexOf(j)===-1){H.push(j);}});e.setModel(g,"p13n");p.bindAggregation("items",{path:"/filters",model:"p13n",template:new a({columnKey:"{p13n>columnKey}",text:"{p13n>text}",position:"{p13n>position}",tooltip:"{p13n>tooltip}",selected:"{p13n>selected}",control:"{p13n>control}",required:"{p13n>required}"})});for(var i=0;i<A.length;i++){if(H.indexOf(A[i].columnKey)>-1){h.push(A[i]);}}g.setProperty("/filters",h);f.oAdaptUIAddFiltersDialog.setModel(o,f.getConditionModelName());f.oAdaptUIAddFiltersDialog.open();}).then(function(o){return[{selectorControl:f,changeSpecificData:{changeType:"addFilter",content:o}}];});}}};}},aggregations:{_content:{domRef:":sap-domref",propagateMetadata:function(e){var t=e.getMetadata().getName();if(t==="sap.ui.mdc.FilterField"){return{actions:{remove:{changeType:"removeFilter",changeOnRelevantContainer:true},reveal:{changeType:"addFilter",changeOnRelevantContainer:true}}};}else if(t==="sap.ui.layout.AlignedFlowLayout"){return{aggregations:{content:{domRef:":sap-domref",actions:{move:{changeType:"moveFilters",changeOnRelevantContainer:false}}}}};}else{return{actions:null};}},propagateRelevantContainer:function(e){var t=e.getMetadata().getName();if(t==="sap.ui.layout.AlignedFlowLayout"){return e.getParent()?e.getParent():null;}else if(t==="sap.ui.mdc.FilterBar"){return e;}else if(t==="sap.ui.mdc.FilterField"){if(e.getParent()&&e.getParent().getParent()){return e.getParent().getParent();}else{return null;}}else{return null;}}}}};},false);
sap.ui.predefine('sap/ui/mdc/designtime/library.designtime',[],function(){"use strict";return{};});
//# sourceMappingURL=library-preload.designtime.js.map