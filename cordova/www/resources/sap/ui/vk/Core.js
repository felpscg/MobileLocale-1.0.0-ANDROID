/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","./library"],function(M,v){"use strict";var C=M.extend("sap.ui.vk.Core",{metadata:{publicMethods:["registerClass"]},constructor:function(){if(v.getCore){return v.getCore();}M.call(this);var t=this;v.getCore=function(){return t;};this._classes=[];}});C.prototype.registerClass=function(c){if(this._classes.indexOf(c)>=0){return this;}var t=this,f=c.getMetadata().getName(),e=f+"-created",a=f+"-destroying",b=c.prototype.register,d=c.prototype.deregister;c.prototype.register=function(){if(b){b.call(this);}t.fireEvent(e,{object:this});};c.prototype.deregister=function(){t.fireEvent(a,{object:this});if(d){d.call(this);}};this._classes.push(c);return this;};return new C();});
