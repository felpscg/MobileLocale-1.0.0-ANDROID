// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/base/Log","sap/m/Text"],function(C,L,T){"use strict";var a={};a.render=function(r,c){var t=null,b,p=c.getPinButton();p=p.length?p[0]:undefined;try{t=c.getTileViews()[0];}catch(e){L.warning("Failed to load tile view: ",e.message);t=new T({text:"Failed to load. "});}var o=C.last("/core/home/gridContainer")&&c.getParent().getParent()||c.getParent(),d=o&&o.getTiles?o.getTiles():[],v=d.filter(function(g){return g.getVisible();}),i=v.indexOf(c)>-1?v.indexOf(c)+1:"";if(!o){return;}r.write("<li");if(C.last("/core/shell/model/enableHelp")){r.writeAttribute("data-help-id",c.getTileCatalogId());}r.writeControlData(c);r.addClass("sapUshellTile");if(c.getTileActionModeActive()){r.addClass("sapUshellTileWrapper");}if(t&&t.getContent){b=t.getContent();b.forEach(function(I){if(I.isA("sap.suite.ui.commons.FeedTile")){r.addClass("sapUshellFeedTileBG");}});}if(c.getLong()){r.addClass("sapUshellLong");}if(!c.getVisible()){r.addClass("sapUshellHidden");}if(c.getIsLocked()){r.addClass("sapUshellLockedTile");}if(C.last("/core/home/sizeBehavior")==="Small"){r.addClass("sapUshellSmall");}r.writeClasses();r.writeAccessibilityState(c,{role:"option",posinset:i,setsize:v.length});var f=o.getId()+"-titleText";r.writeAttribute("aria-describedby",f);if(c.getIeHtml5DnD()){r.writeAttribute("draggable","true");}r.writeAttributeEscaped("tabindex","-1");var l=c.data("layoutPosition");if(l){var s="-webkit-transform:"+l.translate3D+";-ms-transform:"+l.translate2D+";transform:"+l.translate3D;r.writeAttribute("style",s);}r.write(">");if(!c.getTileActionModeActive()){r.write("<div");r.addClass("sapUshellTileWrapper");r.writeClasses();r.write(">");}this.renderTileActionMode(r,c);r.addClass("sapUshellTileInner");if(c.getProperty("tileActionModeActive")){r.addClass("sapUshellTileActionBG");}if(this.renderTileView){this.renderTileView(r,t,p,c.getTarget(),c.getIsCustomTile());}if(c.getShowActionsIcon()&&!c.getTileActionModeActive()){r.renderControl(c.actionIcon);}if(!c.getTileActionModeActive()){r.write("</div>");if(this.renderTileActionsContainer){this.renderTileActionsContainer(r,t,p,c.getTarget(),c.getIsCustomTile());}}r.write("</li>");};a.renderTileActionsContainer=function(r,t,p){if(p){p.addStyleClass("sapUshellActionButton");r.write("<div");r.addClass("sapUshellTilePinButtonOverlay");r.writeClasses();if(t.getHeader){r.writeAccessibilityState(t,{role:"toolbar",label:t.getHeader()});}r.write(">");r.renderControl(p);r.write("</div>");}};a.renderTileView=function(r,t,p,s,i){var u="";if(i){r.write("<div");r.writeClasses();r.write(">");r.renderControl(t);r.write("</div>");}else{r.write("<a");r.writeClasses();if(s){if(s.charAt(0)==="#"){if(window.location.search&&window.location.search.length>0){u=window.location.origin+window.location.pathname+window.location.search+"&appState=lean"+s;}else{u=window.location.origin+window.location.pathname+"?appState=lean"+s;}}else{u=s;}r.writeAttributeEscaped("target","_blank");r.writeAttributeEscaped("href",u);}r.write("tabindex=\"-1\">");r.renderControl(t);r.write("</a>");}};a.renderTileActionMode=function(r,c){if(!c.getTileActionModeActive()){return;}r.write("<div");r.addClass("sapUshellTileActionLayerDiv");r.writeClasses();r.write(">");if(c.getTileActionModeActive()&&!c.getIsLocked()){r.write("<div");r.addClass("sapUshellTileDeleteClickArea");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapUshellTileDeleteIconOuterClass");r.writeClasses();r.write(">");r.renderControl(c._initDeleteAction());r.write("</div>");r.write("</div>");}r.write("<div class='sapUshellTileActionDivCenter'></div>");r.write("<div");r.addClass("sapUshellTileActionIconDivBottom");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapUshellTileActionIconDivBottomInnerDiv");r.writeClasses();r.write(">");r.renderControl(c.getActionSheetIcon());r.write("</div>");r.write("</div>");r.write("</div>");};return a;},true);
