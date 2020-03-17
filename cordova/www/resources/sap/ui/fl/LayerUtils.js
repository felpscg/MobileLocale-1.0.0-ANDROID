/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/UriParameters","sap/ui/thirdparty/hasher"],function(U,h){"use strict";var L={BASE:"BASE",VENDOR:"VENDOR",PARTNER:"PARTNER",CUSTOMER_BASE:"CUSTOMER_BASE",CUSTOMER:"CUSTOMER",USER:"USER"};var l=[L.BASE,L.VENDOR,L.PARTNER,L.CUSTOMER_BASE,L.CUSTOMER,L.USER];var m={};l.forEach(function(s,i){m[s]=i;});var a={_mLayersIndex:m,_sTopLayer:l[l.length-1],FL_MAX_LAYER_PARAM:"sap-ui-fl-max-layer",isVendorLayer:function(){return this.getCurrentLayer(false)===L.VENDOR;},isCustomerDependentLayer:function(s){return([L.CUSTOMER,L.CUSTOMER_BASE].indexOf(s)>-1);},doesCurrentLayerRequirePackage:function(){var c=this.getCurrentLayer(false);return(c===L.VENDOR)||(c===L.PARTNER)||(c===L.CUSTOMER_BASE);},getMaxLayer:function(){var p;var u=this.getUshellContainer();if(u){var P=u.getService("URLParsing").parseShellHash(h.getHash())||{};if(P.params&&P.params.hasOwnProperty(this.FL_MAX_LAYER_PARAM)){p=P.params[this.FL_MAX_LAYER_PARAM][0];}}return p||this.getUrlParameter(this.FL_MAX_LAYER_PARAM)||this._sTopLayer;},getLayerIndex:function(s){return this._mLayersIndex[s];},isOverMaxLayer:function(s){return(this.getLayerIndex(s)>this.getLayerIndex(this.getMaxLayer()));},compareAgainstCurrentLayer:function(s,c){var C=c||a.getCurrentLayer(false);if((this.getLayerIndex(C)>this.getLayerIndex(s))||!s){return-1;}else if(this.getLayerIndex(C)===this.getLayerIndex(s)){return 0;}return 1;},isLayerFilteringRequired:function(){return!(this._sTopLayer===this.getMaxLayer());},getCurrentLayer:function(i){if(i){return L.USER;}var s=this.getUrlParameter("sap-ui-layer")||"";s=s.toUpperCase();return s||L.CUSTOMER;},getUrlParameter:function(p){return U.fromQuery(window.location.search).get(p);},getUshellContainer:function(){return sap.ushell&&sap.ushell.Container;}};return a;},true);
