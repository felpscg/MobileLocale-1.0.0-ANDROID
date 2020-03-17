/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./FlexBoxStylingHelper','sap/m/library',"sap/base/Log","sap/m/FlexItemData"],function(F,l,L,a){"use strict";var b=l.FlexDirection;var c=l.FlexRendertype;var d={apiVersion:2};d.render=function(r,C){r.openStart(C.getRenderType()==c.List?"ul":"div",C);var p=C.getParent();if(p&&p.isA("sap.m.FlexBox")){if(!C.hasStyleClass("sapMFlexItem")){r.class("sapMFlexItem");}var o=C.getLayoutData();if(o instanceof a){F.setFlexItemStyles(r,o);}}else if(C.getFitContainer()){r.class("sapMFlexBoxFit");}r.class("sapMFlexBox");if(C.getDisplayInline()){r.class("sapMFlexBoxInline");}if(C.getDirection()===b.Column||C.getDirection()===b.ColumnReverse){r.class("sapMVBox");}else{r.class("sapMHBox");}if(C.getDirection()===b.RowReverse||C.getDirection()===b.ColumnReverse){r.class("sapMFlexBoxReverse");}r.class("sapMFlexBoxJustify"+C.getJustifyContent());r.class("sapMFlexBoxAlignItems"+C.getAlignItems());r.class("sapMFlexBoxWrap"+C.getWrap());r.class("sapMFlexBoxAlignContent"+C.getAlignContent());var B="sapMFlexBoxBG"+C.getBackgroundDesign();if(!C.hasStyleClass(B)){r.class(B);}r.style("height",C.getHeight());r.style("width",C.getWidth());var t=C.getTooltip_AsString();if(t){r.attr("title",t);}r.openEnd();d.renderItems(C,r);if(C.getRenderType()===c.List){r.close("ul");}else{r.close("div");}};d.renderItems=function(C,r){var e=C.getItems(),w='';for(var i=0;i<e.length;i++){if(e[i].isA('sap.m.FlexBox')||C.getRenderType()===c.Bare){w="";}else if(C.getRenderType()===c.List){w="li";}else{w="div";}d.renderItem(e[i],w,r);}};d.renderItem=function(i,w,r){var o=i.getLayoutData();if(w&&!o){i.setAggregation("layoutData",new a(),true);o=i.getLayoutData();}if(!(o instanceof a)){if(o){L.warning(o+" set on "+i+" is not of type sap.m.FlexItemData");}if(w){r.openStart(w);}}else{if(w){r.openStart(w,o.getId());}if(o.getStyleClass()){d.addItemClass(o.getStyleClass(),i,w,r);}d.addItemClass("sapMFlexItemAlign"+o.getAlignSelf(),i,w,r);d.addItemClass("sapMFlexBoxBG"+o.getBackgroundDesign(),i,w,r);if(w){F.setFlexItemStyles(r,o);}}d.addItemClass("sapMFlexItem",i,w,r);if(w){if(i.isA("sap.m.ScrollContainer")){r.class("sapMFlexBoxScroll");}if(!i.getVisible()){r.class("sapUiHiddenPlaceholder");}r.openEnd();}r.renderControl(i);if(w){r.close(w);}};d.addItemClass=function(C,i,w,r){if(w){r.class(C);}else{i.addStyleClass(C);}};return d;},true);
