/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/dt/OverlayRegistry","sap/ui/dt/Util"],function(O,D){"use strict";return function(r){function i(v,o){return typeof v==='function'?v(o):v;}function g(E){return r._oDesignTime.getPlugins().map(function(p){return p.getMenuItems(E);}).reduce(function(R,m){return m?R.concat(m):R;},[]).map(function(m){return Object.assign({},m,{enabled:i(m.enabled,E),text:i(m.text,E[0])});});}function a(c){var C=D.castArray(c);var E=C.map(function(s){var o=O.getOverlay(s);if(!o){throw new Error(D.printf('Control with id="{0}" is not under the one of root elements or ignored.',s));}return o;});return g(E).map(function(m){return D.pick(m,['id','icon','rank','group','enabled','text']);});}function e(c,A){var C=D.castArray(c);var E=C.map(function(s){var o=O.getOverlay(s);if(!o){throw new Error(D.printf('Control with id="{0}" is not under the one of root elements or ignored.',s));}return o;});var b=g(E);var m=b.filter(function(m){return m.id===A;}).pop();if(!m){throw new Error('No action found by specified ID');}else{return m.handler(E,{});}}return{exports:{get:a,execute:e}};};});