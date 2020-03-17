sap.ui.define(["sap/ui/core/service/Service","sap/ui/core/service/ServiceFactory","sap/ui/model/resource/ResourceModel","sap/ui/core/cache/CacheManager"],function(S,a,R,C){"use strict";function g(u,e,U){return new Promise(function(r,c){jQuery.ajax(u,{method:"GET"}).done(function(o,t,j){U[u]=j.getResponseHeader("ETag")||j.getResponseHeader("Last-Modified");r(e===U[u]);}).fail(function(){U[u]="";r(false);});});}var b=S.extend("sap.fe.services.CacheHandlerService",{initPromise:null,init:function(){var t=this;var c=this.getContext();this.oFactory=c.factory;var s=c.settings;if(!s.metaModel){throw new Error("a `metaModel` property is expected when instantiating the CacheHandlerService");}this.oMetaModel=s.metaModel;this.initPromise=this.oMetaModel.fetchEntityContainer().then(function(){return t;});this.mCacheNeedsInvalidate={};},exit:function(){this.oFactory.removeGlobalInstance(this.oMetaModel);},validateCacheKey:function(c){var t=this;var d=true;return C.get(c).then(function(m){var M=t.getETags();var u=JSON.stringify(M);if(m){var U={};var e=JSON.parse(m.cachedETags);return Promise.all(Object.keys(e).map(function(s){if(e[s]){if(M[s]){U[s]=M[s];return e[s]===M[s];}else{return g(s,e[s],U);}}else{U[s]=M[s];return e[s]===M[s];}})).then(function(v){d=v.indexOf(false)>=0;if(Object.keys(U).some(function(s){return!U[s];})){return null;}else{return d?JSON.stringify(U):m.viewCacheKey;}});}else if(Object.keys(M).some(function(s){return!M[s];})){d=true;u=null;}return u;}).catch(function(e){d=true;return null;}).then(function(s){t.mCacheNeedsInvalidate[c]=d;return s;});},invalidateIfNeeded:function(c,s){var d=JSON.stringify(this.getETags());if(this.mCacheNeedsInvalidate[s]||(c&&c!==d)){var m={};m.cachedETags=d;m.viewCacheKey=c;return C.set(s,m);}else{return Promise.resolve();}},getETags:function(){var m=this.oMetaModel.getETags();Object.keys(m).forEach(function(M){if(m[M]instanceof Date){m[M]=m[M].toISOString();}});return m;}});return a.extend("sap.fe.services.CacheHandlerServiceFactory",{_oInstanceRegistry:{},createInstance:function(s){if(!this._oInstanceRegistry[s.settings.metaModel]){this._oInstanceRegistry[s.settings.metaModel]=new b(Object.assign({factory:this,scopeObject:null,scopeType:"service"},s));}var t=this;return this._oInstanceRegistry[s.settings.metaModel].initPromise.then(function(){return t._oInstanceRegistry[s.settings.metaModel];}).catch(function(e){t._oInstanceRegistry[s.settings.metaModel]=null;throw e;});},getInstance:function(m){return this._oInstanceRegistry[m];},removeGlobalInstance:function(m){this._oInstanceRegistry[m]=null;}});},true);
