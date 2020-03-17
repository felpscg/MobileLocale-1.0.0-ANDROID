// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/base/ManagedObject","sap/ui/core/Control","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/base/Log","./LinkTileWrapperRenderer"],function(q,M,C,A,L){"use strict";var a=C.extend("sap.ushell.ui.launchpad.LinkTileWrapper",{metadata:{library:"sap.ushell",properties:{uuid:{type:"string",group:"Misc",defaultValue:null},tileCatalogId:{type:"string",group:"Misc",defaultValue:null},target:{type:"string",group:"Misc",defaultValue:null},visible:{type:"boolean",group:"Misc",defaultValue:true},debugInfo:{type:"string",group:"Misc",defaultValue:null},animationRendered:{type:"boolean",group:"Misc",defaultValue:false},isLocked:{type:"boolean",group:"Misc",defaultValue:false},tileActionModeActive:{type:"boolean",group:"Misc",defaultValue:false},ieHtml5DnD:{type:"boolean",group:"Misc",defaultValue:false}},aggregations:{tileViews:{type:"sap.ui.core.Control",multiple:true,singularName:"tileView"},footItems:{type:"sap.ui.core.Control",multiple:true,singularName:"footItem"}},events:{press:{},coverDivPress:{},afterRendering:{},showActions:{}}}});a.prototype.ontap=function(){L.info("Tile clicked:",this.getDebugInfo(),"sap.ushell.ui.launchpad.LinkTileWrapper");return;};a.prototype.destroy=function(s){this.destroyTileViews();C.prototype.destroy.call(this,s);};a.prototype.addTileView=function(o,s){o.setParent(null);o.addCustomData(new A({key:"tabindex",value:"-1",writeToDom:true}));M.prototype.addAggregation.call(this,"tileViews",o,s);};a.prototype.destroyTileViews=function(){if(this.mAggregations.tileViews){this.mAggregations.tileViews.length=0;}};a.prototype.onAfterRendering=function(){this.fireAfterRendering();};a.prototype._launchTileViaKeyboard=function(e){if(e.target.tagName!=="BUTTON"){var t=this.getTileViews()[0],p=false,c;if(t.firePress){c=document.createEvent("MouseEvents");c.initEvent("click",false,true);t.getDomRef().dispatchEvent(c);}else{while(t.getContent&&!p){t=t.getContent()[0];if(t.firePress){t.firePress({id:this.getId()});p=true;}}}}};a.prototype.onsapenter=function(e){this._launchTileViaKeyboard(e);};a.prototype.onsapspace=function(e){this._launchTileViaKeyboard(e);};a.prototype.onclick=function(e){if(this.getTileActionModeActive()){e.preventDefault();}else{var c=this.getTileViews()[0].getContent?c.getContent()[0]:this.getTileViews()[0];sap.ui.getCore().getEventBus().publish("launchpad","dashboardTileLinkClick");}};a.prototype.setVisible=function(v){this.setProperty("visible",v,true);return this.toggleStyleClass("sapUshellHidden",!v);};a.prototype.setAnimationRendered=function(v){this.setProperty("animationRendered",v,true);};a.prototype._handleTileShadow=function(j,b){if(j.length){j.unbind("mouseenter mouseleave");var u,t=j.css("border").split("px")[0],m=this.getModel();if(t>0){u=j.css("border-color");}else{u=this.getRgba();}j.hover(function(){if(!m.getProperty("/tileActionModeActive")){var o=q(j).css("box-shadow"),T=o?o.split(") ")[1]:null,U;if(T){U=T+" "+u;q(this).css("box-shadow",U);}}},function(){q(this).css("box-shadow","");});}};a.prototype.setUuid=function(u){this.setProperty("uuid",u,true);return this;};return a;});
