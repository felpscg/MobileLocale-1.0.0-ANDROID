/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","../threejs/thirdparty/three","./Gizmo","./ScaleToolGizmoRenderer","./CoordinateSystem","./AxisColours"],function(q,t,G,S,C,A){"use strict";var c=G.extend("sap.ui.vk.tools.ScaleToolGizmo",{metadata:{library:"sap.ui.vk"}});c.prototype.init=function(){if(G.prototype.init){G.prototype.init.apply(this);}this._createEditingForm(null,64);this._gizmoIndex=-1;this._handleIndex=-1;this._viewport=null;this._tool=null;this._nonUniformScaleEnabled=false;this._sceneGizmo=new THREE.Scene();var l=new THREE.DirectionalLight(0xFFFFFF,0.5);l.position.set(1,3,2);this._sceneGizmo.add(l);this._sceneGizmo.add(new THREE.AmbientLight(0xFFFFFF,0.5));this._gizmo=new THREE.Group();this._touchAreas=new THREE.Group();this._sceneGizmo.add(this._gizmo);this._gizmoScale=new THREE.Vector3().setScalar(1);this._coordinateSystem=C.World;this._nodes=[];this._matViewProj=new THREE.Matrix4();this._gizmoSize=132;var e=144,f=24/e,g=48/e;function h(a,b,k){var m=new THREE.Matrix4().makeBasis(new THREE.Vector3(a.y,a.z,a.x),a,new THREE.Vector3(a.z,a.x,a.y));var n=new THREE.BoxBufferGeometry(f,f,f);n.applyMatrix(m);var o=new THREE.MeshLambertMaterial({color:b,transparent:true});var p=new THREE.Mesh(n,o);p.userData.color=b;if(a){p.position.copy(a);var r=window.devicePixelRatio*0.5/e;var s=new THREE.CylinderBufferGeometry(r,r,1,4);m.setPosition(a.clone().multiplyScalar(-0.5));s.applyMatrix(m);var u=new THREE.Mesh(s,o);u.renderOrder=1;p.add(u);m.setPosition(a);}var v=new THREE.BoxBufferGeometry(g,g,g);v.applyMatrix(m);k.add(new THREE.Mesh(v,o));return p;}function i(a,b,k){var m=new THREE.BufferGeometry();var v=new Float32Array(6);v[a]=v[b+3]=0.7;m.addAttribute("position",new THREE.Float32BufferAttribute(v,3));var n=new Float32Array(6);n[a]=n[b+3]=1;m.addAttribute("color",new THREE.Float32BufferAttribute(n,3));var o=new THREE.Line(m,new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors,transparent:true,linewidth:window.devicePixelRatio}));o.userData.colors=n;var p=new THREE.Geometry();var r=new THREE.Vector3().setComponent(a,0.7);var s=new THREE.Vector3().setComponent(b,0.7);p.vertices.push(new THREE.Vector3(),r,s);p.faces.push(new THREE.Face3(0,1,2));var u=new THREE.Mesh(p,new THREE.MeshBasicMaterial({color:0xFFFF00,opacity:0.5,transparent:true,side:THREE.DoubleSide,visible:false}));u.renderOrder=1;o.add(u);k.add(u.clone());return o;}this._gizmo.add(h(new THREE.Vector3(1,0,0),A.x,this._touchAreas));this._gizmo.add(h(new THREE.Vector3(0,1,0),A.y,this._touchAreas));this._gizmo.add(h(new THREE.Vector3(0,0,1),A.z,this._touchAreas));this._gizmo.add(i(1,2,this._touchAreas));this._gizmo.add(i(2,0,this._touchAreas));this._gizmo.add(i(0,1,this._touchAreas));f-=0.1/e;var j=new THREE.MeshLambertMaterial({color:0xC0C0C0,transparent:true});this._gizmo.add(new THREE.Mesh(new THREE.BoxBufferGeometry(f,f,f),j));this._touchAreas.add(new THREE.Mesh(new THREE.BoxBufferGeometry(g,g,g),new THREE.MeshBasicMaterial()));this._axisTitles=this._createAxisTitles();this._sceneGizmo.add(this._axisTitles);this._updateGizmoPartVisibility();};c.prototype.hasDomElement=function(){return true;};c.prototype._updateGizmoPartVisibility=function(){var s=this._coordinateSystem===C.Screen;var g=this._gizmo.children,a=this._touchAreas.children;g[2].visible=a[2].visible=!s;g[3].visible=g[4].visible=a[3].visible=a[4].visible=!s&&this._nonUniformScaleEnabled;g[5].visible=a[5].visible=this._nonUniformScaleEnabled;this._axisTitles.children[2].visible=!s;};c.prototype.setCoordinateSystem=function(a){this._coordinateSystem=a;this._gizmoIndex=this._handleIndex=-1;this._updateGizmoPartVisibility();};c.prototype.setNonUniformScaleEnabled=function(v){this._nonUniformScaleEnabled=!!v;this._updateGizmoPartVisibility();};c.prototype.show=function(v,a){this._viewport=v;this._tool=a;this._nodes.length=0;this._updateSelection(v._viewStateManager);};c.prototype.hide=function(){this._viewport=null;this._tool=null;this._gizmoIndex=this._handleIndex=-1;this._updateEditingForm(false);};c.prototype.getGizmoCount=function(){if(this._coordinateSystem===C.Local){return this._nodes.length;}else{return this._nodes.length>0?1:0;}};c.prototype.getTouchObject=function(i){if(this._nodes.length===0){return null;}this._updateGizmoObjectTransformation(this._touchAreas,i);return this._touchAreas;};var d=[1,2,4,6,5,3];c.prototype.highlightHandle=function(a,h){var b=(a===6)||(a>=0&&!this._nonUniformScaleEnabled);var i,o;for(i=0;i<3;i++){o=this._gizmo.children[i];var e=b||(d[a]&(1<<i));var f=e?0xFFFF00:o.userData.color;o.material.color.setHex(f);o.children[0].material.color.setHex(f);o.children[0].material.opacity=o.material.opacity=e||h?1:0.35;var g=this._axisTitles.children[i];g.material.color.setHex(f);g.material.opacity=e||h?1:0.35;}for(i=3;i<6;i++){o=this._gizmo.children[i];var j=o.geometry.attributes.color;j.copyArray(b||i===a?[1,1,0,1,1,0]:o.userData.colors);j.needsUpdate=true;o.material.opacity=h||i===a?1:0.35;o.children[0].material.visible=i===a;}o=this._gizmo.children[6];o.material.color.setHex(b?0xFFFF00:0xC0C0C0);o.material.opacity=b||h?1:0.35;};c.prototype.selectHandle=function(i,g){this._gizmoIndex=g;this._handleIndex=i;this._viewport.setShouldRenderFrame();};c.prototype.beginGesture=function(){this._matOrigin=this._gizmo.matrixWorld.clone();this._nodes.forEach(function(n){n.scaleOrigin=n.node.scale.clone();n.matOrigin=n.node.matrixWorld.clone();n.matParentInv=new THREE.Matrix4().getInverse(n.node.parent.matrixWorld);});};c.prototype.endGesture=function(){this._tool.fireScaled({x:this._gizmoScale.x,y:this._gizmoScale.y,z:this._gizmoScale.z});this._gizmoScale.setScalar(1);};c.prototype._scale=function(s){this._gizmoScale.copy(s);if(this._coordinateSystem===C.Local){this._nodes.forEach(function(n){n.node.scale.copy(n.scaleOrigin).multiply(s);n.node.matrixWorldNeedsUpdate=true;});this._viewport._updateBoundingBoxesIfNeeded();}else{var m=this._matOrigin.clone().scale(s).multiply(new THREE.Matrix4().getInverse(this._matOrigin));this._nodes.forEach(function(n){if(!n.ignore){var a=n.node;a.matrixWorld.multiplyMatrices(m,n.matOrigin);a.matrix.multiplyMatrices(n.matParentInv,a.matrixWorld);a.matrix.decompose(a.position,new THREE.Quaternion(),a.scale);a.matrixWorldNeedsUpdate=true;}});}this._viewport.setShouldRenderFrame();};c.prototype.scale=function(x,y,z){this.beginGesture();this._scale(new THREE.Vector3(x,y,z));};c.prototype._setScale=function(s){if(this._tool.fireEvent("scaling",{x:s.x,y:s.y,z:s.z},true)){this._scale(s);}};c.prototype.getValue=function(){var v=1;if(this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3){switch(this._coordinateSystem){case C.World:if(this._nodes.length===1){v=new THREE.Vector3().setFromMatrixColumn(this._nodes[0].node.matrixWorld,this._handleIndex).length();}break;case C.Local:v=this._nodes[this._gizmoIndex].node.scale.getComponent(this._handleIndex);break;default:break;}}return v;};c.prototype.setValue=function(v){if(this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3){this.beginGesture();var s=new THREE.Vector3(1,1,1);if(this._nonUniformScaleEnabled){s.setComponent(this._handleIndex,v/this._lastEditValue);}else{s.setScalar(v/this._lastEditValue);}this._scale(s);this.endGesture();}};c.prototype.expandBoundingBox=function(b){if(this._viewport){this._expandBoundingBox(b,this._viewport.getCamera().getCameraRef());}};c.prototype.handleSelectionChanged=function(e){if(this._viewport){this._updateSelection(this._viewport._viewStateManager);this._gizmoIndex=this._handleIndex=-1;}};c.prototype._getObjectScale=function(o){if(this._nodes.length===1){return this._nodes[0].node.scale;}else if(this._coordinateSystem===C.Local){return this._nodes[o].node.scale;}return new THREE.Vector3(1,1,1);};c.prototype._getObjectSize=function(o){var b=new THREE.Box3();if(this._nodes.length===1){this._nodes[0].node._expandBoundingBox(b,true);}else if(this._coordinateSystem===C.Local){this._nodes[0].node._expandBoundingBox(b,true);}if(b.isEmpty()){return 0;}var s=new THREE.Vector3();b.getSize(s);return s.length();};c.prototype._updateGizmoTransformation=function(g,a){var s=this._updateGizmoObjectTransformation(this._gizmo,g);this._updateAxisTitles(this._axisTitles,this._gizmo,a,this._gizmoSize+30,s);};c.prototype._getEditingFormPosition=function(){var s=this._updateGizmoObjectTransformation(this._gizmo,this._gizmoIndex);var a=new THREE.Vector3().setFromMatrixColumn(this._gizmo.matrixWorld,this._handleIndex).normalize();return a.clone().multiplyScalar((this._gizmoSize+18)*s).add(this._gizmo.position).applyMatrix4(this._matViewProj);};c.prototype.render=function(){if(this._nodes.length>0){var r=this._viewport.getRenderer(),a=this._viewport.getCamera().getCameraRef();this._matViewProj.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse);r.clearDepth();for(var i=0,l=this.getGizmoCount();i<l;i++){this._updateGizmoTransformation(i,a);r.render(this._sceneGizmo,a);}}this._updateEditingForm(this._nodes.length>0&&this._gizmoIndex>=0&&this._handleIndex>=0&&this._handleIndex<3,this._handleIndex);};return c;});
