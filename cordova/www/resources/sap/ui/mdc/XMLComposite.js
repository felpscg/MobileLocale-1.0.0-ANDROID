/*!
 * SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/mdc/XMLCompositeMetadata','sap/ui/model/base/ManagedObjectModel','sap/ui/core/util/XMLPreprocessor','sap/ui/model/json/JSONModel','sap/ui/core/Fragment','sap/ui/base/ManagedObject','sap/ui/base/DataType','sap/ui/model/base/XMLNodeAttributesModel','sap/ui/core/util/reflection/XmlTreeModifier','sap/ui/model/resource/ResourceModel','sap/ui/model/base/XMLNodeUtils','sap/ui/base/ManagedObjectObserver','sap/base/util/ObjectPath','sap/ui/base/SyncPromise','sap/base/Log','sap/ui/performance/Measurement','sap/ui/core/XMLComposite','./ResourceModel'],function(q,C,X,M,a,J,F,b,D,c,d,R,U,e,O,S,L,f,g,h){"use strict";var m={};function k(i,j){if(!m[i]){q.sap.require(i);m[i]=O.get(i);}return m[i];}function l(P){var i={};i.models=P.oModels||{};i.bindingContexts=P.oBindingContexts||{};return i;}function o(j,n,E,I,V){var A=new J(E),w=I.getMetadata(),x=w.getAllAggregations(),P=w.getAllProperties(),y=w._mAllSpecialSettings;A.getVisitor=function(){return V;};A.$$valueAsPromise=true;A._getObject=function(z,B){var G;z=this.resolve(z,B);z=z.substring(1);var H=z.split("/");if(z&&z.startsWith&&z.startsWith("metadataContexts")){return this._navInMetadataContexts(z);}if(P.hasOwnProperty(z)){var K=P[z];if(!E.hasAttribute(z)){return K.defaultValue;}return S.resolve(V.getResult(E.getAttribute(z))||E.getAttribute(z)).then(function(Z){if(Z){var $=U.parseScalarType(K.type,Z,z);if(typeof $==="object"&&$.path){return Z;}return $;}return null;});}else if(x.hasOwnProperty(H[0])){var N=x[H[0]];var Q,T=d.getAggregation(E,H[0]);if(!T){return null;}if(N.multiple){var W=[];for(var i=0;i<T.length;i++){Q=new c(T[i],V,"");W.push(Q.getContext("/"));}G=W;}else{Q=new c(T,V,"");Q.$$valueAsPromise=true;G=Q.getContext("/");}H.shift();return this._getNode(H,G);}else if(y.hasOwnProperty(z)){var Y=y[z];if(!E.hasAttribute(z)){return Y.defaultValue||null;}return S.resolve(V.getResult(E.getAttribute(z))).then(function(Z){if(Y.type){var $=U.parseScalarType(Y.type,Z,z);if(typeof $==="object"&&$.path){return Z;}return $;}if(Z){return Z;}return E.getAttribute(z);});}};A._navInMetadataContexts=function(i){var z=i.replace("metadataContexts","");var B=z.split("/"),N=j["metadataContexts"].getObject();B.shift();return this._getNode(B,N);};A._getNode=function(i,N){var z=null,B;while(i.length>0&&N){if(N.getObject){z=N.getObject(i.join("/"));}if(!z){B=i.shift();N=N[B];}else{return z;}}return N;};A.getContextName=function(){return n;};j[n]=A.getContext("/");if(j["metadataContexts"]){j["metadataContexts"].oModel.setProperty("/"+n,j[n]);}}function p(i,V){var j=new J(V.getViewInfo());i["$view"]=j.getContext("/");}function r(i,V,n,w,x){if(!n&&!w){return;}var y=n?b.bindingParser(n):{parts:[]};var z=w?b.bindingParser(w):{parts:[]};if(!z.parts){z={parts:[z]};}if(!y.parts){y={parts:[y]};}q.merge(y.parts,z.parts);for(var j=0;j<y.parts.length;j++){s(i,V,y.parts[j],y,x);V=V["with"](i,false);}var A=new J(y);i["metadataContexts"]=A.getContext("/");}function s(i,V,j,n,w){j.model=j.model||w;var K=j.name||j.model||undefined;if(n[K]){return;}try{i[K]=V.getContext(j.model+">"+j.path);n[K]=i[K];}catch(x){i["_$error"].oModel.setProperty("/"+K,x);}}function t(P,i,n){var A=i._aggregationFragments,w=[],x=i.getLibraryName(),y;if(A){Object.keys(A).forEach(function(z){var B=i.getAggregation(z);if(!B){return true;}var E=P.getElementsByTagNameNS(x,z)[0];if(!E){E=document.createElementNS(x,z);P.appendChild(E);y=false;}else{y=true;}if(y&&!B.multiple){return true;}var G=A[z].cloneNode(true);w.push(n.visitChildNodes(G).then(function(){var H=U.getChildren(G);var I=P.getAttribute("id");for(var j=0;j<H.length;j++){if(H[j].getAttribute("id")){H[j].setAttribute("id",F.createId(I,H[j].getAttribute("id")));}E.appendChild(H[j]);}}));});}return Promise.all(w);}function u(i){var j=this.getMetadata(),n=i.name,w=j.getProperty(n)||j.getAggregation(n)||j.getAllPrivateAggregations()[n];if(w){this._requestFragmentRetemplatingCheck(w);}}var v=g.extend("sap.ui.mdc.XMLComposite",{metadata:{properties:{_fnPopulateTemplate:{type:"function",visibility:'hidden'}}},defaultMetaModel:'sap.ui.mdc.metaModel',alias:"this",constructor:function(i,j){j=j||{};var n=this.getMetadata(),T="_fnPopulateTemplate",A=n.getCompositeAggregationName();if(i&&typeof i!=='string'){j=i;i=j.id;delete j.id;}if(!j[T]){j[T]=function(w,j){j[A]=this._fragmentContent;w._bIsClone=true;}.bind(this);}else{j[T](this,j);}g.apply(this,[i,j]);}},X);v.prototype.set_fnPopulateTemplate=function(V,i){this.mProperties["_fnPopulateTemplate"]=V;return this;};v.prototype.init=function(){this.observer=new e(u.bind(this));this.observer.observe(this,{properties:true,aggregations:true});if(h){this.setModel(h.getModel(),"$i18n");}};v.prototype._initCompositeSupport=function(i){var j=this.getMetadata(),A=j.getCompositeAggregationName(),n=i&&A?i[A]:undefined;if(n){if(n instanceof b){this._setCompositeAggregation(n);return;}this._fragmentContent=n;}else{if(this.getMetadata().usesTemplating()){this._requestFragmentRetemplatingCheck();return;}}g.prototype._initCompositeSupport.apply(this,[i]);};v.prototype.useAsTemplate=function(i){var j=this.getMetadata(),n=j._oClass,A=j.getCompositeAggregationName();i=i||{};i[A]=this._fragmentContent;return new n(i);};v.initialTemplating=function(E,V,i){var I=k(i),j=new J({}),n={"_$error":j.getContext("/")},w=I.getMetadata(),x=w.getFragment(),y=w._mSpecialSettings.metadataContexts?w._mSpecialSettings.metadataContexts.defaultValue:"";if(!x){throw new Error("Fragment "+i+" not found");}if(!E.getAttribute("id")){E.setAttribute("id",w.uid());}r(n,V,E.getAttribute("metadataContexts"),y,I.prototype.defaultMetaModel);o(n,I.prototype.alias,E,I,V);p(n,V);var z=V["with"](n,true);return z.visitChildNodes(E).then(function(){return t(E,w,z);}).then(function(){return z.visitChildNodes(x);}).then(function(){var N=x.ownerDocument.createElementNS("http://schemas.sap.com/sapui5/extension/sap.ui.core.xmlcomposite/1",w.getCompositeAggregationName());N.appendChild(x);E.appendChild(N);});};v.prototype._requestFragmentRetemplatingCheck=function(i,j){var n=true;if(i){n=!this._bIsCreating&&!this._bIsBeingDestroyed&&!this._requestFragmentRetemplatingPending&&i.appData&&i.appData.invalidate==="template";}if(!n){return;}if(!this._requestFragmentRetemplatingPending){if(this.requestFragmentRetemplating){this._requestFragmentRetemplatingPending=true;setTimeout(function(){this.requestFragmentRetemplating(j);this._requestFragmentRetemplatingPending=false;}.bind(this),0);}else{throw new Error("Function requestFragmentRetemplating not available although invalidationMode was set to template");}}};v.prototype.requestFragmentRetemplating=function(i){if(i){return this.fragmentRetemplating();}if(this._bIsClone&&(this._renderingContent?this._renderingContent():this._getCompositeAggregation())){delete this._bIsClone;return;}var A=this.getMetadata().getMandatoryAggregations(),B=true;for(var n in A){B=typeof this.getBindingInfo(n)==="object";if(!B){break;}}if(B){this.fragmentRetemplating();}};v.prototype.fragmentRetemplating=function(){var i=this.getMetadata(),j=i.getFragment();if(!j){throw new Error("Fragment "+j.tagName+" not found");}var n=this._getManagedObjectModel();var w=this;n.getContextName=function(){return w.alias;};this.bindObject(this.alias+">/");this.setModel(n,this.alias);n._mSettings=l(this._getPropertiesToPropagate());delete n._mSettings.models["$"+this.alias];delete n._mSettings.bindingContexts["$"+this.alias];this.setModel(null,this.alias);a.process(j.querySelector("*"),{},n._mSettings);var x={};x[i.getCompositeAggregationName()]=j;this._initCompositeSupport(x);};v.prototype.getSuppressInvalidateAggregation=function(n,i){var j=this.getMetadata(),A=j.getAggregation(n)||j.getAllPrivateAggregations()[n];if(!A){return true;}i=j._suppressInvalidate(A,i);this._requestFragmentRetemplatingCheck(A);return i;};v.prototype.destroy=function(){g.prototype.destroy.apply(this,arguments);if(this.observer){this.observer.destroy();}};return v;},true);
