/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseText","./BaseRectangle","./RenderUtils","sap/ui/core/IconPool","sap/ui/core/Core"],function(B,a,R,I,C){"use strict";var b=B.extend("sap.gantt.simple.BaseImage",{metadata:{properties:{src:{type:"sap.ui.core.URI",defaultValue:null},width:{type:"sap.gantt.SVGLength",defaultValue:20},height:{type:"sap.gantt.SVGLength",defaultValue:20}}}});var i=["x","y","width","height"];var c={IconFont:"iconFont",Image:"bitImage"};b.prototype._needToRenderAs=function(){return I.isIconURI(this.getSrc())?c.IconFont:c.Image;};b.prototype.getText=function(){if(this._needToRenderAs()===c.IconFont){var o=I.getIconInfo(this.getSrc());if(o){return o.content;}}else{jQuery.sap.log.error("\"getText\" can not be invoked since it's not a icon font!",this);}};b.prototype.getFontFamily=function(){if(this._needToRenderAs()===c.IconFont){var o=I.getIconInfo(this.getSrc());if(o){return o.fontFamily;}}else{jQuery.sap.log.error("\"getFontFamily\" can not be invoked since it's not a icon font!",this);}};b.prototype.getFontSize=function(){if(this._needToRenderAs()===c.IconFont){return parseFloat(this.getHeight());}else{jQuery.sap.log.error("\"getFontSize\" can not be invoked since it's not a icon font!",this);}};b.prototype.getX=function(){var r=C.getConfiguration().getRTL();if(this._needToRenderAs()===c.Image){if(r){return a.prototype.getX.apply(this)-this.getWidth();}return a.prototype.getX.apply(this);}else if(this._needToRenderAs()===c.IconFont){return B.prototype.getX.apply(this);}};b.prototype.getY=function(){if(this._needToRenderAs()===c.Image){return a.prototype.getY.apply(this);}else if(this._needToRenderAs()===c.IconFont){return B.prototype.getY.apply(this);}};b.prototype.renderElement=function(r,e){if(this._needToRenderAs()===c.Image){r.write("<image");this.writeElementData(r);r.writeClasses(this);R.renderAttributes(r,e,i);r.writeAttribute("xlink:href",this.getProperty("src"));r.write(">");R.renderTooltip(r,e);r.write("</image>");}else if(this._needToRenderAs()===c.IconFont){B.prototype.renderElement.apply(this,arguments);}};return b;},true);