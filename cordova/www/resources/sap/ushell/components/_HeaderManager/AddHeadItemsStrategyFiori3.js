// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";function a(E,i){return E.indexOf(i)===-1?E.concat(i):E;}function A(E,i){return i.reduce(a,E);}function f(r){return function(i){return r.indexOf(i)===-1;};}function v(E,i){return A(E,i.filter(f(['backBtn','homeBtn']))).length<=3;}function b(c,I){var n=[],C=c.concat(I);if(c.indexOf("backBtn")>-1||I.indexOf("backBtn")>-1){n.push("backBtn");}if(c.indexOf("homeBtn")>-1||I.indexOf("homeBtn")>-1){n.push("homeBtn");}if(n.length<3){for(var i=0;i<C.length;i++){var s=C[i];if(n.indexOf(s)===-1){n.push(s);}if(n.length>=3){break;}}}return n;}function e(c,V){var r=c;if(v(c,V)){r=b(c,V);}return r;}return{execute:e};});
