/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Core","sap/gantt/library","sap/ui/core/Element","sap/ui/core/CustomStyleClassSupport","sap/ui/base/ManagedObjectMetadata","./GanttUtils","./CoordinateUtils","./AggregationUtils","../misc/Format"],function(C,l,E,a,M,G,b,A,F){"use strict";var B=E.extend("sap.gantt.simple.BaseShape",{metadata:{"abstract":true,properties:{shapeId:{type:"string"},time:{type:"object"},endTime:{type:"object"},scheme:{type:"string",defaultValue:null},xBias:{type:"float",defaultValue:0},yBias:{type:"float",defaultValue:0},fill:{type:"sap.gantt.ValueSVGPaintServer"},strokeOpacity:{type:"float",defaultValue:1.0},fillOpacity:{type:"float",defaultValue:1.0},opacity:{type:"float",defaultValue:1.0},stroke:{type:"sap.gantt.ValueSVGPaintServer"},strokeWidth:{type:"float",defaultValue:0},strokeDasharray:{type:"string"},transform:{type:"string"},filter:{type:"string"},expandable:{type:"boolean",defaultValue:false},selectable:{type:"boolean",defaultValue:false},selected:{type:"boolean",defaultValue:false},draggable:{type:"boolean",defaultValue:false},resizable:{type:"boolean",defaultValue:false},hoverable:{type:"boolean",defaultValue:false},connectable:{type:"boolean",defaultValue:false},rowYCenter:{type:"float"},countInBirdEye:{type:"boolean",defaultValue:false},childElement:{type:"boolean",defaultValue:false,visibility:"hidden"},shapeUid:{type:"string",visibility:"hidden"},visible:{type:"boolean",defaultValue:true}}}});a.apply(B.prototype);B.prototype.init=function(){this.bPreventSingleClick=false;};var v={};C.attachThemeChanged(function(){v={};});var R=/translate\((-?\d{1,}),?\s?(-?\d{1,})?\)/gi;B.prototype.setShapeUid=function(u){jQuery.sap.log.error("The control manages the shapeUid generation. The method \"setShapeUid\" cannot be used programmatically!",this);};B.prototype.getTransform=function(){var t=this.getProperty("transform");if(t){return t;}return this._buildTransformByXYBias();};B.prototype.setTransform=function(V){this.setProperty("transform",V);this._updateBiasFromTransform(V);return this;};B.prototype._buildTransformByXYBias=function(){var n=this.getXBias(),c=this.getYBias();if(n||c){n=n?n:0;n=C.getConfiguration().getRTL()?-n:n;c=c?c:0;return"translate("+n+" "+c+")";}return null;};B.prototype._updateBiasFromTransform=function(t){if(t!=null){var c=this._parseBias(t);if(c.length>0){var n=c[0]||0,N=c[1]||0;this.setProperty("xBias",n,true);this.setProperty("yBias",N,true);}}};B.prototype._parseBias=function(t){var m=R.exec(t);var c=[];if(m&&m.length>0){m.forEach(function(d,i){if(i!==0&&d){c.push(parseFloat(d));}});}return c;};B.prototype.getStyle=function(){var s={"stroke":this.determineValueColor(this.getStroke()),"stroke-width":this.getStrokeWidth()};var i=this.getSelectable()||this.getHoverable();if(this.getProperty("childElement")===false&&i===false){s["pointer-events"]="none";}return this.getInlineStyle(s);};B.prototype.getXByTime=function(t){var o=this.getAxisTime();var n=o.timeToView(F.abapTimestampToDate(t));if(!jQuery.isNumeric(n)){jQuery.sap.log.warning("Cannot convert time:"+t+" to an valid coordinate. Invalid coordinate might not get rendered at all, check the property value!");return 0;}return n;};B.prototype.getAxisTime=function(){if(this.mAxisTime){return this.mAxisTime;}else{var g=this.getGanttChartBase();return g?g.getAxisTime():null;}};B.prototype.getGanttChartBase=function(){var r=this.getParentRowSettings();return r?r.getParentGantt():null;};B.prototype.getParentRowSettings=function(){return A.getParentControlOf("sap.gantt.simple.GanttRowSettings",this);};B.prototype.getInlineStyle=function(s){return Object.keys(s).reduce(function(i,c){if(s[c]!==undefined&&s[c]!==null&&s[c]!==""){i+=(c+":"+s[c]+"; ");}return i;},"");};B.prototype.determineValueColor=function(p){var f=v[p];if(!f&&p){f=l.ValueSVGPaintServer.normalize(p);v[p]=f;}return f;};B.prototype.destroy=function(){return E.prototype.destroy.apply(this,["KeepDom"]);};B.prototype.isVisible=function(){return false;};B.prototype.renderElement=function(r,e){};B.prototype.writeElementData=function(r){if(this.getProperty("childElement")){var g=M.isGeneratedId(this.getId());if(!g){r.writeAttribute("id",this.getId());}return;}if(this._shallWriteElementData(this)){r.writeElementData(this);if(this.getShapeId()){r.writeAttribute(G.SHAPE_ID_DATASET_KEY,this.getShapeId());}if(this.getConnectable()){r.writeAttribute(G.CONNECTABLE_DATASET_KEY,this.getConnectable());}}};B.prototype._shallWriteElementData=function(s){var S=s.getParent()===null;if(S===false){S=A.isParentRowSetting(s);}if(S===false){S=A.isLazyAggregation(s);}return S;};B.prototype.ensureGanttChart=function(){if(!this.mChartInstance){this.mChartInstance=this.getGanttChartBase();}};B.prototype.setSelected=function(s,S){var p=this.getSelected();this.setProperty("selected",s,S);var g=this.getGanttChartBase(),c=this.getShapeUid();if(p!==s&&g&&c){g.getSelection().update(c,{selected:s,ctrl:false,draggable:this.getDraggable(),time:this.getTime(),endTime:this.getEndTime()});}return this;};B.prototype.onclick=function(e){var c=function(){var g;if(this.bPreventSingleClick===false){g=this.getGanttChartBase();if(!g.fireShapePress({shape:this,rowSettings:this.getParentRowSettings()})){return;}g.handleShapePress({shape:this,ctrlOrMeta:e.ctrlKey||e.metaKey});e.setMarked();}this.bPreventSingleClick=false;}.bind(this);if(!this.getSelectable()){return;}if(this._isDoubleClickEventDisabled()){c();return;}this.iSingleClickTimer=jQuery.sap.delayedCall(300,this,c);};B.prototype.ondblclick=function(e){if(this._isDoubleClickEventDisabled()){return;}jQuery.sap.clearDelayedCall(this.iSingleClickTimer);this.bPreventSingleClick=true;this.getGanttChartBase().fireShapeDoubleClick({shape:this,rowSettings:this.getParentRowSettings()});e.stopImmediatePropagation();};B.prototype.oncontextmenu=function(e){e.preventDefault();e.stopImmediatePropagation();var c=b.getLatestCursorPosition();this.getGanttChartBase().fireShapeContextMenu({shape:this,rowSettings:this.getParentRowSettings(),pageX:c.pageX,pageY:c.pageY});};B.prototype.onmouseout=function(e){if(this.getHoverable()===false){return;}this.iMouseOutTimer=jQuery.sap.delayedCall(500,this,function(){if(this.bShapeMouseEnterFired){this.getGanttChartBase().fireShapeMouseLeave({shape:this});this.bShapeMouseEnterFired=false;}jQuery.sap.clearDelayedCall(this.iMouseOutTimer);});};B.prototype.onmouseover=function(e){if(this.getHoverable()===false){return;}this.iMouseOverTimer=jQuery.sap.delayedCall(500,this,function(){var c=b.getCursorElement();if(c===this){var m=b.getLatestCursorPosition();this.getGanttChartBase().fireShapeMouseEnter({shape:this,pageX:m.pageX,pageY:m.pageY});this.bShapeMouseEnterFired=true;}jQuery.sap.clearDelayedCall(this.iMouseOverTimer);});};B.prototype.getShapeUid=function(){return this.getProperty("shapeUid");};B.prototype._isDoubleClickEventDisabled=function(){var g=this.getGanttChartBase();return g&&g.getDisableShapeDoubleClickEvent();};return B;},true);
