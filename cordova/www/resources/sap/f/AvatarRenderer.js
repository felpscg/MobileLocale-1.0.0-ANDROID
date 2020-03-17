/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/f/library","sap/base/security/encodeCSS"],function(l,e){"use strict";var A=l.AvatarSize;var a=l.AvatarType;var b=l.AvatarColor;var c={apiVersion:2};c.render=function(r,o){var i=o.getInitials(),s=o._getActualDisplayType(),I=o._getImageFallbackType(),d=o.getDisplaySize(),D=o.getDisplayShape(),f=o.getImageFitType(),C=o.getCustomDisplaySize(),g=o.getCustomFontSize(),S=o.getSrc(),h="sapFAvatar",t=o.getTooltip_AsString(),j=o._getDefaultTooltip(),L=o.getAriaLabelledBy(),k=o.getAriaDescribedBy(),m=t&&i?j+" "+t:j,n=i?j+" "+i:j;r.openStart("span",o);r.class(h);c.addBackgroundColorClass(r,o);r.class(h+d);r.class(h+s);r.class(h+D);if(o.hasListeners("press")){r.class("sapMPointer");r.class(h+"Focusable");r.attr("role","button");r.attr("tabindex",0);}else{r.attr("role","img");}if(o.getShowBorder()){r.class("sapFAvatarBorder");}if(d===A.Custom){r.style("width",C);r.style("height",C);r.style("font-size",g);}if(t){r.attr("title",t);r.attr("aria-label",m);}else{r.attr("aria-label",n);}if(L&&L.length>0){r.attr("aria-labelledby",L.join(" "));}if(k&&k.length>0){r.attr("aria-describedby",k.join(" "));}r.openEnd();if(s===a.Icon||I===a.Icon){r.renderControl(o._getIcon());}else if(s===a.Initials||I===a.Initials){r.openStart("span");r.class(h+"InitialsHolder");r.openEnd();r.text(i);r.close("span");}if(s===a.Image){r.openStart("span");r.class(h+"ImageHolder");r.class(h+s+f);r.style("background-image","url('"+e(S)+"')");r.openEnd();r.close("span");}if(o._fnLightBoxOpen){r.openStart("span").class(h+"MagnifyingGlass").openEnd().close("span");}r.close("span");};c.addBackgroundColorClass=function(r,o){var B=o.getBackgroundColor(),k;if(o.getBackgroundColor()===b.Random){k=Object.keys(b);k.splice(k.indexOf(b.Random),1);B=b[k[k.length*Math.random()<<0]];}r.class("sapFAvatarColor"+B);};return c;},true);