/*!
 * SAPUI5

        (c) Copyright 2009-2019 SAP SE. All rights reserved
    
 */
sap.ui.define(['sap/ui/base/Object','sap/ui/core/date/UniversalDate',"sap/base/Log"],function(B,U,L){"use strict";var t=B.extend("sap.me.CalendarDate",{constructor:function(){if(arguments.length===0||!(arguments[0]instanceof Date||arguments[0]instanceof U)){var d=new Date();this._date=t.createDate(d.getFullYear(),d.getMonth(),d.getDate());}else{var i=arguments[0];if(i instanceof U){i=new Date(i.getTime());}this._date=t.createDate(i.getFullYear(),i.getMonth(),i.getDate());}}});t.createDate=function(y,m,d){var D=new Date(y,m,d,12,0,0);return new U(D.getTime());};t._regExpToDateString=/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d\d?) (\d\d\d\d)$/i;t.prototype.getDateObject=function(){return this._date;};t.prototype.getCopyDateObject=function(){var c=new U(this._date.getTime());return c;};t.getMonthFromString=function(s){var m=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];s=s.toLowerCase();return m.indexOf(s);};t.parseFromToDateString=function(f,T){var p;var r=t._regExpToDateString.exec(f);if(r!==null&&r.length===4&&r[0]===f){p=t.createDate(parseInt(r[3]),t.getMonthFromString(r[1]),parseInt(r[2]));}else{L.warning("The provided string does not match the toDateString format: "+f);if(typeof T==="boolean"&&T){throw new Error("Unparseable string provided: "+f);}var d=new Date(f);p=new U(d.getTime());}return p;};t.prototype.nextMonth=function(){this._date=t.getNextMonth(this._date);return this._date;};t.getNextMonth=function(d){var n=new U(d);n.setMonth(n.getMonth()+1,1);n.setHours(12,0,0);return n;};t.prototype.previousMonth=function(){this._date=t.getPreviousMonth(this._date);return this._date;};t.getPreviousMonth=function(d){var p=new U(d);p.setMonth(p.getMonth()-1,1);p.setHours(12,0,0);return p;};t.prototype.nextWeek=function(){this._date.setHours(12);this._date.setDate(this._date.getDate()+7);return this._date;};t.prototype.previousWeek=function(){this._date.setHours(12);this._date.setDate(this._date.getDate()-7);return this._date;};t.prototype.toDateString=function(){var d=new Date(this._date.getTime());return d.toDateString();};return t;},true);