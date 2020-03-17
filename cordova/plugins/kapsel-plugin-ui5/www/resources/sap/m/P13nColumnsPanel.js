/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/library','sap/ui/model/ChangeReason','sap/ui/model/json/JSONModel','sap/ui/model/BindingMode','sap/ui/core/ResizeHandler','sap/ui/core/IconPool','./library','./Table','./Column','./ColumnListItem','./P13nPanel','./P13nColumnsItem','./SearchField','./ScrollContainer','./Text','./Button','./OverflowToolbar','./OverflowToolbarLayoutData','./OverflowToolbarButton','./ToolbarSpacer',"sap/ui/thirdparty/jquery"],function(C,c,J,B,R,I,l,T,d,e,P,f,S,g,h,i,O,j,k,m,q){"use strict";var n=l.OverflowToolbarPriority;var o=l.ButtonType;var p=l.ToolbarDesign;var L=l.ListType;var r=l.ListMode;var s=l.P13nPanelType;var t=P.extend("sap.m.P13nColumnsPanel",{metadata:{library:"sap.m",properties:{visibleItemsThreshold:{type:"int",group:"Behavior",defaultValue:-1}},aggregations:{columnsItems:{type:"sap.m.P13nColumnsItem",multiple:true,singularName:"columnsItem",bindable:"bindable"},content:{type:"sap.ui.core.Control",multiple:true,singularName:"content",visibility:"hidden"}},events:{addColumnsItem:{parameters:{newItem:{type:"sap.m.P13nColumnsItem"}}},changeColumnsItems:{parameters:{newItems:{type:"sap.m.P13nColumnsItem[]"},existingItems:{type:"sap.m.P13nColumnsItem[]"},items:{type:"object[]"}}},setData:{}}},renderer:function(a,b){a.write("<div");a.writeControlData(b);a.addClass("sapMP13nColumnsPanel");a.writeClasses();a.write(">");var u=b.getAggregation("content");if(u){u.forEach(function(v){a.renderControl(v);});}a.write("</div>");}});t.prototype.init=function(){this._iLiveChangeTimer=0;this._iSearchTimer=0;this._bIgnoreUpdateInternalModel=false;this._bUpdateInternalModel=true;this._bTableItemsChanged=false;this._bOnAfterRenderingFirstTimeExecuted=false;var M=new J({items:[],columnKeyOfMarkedItem:undefined,isMoveDownButtonEnabled:undefined,isMoveUpButtonEnabled:undefined,showOnlySelectedItems:undefined,countOfSelectedItems:0,countOfItems:0});M.setDefaultBindingMode(B.TwoWay);M.setSizeLimit(1000);this.setModel(M,"$sapmP13nColumnsPanel");this.setType(s.columns);this.setTitle(sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("COLUMSPANEL_TITLE"));this._createTable();this._createToolbar();this.setVerticalScrolling(false);var a=new g({horizontal:false,vertical:true,content:[this._oTable],width:'100%',height:'100%'});this.addAggregation("content",a);var b=this;this._fnHandleResize=function(){var u=false,v,w;if(b.getParent){var $=null,x,H;var y=b.getParent();var z=b._getToolbar();if(y&&y.$){$=y.$("cont");if($.children().length>0&&z.$().length>0){v=a.$()[0].clientHeight;x=$.children()[0].clientHeight;H=z?z.$()[0].clientHeight:0;w=x-H;if(v!==w){a.setHeight(w+'px');u=true;}}}}return u;};this._sContainerResizeListener=R.register(a,this._fnHandleResize);};t.prototype.reInitialize=function(){};t.prototype.onBeforeRendering=function(){this._updateInternalModel();if(!this._getInternalModel().getProperty("/columnKeyOfMarkedItem")){this._setColumnKeyOfMarkedItem(this._getColumnKeyByTableItem(this._getVisibleTableItems()[0]));}this._switchMarkedTableItemTo(this._getTableItemByColumnKey(this._getInternalModel().getProperty("/columnKeyOfMarkedItem")));this._updateControlLogic();};t.prototype.onAfterRendering=function(){if(!this._bOnAfterRenderingFirstTimeExecuted){this._bOnAfterRenderingFirstTimeExecuted=true;window.clearTimeout(this._iLiveChangeTimer);var a=this;this._iLiveChangeTimer=window.setTimeout(function(){a._fnHandleResize();},0);}};t.prototype.getOkPayload=function(){this._updateInternalModel();var M=this._getInternalModel().getProperty("/items");return{tableItems:M.map(function(a){return{columnKey:a.columnKey,index:a.persistentIndex===-1?undefined:a.persistentIndex,visible:a.persistentSelected,width:a.width};}),tableItemsChanged:this._bTableItemsChanged,selectedItems:M.filter(function(a){return a.persistentSelected;}).map(function(a){return{columnKey:a.columnKey};})};};t.prototype.getResetPayload=function(){return{oPanel:this};};t.prototype.exit=function(){R.deregister(this._sContainerResizeListener);this._sContainerResizeListener=null;this._getToolbar().destroy();this._oTable.destroy();this._oTable=null;if(this._getInternalModel()){this._getInternalModel().destroy();}window.clearTimeout(this._iLiveChangeTimer);window.clearTimeout(this._iSearchTimer);};t.prototype.addItem=function(a){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}this.addAggregation("items",a);return this;};t.prototype.insertItem=function(a,b){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}this.insertAggregation("items",a,b);return this;};t.prototype.removeItem=function(a){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}a=this.removeAggregation("items",a);return a;};t.prototype.removeAllItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}return this.removeAllAggregation("items");};t.prototype.destroyItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}this.destroyAggregation("items");return this;};t.prototype.addColumnsItem=function(a){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}this.addAggregation("columnsItems",a);return this;};t.prototype.insertColumnsItem=function(a,b){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}this.insertAggregation("columnsItems",a,b);return this;};t.prototype.updateColumnsItems=function(a){this.updateAggregation("columnsItems");if(a===c.Change&&!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}};t.prototype.removeColumnsItem=function(a){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}return this.removeAggregation("columnsItems",a);};t.prototype.removeAllColumnsItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}return this.removeAllAggregation("columnsItems");};t.prototype.destroyColumnsItems=function(){if(!this._bIgnoreUpdateInternalModel){this._bUpdateInternalModel=true;}this.destroyAggregation("columnsItems");return this;};t.prototype.onBeforeNavigationFrom=function(){var M=this._getSelectedModelItems();var v=this.getVisibleItemsThreshold();return!(M&&v!==-1&&M.length>v);};t.prototype._notifyChange=function(){this._bTableItemsChanged=true;var a=this.getChangeNotifier();if(a){a(this);}};t.prototype._scrollToSelectedItem=function(a){if(!a){return;}sap.ui.getCore().applyChanges();if(!!a.getDomRef()){a.focus();}};t.prototype._getInternalModel=function(){return this.getModel("$sapmP13nColumnsPanel");};t.prototype._createTable=function(){this._oTable=new T({mode:r.MultiSelect,rememberSelections:false,itemPress:q.proxy(this._onItemPressed,this),selectionChange:q.proxy(this._onSelectionChange,this),columns:[new d({vAlign:C.VerticalAlign.Middle,header:new h({text:{parts:[{path:'/countOfSelectedItems'},{path:'/countOfItems'}],formatter:function(a,b){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText('COLUMNSPANEL_SELECT_ALL_WITH_COUNTER',[a,b]);}}})})],items:{path:"/items",templateShareable:false,template:new e({cells:[new h({text:"{text}"})],visible:"{visible}",selected:"{persistentSelected}",tooltip:"{tooltip}",type:L.Active})}});this._oTable.setModel(this._getInternalModel());};t.prototype._createToolbar=function(){var a=this;var b=sap.ui.getCore().getLibraryResourceBundle("sap.m");var u=new O(this.getId()+"-toolbar",{design:p.Auto,content:[new m(),new S(this.getId()+"-searchField",{liveChange:function(E){var v=E.getSource().getValue(),D=(v?300:0);window.clearTimeout(a._iSearchTimer);if(D){a._iSearchTimer=window.setTimeout(function(){a._onExecuteSearch();},D);}else{a._onExecuteSearch();}},search:q.proxy(this._onExecuteSearch,this),layoutData:new j({minWidth:"12.5rem",maxWidth:"23.077rem",shrinkable:true,moveToOverflow:false,stayInOverflow:false})}),new i({text:{path:'/showOnlySelectedItems',formatter:function(v){return v?b.getText('COLUMNSPANEL_SHOW_ALL'):b.getText('COLUMNSPANEL_SHOW_SELECTED');}},tooltip:{path:'/showOnlySelectedItems',formatter:function(v){return v?b.getText('COLUMNSPANEL_SHOW_ALL'):b.getText('COLUMNSPANEL_SHOW_SELECTED');}},type:o.Transparent,press:q.proxy(this._onSwitchButtonShowSelected,this),layoutData:new j({moveToOverflow:true,priority:n.High})}),new k({icon:I.getIconURI("collapse-group"),text:b.getText('COLUMNSPANEL_MOVE_TO_TOP'),tooltip:b.getText('COLUMNSPANEL_MOVE_TO_TOP'),type:o.Transparent,enabled:{path:'/isMoveUpButtonEnabled'},press:q.proxy(this.onPressButtonMoveToTop,this),layoutData:new j({moveToOverflow:true,priority:n.Low,group:2})}),new k({icon:I.getIconURI("slim-arrow-up"),text:b.getText('COLUMNSPANEL_MOVE_UP'),tooltip:b.getText('COLUMNSPANEL_MOVE_UP'),type:o.Transparent,enabled:{path:'/isMoveUpButtonEnabled'},press:q.proxy(this.onPressButtonMoveUp,this),layoutData:new j({moveToOverflow:true,priority:n.High,group:1})}),new k({icon:I.getIconURI("slim-arrow-down"),text:b.getText('COLUMNSPANEL_MOVE_DOWN'),tooltip:b.getText('COLUMNSPANEL_MOVE_DOWN'),type:o.Transparent,enabled:{path:'/isMoveDownButtonEnabled'},press:q.proxy(this.onPressButtonMoveDown,this),layoutData:new j({moveToOverflow:true,priority:n.High,group:1})}),new k({icon:I.getIconURI("expand-group"),text:b.getText('COLUMNSPANEL_MOVE_TO_BOTTOM'),tooltip:b.getText('COLUMNSPANEL_MOVE_TO_BOTTOM'),type:o.Transparent,enabled:{path:'/isMoveDownButtonEnabled'},press:q.proxy(this.onPressButtonMoveToBottom,this),layoutData:new j({moveToOverflow:true,priority:n.Low,group:2})})]});u.setModel(this._getInternalModel());this.addAggregation("content",u);};t.prototype.onPressButtonMoveToTop=function(){this._moveMarkedTableItem(this._getMarkedTableItem(),this._getVisibleTableItems()[0]);};t.prototype.onPressButtonMoveUp=function(){var v=this._getVisibleTableItems();this._moveMarkedTableItem(this._getMarkedTableItem(),v[v.indexOf(this._getMarkedTableItem())-1]);};t.prototype.onPressButtonMoveDown=function(){var v=this._getVisibleTableItems();this._moveMarkedTableItem(this._getMarkedTableItem(),v[v.indexOf(this._getMarkedTableItem())+1]);};t.prototype.onPressButtonMoveToBottom=function(){var v=this._getVisibleTableItems();this._moveMarkedTableItem(this._getMarkedTableItem(),v[v.length-1]);};t.prototype._onSwitchButtonShowSelected=function(){this._getInternalModel().setProperty("/showOnlySelectedItems",!this._getInternalModel().getProperty("/showOnlySelectedItems"));this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();this._scrollToSelectedItem(this._getMarkedTableItem());this._updateControlLogic();this._fnHandleResize();};t.prototype._onExecuteSearch=function(){this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();this._updateControlLogic();};t.prototype._switchVisibilityOfUnselectedModelItems=function(){var b=this._isFilteredByShowSelected();var M=this._getInternalModel().getProperty("/items");M.forEach(function(a){if(a.persistentSelected){a.visible=true;return;}a.visible=!b;});this._getInternalModel().setProperty("/items",M);};t.prototype._getVisibleModelItems=function(){return this._getInternalModel().getProperty("/items").filter(function(M){return!!M.visible;});};t.prototype._moveMarkedTableItem=function(a,b){var M=this._getModelItemByColumnKey(this._getColumnKeyByTableItem(a));var u=this._getModelItemByColumnKey(this._getColumnKeyByTableItem(b));var v=this._getModelItemIndexByColumnKey(M.columnKey);var w=this._getModelItemIndexByColumnKey(u.columnKey);this._moveModelItems(v,w);this._scrollToSelectedItem(this._getMarkedTableItem());this._updateControlLogic();this._fireChangeColumnsItems();this._fireSetData();this._notifyChange();};t.prototype._moveModelItems=function(a,b){var M=this._getInternalModel().getProperty("/items");if(a<0||b<0||a>M.length-1||b>M.length-1){return false;}this._removeStyleOfMarkedTableItem();var u=M.splice(a,1);M.splice(b,0,u[0]);this._updateModelItemsPersistentIndex(M);this._updateCounts(M);this._getInternalModel().setProperty("/items",M);this._switchMarkedTableItemTo(this._getMarkedTableItem());return true;};t.prototype._getModelItemByColumnKey=function(a){var M=this._getInternalModel().getProperty("/items").filter(function(b){return b.columnKey===a;});return M[0];};t.prototype._updateCounts=function(M){var a=0;var b=0;M.forEach(function(u){a++;if(u.persistentSelected){b++;}});this._getInternalModel().setProperty("/countOfItems",a);this._getInternalModel().setProperty("/countOfSelectedItems",b);};t.prototype._sortModelItemsByPersistentIndex=function(M){var u;var v;try{v=sap.ui.getCore().getConfiguration().getLocale().toString();if(typeof window.Intl!=='undefined'){u=window.Intl.Collator(v,{numeric:true});}}catch(E){}M.forEach(function(a,b){a.localIndex=b;});M.sort(function(a,b){if(a.persistentSelected===true&&(b.persistentSelected===false||b.persistentSelected===undefined)){return-1;}else if((a.persistentSelected===false||a.persistentSelected===undefined)&&b.persistentSelected===true){return 1;}else if(a.persistentSelected===true&&b.persistentSelected===true){if(a.persistentIndex>-1&&a.persistentIndex<b.persistentIndex){return-1;}else if(b.persistentIndex>-1&&a.persistentIndex>b.persistentIndex){return 1;}else{return a.localIndex-b.localIndex;}}else if((a.persistentSelected===false||a.persistentSelected===undefined)&&(b.persistentSelected===false||b.persistentSelected===undefined)){return u?u.compare(a.text,b.text):a.text.localeCompare(b.text,v,{numeric:true});}});M.forEach(function(a){delete a.localIndex;});};t.prototype._getColumnKeyByTableItem=function(a){var b=this._oTable.indexOfItem(a);if(b<0){return null;}return this._oTable.getBinding("items").getContexts()[b].getObject().columnKey;};t.prototype._getModelItemIndexByColumnKey=function(a){var b=-1;this._getInternalModel().getProperty("/items").some(function(M,u){if(M.columnKey===a){b=u;return true;}});return b;};t.prototype._getSelectedModelItems=function(){return this._getInternalModel().getProperty("/items").filter(function(M){return M.persistentSelected;});};t.prototype._getVisibleTableItems=function(){return this._oTable.getItems().filter(function(a){return a.getVisible();});};t.prototype._getTableItemByColumnKey=function(a){var b=this._oTable.getBinding("items").getContexts();var u=this._oTable.getItems().filter(function(v,w){return b[w].getObject().columnKey===a;});return u[0];};t.prototype._getToolbar=function(){return sap.ui.getCore().byId(this.getId()+"-toolbar")||null;};t.prototype._getSearchField=function(){return sap.ui.getCore().byId(this.getId()+"-searchField")||null;};t.prototype._getSearchText=function(){var a=this._getSearchField();return a?a.getValue():"";};t.prototype._isFilteredBySearchText=function(){return!!this._getSearchText().length;};t.prototype._isFilteredByShowSelected=function(){return this._getInternalModel().getData().showOnlySelectedItems;};t.prototype._updateControlLogic=function(){var b=this._isFilteredBySearchText();var a=this._isFilteredByShowSelected();var v=this._getVisibleTableItems();this._getInternalModel().setProperty("/isMoveUpButtonEnabled",v.indexOf(this._getMarkedTableItem())>0);this._getInternalModel().setProperty("/isMoveDownButtonEnabled",v.indexOf(this._getMarkedTableItem())>-1&&v.indexOf(this._getMarkedTableItem())<v.length-1);var u=sap.ui.getCore().byId(this._oTable.getId()+'-sa');if(u){u.setEnabled(!b&&!a);}};t.prototype._updateModelItemsPersistentIndex=function(M){var a=-1;M.forEach(function(b){b.persistentIndex=-1;if(b.persistentSelected){a++;b.persistentIndex=a;}});};t.prototype._fireSetData=function(){this._bIgnoreUpdateInternalModel=true;this.fireSetData();this._bIgnoreUpdateInternalModel=false;};t.prototype._fireChangeColumnsItems=function(){this._bIgnoreUpdateInternalModel=true;var M=this._getInternalModel().getProperty("/items");var E={newItems:[],existingItems:[],items:M.map(function(a){return{columnKey:a.columnKey,visible:a.persistentSelected,index:a.persistentIndex===-1?undefined:a.persistentIndex,width:a.width,total:a.total};})};M.forEach(function(a){var b=this._getColumnsItemByColumnKey(a.columnKey);if(b){b.setVisible(a.persistentSelected);b.setIndex(a.persistentIndex===-1?undefined:a.persistentIndex);if(a.width!==undefined){b.setWidth(a.width);}if(a.total!==undefined){b.setTotal(a.total);}E.existingItems.push(b);}else{E.newItems.push(new f({columnKey:a.columnKey,visible:a.persistentSelected,index:a.persistentIndex===-1?undefined:a.persistentIndex,width:a.width,total:a.total}));}},this);this.fireChangeColumnsItems(E);this._bIgnoreUpdateInternalModel=false;};t.prototype._getColumnsItemByColumnKey=function(a){var b=this.getColumnsItems().filter(function(u){return u.getColumnKey()===a;});return b[0];};t.prototype._getMarkedTableItem=function(){return this._getTableItemByColumnKey(this._getInternalModel().getProperty("/columnKeyOfMarkedItem"));};t.prototype._setColumnKeyOfMarkedItem=function(a){this._getInternalModel().setProperty("/columnKeyOfMarkedItem",a);};t.prototype._onItemPressed=function(E){this._switchMarkedTableItemTo(E.getParameter('listItem'));this._updateControlLogic();};t.prototype._onSelectionChange=function(E){if(!E.getParameter("selectAll")&&E.getParameter("listItems").length===1){this._switchMarkedTableItemTo(E.getParameter("listItem"));}this._selectTableItem();};t.prototype._selectTableItem=function(){this._updateControlLogic();var M=this._getInternalModel().getProperty("/items");this._updateModelItemsPersistentIndex(M);this._updateCounts(M);this._getInternalModel().setProperty("/items",M);this._fireChangeColumnsItems();this._fireSetData();this._notifyChange();var v=this.getValidationExecutor();if(v){v();}};t.prototype._switchMarkedTableItemTo=function(a){this._removeStyleOfMarkedTableItem();var b=this._getColumnKeyByTableItem(a);if(b){this._setColumnKeyOfMarkedItem(b);a.addStyleClass("sapMP13nColumnsPanelItemSelected");}};t.prototype._removeStyleOfMarkedTableItem=function(){if(this._getMarkedTableItem()){this._getMarkedTableItem().removeStyleClass("sapMP13nColumnsPanelItemSelected");}};t.prototype._filterModelItemsBySearchText=function(){var a=this._getSearchText();a=a.replace(/(^\s+)|(\s+$)/g,'');a=a.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');var b=new RegExp(a,'igm');if(!b){return;}this._getVisibleModelItems().forEach(function(M){M.visible=false;if(typeof M.text==="string"&&M.text.match(b)){M.visible=true;}if(typeof M.tooltip==="string"&&M.tooltip.match(b)){M.visible=true;}});this._getInternalModel().refresh();};t.prototype._updateInternalModel=function(){if(!this._bUpdateInternalModel){return;}this._bUpdateInternalModel=false;this._removeStyleOfMarkedTableItem();var M=this._getInternalModel().getProperty("/items");this._getInternalModel().setProperty("/items",this.getItems().map(function(b){return{columnKey:b.getColumnKey(),visible:true,text:b.getText(),tooltip:b.getTooltip(),persistentIndex:-1,persistentSelected:b.getVisible(),width:undefined,total:undefined};},this));this.getColumnsItems().forEach(function(b){var u=this._getModelItemByColumnKey(b.getColumnKey());if(!u){return;}if(b.getIndex()!==undefined){u.persistentIndex=b.getIndex();}if(b.getVisible()!==undefined){u.persistentSelected=b.getVisible();}if(b.getWidth()!==undefined){u.width=b.getWidth();}if(b.getTotal()!==undefined){u.total=b.getTotal();}},this);this._switchVisibilityOfUnselectedModelItems();this._filterModelItemsBySearchText();var a=this._getInternalModel().getProperty("/items");this._sortModelItemsByPersistentIndex(a);this._updateCounts(a);this._getInternalModel().setProperty("/items",a);this._switchMarkedTableItemTo(this._getMarkedTableItem());if(q(a).not(M).length!==0||q(M).not(a).length!==0){this._bTableItemsChanged=true;}};return t;});
