// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchModel'],function(S){"use strict";var m=sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar",{metadata:{properties:{itemId:"string",navigationObjects:{type:"object",multiple:true},positionInList:"int"},aggregations:{_relatedObjectActionsToolbar:{type:"sap.m.Toolbar",multiple:false,visibility:"hidden"},_ariaDescriptionForLinks:{type:"sap.ui.core.InvisibleText",multiple:false,visibility:"hidden"}}},init:function(){var t=this;if(sap.ui.core.Control.prototype.init){sap.ui.core.Control.prototype.init.apply(t,arguments);}sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar._allOfMyCurrentInstances.push(t);t.setAggregation("_relatedObjectActionsToolbar",new sap.m.Toolbar({design:sap.m.ToolbarDesign.Solid}).data("sap-ui-fastnavgroup","false",true).addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Toolbar"));t.setAggregation("_ariaDescriptionForLinks",new sap.ui.core.InvisibleText({text:sap.ushell.resources.i18n.getText("result_list_item_aria_has_more_links")}));if(typeof sap!=='undefined'&&sap.ui&&sap.ui.getCore){sap.ui.getCore().getEventBus().subscribe("searchLayoutChanged",t._layoutToolbarElements,t);}},exit:function(){var t=this;if(sap.ui.core.Control.prototype.exit){sap.ui.core.Control.prototype.exit.apply(t,arguments);}var a=sap.ushell.renderers.fiori2.search.controls.SearchRelatedObjectsToolbar._allOfMyCurrentInstances;for(var i=0;i<a.length;i++){if(a[i]===t){a.splice(i,1);break;}}if(typeof sap!=='undefined'&&sap.ui&&sap.ui.getCore){sap.ui.getCore().getEventBus().unsubscribe("searchLayoutChanged",t._layoutToolbarElements,t);}},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUshellSearchResultListItem-RelatedObjectsToolbar");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_ariaDescriptionForLinks"));c._renderToolbar(r);r.write("</div>");},_renderToolbar:function(r){var t=this;var i;var _=t.getAggregation("_relatedObjectActionsToolbar");_.destroyContent();var c=function(b){return function(){t._performNavigation(b,{trackingOnly:true});};};var n=t.getNavigationObjects();if(n.length>0){var a=[];for(i=0;i<n.length;i++){var b=n[i];var l=new sap.m.Link({text:b.getText(),href:b.getHref(),layoutData:new sap.m.ToolbarLayoutData({shrinkable:false}),press:c(b)});var d=b.getTarget();if(d){l.setTarget(d);}l.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");a.push(l);}var e=new sap.m.ToolbarSpacer();e.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Spacer");_.addContent(e);for(i=0;i<a.length;i++){_.addContent(a[i]);}t._overFlowButton=new sap.m.Button({icon:sap.ui.core.IconPool.getIconURI("overflow")});t._overFlowButton.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-OverFlowButton");_.addContent(t._overFlowButton);t._overFlowSheet=new sap.m.ActionSheet({placement:sap.m.PlacementType.Top});t._overFlowButton.attachPress(function(){t._overFlowSheet.openBy(t._overFlowButton);});r.renderControl(_);}},onAfterRendering:function(){var t=this;t._layoutToolbarElements();t._addAriaInformation();},_layoutToolbarElements:function(){var t=this;var _=t.getAggregation("_relatedObjectActionsToolbar");if(!(t.getDomRef()&&_.getDomRef())){return;}var a=$(_.getDomRef());var b=a.width();if($(t.getDomRef()).css("display")==="none"||a.css("display")==="none"){return;}t.toolbarWidth=b;var c=$(t._overFlowButton.getDomRef());c.css("display","none");var d=0;var p=function(k,l){t._performNavigation(l);};var e=a.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");for(var i=0;i<e.length;i++){var f=$(e[i]);f.css("display","");var g=d+f.outerWidth(true);if(g>b){if(i<e.length){c.css("display","");var o=c.outerWidth(true);for(;i>=0;i--){f=$(e[i]);g-=f.outerWidth(true);if(g+o<=b){break;}}}var n=t.getNavigationObjects();t._overFlowSheet.destroyButtons();i=(i>=0)?i:0;for(;i<e.length;i++){f=$(e[i]);f.css("display","none");var h=n[i];var j=new sap.m.Button({text:h.getText()});j.attachPress(h,p);t._overFlowSheet.addButton(j);}break;}d=g;}t._setupItemNavigation();},_setupItemNavigation:function(){var t=this;if(!t.theItemNavigation){t.theItemNavigation=new sap.ui.core.delegate.ItemNavigation();t.addDelegate(t.theItemNavigation);}t.theItemNavigation.setCycling(false);t.theItemNavigation.setRootDomRef(t.getDomRef());var a=[];var _=t.getAggregation("_relatedObjectActionsToolbar");var c=_.getContent();for(var i=0;i<c.length;i++){if(!c[i].hasStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Element")){continue;}if(!$(c[i].getDomRef()).attr("tabindex")){var b="-1";if(c[i].getPressed&&c[i].getPressed()){b="0";}$(c[i].getDomRef()).attr("tabindex",b);}a.push(c[i].getDomRef());}var d=t._overFlowButton.getDomRef();a.push(d);$(d).attr("tabindex","-1");t.theItemNavigation.setItemDomRefs(a);},_addAriaInformation:function(){var t=this;var a=$(this.getAggregation("_relatedObjectActionsToolbar").getDomRef());var b=a.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");var c=$(t._overFlowButton.getDomRef());if(b.length>0||c.is(":visible")){var d=t.getAggregation("_ariaDescriptionForLinks").getId();b.each(function(){var f=$(this);var e=f.attr("aria-describedby")||"";e+=" "+d;f.attr("aria-describedby",e);});if(c.is(":visible")){var e=c.attr("aria-describedby")||"";e+=" "+d;c.attr("aria-describedby",e);}}},_performNavigation:function(n,p){var t=p&&p.trackingOnly||false;n.performNavigation({trackingOnly:t});}});m._allOfMyCurrentInstances=[];$(window).on("resize",function(){for(var i=0;i<this._allOfMyCurrentInstances.length;i++){this._allOfMyCurrentInstances[i]._layoutToolbarElements();}}.bind(m));return m;});
