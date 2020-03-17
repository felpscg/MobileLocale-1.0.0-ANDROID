/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/library','./HashChanger',"sap/base/Log","sap/ui/thirdparty/URI","sap/ui/Device","sap/base/util/ObjectPath"],function(l,H,L,U,D,O){"use strict";var a=l.routing.HistoryDirection;var b=function(h){this._iHistoryLength=window.history.length;this.aHistory=[];this._bIsInitial=true;if(!D.browser.msie){var s=window.history.state===null?{}:window.history.state,c=window.location.hash;c=c.replace(/^#/,"");if(typeof s==="object"){b._aStateHistory.push(c);s.sap={};s.sap.history=b._aStateHistory;window.history.replaceState(s,window.document.title);}else{L.debug("Unable to determine HistoryDirection as history.state is already set: "+window.history.state,"sap.ui.core.routing.History");}}if(!h){L.error("sap.ui.core.routing.History constructor was called and it did not get a hashChanger as parameter");}this._setHashChanger(h);this._reset();};b._aStateHistory=[];b.prototype.getHistoryStateOffset=function(){if(D.browser.msie){return undefined;}var s=O.get("history.state.sap.history");if(!Array.isArray(s)){return undefined;}return s.length-b._aStateHistory.length;};b.prototype.destroy=function(n){this._unRegisterHashChanger();};b.prototype.getDirection=function(n){if(n!==undefined&&this._bIsInitial){return undefined;}if(n===undefined){return this._sCurrentDirection;}return this._getDirection(n);};b.prototype.getPreviousHash=function(){return this.aHistory[this.iHistoryPosition-1];};b.prototype._setHashChanger=function(h){if(this._oHashChanger){this._unRegisterHashChanger();}this._oHashChanger=h;this._mEventListeners={};h.getRelevantEventsInfo().forEach(function(e){var E=e.name,p=e.paramMapping||{},f=this._onHashChange.bind(this,p);this._mEventListeners[E]=f;this._oHashChanger.attachEvent(E,f,this);}.bind(this));this._oHashChanger.attachEvent("hashReplaced",this._hashReplaced,this);this._oHashChanger.attachEvent("hashSet",this._hashSet,this);};b.prototype._unRegisterHashChanger=function(){if(this._mEventListeners){var e=Object.keys(this._mEventListeners);e.forEach(function(E){this._oHashChanger.detachEvent(E,this._mEventListeners[E],this);}.bind(this));delete this._mEventListeners;}this._oHashChanger.detachEvent("hashReplaced",this._hashReplaced,this);this._oHashChanger.detachEvent("hashSet",this._hashSet,this);this._oHashChanger=null;};b.prototype._reset=function(){this.aHistory.length=0;this.iHistoryPosition=0;this._bUnknown=true;this.aHistory[0]=this._oHashChanger.getHash();};b.prototype._getDirection=function(n,h,c){if(c&&this._oNextHash&&this._oNextHash.sHash===n){return a.NewEntry;}if(h){return a.NewEntry;}if(this._bUnknown){return a.Unknown;}if(this.aHistory[this.iHistoryPosition+1]===n&&this.aHistory[this.iHistoryPosition-1]===n){return a.Unknown;}if(this.aHistory[this.iHistoryPosition-1]===n){return a.Backwards;}if(this.aHistory[this.iHistoryPosition+1]===n){return a.Forwards;}return a.Unknown;};b.prototype._getDirectionWithState=function(h){var s=window.history.state===null?{}:window.history.state,B,d;if(typeof s==="object"){if(s.sap===undefined){b._aStateHistory.push(h);s.sap={};s.sap.history=b._aStateHistory;history.replaceState(s,document.title);d=a.NewEntry;}else{B=s.sap.history.every(function(u,c){return u===b._aStateHistory[c];});if(B&&s.sap.history.length===b._aStateHistory.length){d=undefined;}else{d=B?a.Backwards:a.Forwards;b._aStateHistory=s.sap.history;}}}else{L.debug("Unable to determine HistoryDirection as history.state is already set: "+window.history.state,"sap.ui.core.routing.History");}return d;};b.prototype._onHashChange=function(p,e){var n=p.newHash||"newHash",o=p.oldHash||"oldHash",f=p.fullHash||"fullHash";this._hashChange(e.getParameter(n),e.getParameter(o),e.getParameter(f));};b.prototype._hashChange=function(n,o,f){var c=window.history.length,d;if(this._oNextHash&&this._oNextHash.bWasReplaced&&this._oNextHash.sHash===n){this.aHistory[this.iHistoryPosition]=n;if(f!==undefined&&!D.browser.msie&&this===b.getInstance()){b._aStateHistory[b._aStateHistory.length-1]=f;window.history.replaceState({sap:{history:b._aStateHistory}},window.document.title);}this._oNextHash=null;if(!this._bIsInitial){this._sCurrentDirection=a.Unknown;}return;}this._bIsInitial=false;if(f!==undefined&&!D.browser.msie&&this===b.getInstance()){d=this._getDirectionWithState(f);}if(!d){d=this._getDirection(n,this._iHistoryLength<window.history.length,true);}this._sCurrentDirection=d;this._iHistoryLength=c;if(this._oNextHash){this._oNextHash=null;}if(d===a.Unknown){this._reset();return;}this._bUnknown=false;if(d===a.NewEntry){if(this.iHistoryPosition+1<this.aHistory.length){this.aHistory=this.aHistory.slice(0,this.iHistoryPosition+1);}this.aHistory.push(n);this.iHistoryPosition+=1;return;}if(d===a.Forwards){this.iHistoryPosition++;return;}if(d===a.Backwards){this.iHistoryPosition--;}};b.prototype._hashSet=function(e){this._hashChangedByApp(e.getParameter("sHash"),false);};b.prototype._hashReplaced=function(e){this._hashChangedByApp(e.getParameter("sHash"),true);};b.prototype._hashChangedByApp=function(n,w){this._oNextHash={sHash:n,bWasReplaced:w};};var i=new b(H.getInstance());b.getInstance=function(){return i;};return b;},true);
