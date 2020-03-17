/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/library","sap/ui/core/Core","sap/ui/core/Element","sap/ui/core/Locale","sap/ui/core/LocaleData","sap/ui/core/format/DateFormat","sap/base/util/ObjectPath","../misc/Utility","../misc/Format","../misc/RelativeTimeFormatter","../config/TimeHorizon","../misc/AxisTime"],function(l,C,E,L,a,D,O,U,F,R,T,A){"use strict";var b=E.extend("sap.gantt.axistime.AxisTimeStrategyBase",{metadata:{"abstract":true,properties:{timeLineOptions:{type:"object"},timeLineOption:{type:"object"},coarsestTimeLineOption:{type:"object"},finestTimeLineOption:{type:"object"},zoomLevels:{type:"int",defaultValue:10},zoomLevel:{type:"int",defaultValue:0},calendarType:{type:"string",defaultValue:sap.ui.core.CalendarType.Gregorian},locale:{type:"object"},firstDayOfWeek:{type:"int"},mouseWheelZoomType:{type:"sap.gantt.MouseWheelZoomType",defaultValue:l.MouseWheelZoomType.FineGranular}},aggregations:{totalHorizon:{type:"sap.gantt.config.TimeHorizon",multiple:false},visibleHorizon:{type:"sap.gantt.config.TimeHorizon",multiple:false},_axisTime:{type:"sap.gantt.misc.AxisTime",multiple:false,visibility:"hidden"}}}});b.prototype.applySettings=function(s){s=s||{};if(!s.visibleHorizon){s.visibleHorizon=l.config.DEFAULT_INIT_HORIZON.clone();}if(!s.totalHorizon){s.totalHorizon=l.config.DEFAULT_PLAN_HORIZON.clone();}this.checkFirstDayOfWeek(s);E.prototype.applySettings.call(this,s);this.calZoomBase();return this;};b.prototype.exit=function(){C.detachLocalizationChanged(this._onLocalizationChanged,this);};b.prototype.isTimePeriodZoomEnabled=function(){return true;};b.prototype._setVisibleHorizon=function(v){var h=this._completeTimeHorizon(v);var o=this.getAggregation("visibleHorizon");if(o){o.setStartTime(h.getStartTime(),true);o.setEndTime(h.getEndTime(),true);}else{this.setAggregation("visibleHorizon",h,true);}return this;};b.prototype.setVisibleHorizonWithReason=function(v,r,o){this._setVisibleHorizon(v);return this;};b.prototype._completeTimeHorizon=function(v){var o=this.getVisibleHorizon(),c=this.getTotalHorizon();if(o===null||c===null){return v;}var r=new T({startTime:o.getStartTime(),endTime:o.getEndTime()});if(v){var s=v.getStartTime(),e=v.getEndTime(),d,t=F.abapTimestampToDate(c.getStartTime()),f=F.abapTimestampToDate(c.getEndTime());if(!s&&!e){return r;}var i;if(this._oZoom&&this._oZoom.base&&this._oZoom.base.scale!==undefined&&this._nGanttVisibleWidth!==undefined&&this.getAxisTime()){var n=this.getAxisTime().getZoomRate();var g=this._oZoom.base.scale/n;i=this._nGanttVisibleWidth*g;}else{i=F.abapTimestampToDate(r.getEndTime()).getTime()-F.abapTimestampToDate(r.getStartTime()).getTime();}if(!s){d=F.abapTimestampToDate(e);d.setTime(d.getTime()-i);if(d<t){d=t;e=F.dateToAbapTimestamp(new Date(t+i));}s=F.dateToAbapTimestamp(d);}else if(!e){d=F.abapTimestampToDate(s);d.setTime(d.getTime()+i);if(d>f){d=f;s=F.dateToAbapTimestamp(new Date(f-i));}e=F.dateToAbapTimestamp(d);}else{d=F.abapTimestampToDate(s);if(d<t){s=this.getTotalHorizon().getStartTime();}d=F.abapTimestampToDate(e);if(d>f){e=this.getTotalHorizon().getEndTime();}}r.setStartTime(s);r.setEndTime(e);}return r;};b.prototype.createAxisTime=function(o){var t=this.getTimeLineOption(),v=this.getVisibleHorizon(),c=this.getTotalHorizon();if(!U.judgeTimeHorizonValidity(v,c)){this.getVisibleHorizon().setStartTime(c.getStartTime(),true);this.getVisibleHorizon().setEndTime(c.getEndTime(),true);jQuery.sap.log.warning("Visible horizon is not in total horizon, so convert visible horizon to total horizon",null,"sap.gantt.axistime.AxisTimeStrategyBase.createAxisTime()");}var h=F.getTimeStampFormatter().parse(c.getStartTime());var H=F.getTimeStampFormatter().parse(c.getEndTime());var n=H.valueOf()-h.valueOf();var d=O.get(t.innerInterval.unit).offset(h,t.innerInterval.span).valueOf()-h.valueOf();var e=new A([h,H],[0,Math.ceil(n*t.innerInterval.range/d)],1,null,null,o,this);this.setAggregation("_axisTime",e,true);};b.prototype.syncContext=function(n){var r={zoomLevel:undefined,axisTimeChanged:false};return r;};b.prototype.updateStopInfo=function(s){return null;};b.prototype._setTotalHorizon=function(t,s){if(typeof s==="undefined"){s=true;}if(t){var o=this.getAggregation("totalHorizon");if(o){o.setStartTime(t.getStartTime(),true);o.setEndTime(t.getEndTime(),true);}else{this.setAggregation("totalHorizon",t,s);}}return this;};b.prototype.getUpperRowFormatter=function(){var t=this.getTimeLineOption();var o=t.largeInterval;var f;if(o.relativeTime){var c=F.abapTimestampToDate(this.getTotalHorizon().getStartTime());f=new R(c,o.unit,o.relativeTimePrefix);}else{var d=this.getCalendarType(),e=this.getLocale()?this.getLocale():new L(C.getConfiguration().getLanguage().toLowerCase());f=D.getDateTimeInstance({format:o.format,pattern:o.pattern,style:o.style,calendarType:t.calendarType||d},o.locale?new L(o.locale):e);}return f;};b.prototype.getLowerRowFormatter=function(){var t=this.getTimeLineOption();var s=t.smallInterval;var f;if(s.relativeTime){var o=F.abapTimestampToDate(this.getTotalHorizon().getStartTime());f=new R(o,s.unit,s.relativeTimePrefix);}else{var c=this.getCalendarType(),d=this.getLocale()?this.getLocale():new L(C.getConfiguration().getLanguage().toLowerCase());f=D.getDateTimeInstance({format:s.format,pattern:s.pattern,style:s.style,calendarType:c},s.locale?new L(s.locale):d);}return f;};b.prototype.isLowerRowTickHourSensitive=function(){var t=this.getTimeLineOption();var u=t.innerInterval.unit;var s=t.innerInterval.span;var S=F.getTimeStampFormatter().parse("20000101000000");var e=O.get(u).offset(S,s);return(e.getTime()-S.getTime())<=60*60*1000;};b.prototype.getAxisTime=function(){return this.getAggregation("_axisTime");};b.prototype.fireRedrawRequest=function(f,r,v,o){this.fireEvent("_redrawRequest",{forceUpdate:f,reasonCode:r,valueBeforeChange:v,originEvent:o});};b.prototype.updateGanttVisibleWidth=function(n){this._nGanttVisibleWidth=n;};b.prototype.getGanttVisibleWidth=function(){return this._nGanttVisibleWidth;};b.prototype.calZoomScale=function(u,s,r){var S=F.getTimeStampFormatter().parse("20000101000000");var e=O.get(u).offset(S,s);return this.calZoomScaleByDate(S,e,r);};b.prototype.calZoomScaleByDate=function(s,e,r){return(e.valueOf()-s.valueOf())/r;};b.prototype.calZoomBase=function(){var B=this.getTimeLineOption()||this.getFinestTimeLineOption();if(B){var s=this.calZoomScale(B.innerInterval.unit,B.innerInterval.span,B.innerInterval.range);this._oZoom={base:{timeLineOption:B,rate:1,scale:s}};return true;}return false;};b.prototype.checkFirstDayOfWeek=function(s){if(typeof s.firstDayOfWeek==="undefined"){s.firstDayOfWeek=a.getInstance(C.getConfiguration().getLocale()).getFirstDayOfWeek();C.attachLocalizationChanged(this._onLocalizationChanged,this);}};b.prototype.updateVisibleHorizonOnMouseWheelZoom=function(t,s,o,S){var z=s<0;var Z=Math.round(Math.abs(s)/100);var m=this.getMouseWheelZoomType();if(m===l.MouseWheelZoomType.FineGranular){this.updateVisibleHorizonOnFineGranularMouseWheelZoom(t,z,Z,o,S);}else if(m===l.MouseWheelZoomType.Stepwise){this.updateVisibleHorizonOnStepWiseMouseWheelZoom(t,z,Z,o,S);}};b.prototype.updateVisibleHorizonOnFineGranularMouseWheelZoom=function(t,z,Z,o,s){var v=this.getVisibleHorizon();var V=F.abapTimestampToDate(v.getStartTime());var c=this.getTimeLineOption();var n=O.get(c.innerInterval.unit).offset(V,Z*c.innerInterval.span).getTime()-V.getTime();var i=z?-1:1;var N=this.calVisibleHorizonByDelta(i*n,t);var r=s?"syncVisibleHorizon":"mouseWheelZoom";this.setVisibleHorizonWithReason(N,r,o);};b.prototype.updateVisibleHorizonOnStepWiseMouseWheelZoom=function(t,z,Z,o,s){var i=z?-1:1;var c=this.getZoomLevel()-i*Z;if(c>-1&&c<this.getZoomLevels()){if(this._aZoomRate[c]&&!U.floatEqual(this._aZoomRate[c],this._oZoom.rate)){this.setZoomLevel(c);}}};b.prototype.calVisibleHorizonByRate=function(n,o){var c=0;if(this._oZoom&&this._oZoom.base&&this._oZoom.base.scale!==undefined&&this._nGanttVisibleWidth!==undefined){var v=F.abapTimestampToDate(this.getVisibleHorizon().getStartTime());var V=F.abapTimestampToDate(this.getVisibleHorizon().getEndTime());var d=V.getTime()-v.getTime();var e=this._oZoom.base.scale/n;var f=this._nGanttVisibleWidth*e;c=f-d;}return this.calVisibleHorizonByDelta(c,o);};b.prototype.calVisibleHorizonByDelta=function(n,o){var v=this.getVisibleHorizon();if(n!==0){var c=F.abapTimestampToDate(v.getStartTime()).getTime();var d=F.abapTimestampToDate(v.getEndTime()).getTime();var e=d-c;var f=0;var g,h;var i=F.abapTimestampToDate(this.getTotalHorizon().getStartTime()).getTime();var j=F.abapTimestampToDate(this.getTotalHorizon().getEndTime()).getTime();if(n>0&&c<=i){g=0;h=1;f=i;}else if(n>0&&d>=j){g=1;h=0;f=j;}else{if(!o){f=c+e/2;}else{f=o.getTime();}g=(f-c)/e;h=1-g;}var k=e+n;var m=f-g*k;var p=f+h*k;var N,q;if(m<=i){N=this.getTotalHorizon().getStartTime();}else{N=new Date();N.setTime(m);}if(p>=j){q=this.getTotalHorizon().getEndTime();}else{q=new Date();q.setTime(p);}return new T({startTime:N,endTime:q});}return v;};b.prototype.calMiddleDate=function(s,e){return new Date(s.getTime()+(e.getTime()-s.getTime())/2);};b.prototype._onLocalizationChanged=function(){this.setFirstDayOfWeek(a.getInstance(C.getConfiguration().getLocale()).getFirstDayOfWeek());};b.prototype._updateZoomControlType=function(z){return null;};return b;},true);
