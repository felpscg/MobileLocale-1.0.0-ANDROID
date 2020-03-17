sap.ui.define(["sap/ui/base/EventProvider","sap/m/Menu","sap/m/MenuItem","../getResourceBundle","../threejs/thirdparty/three","./CoordinateSystem"],function(E,M,a,g,t,C){"use strict";var R=E.extend("sap.ui.vk.tools.RotateToolHandler",{metadata:{},constructor:function(b){this._tool=b;this._gizmo=b.getGizmo();this._rect=null;this._rayCaster=new THREE.Raycaster();this._rayCaster.linePrecision=0.2;this._handleIndex=-1;this._gizmoIndex=-1;this._matrixOrigin=new THREE.Matrix4();this._levelingQuaternion=new THREE.Quaternion();this._mouse=new THREE.Vector2();this._mouseOrigin=new THREE.Vector2();}});R.prototype._updateMouse=function(e){var s=this.getViewport().getRenderer().getSize();this._mouse.x=((e.x-this._rect.x)/s.width)*2-1;this._mouse.y=((e.y-this._rect.y)/s.height)*-2+1;this._rayCaster.setFromCamera(this._mouse,this.getViewport().getCamera().getCameraRef());};R.prototype._updateHandles=function(e,h){var p=this._handleIndex;this._handleIndex=-1;if(e.n===1||(e.event&&e.event.type==="contextmenu")){for(var i=0,l=this._gizmo.getGizmoCount();i<l;i++){var b=this._gizmo.getTouchObject(i);var c=this._rayCaster.intersectObject(b,true);if(c.length>0){this._handleIndex=b.children.indexOf(c[0].object);if(this._handleIndex>=0&&this._handleIndex<3){this._gizmoIndex=i;this._matrixOrigin.copy(b.matrixWorld);this._gizmo._getLevelingQuaternion(this._levelingQuaternion,i);this._objectSize=this._gizmo._getObjectSize(i)/this._gizmo._getGizmoScale(b.position);}}}}this._gizmo.highlightHandle(this._handleIndex,h||this._handleIndex===-1);if(p!==this._handleIndex){this.getViewport().setShouldRenderFrame();}};R.prototype.hover=function(e){if(this._inside(e)&&!this._gesture){this._updateMouse(e);this._updateHandles(e,true);e.handled|=this._handleIndex>=0;}};R.prototype.click=function(e){if(this._inside(e)&&!this._gesture){this._updateMouse(e);this._updateHandles(e,true);this._gizmo.selectHandle(this._handleIndex,this._gizmoIndex);e.handled|=this._handleIndex>=0;}};R.prototype.beginGesture=function(e){if(this._inside(e)&&!this._gesture){this._updateMouse(e);this._updateHandles(e,false);if(this._handleIndex>=0&&this._handleIndex<3){e.handled=true;this._gesture=true;this._mouseOrigin.copy(e);this._gizmo.selectHandle(this._handleIndex,this._gizmoIndex);this._gizmo.beginGesture();var b=new THREE.Vector3().setFromMatrixColumn(this._matrixOrigin,(this._handleIndex+1)%3).normalize();var c=new THREE.Vector3().setFromMatrixColumn(this._matrixOrigin,(this._handleIndex+2)%3).normalize();var r=new THREE.Vector3().crossVectors(b,c).normalize();var d=new THREE.Vector3().setFromMatrixPosition(this._matrixOrigin);var l=new THREE.Matrix4().makeRotationFromQuaternion(this._levelingQuaternion);var f=new THREE.Vector3(1,0,0);var m=2;for(var i=0;i<3;i++){var h=new THREE.Vector3().setFromMatrixColumn(l,i).normalize();var j=r.dot(h);if(m>j){m=j;f.copy(h);}}f.sub(r.clone().multiplyScalar(f.dot(r))).normalize();this._levelAngle=Math.atan2(f.dot(c),f.dot(b));var k=this._rayCaster.ray;var n=d.clone().sub(k.origin);var o=r.dot(n)/r.dot(k.direction);var p=k.direction.clone().multiplyScalar(o).sub(n).normalize();this._startAngle=Math.atan2(p.dot(c),p.dot(b));var u=new THREE.Vector3().setFromMatrixColumn(this.getViewport().getCamera().getCameraRef().matrixWorld,1);var q=new THREE.Vector3().crossVectors(p,r);this._rotationDelta=u.dot(q)<0?-0.01:0.01;}}};R.prototype.move=function(e){if(this._gesture){e.handled=true;this._updateMouse(e);var b=this._startAngle;var c=b+(e.y-this._mouseOrigin.y)*this._rotationDelta;if(this._tool.getEnableStepping()){var s=5;if(this._objectSize>0){var d=[0.1,1,5,15];var f=[2000,1000,300,0];for(var i=0;i<4;i++){if(this._objectSize>=f[i]){s=d[i];break;}}}s=THREE.Math.degToRad(s);var h=c-b-this._levelAngle;c+=Math.round(h/s)*s-h;}if(isFinite(b)&&isFinite(c)){this._gizmo._setRotationAxisAngle(this._handleIndex,b,c);}}};R.prototype.endGesture=function(e){if(this._gesture){this._gesture=false;e.handled=true;this._updateMouse(e);this._gizmo.endGesture();this._updateHandles(e,true);this.getViewport().setShouldRenderFrame();}};R.prototype.contextMenu=function(e){if(this._inside(e)){this._updateMouse(e);this._updateHandles(e,true);if(this._handleIndex>=0){e.handled=true;var m=new M({items:[new a({text:g().getText("TOOL_COORDINATE_SYSTEM_WORLD"),key:C.World}),new a({text:g().getText("TOOL_COORDINATE_SYSTEM_LOCAL"),key:C.Local}),new a({text:g().getText("TOOL_COORDINATE_SYSTEM_SCREEN"),key:C.Screen}),new a({text:g().getText("TOOL_COORDINATE_SYSTEM_CUSTOM"),key:C.Custom})],itemSelected:function(e){var i=e.getParameters("item").item;this._tool.setCoordinateSystem(i.getKey());}.bind(this)});m.openAsContextMenu(e.event,this.getViewport());}}};R.prototype.getViewport=function(){return this._tool._viewport;};R.prototype._getOffset=function(o){var r=o.getBoundingClientRect();var p={x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};return p;};R.prototype._inside=function(e){if(this._rect===null||true){var i=this._tool._viewport.getIdForLabel();var d=document.getElementById(i);if(d===null){return false;}var o=this._getOffset(d);this._rect={x:o.x,y:o.y,w:d.offsetWidth,h:d.offsetHeight};}return(e.x>=this._rect.x&&e.x<=this._rect.x+this._rect.w&&e.y>=this._rect.y&&e.y<=this._rect.y+this._rect.h);};return R;});