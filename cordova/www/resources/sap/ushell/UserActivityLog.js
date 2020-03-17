// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ushell/ui/launchpad/Tile","sap/ushell/EventHub"],function(u,T,E){"use strict";var U=function(){};U.prototype={_maxLoggedMessages:30,_maxMessageByteSize:2048,_maxQueueByteSize:30720,_isActive:false,_observedLaunchpadActions:["createGroupAt","deleteGroup","resetGroup","changeGroupTitle","moveGroup","addTile","deleteTile","movetile","externalSearch","addBookmarkTile"],_observedGeneralActions:["openApp"],_observedEventHubEvents:["showCatalog"],_aDoableObjects:[],messageType:{ACTION:0,ERROR:1},_tileOntapOrigFunc:undefined,activate:function(){if(this._isActive){return;}this._isActive=true;var e=sap.ui.getCore().getEventBus(),t=this;this._observedLaunchpadActions.forEach(function(b,i,c){e.subscribe("launchpad",b,t._handleAction,t);});e.subscribe("sap.ushell","appOpened",t._handleAction,t);this._observedGeneralActions.forEach(function(b,i,c){e.subscribe(b,t._handleAction,t);});this._observedEventHubEvents.forEach(function(b,i,c){t._aDoableObjects.push(E.on(b).do(t._handleActionEventHub.bind(t)));});jQuery.sap.log.addLogListener(this);jQuery.sap.log.debug("requiring sap.ushell.ui.launchpad.Tile",new Error().stack,"sap.ushell.UserActivityLog");t._tileOntapOrigFunc=T.prototype.ontap;sap.ushell.ui.launchpad.Tile.prototype.ontap=t._tileOnTapDecorator(t._tileOntapOrigFunc);},deactivate:function(){if(!this._isActive){return;}this._isActive=false;var e=sap.ui.getCore().getEventBus(),t=this;this._observedLaunchpadActions.forEach(function(b,i,c){e.unsubscribe("launchpad",b,t._handleAction,t);});e.unsubscribe("sap.ushell","appOpened",t._handleAction,t);this._observedGeneralActions.forEach(function(b,i,c){e.unsubscribe(b,t._handleAction,t);});this._aDoableObjects.forEach(function(d){d.off();});jQuery.sap.log.removeLogListener(this);sap.ushell.ui.launchpad.Tile.prototype.ontap=this._tileOntapOrigFunc;},addMessage:function(t,m,b){if(this._isActive){this._addMessageInternal(t,m,b);}},getLog:function(){return this._getLoggingQueueFromStorage();},getMessageInfo:function(){var r={userDetails:this._getUserDetails(),shellState:this._getShellState(),navigationData:this._getLastNavActionFromStorage(),userLog:this.getLog(),formFactor:u.getFormFactor()};return r;},getMessageInfoAsString:function(s){return JSON.stringify(this.getMessageInfo(s));},onLogEntry:function(d){var e=(typeof d.details!=="undefined"&&(d.details!==""))?(d.message+" , "+d.details):d.message;this.addMessage(this.messageType.ERROR,e);},onAttachToLog:function(){},onDetachFromLog:function(){},_tileOnTapDecorator:function(o){var t=this,n,l,b,c,d,e;return function(){var f=this.getMetadata().getName();if(f=="sap.ushell.ui.launchpad.PlusTile"){t.addMessage(t.messageType.ACTION,"Open Catalog for empty group "+this.getGroupId());}else if(f=="sap.ushell.ui.launchpad.Tile"){n=hasher.getHash();if(n){var g=sap.ushell.Container.getService("URLParsing");var h=g.parseShellHash(n);n="#"+g.constructShellHash({target:{semanticObject:h.semanticObject,action:h.action}});}l=t._getLastNavActionFromStorage();l.time=new Date();l.navigationHash=n;l.tileDebugInfo=this.getDebugInfo();b=sap.ui.getCore().byId(this.getId());c=b.getModel();d=this.getBindingContext();e=d.getPath();l.tileTitle=d.getModel().getProperty(e).title;t._putInSessionStorage("sap.ushell.UserActivityLog.lastNavigationActionData",JSON.stringify(l));t.addMessage(t.messageType.ACTION,"Click on Tile: "+c.getData().title+" Tile debugInfo: "+this.getDebugInfo());}o.apply(this,arguments);};},_addMessageInternal:function(t,m,b){var l=this._getLoggingQueueFromStorage(),c={type:null},p;for(p in this.messageType){if(t==this.messageType[p]){c.type=p;break;}}if(c.type===null){return;}jQuery.extend(c,{messageID:b,messageText:m,time:new Date(),toString:function(){var d=[this.type,this.time];if(typeof this.messageID!=="undefined"){d.push(this.messageID);}d.push(this.messageText);return d.join(" :: ");}});l.push(c);if(l.length>this._maxLoggedMessages){l.shift();}this._putInSessionStorage("sap.ushell.UserActivityLog.loggingQueue",JSON.stringify(l));},_handleActionEventHub:function(e){this._handleAction("",e.sId,e.oData);},_handleAction:function(c,e,d){var m;switch(e){case"deleteTile":m="Delete Tile "+(d.tileId||"");break;case"moveTile":m="Move Tile "+(d.sTileId||"")+" to Group "+(d.toGroupId||"");break;case"createGroupAt":m="Create Group";break;case"changeGroupTitle":m="Change Group Title of "+(d.groupId||"")+" to "+(d.newTitle||"");break;case"deleteGroup":m="Delete Group "+(d.groupId||"");break;case"addTile":var t=d.catalogTileContext.oModel.oData,s=d.catalogTileContext.sPath,b=this._findInModel(s,t),f=b.id,g=d.groupContext.getObject(),h=g.groupId;m="Add Tile "+(f||"")+" to Group "+(h||"");break;case"moveGroup":m="Move Group from index "+(d.fromIndex||"")+" to index "+(d.toIndex||"");break;case"appOpened":m="Open application "+d.action;var l=this._getLastNavActionFromStorage();l.applicationInformation={};["applicationType","ui5ComponentName","url","additionalInformation","text"].forEach(function(p){l.applicationInformation[p]=d[p];});if(!this._hashSegmentsEqual(l.navigationHash,d.sShellHash)){l.tileDebugInfo="";}l.navigationHash=d.sShellHash;this._putInSessionStorage("sap.ushell.UserActivityLog.lastNavigationActionData",JSON.stringify(l));break;case"addBookmarkTile":m="Add Bookmark "+(d.title||"")+" "+(d.subtitle||"")+" for URL: "+(d.url||"");break;case"showCatalog":m="Show Catalog";break;default:break;}this.addMessage(this.messageType.ACTION,m);},_findInModel:function(p,m){var b,c=m,i,d;try{b=p.split("/");for(i=0;i<b.length;i=i+1){if(d!==b[i]){continue;}c=c[d];}}catch(e){return undefined;}return c;},_getUserDetails:function(){var b=sap.ushell.Container.getUser();return{fullName:b.getFullName()||"",userId:b.getId()||"",eMail:b.getEmail()||"",Language:b.getLanguage()||""};},_getShellState:function(){var v=sap.ui.getCore().byId("viewPortContainer"),m,r="";if(v!==undefined){m=v.getModel();r=m.getProperty("/currentState/stateName");}return r;},_getLoggingQueueFromStorage:function(){var l=this._getFromSessionStorage("sap.ushell.UserActivityLog.loggingQueue");var q=[];if(l){try{q=JSON.parse(l);}catch(e){}}return q;},_getLastNavActionFromStorage:function(){var l=this._getFromSessionStorage("sap.ushell.UserActivityLog.lastNavigationActionData");return(l?JSON.parse(l):{});},_hashSegmentsEqual:function(b,c){if((!b)||(!c)){return false;}return(this._getHashSegment(b)===this._getHashSegment(c));},_getHashSegment:function(b){var i=b.indexOf("~"),c;if(i>-1){return b.substring(0,i);}c=b.indexOf("?");if(c>-1){return b.substring(0,c);}return b;},_getFromSessionStorage:function(k){var r=null;try{r=sessionStorage.getItem(k);}catch(e){}return r;},_putInSessionStorage:function(k,v){try{sessionStorage.setItem(k,v);}catch(e){}}};var a=new U();return a;},true);
