/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/core/Control","sap/ui/Device","sap/ui/core/Core","./GanttUtils"],function(l,C,D,a,G){"use strict";var b=C.extend("sap.gantt.simple.GanttSyncedControl",{metadata:{library:"sap.gantt",properties:{innerWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"}}},renderer:function(r,c){var g=c.getParent().getParent();r.write("<div class='sapGanttBackground'");r.writeControlData(c);r.write(">");r.write("<div class='sapGanttBackgroundFlexContainer'>");r.write("<div class='sapGanttBackgroundContainer sapGanttBackgroundScrollbar'>");r.write("<div");r.addClass("sapGanttBackgroundTable");r.writeClasses();r.write(">");c.renderGanttHeaderPlaceholder(r,g);c.renderGanttBodyPlaceholder(r,g);c.renderHorizontalScrollbarContainer(r);r.write("</div>");r.write("</div>");c.renderVerticalScrollbarContainer(r,c);r.write("</div>");r.write("</div>");}});b.prototype.init=function(){this.oSyncInterface=null;this.state={rows:[],innerVerticalScrollPosition:0,horizontalScrollPosition:0,layout:{top:0,headerHeight:0,contentHeight:0}};this._bRowsHeightChanged=false;this._bAllowContentScroll=true;};b.prototype.onAfterRendering=function(){var d=this.getDomRefs();var g=this.getParent().getParent();if(this.oSyncInterface){var r=a.createRenderManager();this.oSyncInterface.renderHorizontalScrollbar(r,g.getId()+"-hsb",g.getContentWidth());r.flush(d.hsbContainer);}if(this.oSyncInterface&&d.content&&d.vsbContainerContent){this.oSyncInterface.registerVerticalScrolling({wheelAreas:[d.content],touchAreas:[d.content]});this.oSyncInterface.placeVerticalScrollbarAt(d.vsbContainerContent);}this.updateScrollPositions();};b.prototype.renderGanttHeaderPlaceholder=function(r,g){r.write("<div");r.writeAttribute("data-sap-ui-related",g.getId());r.addClass("sapGanttChartWithTableHeader");r.writeClasses();r.write(">");r.write("</div>");};b.prototype.renderGanttBodyPlaceholder=function(r,g){r.write("<div class='sapGanttBackgroundTableContent' style='height:"+this.state.layout.contentHeight+"px'>");r.write("<div");r.writeAttribute("id",g.getId()+"-gantt");r.writeAttribute("data-sap-ui-related",g.getId());r.addClass("sapGanttChartContentBody");r.addClass("sapGanttBackgroundSVG");r.writeClasses();r.write(">");this.renderSvgDefs(r,g);this.renderGanttChartCnt(r,g);r.write("</div>");r.write("</div>");};b.prototype.renderVerticalScrollbarContainer=function(r,c){r.write("<div class='sapGanttBackgroundVScrollContainer'>");r.write("<div class='sapGanttBackgroundVScrollContentArea' style='margin-top:"+(c.state.layout.top+c.state.layout.headerHeight)+"px'></div>");r.write("</div>");};b.prototype.syncWith=function(t){var e=t.getParent()._oExpandModel;t._enableSynchronization().then(function(s){this.oSyncInterface=s;s.rowCount=function(c){var o=this.state.rows.length;var i;if(o<c){for(i=0;i<c-o;i++){this.state.rows.push({height:0,selected:false,hovered:false});}}else if(o>c){for(i=o-1;i>=c;i--){this.state.rows.pop();}}}.bind(this);s.rowSelection=function(i,S){if(this.state.rows[i]){this.state.rows[i].selected=S;G.updateGanttRows(this,this.state.rows,i);}}.bind(this);s.rowHover=function(i,h){if(this.state.rows[i]){this.state.rows[i].hovered=h;G.updateGanttRows(this,this.state.rows,i);}}.bind(this);s.rowHeights=function(h){for(var i=0;i<=h.length-1;i++){h[i]=e.getRowHeightByIndex(t,i,h[i]);}var g=this.getParent().getParent();if(g.getDisplayType()===l.simple.GanttChartWithTableDisplayType.Chart){return h;}this.setRowsHeightChanged(false);h.forEach(function(H,I){if(!this.state.rows[I]){this.state.rows[I]={};}if(this.state.rows[I].height!==H){this.setRowsHeightChanged(true);}this.state.rows[I].height=H;}.bind(this));if(this.getRowsHeightChanged()&&g.getDisplayType()!==l.simple.GanttChartWithTableDisplayType.Table){g.redraw();}return h;}.bind(this);s.innerVerticalScrollPosition=function(S){this.state.innerVerticalScrollPosition=S;this.updateScrollPositions();}.bind(this);s.layout=function(L){this.state.layout=L;this.updateLayout();}.bind(this);this.invalidate();}.bind(this));};b.prototype.renderHorizontalScrollbarContainer=function(r){r.write("<div class='sapGanttHSBContainer'>");r.write("</div>");};b.prototype.renderSvgDefs=function(r,g){var s=g.getSvgDefs();if(s){r.write("<svg");r.writeAttribute("id",g.getId()+"-svg-psdef");r.writeAttribute("aria-hidden","true");r.addStyle("float","left");r.addStyle("width","0px");r.addStyle("height","0px");r.writeStyles();r.write(">");r.write(s.getDefString());r.write("</svg>");}};b.prototype.renderGanttChartCnt=function(r,g){r.write("<div id='"+g.getId()+"-cnt'");r.addClass("sapGanttChartCnt");r.writeClasses();r.addStyle("height","100%");r.addStyle("width","100%");r.write(">");r.write("</div>");};b.prototype.setInnerWidth=function(w){this.setProperty("innerWidth",w,true);this._toggleHSBVisibility(w);return this;};b.prototype._toggleHSBVisibility=function(w){var d=this.getDomRefs();if(d.hsb==null||d.hsbContent==null){return;}var s=parseFloat(w)>jQuery(d.contentContainer).width();if(s){d.hsbContent.style.height=null;d.hsbContent.style.width=w;}else{d.hsbContent.style.cssText=null;if(D.browser.msie){d.hsbContent.style.width=0;}}};b.prototype.addEventListeners=function(){this.addScrollEventListeners();};b.prototype.addScrollEventListeners=function(){var t=this;this.oHSb.addEventListener("scroll",function(e){t.state.horizontalScrollPosition=e.target.scrollLeft;});};b.prototype.updateLayout=function(){var d=this.getDomRefs();if(d){d.header.style.height=(this.state.layout.top+this.state.layout.headerHeight)+"px";d.contentContainer.style.height=this.state.layout.contentHeight+"px";d.vsbContainerContent.style.marginTop=(this.state.layout.top+this.state.layout.headerHeight)+"px";}};b.prototype.updateScrollPositions=function(){var d=this.getDomRefs();if(d&&this._bAllowContentScroll){d.content.scrollTop=this.state.innerVerticalScrollPosition;if(d.content.scrollTop!==this.state.innerVerticalScrollPosition){this._bAllowContentScroll=false;}}};b.prototype.setAllowContentScroll=function(A){this._bAllowContentScroll=A;};b.prototype.setRowsHeightChanged=function(r){this._bRowsHeightChanged=r;};b.prototype.getRowsHeightChanged=function(r){return this._bRowsHeightChanged;};b.prototype.scrollContentIfNecessary=function(){if(this._bAllowContentScroll===false){this._bAllowContentScroll=true;this.updateScrollPositions();}};b.prototype.getDomRefs=function(){var d=this.getDomRef();if(!d){return null;}var h=d.querySelector(".sapGanttChartWithTableHeader"),c=d.querySelector(".sapGanttBackgroundTableContent"),o=c.querySelector(".sapGanttChartContentBody");var v=d.querySelector(".sapGanttBackgroundVScrollContainer"),V=v.querySelector(".sapGanttBackgroundVScrollContentArea");var H=d.querySelector(".sapGanttHSBContainer");var e=d.querySelector(".sapUiTableHSbExternal"),f=d.querySelector(".sapUiTableHSbContent");return{header:h,contentContainer:c,content:o,vsbContainer:v,vsbContainerContent:V,hsbContainer:H,hsb:e,hsbContent:f};};b.prototype.getRowStates=function(){return this.state.rows;};b.prototype.getRowHeights=function(){return this.state.rows.map(function(r){return r.height;});};b.prototype.syncRowSelection=function(i){if(i>-1){var s=!this.state.rows[i].selected;this.oSyncInterface.syncRowSelection(i,s);}};b.prototype.syncRowHover=function(i,h){if(i>-1){this.oSyncInterface.syncRowHover(i,h);}};return b;});
