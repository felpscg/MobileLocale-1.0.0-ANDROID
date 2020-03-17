/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","jquery.sap.global","sap/ui/core/Control","sap/ui/model/ChangeReason","sap/base/util/values","sap/ui/layout/Splitter","sap/ui/layout/SplitterLayoutData","sap/ui/core/ResizeHandler","./InnerGanttChart","./GanttHeader","./GanttSyncedControl","../control/AssociateContainer","../axistime/ProportionZoomStrategy","./SelectionModel","./ExpandModel","./ShapeScheme","./GanttExtension","./GanttScrollExtension","./GanttZoomExtension","./GanttPointerExtension","./GanttDragDropExtension","./GanttPopoverExtension","./GanttConnectExtension","./GanttResizeExtension","./RenderUtils","../misc/Format","../misc/Utility","../config/TimeHorizon","./GanttChartWithTableRenderer"],function(l,q,C,c,v,S,d,R,I,G,e,A,P,f,E,g,h,j,k,m,n,o,p,r,s,F,U,T){"use strict";var t=l.simple.GanttChartWithTableDisplayType,V=l.simple.VisibleHorizonUpdateType;var u=Object.freeze({"totalHorizonUpdated":V.TotalHorizonUpdated,"mouseWheelZoom":V.MouseWheelZoom,"syncVisibleHorizon":V.SyncVisibleHorizon,"initialRender":V.InitialRender,"horizontalScroll":V.HorizontalScroll,"zoomLevelChanged":V.ZoomLevelChanged,"timePeriodZooming":V.TimePeriodZooming});var M=10;var w=60;function x(a,b){return a+b;}function y(a,b){return Math.abs(a-b)<M;}var z=C.extend("sap.gantt.simple.GanttChartWithTable",{metadata:{properties:{width:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",defaultValue:"100%"},shapeSelectionMode:{type:"sap.gantt.SelectionMode",defaultValue:l.SelectionMode.MultiWithKeyboard},shapeSelectionSettings:{type:"object",defaultValue:null},enableCursorLine:{type:"boolean",defaultValue:true},enableNowLine:{type:"boolean",defaultValue:true},nowLineInUTC:{type:"boolean",defaultValue:true},enableVerticalLine:{type:"boolean",defaultValue:true},enableAdhocLine:{type:"boolean",defaultValue:true},adhocLineLayer:{type:"string",defaultValue:l.AdhocLineLayer.Top},dragOrientation:{type:"sap.gantt.DragOrientation",defaultValue:l.DragOrientation.Free},ghostAlignment:{type:"string",defaultValue:l.dragdrop.GhostAlignment.None},showShapeTimeOnDrag:{type:"boolean",defaultValue:false},selectionPanelSize:{type:"sap.ui.core.CSSSize",defaultValue:"30%"},displayType:{type:"sap.gantt.simple.GanttChartWithTableDisplayType",defaultValue:t.Both},disableShapeDoubleClickEvent:{type:"boolean",defaultValue:false}},aggregations:{table:{type:"sap.ui.table.Table",multiple:false},adhocLines:{type:"sap.gantt.AdhocLine",multiple:true,singularName:"adhocLine",bindable:"bindable",visibility:"public"},svgDefs:{type:"sap.gantt.def.SvgDefs",multiple:false,singularName:"svgDef"},shapeSchemes:{type:"sap.gantt.simple.ShapeScheme",multiple:true,singularName:"shapeScheme"},calendarDef:{type:"sap.gantt.def.cal.CalendarDefs",multiple:false,bindable:"bindable"},axisTimeStrategy:{type:"sap.gantt.axistime.AxisTimeStrategyBase",multiple:false,bindable:"bindable"},locale:{type:"sap.gantt.config.Locale",multiple:false},_splitter:{type:"sap.ui.layout.Splitter",multiple:false,visibility:"hidden"},_header:{type:"sap.gantt.simple.GanttHeader",multiple:false,defaultValue:null,visibility:"hidden"},_innerGantt:{type:"sap.gantt.simple.InnerGanttChart",multiple:false,visibility:"hidden"}},events:{shapeSelectionChange:{parameters:{shapeUids:{type:"string[]"}}},shapeResize:{parameters:{shapeUid:{type:"string"},shape:{type:"sap.gantt.shape.BaseShape"},rowObject:{type:"object"},oldTime:{type:"string[]"},newTime:{type:"string[]"}}},shapeMouseEnter:{parameters:{shape:{type:"sap.gantt.shape.BaseShape"},pageX:{type:"int"},pageY:{type:"int"}}},shapeMouseLeave:{parameters:{shape:{type:"sap.gantt.shape.BaseShape"},originEvent:{type:"object"}}},shapePress:{parameters:{shape:{type:"sap.gantt.simple.BaseShape"},rowSettings:{type:"sap.gantt.simple.GanttRowSettings"}},allowPreventDefault:true},shapeDoubleClick:{parameters:{shape:{type:"sap.gantt.shape.BaseShape"},rowSettings:{type:"sap.gantt.simple.GanttRowSettings"}}},shapeContextMenu:{parameters:{shape:{type:"sap.gantt.shape.BaseShape"},rowSettings:{type:"sap.gantt.simple.GanttRowSettings"},pageX:{type:"int"},pageY:{type:"int"}}},dragStart:{parameters:{sourceGanttChart:{type:"sap.gantt.simple.GanttChartWithTable"},draggedShapeDates:{type:"object"},lastDraggedShapeUid:{type:"string"},cursorDateTime:{type:"object"}}},shapeDrop:{parameters:{sourceGanttChart:{type:"sap.gantt.simple.GanttChartWithTable"},targetGanttChart:{type:"sap.gantt.simple.GanttChartWithTable"},draggedShapeDates:{type:"object"},lastDraggedShapeUid:{type:"string"},targetRow:{type:"sap.ui.table.Row"},cursorDateTime:{type:"object"},newDateTime:{type:"object"},targetShape:{type:"sap.gantt.shape.BaseShape"}}},shapeConnect:{parameters:{fromShapeUid:{type:"string"},toShapeUid:{type:"string"},type:{type:"sap.gantt.simple.RelationshipType"}}},visibleHorizonUpdate:{parameters:{type:{type:"sap.gantt.simple.VisibleHorizonUpdateType"},lastVisibleHorizon:{type:"sap.gantt.config.TimeHorizon"},currentVisibleHorizon:{type:"sap.gantt.config.TimeHorizon"}}}}}});z.prototype.init=function(){this.iGanttRenderedWidth=-1;this._bExtensionsInitialized=false;this._oExpandModel=new E();this._oSplitter=new S();this.setAggregation("_splitter",this._oSplitter);this._oSyncedControl=new e();this.setAggregation("_innerGantt",new I());this.setAggregation("_header",new G());this._sPreviousDisplayType=this.getDisplayType();};z.prototype.getInnerGantt=function(){return this.getAggregation("_innerGantt");};z.prototype.onSplitterResize=function(a){var O=a.getParameter("oldSizes"),N=a.getParameter("newSizes"),b=O.length>0&&N.length>0&&O[0]!==N[0],D=this.getDisplayType(),i=N[0];if(b){if(D===t.Both){this._onResize();}var B=function(H){return this.getSelectionPanelSize().startsWith("0")||H[0]!==0;}.bind(this);if(y(O.reduce(x),N.reduce(x))&&O[0]!==N[0]&&B(O)){this.setProperty("selectionPanelSize",i+"px",true);this.fireEvent("_selectionPanelResize",{newWidth:i,displayType:D});}this._draw(true);}};z.prototype.setLayoutData=function(L){this.setAggregation("layoutData",L,true);this.fireEvent("_layoutDataChange");return this;};z.prototype.setDisplayType=function(D){this._sPreviousDisplayType=this.getDisplayType();if(this._sPreviousDisplayType===t.Both&&D!==t.Both){this._iLastTableAreaSize=this.getAggregation("_splitter").getCalculatedSizes()[0];}this.setProperty("displayType",D,false);if(D===t.Table){this.setProperty("selectionPanelSize","auto",true);this._setupDisplayType();}return this;};z.prototype.setSelectionPanelSize=function(a){this.setProperty("selectionPanelSize",a,false);delete this._iLastTableAreaSize;this._setSplitterLayoutData(a,"auto");return this;};z.prototype.applySettings=function(a,b){a=a||{};this._applyMissingSettings(a);C.prototype.applySettings.call(this,a,b);this._initSelectionModel(this.getProperty("shapeSelectionMode"));};z.prototype._applyMissingSettings=function(a){if(!a.axisTimeStrategy){a.axisTimeStrategy=new P();}if(!a.locale){a.locale=l.config.DEFAULT_LOCALE_CET.clone();}if(!a.shapeSchemes){a.shapeSchemes=[new g({key:"default",primary:true})];}else{var H=a.shapeSchemes.some(function(b){return b.getPrimary();});if(!H){q.sap.log.warning("you need set a ShapeSheme with primary:true");}}};z.prototype.getPrimaryShapeScheme=function(){return this.getShapeSchemes().filter(function(a){return a.getPrimary();})[0];};z.prototype.getSyncedControl=function(){return this._oSyncedControl;};z.prototype.getTableRowHeights=function(){return this.getSyncedControl().getRowHeights();};z.prototype.setTable=function(a){this.setAggregation("table",a);a._bVariableRowHeightEnabled=true;var O=this._oSplitter.removeContentArea(0);this._oSplitter.insertContentArea(new A({content:a,enableRootDiv:true,layoutData:a.getLayoutData()?a.getLayoutData().clone():new d()}),0);if(O==null){this._oSyncedControl.syncWith(a);this._oSplitter.addContentArea(this._oSyncedControl);}else if(O&&O.getContent()!==a.getId()){this._oSyncedControl.syncWith(a);}a.detachEvent("_rowsUpdated",this._onTableRowsUpdated,this);a.attachEvent("_rowsUpdated",this._onTableRowsUpdated,this);};z.prototype.setEnableVariableRowHeight=function(b){if(this.getTable()){this.getTable()._bVariableRowHeightEnabled=b;}else{q.sap.log.warning("you need to set table aggregation first");}};z.prototype.getRenderedTimeRange=function(){return this.getAxisTime().getTimeRangeSlice(0,this.iGanttRenderedWidth);};z.prototype._initSelectionModel=function(a){if(this.oSelection){this.oSelection.detachSelectionChanged(this._onSelectionChanged,this);}this.oSelection=new f(a);this.oSelection.attachSelectionChanged(this._onSelectionChanged,this);return this;};z.prototype.setShapeSelectionMode=function(a){this.setProperty("shapeSelectionMode",a);if(this.oSelection){this.oSelection.setSelectionMode(a);}return this;};z.prototype.getSelectedShapeUid=function(){var a=this.oSelection.allUid();return a;};z.prototype._onSelectionChanged=function(a){var b=a.getParameter("shapeUid"),D=a.getParameter("deselectedUid"),i=a.getParameter("silent");this._updateShapeSelections(b,D);if(!i){this.fireShapeSelectionChange({shapeUids:b});}};z.prototype.handleShapePress=function(a){var b=a.shape,i=b.getShapeUid(),B=a.ctrlOrMeta;var N=!b.getSelected();this.oSelection.update(i,{selected:N,ctrl:B,draggable:b.getDraggable(),time:b.getTime(),endTime:b.getEndTime()});};z.prototype._updateShapeSelections=function(a,D){var b=this.getShapeSelectionMode();if(b===l.SelectionMode.None){return;}s.updateShapeSelections(this,a,D);};z.prototype.getSelection=function(){return this.oSelection;};z.prototype.getExpandedBackgroundData=function(){if(this._oExpandModel.hasExpandedRows()){var a=this.getTable().getRows();var b=a.length;var B=this.getTable().getFirstVisibleRow();var D=[];for(var i=0;i<b;i++){if(a[i].getIndex()>=B){var H=a[i].getAggregation("_settings");D.push(H.getRowUid());}}return this._oExpandModel.collectExpandedBgData(D);}};z.prototype.setAxisTimeStrategy=function(a){this.setAggregation("axisTimeStrategy",a,false);a.attachEvent("_redrawRequest",this._onRedrawRequest,this);return this;};z.prototype._onTableRowsUpdated=function(a){if(!this.getVisible()){return;}var b=a.getParameter("reason"),i=this.getInnerGantt();var B=v(c).slice();var D=B.concat(["Render","VerticalScroll","FirstVisibleRowChange","Resize"]);if(D.indexOf(b)!==-1){this.getSyncedControl().setAllowContentScroll(false);i.invalidate();}else{i.getRenderer().renderImmediately(this);}};z.prototype.syncVisibleHorizon=function(a,i,K,b){var B=this.getAxisTimeStrategy();var D=B.getTotalHorizon();var H;var J=this.getVisibleWidth();if(i!==undefined){if(J===undefined){return;}if(K){var L=B.getVisibleHorizon();var N=F.abapTimestampToDate(L.getStartTime());H=U.calculateHorizonByWidth(a,i,J,N);}else{H=U.calculateHorizonByWidth(a,i,J);}}else{H=a;}if(D.getEndTime()<H.getEndTime()){var O=F.abapTimestampToDate(H.getEndTime()).getTime()-F.abapTimestampToDate(H.getStartTime()).getTime();var Q=F.abapTimestampToDate(D.getEndTime());var W=new Date();W.setTime(Q.getTime()-O);H=new T({startTime:W,endTime:Q});}this._updateVisibleHorizon(H,b||"syncVisibleHorizon",J);};z.prototype._updateVisibleHorizon=function(a,b,i){var B=this.getAxisTimeStrategy();B.updateGanttVisibleWidth(i);if(a&&a.getStartTime()){B.setVisibleHorizonWithReason(a,b);}};z.prototype.syncMouseWheelZoom=function(a){this._getZoomExtension().performMouseWheelZooming(a.originEvent,true);};z.prototype.syncTimePeriodZoomOperation=function(a,b,O){this._getZoomExtension().syncTimePeriodZoomOperation(a,b,O);};z.prototype._onRedrawRequest=function(a){var b=a.getParameter("forceUpdate");var i=a.getParameter("valueBeforeChange");var B=a.getParameter("reasonCode");var O=a.getParameter("originEvent");var D=this.getAxisTimeStrategy();if(B!=="totalHorizonUpdated"&&i){if(B!=="syncVisibleHorizon"){var H=D.getVisibleHorizon();var J=this.getVisibleWidth();this.fireEvent("_visibleHorizonUpdate",{reasonCode:B,visibleHorizon:H,visibleWidth:J,originEvent:O});}}this.fireVisibleHorizonUpdate({type:u[B],lastVisibleHorizon:i,currentVisibleHorizon:D.getVisibleHorizon()});b=B==="initialRender"?true:b;this.redraw(b);this._setupDisplayType();};z.prototype.redraw=function(b){if(b){var a=this._getScrollExtension();a.clearOffsetWidth();}this._draw(b);};z.prototype._draw=function(){var i=this.getVisibleWidth();if(!i){return;}var a=this.getAxisTimeStrategy().syncContext(i);this.fireEvent("_zoomInfoUpdated",a);var b=this._getScrollExtension();if(a.axisTimeChanged){b.clearOffsetWidth();}b.needRerenderGantt(function(){this.getInnerGantt().getRenderer().renderImmediately(this);}.bind(this));};z.prototype.onBeforeRendering=function(a){this._updateRowHeightInExpandModel(this.getTable());h.detachEvents(this);this._oSplitter.detachResize(this.onSplitterResize,this);if(this._sResizeHandlerId){R.deregister(this._sResizeHandlerId);}};z.prototype.onAfterRendering=function(a){this._attachExtensions();h.attachEvents(this);this._oSplitter.attachResize(this.onSplitterResize,this);this._sResizeHandlerId=R.register(this,this._onResize.bind(this));this.jumpToVisibleHorizon("initialRender");};z.prototype._onResize=function(){if(this.getDisplayType()!==t.Both){return;}var a=this.getAggregation("_splitter"),i=this.getDomRef().offsetWidth,L,b,B,N;if(a.getContentAreas()[0]&&a.getContentAreas()[0].getLayoutData()){L=a.getContentAreas()[0];b=L.getLayoutData();if(i<w*2){N=i/2;}else{B=L.getDomRef().offsetWidth;N=Math.max(Math.min(B,i-w),w);}b.setSize(N+"px");}};z.prototype._setupDisplayType=function(){var D=this.getDisplayType();if(D===t.Table){this._setSplitterLayoutData("auto","0px");}else if(D===t.Chart){this._setSplitterLayoutData("0px","auto");}else if(D!==this._sPreviousDisplayType){this._setSplitterLayoutData(this._iLastTableAreaSize?this._iLastTableAreaSize+"px":this.getSelectionPanelSize(),"auto");}};z.prototype._setSplitterLayoutData=function(a,b){var i=this._oSplitter.getContentAreas();if(i.length>1){var B=i[0].getLayoutData(),D=i[1].getLayoutData(),H=this.getDisplayType()===t.Both;B.setSize(a).setResizable(H);D.setSize(b).setResizable(H);}};z.prototype._updateRowHeightInExpandModel=function(a){var i=a.getRowHeight();if(i===0){i=a._getDefaultRowHeight();}this._oExpandModel.setBaseRowHeight(i);};z.prototype.jumpToVisibleHorizon=function(a){var b=this.getAxisTimeStrategy().getVisibleHorizon();this._updateVisibleHorizon(b,a,this.getVisibleWidth());};z.prototype.exit=function(){if(this._sResizeHandlerId){R.deregister(this._sResizeHandlerId);}this._detachExtensions();};z.prototype._attachExtensions=function(){if(this._bExtensionsInitialized){return;}h.enrich(this,j);h.enrich(this,k);h.enrich(this,m);h.enrich(this,n);h.enrich(this,o);h.enrich(this,p);h.enrich(this,r);this._bExtensionsInitialized=true;};z.prototype._detachExtensions=function(){h.cleanup(this);};z.prototype.getAxisTime=function(){var a=this.getAxisTimeStrategy().getAxisTime();if(!a){this.getAxisTimeStrategy().createAxisTime(this.getLocale());a=this.getAxisTimeStrategy().getAxisTime();}return a;};z.prototype.getContentWidth=function(){var a=this.getAxisTime(),b=a.getViewRange();return Math.abs(Math.ceil(b[1])-Math.ceil(b[0]));};z.prototype.getVisibleWidth=function(){return this._getScrollExtension?this._getScrollExtension().getVisibleWidth():undefined;};z.prototype.expand=function(a,b){this.toggleShapeScheme(true,a,b);};z.prototype.collapse=function(a,b){this.toggleShapeScheme(false,a,b);};z.prototype.toggleShapeScheme=function(b,a,i){var B=[];if(typeof i==="number"){B=[i];}else if(Array.isArray(i)){B=i;}if(B.length===0||!a){return;}var D=this.getShapeSchemes().filter(function(K){return K.getKey()===a;});if(D==null||D.length===0||D.length>1){return;}var H=this.getPrimaryShapeScheme();var J=this._oExpandModel.isTableRowHeightNeedChange(b,this.getTable(),B,H,D[0]);if(J){this.getTable().invalidate();}};z.prototype.isShapeVisible=function(a){if(a&&a.isVisible()){return true;}if(!a.getVisible()){return false;}var b=this.getRenderedTimeRange(),i=b[0],B=b[1];var D=a.getTime(),H=a.getEndTime();var J=function(K){return(K>=i&&K<=B);};if(a.getSelected()||!D||!H){return true;}else if(D&&H){return J(D)||J(H)||(D<=i&&H>=B);}else if(D&&!H){return J(D);}else if(!D&&H){return J(H);}};z.prototype.doBirdEye=function(i){var Z=this._getZoomExtension();Z.doBirdEye(i);};return z;},true);
