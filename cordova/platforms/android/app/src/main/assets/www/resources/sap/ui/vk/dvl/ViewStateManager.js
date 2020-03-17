/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/Element","../ContentConnector","../ViewStateManagerBase","./GraphicsCoreApi","../cssColorToColor","../colorToCSSColor","../abgrToColor","../colorToABGR","./Scene"],function(q,E,C,V,G,c,a,b,d,S){"use strict";var e;var f=V.extend("sap.ui.vk.dvl.ViewStateManager",{metadata:{}});var g=f.getMetadata().getParent().getClass().prototype;f.prototype.init=function(){if(g.init){g.init.call(this);}this._nodeHierarchy=null;this._dvl=null;this._nodeStates=new Map();this._selectedNodes=new Set();this._visibilityTracker=new e();this._closedNodeProcessed=false;};f.prototype._setContent=function(i){var j=null;if(i&&i instanceof S){j=i;}this._setScene(j);};f.prototype._onAfterUpdateContentConnector=function(){this._setContent(this._contentConnector.getContent());};f.prototype._onBeforeClearContentConnector=function(){this._setScene(null);};f.prototype._handleContentReplaced=function(i){var j=i.getParameter("newContent");this._setContent(j);};f.prototype._setScene=function(i){if(i){this._setNodeHierarchy(i.getDefaultNodeHierarchy());}else{this._setNodeHierarchy(null);}return this;};f.prototype._setNodeHierarchy=function(n){var o=this._nodeHierarchy;if(this._nodeHierarchy){this._nodeHierarchy.detachNodeCreated(this._handleNodeCreated,this);this._nodeHierarchy.detachNodeRemoving(this._handleNodeRemoving,this);this._dvl.Client.detachStepEvent(this._handleStepEvent,this);this._nodeHierarchy=null;this._dvl=null;this._nodeStates.clear();this._selectedNodes.clear();this._visibilityTracker.clear();}if(n){var i=n.getScene(),j=i.getSceneRef();this._nodeHierarchy=n;this._dvl=i.getGraphicsCore().getApi(G.LegacyDvl);this._dvl.Client.attachStepEvent(this._handleStepEvent,this);this._nodeHierarchy.attachNodeCreated(this._handleNodeCreated,this);this._nodeHierarchy.attachNodeRemoving(this._handleNodeRemoving,this);this._populateNodeStates(this._dvl.Scene.RetrieveSceneInfo(j,sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN|sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_HOTSPOTS).ChildNodes);}if(n!==o){this.fireNodeHierarchyReplaced({oldNodeHierarchy:o,newNodeHierarchy:n});}return this;};f.prototype._populateNodeStates=function(n){var t=this,v=[],i=[],j=[],u=[],k=this._nodeHierarchy.getScene(),l=k.getSceneRef();n.forEach(function addNodeRecursive(m){var o=t._dvl.Scene.RetrieveNodeInfo(l,m,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS|sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_CHILDREN);t._nodeStates.set(m,{flags:o.Flags});if(o.Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED){t._selectedNodes.add(m);}(o.Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE?v:i).push(m);(o.Flags&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED?j:u).push(m);o.ChildNodes.forEach(addNodeRecursive);});this.fireSelectionChanged({selected:j,unselected:u});this.fireVisibilityChanged({visible:v,hidden:i});return this;};f.prototype._handleNodeCreated=function(i){this._populateNodeStates([i.getParameter("nodeRef")]);};f.prototype._handleNodeRemoving=function(i){var n=i.getParameter("nodeRef"),t=this;var r=function(n){t._nodeHierarchy.enumerateChildren(n,r,true,true);t._nodeStates.delete(n);};r(n);};f.prototype.getNodeHierarchy=function(){return this._nodeHierarchy;};f.prototype.getVisibilityChanges=function(){return this.getShouldTrackVisibilityChanges()?this._visibilityTracker.getInfo(this.getNodeHierarchy()):null;};f.prototype.getVisibilityComplete=function(){var n=this.getNodeHierarchy(),i=n.findNodesByName(),v=[],j=[];i.forEach(function(k){var l=n.createNodeProxy(k),m=q.grep(l.getVeIds(),function(m){return m.type==="VE_LOCATOR";});m=Array.isArray(m)&&m.length>0?m[0].fields[0].value:null;n.destroyNodeProxy(l);if(m){if(this.getVisibilityState(k)){v.push(m);}else{j.push(m);}}},this);return{visible:v,hidden:j};};f.prototype.resetVisibility=function(){this._dvl.Renderer.ResetView(sap.ve.dvl.DVLRESETVIEWFLAG.VISIBILITY,this._scene);return this;};var h=function(n,i,j){return n.has(j)&&(n.get(j).flags&i)!==0;};f.prototype._getVisibilityFlagState=function(n){return h(this._nodeStates,sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE,n);};f.prototype._getSelectionFlagState=function(n){return h(this._nodeStates,sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED,n);};var s=function(n,i,j,k){if(n.has(k)){var l=n.get(k);l.flags=l.flags&~j|i&j;}else{n.set(k,{flags:i&j});}};f.prototype._setFlags=function(n,i,j){if(j&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE){this.setVisibilityState(n,(i&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE)!==0,false);}if(j&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED){this.setSelectionState(n,(i&sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED)!==0,false);}s(this._nodeStates,i,j&~(sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE|sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED),n);return this;};f.prototype._getFlags=function(n,i){var j=this._nodeStates.get(n),k=j&&j.flags;return k!==undefined?k&i:null;};f.prototype.getVisibilityState=function(n){return Array.isArray(n)?n.map(this._getVisibilityFlagState,this):this._getVisibilityFlagState(n);};f.prototype.setVisibilityState=function(n,v,r){if(!Array.isArray(n)){n=[n];}var i=q.sap.unique(r?this._collectNodesRecursively(n,true):n).filter(function(j){return j&&this._getVisibilityFlagState(j)!==v;},this);if(i.length>0){i.forEach(function(j){var k=this._nodeStates.get(j);if(k){if(k.flags===undefined){k.flags=0;}if(v){k.flags|=sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE;}else{k.flags&=~sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE;}}else{this._nodeStates.set(j,{flags:v?sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_VISIBLE:0});}},this);if(this.getShouldTrackVisibilityChanges()){i.forEach(this._visibilityTracker.trackNodeRef,this._visibilityTracker);}this.fireVisibilityChanged({visible:v?i:[],hidden:v?[]:i});}return this;};f.prototype.enumerateSelection=function(i){this._selectedNodes.forEach(i);return this;};f.prototype.getSelectionState=function(n){return Array.isArray(n)?n.map(this._getSelectionFlagState,this):this._getSelectionFlagState(n);};f.prototype.setSelectionState=function(n,i,r,j){if(!Array.isArray(n)){n=[n];}var k=q.sap.unique(r||this.getRecursiveSelection()?this._collectNodesRecursively(n):n);if(this.getRecursiveSelection()&&!i){k=this._nodeHierarchy._appendAncestors(k);}k=k.filter(function(l){return l&&this._getSelectionFlagState(l)!==i;},this);if(k.length>0){k.forEach(function(l){var m=this._nodeStates.get(l);if(m){if(m.flags===undefined){m.flags=this._dvl.Scene.RetrieveNodeInfo(this._nodeHierarchy.getScene().getSceneRef(),l,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags;}if(i){m.flags|=sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED;}else{m.flags&=~sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED;}}else{var o=this._dvl.Scene.RetrieveNodeInfo(this._nodeHierarchy.getScene().getSceneRef(),l,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags;this._nodeStates.set(l,{flags:o|(i?sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED:0)});}this._selectedNodes[i?"add":"delete"](l);},this);if(!j){this.fireSelectionChanged({selected:i?k:[],unselected:i?[]:k});}}return this;};f.prototype.setSelectionStates=function(i,u,r,j){if(!Array.isArray(i)){i=[i];}if(!Array.isArray(u)){u=[u];}var k=q.sap.unique(r||this.getRecursiveSelection()?this._collectNodesRecursively(i):i);var l=q.sap.unique(r||this.getRecursiveSelection()?this._collectNodesRecursively(u):u);if(this.getRecursiveSelection()){l=this._nodeHierarchy._appendAncestors(l,k);}k=k.filter(function(n){return n&&this._getSelectionFlagState(n)===false;},this);l=l.filter(function(n){return n&&this._getSelectionFlagState(n)===true;},this);if(k.length>0){k.forEach(function(n){var m=this._nodeStates.get(n);if(m){if(m.flags===undefined){m.flags=this._dvl.Scene.RetrieveNodeInfo(this._nodeHierarchy.getScene().getSceneRef(),n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags;}m.flags|=sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED;}else{var o=this._dvl.Scene.RetrieveNodeInfo(this._nodeHierarchy.getScene().getSceneRef(),n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags;this._nodeStates.set(n,{flags:o|sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED});}this._selectedNodes["add"](n);},this);}if(l.length>0){l.forEach(function(n){var m=this._nodeStates.get(n);if(m){if(m.flags===undefined){m.flags=this._dvl.Scene.RetrieveNodeInfo(this._nodeHierarchy.getScene().getSceneRef(),n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags;}m.flags&=~sap.ve.dvl.DVLNODEFLAG.DVLNODEFLAG_SELECTED;}else{var o=this._dvl.Scene.RetrieveNodeInfo(this._nodeHierarchy.getScene().getSceneRef(),n,sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS).Flags;this._nodeStates.set(n,{flags:o});}this._selectedNodes["delete"](n);},this);}if(!j){if(k.length>0||l.length>0){this.fireSelectionChanged({selected:k,unselected:l});}}return this;};f.prototype._handleStepEvent=function(i){if(i.type===sap.ve.dvl.DVLSTEPEVENT.DVLSTEPEVENT_STARTED){this._visibilityTracker.clear();}};f.prototype._collectNodesRecursively=function(n,i){var r=[],t=this;if(i===undefined){i=false;}n.forEach(function collectChildNodes(j){r.push(j);t._nodeHierarchy.enumerateChildren(j,collectChildNodes,i,true);});return r;};f.prototype._getOpacity=function(n){if(this._nodeStates.has(n)){var o=this._nodeStates.get(n).opacity;return o===undefined?null:o;}else{return null;}};f.prototype.getOpacity=function(n){if(Array.isArray(n)){return n.map(this._getOpacity,this);}else{return this._getOpacity(n);}};f.prototype.setOpacity=function(n,o,r){if(!Array.isArray(n)){n=[n];}var i=q.sap.unique(r?this._collectNodesRecursively(n,true):n).filter(function(j){return j&&this._getOpacity(j)!==o;},this);if(i.length>0){i.forEach(function(j){var k=this._nodeStates.get(j);if(k){if(o===null){delete k.opacity;}else{k.opacity=o;}}else if(o!==null){this._nodeStates.set(j,{opacity:o});}},this);this.fireOpacityChanged({changed:i,opacity:o});}return this;};f.prototype._getTintColorABGR=function(n){if(this._nodeStates.has(n)){var t=this._nodeStates.get(n).tintColorABGR;return t===undefined?null:t;}else{return null;}};f.prototype._getTintColor=function(n){if(this._nodeStates.has(n)){var t=this._nodeStates.get(n).tintColorABGR;return t===undefined?null:a(b(t));}else{return null;}};f.prototype.getTintColor=function(n,i){var j=i?"_getTintColorABGR":"_getTintColor";if(Array.isArray(n)){return n.map(this[j],this);}else{return this[j](n);}};f.prototype.setTintColor=function(n,t,r){if(!Array.isArray(n)){n=[n];}var i=null;switch(typeof t){case"number":i=t;break;case"string":if(sap.ui.core.CSSColor.isValid(t)){i=d(c(t));}break;default:t=null;break;}var j=q.sap.unique(r?this._collectNodesRecursively(n,true):n).filter(function(k){return k&&this._getTintColorABGR(k)!==i;},this);if(j.length>0){j.forEach(function(k){var l=this._nodeStates.get(k);if(l){if(i===null){delete l.tintColorABGR;}else{l.tintColorABGR=i;}}else if(i!==null){this._nodeStates.set(k,{tintColorABGR:i});}},this);this.fireTintColorChanged({changed:j,tintColor:t,tintColorABGR:i});}return this;};e=function(){this._visibilityChanges=new Set();};e.prototype.getInfo=function(n){var i=function(v){return v.type==="VE_LOCATOR";};var j=[];this._visibilityChanges.forEach(function(k){var l=n.createNodeProxy(k),v=q.grep(l.getVeIds(),i);v=Array.isArray(v)&&v.length>0?v[0].fields[0].value:null;n.destroyNodeProxy(l);if(v){j.push(v);}});return j;};e.prototype.clear=function(){this._visibilityChanges.clear();};e.prototype.trackNodeRef=function(n){if(this._visibilityChanges.has(n)){this._visibilityChanges.delete(n);}else{this._visibilityChanges.add(n);}};C.injectMethodsIntoClass(f);return f;});
