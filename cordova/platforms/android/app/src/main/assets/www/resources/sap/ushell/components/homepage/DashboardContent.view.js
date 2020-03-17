// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/thirdparty/jquery","sap/m/library","sap/m/Page","sap/ui/core/AccessibleLandmarkRole","sap/ui/core/mvc/View","sap/ui/Device","sap/ui/model/Filter","sap/ushell/components/homepage/DashboardGroupsBox","sap/ushell/Config","sap/ushell/EventHub","sap/ushell/resources","sap/ushell/ui/launchpad/AnchorItem","sap/ushell/ui/launchpad/AnchorNavigationBar","sap/ushell/utils","sap/ui/core/Component","sap/ui/model/FilterOperator"],function(q,m,P,A,V,D,F,a,C,E,r,b,c,u,d,e){"use strict";sap.ui.jsview("sap.ushell.components.homepage.DashboardContent",{createContent:function(o){this.oModel=this.getModel();var f=this.oModel.getProperty("/personalization"),h=sap.ushell.components.getHomepageManager?sap.ushell.components.getHomepageManager():undefined;this.isCombi=D.system.combi;this.isTouch=this.isCombi?false:(D.system.phone||D.system.tablet);this.parentComponent=d.getOwnerComponentFor(this);this.addStyleClass("sapUshellDashboardView");this.ieHtml5DnD=f&&h&&h.isIeHtml5DnD();this.oRenderer=sap.ushell.Container.getRenderer("fiori2");sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeInactive",this._handleEditModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","actionModeActive",this._handleEditModeChange,this);sap.ui.getCore().getEventBus().subscribe("launchpad","contentRefresh",this._onDashboardShown,this);this.oDoable=E.once("CoreResourcesComplementLoaded").do(function(){this.oAnchorNavigationBar.setOverflowEnabled(true);if(f){sap.ui.require(["sap/ushell/components/homepage/ActionMode"],function(i){i.init(this.oModel);}.bind(this));this._createFooter();this._createActionModeMenuButton();}}.bind(this));this.oRenderer.getRouter().getRoute("home").attachMatched(this._onDashboardShown,this);this.oAnchorNavigationBar=this._getAnchorNavigationBar(o);var g=new a();this.oDashboardGroupsBox=g.createGroupsBox(o,this.oModel);this.oFilterSelectedGroup=new F("isGroupSelected",e.EQ,true);this.oPage=new P("sapUshellDashboardPage",{customHeader:this.oAnchorNavigationBar,landmarkInfo:{headerRole:A.Navigation},floatingFooter:true,content:[this.oDashboardGroupsBox]});this.oPage.addEventDelegate({onAfterRendering:function(){var i=this.getDomRef(),s=i.getElementsByTagName("section");q(s[0]).off("scrollstop",o.handleDashboardScroll);q(s[0]).on("scrollstop",o.handleDashboardScroll);}.bind(this)});return this.oPage;},getAnchorItemTemplate:function(){var t=this,h=C.last("/core/extension/enableHelp");var o=new b({index:"{index}",title:"{title}",groupId:"{groupId}",defaultGroup:"{isDefaultGroup}",writeHelpId:h,selected:false,isGroupRendered:"{isRendered}",visible:{parts:["/tileActionModeActive","isGroupVisible","visibilityModes"],formatter:function(f,i,v){if(!v[f?1:0]){return false;}return i||f;}},locked:"{isGroupLocked}",isGroupDisabled:{parts:["isGroupLocked","/isInDrag","/homePageGroupDisplay"],formatter:function(i,I,s){return i&&I&&s==="tabs";}},press:function(f){t.oAnchorNavigationBar.handleAnchorItemPress(f);}});o.attachBrowserEvent("focus",function(){this.setNavigationBarItemsVisibility();}.bind(this.oAnchorNavigationBar));return o;},_getAnchorNavigationBar:function(o){var f=new c("anchorNavigationBar",{selectedItemIndex:"{/topGroupInViewPortIndex}",itemPress:[function(g){this._handleAnchorItemPress(g);},o],overflowEnabled:false});if(D.system.desktop){f.addEventDelegate({onsapskipforward:function(g){g.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.ComponentKeysHandler.goToTileContainer(g,this.bGroupWasPressed);this.bGroupWasPressed=false;},onsapskipback:function(g){g.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(g);},onsapenter:function(g){g.srcControl.getDomRef().click();},onsapspace:function(g){g.srcControl.getDomRef().click();}});}f.addStyleClass("sapContrastPlus");return f;},_actionModeButtonPress:function(){this.oDashboardGroupsBox.getBinding("groups").filter([]);var f=this.oDashboardGroupsBox.getGroups();sap.ushell.components.homepage.ActionMode.toggleActionMode(this.oModel,"Menu Item",f);this._updateAnchorNavigationBarVisibility();if(this.oModel.getProperty("/homePageGroupDisplay")==="tabs"){if(this.oModel.getProperty("/tileActionModeActive")){var g=this.oModel.getProperty("/groups"),s;for(var i=0;i<g.length;i++){if(g[i].isGroupSelected){s=i;break;}}this.getController()._scrollToGroup("launchpad","scrollToGroup",{group:{getGroupId:function(){return g[s].groupId;}},groupChanged:false,focus:true});}else{this.getController()._deactivateActionModeInTabsState();}}},_createActionModeMenuButton:function(){var o={id:"ActionModeBtn",text:r.i18n.getText("activateEditMode"),icon:"sap-icon://edit",press:this._actionModeButtonPress.bind(this)};this.oTileActionsButton=sap.ui.getCore().byId(o.id);if(this.oTileActionsButton){this.oTileActionsButton.setTooltip(o.text);this.oTileActionsButton.setText(o.text);this.oTileActionsButton.attachPress(o.press);}else{var f={controlType:"sap.ushell.ui.launchpad.ActionItem",oControlProperties:o,bIsVisible:true,aStates:["home"]};this.oRenderer.addUserAction(f).done(function(g){this.oTileActionsButton=g;if(C.last("/core/extension/enableHelp")){this.oTileActionsButton.addStyleClass("help-id-ActionModeBtn");}}.bind(this));}},_handleEditModeChange:function(){if(this.oTileActionsButton){this.oTileActionsButton.toggleStyleClass("sapUshellAcionItemActive");}},_createFooter:function(){sap.ui.require(["sap/m/Bar","sap/m/Button","sap/m/ToolbarSpacer"],function(B,f,T){var o=new B("sapUshellDashboardFooter",{visible:"{/tileActionModeActive}",contentRight:[new T()]});var g=new f("sapUshellDashboardFooterDoneBtn",{type:m.ButtonType.Emphasized,text:r.i18n.getText("closeEditMode"),tooltip:r.i18n.getText("exitEditMode"),press:this._actionModeButtonPress.bind(this)});if(D.system.desktop){g.addEventDelegate({onsapskipforward:function(h){h.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);},onsapskipback:function(h){h.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.ComponentKeysHandler.goToFirstVisibleTileContainer();},onsaptabprevious:function(h){h.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.components.ComponentKeysHandler.goToFirstVisibleTileContainer();},onsaptabnext:function(h){h.preventDefault();sap.ushell.renderers.fiori2.AccessKeysHandler.setIsFocusHandledByAnotherHandler(true);sap.ushell.renderers.fiori2.AccessKeysHandler.sendFocusBackToShell(h);}});}o.addContentRight(g);this.oPage.setFooter(o);}.bind(this));},_onDashboardShown:function(){var i=this.oRenderer&&this.oRenderer.getCurrentCoreView()==="home";if(i){if(!D.system.phone){this.oRenderer.showRightFloatingContainer(false);}this._updateAnchorNavigationBarVisibility();this.getController().resizeHandler();u.refreshTiles();if(D.system.desktop){sap.ushell.components.ComponentKeysHandler.goToTileContainer();}}},_updateAnchorNavigationBarVisibility:function(){var o=this.oPage.getShowHeader(),v=this.getModel().getProperty("/groups").filter(function(G){return G.isGroupVisible;}),f=v.length>1;this.oPage.setShowHeader(f);if(f&&!o){var g=this.getModel().getProperty("/groups"),s=this.getModel().getProperty("/iSelectedGroup");for(var i=0;i<v.length;i++){if(v[i].getGroupId&&v[i].getGroupId()===g[s].groupId){this.oAnchorNavigationBar.setSelectedItemIndex(i);break;}}}},getControllerName:function(){return"sap.ushell.components.homepage.DashboardContent";},exit:function(){V.prototype.exit.apply(this,arguments);if(this.oAnchorNavigationBar){this.oAnchorNavigationBar.handleExit();this.oAnchorNavigationBar.destroy();}if(this.oTileActionsButton){this.oTileActionsButton.destroy();}if(this.oDoable){this.oDoable.off();}if(this.oDoneBtnLabel){this.oDoneBtnLabel.destroy();}sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeInactive",this._handleEditModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","actionModeActive",this._handleEditModeChange,this);sap.ui.getCore().getEventBus().unsubscribe("launchpad","contentRefresh",this._onDashboardShown,this);}});},false);
