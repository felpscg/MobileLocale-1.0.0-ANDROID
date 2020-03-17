
THREE.ColladaLoader=function(m){this.manager=(m!==undefined)?m:THREE.DefaultLoadingManager;};
THREE.ColladaLoader.prototype={constructor:THREE.ColladaLoader,crossOrigin:'anonymous',load:function(u,o,a,b){var s=this;var p=(s.path===undefined)?THREE.LoaderUtils.extractUrlBase(u):s.path;var l=new THREE.FileLoader(s.manager);l.setPath(s.path);l.load(u,function(t){o(s.parse(t,p));},a,b);},setPath:function(v){this.path=v;return this;},setResourcePath:function(v){this.resourcePath=v;return this;},options:{set convertUpAxis(v){console.warn('THREE.ColladaLoader: options.convertUpAxis() has been removed. Up axis is converted automatically.');}},setCrossOrigin:function(v){this.crossOrigin=v;return this;},parse:function(t,e){function h(z2,a){var b=[];var c=z2.childNodes;for(var i=0,l=c.length;i<l;i++){var d=c[i];if(d.nodeName===a){b.push(d);}}return b;}function m(t){if(t.length===0)return[];var p=t.trim().split(/\s+/);var a=new Array(p.length);for(var i=0,l=p.length;i<l;i++){a[i]=p[i];}return a;}function n(t){if(t.length===0)return[];var p=t.trim().split(/\s+/);var a=new Array(p.length);for(var i=0,l=p.length;i<l;i++){a[i]=parseFloat(p[i]);}return a;}function o(t){if(t.length===0)return[];var p=t.trim().split(/\s+/);var a=new Array(p.length);for(var i=0,l=p.length;i<l;i++){a[i]=parseInt(p[i]);}return a;}function q(t){return t.substring(1);}function r(){return'three_default_'+(H2++);}function s(a){return Object.keys(a).length===0;}function u(z2){return{unit:w(h(z2,'unit')[0]),upAxis:x(h(z2,'up_axis')[0])};}function w(z2){if((z2!==undefined)&&(z2.hasAttribute('meter')===true)){return parseFloat(z2.getAttribute('meter'));}else{return 1;}}function x(z2){return z2!==undefined?z2.textContent:'Y_UP';}function y(z2,l,a,p){var I2=h(z2,l)[0];if(I2!==undefined){var b=h(I2,a);for(var i=0;i<b.length;i++){p(b[i]);}}}function z(d,b){for(var a in d){var c=d[a];c.build=b(d[a]);}}function A(d,b){if(d.build!==undefined)return d.build;d.build=b(d);return d.build;}function B(z2){var d={sources:{},samplers:{},channels:{}};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;var a;switch(c.nodeName){case'source':a=c.getAttribute('id');d.sources[a]=H1(c);break;case'sampler':a=c.getAttribute('id');d.samplers[a]=C(c);break;case'channel':a=c.getAttribute('target');d.channels[a]=D(c);break;default:console.log(c);}}I2.animations[z2.getAttribute('id')]=d;}function C(z2){var d={inputs:{},};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'input':var a=q(c.getAttribute('source'));var b=c.getAttribute('semantic');d.inputs[b]=a;break;}}return d;}function D(z2){var d={};var a=z2.getAttribute('target');var p=a.split('/');var b=p.shift();var c=p.shift();var f=(c.indexOf('(')!==-1);var g=(c.indexOf('.')!==-1);if(g){p=c.split('.');c=p.shift();d.member=p.shift();}else if(f){var j=c.split('(');c=j.shift();for(var i=0;i<j.length;i++){j[i]=parseInt(j[i].replace(/\)/,''));}d.indices=j;}d.id=b;d.sid=c;d.arraySyntax=f;d.memberSyntax=g;d.sampler=q(z2.getAttribute('source'));return d;}function E(d){var a=[];var c=d.channels;var b=d.samplers;var f=d.sources;for(var g in c){if(c.hasOwnProperty(g)){var i=c[g];var j=b[i.sampler];var k=j.inputs.INPUT;var l=j.inputs.OUTPUT;var p=f[k];var v=f[l];var K2=G(i,p,v);L(K2,a);}}return a;}function F(i){return A(I2.animations[i],E);}function G(c,a,b){var d=I2.nodes[c.id];var f=s2(d.id);var g=d.transforms[c.sid];var k=d.matrix.clone().transpose();var l,p;var i,v,j,jl;var K2={};switch(g){case'matrix':for(i=0,v=a.array.length;i<v;i++){l=a.array[i];p=i*b.stride;if(K2[l]===undefined)K2[l]={};if(c.arraySyntax===true){var L2=b.array[p];var M2=c.indices[0]+4*c.indices[1];K2[l][M2]=L2;}else{for(j=0,jl=b.stride;j<jl;j++){K2[l][j]=b.array[p+j];}}}break;case'translate':console.warn('THREE.ColladaLoader: Animation transform type "%s" not yet implemented.',g);break;case'rotate':console.warn('THREE.ColladaLoader: Animation transform type "%s" not yet implemented.',g);break;case'scale':console.warn('THREE.ColladaLoader: Animation transform type "%s" not yet implemented.',g);break;}var N2=H(K2,k);var O2={name:f.uuid,keyframes:N2};return O2;}function H(d,c){var k=[];for(var f in d){k.push({time:parseFloat(f),value:d[f]});}k.sort(g);for(var i=0;i<16;i++){M(k,i,c.elements[i]);}return k;function g(a,b){return a.time-b.time;}}var I=new THREE.Vector3();var J=new THREE.Vector3();var K=new THREE.Quaternion();function L(a,b){var k=a.keyframes;var c=a.name;var d=[];var p=[];var f=[];var g=[];for(var i=0,l=k.length;i<l;i++){var j=k[i];var v=j.time;var K2=j.value;h2.fromArray(K2).transpose();h2.decompose(I,K,J);d.push(v);p.push(I.x,I.y,I.z);f.push(K.x,K.y,K.z,K.w);g.push(J.x,J.y,J.z);}if(p.length>0)b.push(new THREE.VectorKeyframeTrack(c+'.position',d,p));if(f.length>0)b.push(new THREE.QuaternionKeyframeTrack(c+'.quaternion',d,f));if(g.length>0)b.push(new THREE.VectorKeyframeTrack(c+'.scale',d,g));return b;}function M(k,p,d){var a;var b=true;var i,l;for(i=0,l=k.length;i<l;i++){a=k[i];if(a.value[p]===undefined){a.value[p]=null;}else{b=false;}}if(b===true){for(i=0,l=k.length;i<l;i++){a=k[i];a.value[p]=d;}}else{N(k,p);}}function N(k,p){var a,b;for(var i=0,l=k.length;i<l;i++){var c=k[i];if(c.value[p]===null){a=O(k,i,p);b=P(k,i,p);if(a===null){c.value[p]=b.value[p];continue;}if(b===null){c.value[p]=a.value[p];continue;}Q(c,a,b,p);}}}function O(k,i,p){while(i>=0){var a=k[i];if(a.value[p]!==null)return a;i--;}return null;}function P(k,i,p){while(i<k.length){var a=k[i];if(a.value[p]!==null)return a;i++;}return null;}function Q(k,p,a,b){if((a.time-p.time)===0){k.value[b]=p.value[b];return;}k.value[b]=((k.time-p.time)*(a.value[b]-p.value[b])/(a.time-p.time))+p.value[b];}function R(z2){var d={name:z2.getAttribute('id')||'default',start:parseFloat(z2.getAttribute('start')||0),end:parseFloat(z2.getAttribute('end')||0),animations:[]};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'instance_animation':d.animations.push(q(c.getAttribute('url')));break;}}I2.clips[z2.getAttribute('id')]=d;}function S(d){var a=[];var b=d.name;var c=(d.end-d.start)||-1;var F2=d.animations;for(var i=0,f=F2.length;i<f;i++){var g=F(F2[i]);for(var j=0,k=g.length;j<k;j++){a.push(g[j]);}}return new THREE.AnimationClip(b,c,a);}function T(i){return A(I2.clips[i],S);}function U(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'skin':d.id=q(c.getAttribute('source'));d.skin=V(c);break;case'morph':d.id=q(c.getAttribute('source'));console.warn('THREE.ColladaLoader: Morph target animation not supported yet.');break;}}I2.controllers[z2.getAttribute('id')]=d;}function V(z2){var d={sources:{}};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'bind_shape_matrix':d.bindShapeMatrix=n(c.textContent);break;case'source':var a=c.getAttribute('id');d.sources[a]=H1(c);break;case'joints':d.joints=W(c);break;case'vertex_weights':d.vertexWeights=X(c);break;}}return d;}function W(z2){var d={inputs:{}};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'input':var a=c.getAttribute('semantic');var b=q(c.getAttribute('source'));d.inputs[a]=b;break;}}return d;}function X(z2){var d={inputs:{}};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'input':var a=c.getAttribute('semantic');var b=q(c.getAttribute('source'));var f=parseInt(c.getAttribute('offset'));d.inputs[a]={id:b,offset:f};break;case'vcount':d.vcount=o(c.textContent);break;case'v':d.v=o(c.textContent);break;}}return d;}function Y(d){var b={id:d.id};var g=I2.geometries[b.id];if(d.skin!==undefined){b.skin=Z(d.skin);g.sources.skinIndices=b.skin.indices;g.sources.skinWeights=b.skin.weights;}return b;}function Z(c){var f=4;var g={joints:[],indices:{array:[],stride:f},weights:{array:[],stride:f}};var k=c.sources;var p=c.vertexWeights;var K2=p.vcount;var v=p.v;var L2=p.inputs.JOINT.offset;var M2=p.inputs.WEIGHT.offset;var N2=c.sources[c.joints.inputs.JOINT];var O2=c.sources[c.joints.inputs.INV_BIND_MATRIX];var P2=k[p.inputs.WEIGHT.id].array;var Q2=0;var i,j,l;for(i=0,l=K2.length;i<l;i++){var R2=K2[i];var S2=[];for(j=0;j<R2;j++){var T2=v[Q2+L2];var U2=v[Q2+M2];var V2=P2[U2];S2.push({index:T2,weight:V2});Q2+=2;}S2.sort(Y2);for(j=0;j<f;j++){var d=S2[j];if(d!==undefined){g.indices.array.push(d.index);g.weights.array.push(d.weight);}else{g.indices.array.push(0);g.weights.array.push(0);}}}if(c.bindShapeMatrix){g.bindMatrix=new THREE.Matrix4().fromArray(c.bindShapeMatrix).transpose();}else{g.bindMatrix=new THREE.Matrix4().identity();}for(i=0,l=N2.array.length;i<l;i++){var W2=N2.array[i];var X2=new THREE.Matrix4().fromArray(O2.array,i*O2.stride).transpose();g.joints.push({name:W2,boneInverse:X2});}return g;function Y2(a,b){return b.weight-a.weight;}}function $(i){return A(I2.controllers[i],Y);}function _(z2){var d={init_from:h(z2,'init_from')[0].textContent};I2.images[z2.getAttribute('id')]=d;}function a1(d){if(d.build!==undefined)return d.build;return d.init_from;}function b1(i){var d=I2.images[i];if(d!==undefined){return A(d,a1);}console.warn('THREE.ColladaLoader: Couldn\'t find image with ID:',i);return null;}function c1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'profile_COMMON':d.profile=d1(c);break;}}I2.effects[z2.getAttribute('id')]=d;}function d1(z2){var d={surfaces:{},samplers:{}};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'newparam':e1(c,d);break;case'technique':d.technique=h1(c);break;case'extra':d.extra=n1(c);break;}}return d;}function e1(z2,d){var a=z2.getAttribute('sid');for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'surface':d.surfaces[a]=f1(c);break;case'sampler2D':d.samplers[a]=g1(c);break;}}}function f1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'init_from':d.init_from=c.textContent;break;}}return d;}function g1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'source':d.source=c.textContent;break;}}return d;}function h1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'constant':case'lambert':case'blinn':case'phong':d.type=c.nodeName;d.parameters=i1(c);break;}}return d;}function i1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'emission':case'diffuse':case'specular':case'bump':case'ambient':case'shininess':case'transparency':d[c.nodeName]=j1(c);break;case'transparent':d[c.nodeName]={opaque:c.getAttribute('opaque'),data:j1(c)};break;}}return d;}function j1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'color':d[c.nodeName]=n(c.textContent);break;case'float':d[c.nodeName]=parseFloat(c.textContent);break;case'texture':d[c.nodeName]={id:c.getAttribute('texture'),extra:k1(c)};break;}}return d;}function k1(z2){var d={technique:{}};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'extra':l1(c,d);break;}}return d;}function l1(z2,d){for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'technique':m1(c,d);break;}}}function m1(z2,d){for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'repeatU':case'repeatV':case'offsetU':case'offsetV':d.technique[c.nodeName]=parseFloat(c.textContent);break;case'wrapU':case'wrapV':if(c.textContent.toUpperCase()==='TRUE'){d.technique[c.nodeName]=1;}else if(c.textContent.toUpperCase()==='FALSE'){d.technique[c.nodeName]=0;}else{d.technique[c.nodeName]=parseInt(c.textContent);}break;}}}function n1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'technique':d.technique=o1(c);break;}}return d;}function o1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'double_sided':d[c.nodeName]=parseInt(c.textContent);break;}}return d;}function p1(d){return d;}function q1(i){return A(I2.effects[i],p1);}function r1(z2){var d={name:z2.getAttribute('name')};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'instance_effect':d.url=q(c.getAttribute('url'));break;}}I2.materials[z2.getAttribute('id')]=d;}function s1(i){var l;var a=i.slice((i.lastIndexOf('.')-1>>>0)+2);a=a.toLowerCase();switch(a){case'tga':l=E2;break;default:l=D2;}return l;}function t1(d){var a=q1(d.url);var b=a.profile.technique;var c=a.profile.extra;var f;switch(b.type){case'phong':case'blinn':f=new THREE.MeshPhongMaterial();break;case'lambert':f=new THREE.MeshLambertMaterial();break;default:f=new THREE.MeshBasicMaterial();break;}f.name=d.name;function g(K2){var L2=a.profile.samplers[K2.id];var M2=null;if(L2!==undefined){var N2=a.profile.surfaces[L2.source];M2=b1(N2.init_from);}else{console.warn('THREE.ColladaLoader: Undefined sampler. Access image directly (see #12530).');M2=b1(K2.id);}if(M2!==null){var O2=s1(M2);if(O2!==undefined){var P2=O2.load(M2);var c=K2.extra;if(c!==undefined&&c.technique!==undefined&&s(c.technique)===false){var b=c.technique;P2.wrapS=b.wrapU?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;P2.wrapT=b.wrapV?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping;P2.offset.set(b.offsetU||0,b.offsetV||0);P2.repeat.set(b.repeatU||1,b.repeatV||1);}else{P2.wrapS=THREE.RepeatWrapping;P2.wrapT=THREE.RepeatWrapping;}return P2;}else{console.warn('THREE.ColladaLoader: Loader for texture %s not found.',M2);return null;}}else{console.warn('THREE.ColladaLoader: Couldn\'t create texture with ID:',K2.id);return null;}}var p=b.parameters;for(var k in p){var i=p[k];switch(k){case'diffuse':if(i.color)f.color.fromArray(i.color);if(i.texture)f.map=g(i.texture);break;case'specular':if(i.color&&f.specular)f.specular.fromArray(i.color);if(i.texture)f.specularMap=g(i.texture);break;case'bump':if(i.texture)f.normalMap=g(i.texture);break;case'ambient':if(i.texture)f.lightMap=g(i.texture);break;case'shininess':if(i.float&&f.shininess)f.shininess=i.float;break;case'emission':if(i.color&&f.emissive)f.emissive.fromArray(i.color);if(i.texture)f.emissiveMap=g(i.texture);break;}}var j=p['transparent'];var l=p['transparency'];if(l===undefined&&j){l={float:1};}if(j===undefined&&l){j={opaque:'A_ONE',data:{color:[1,1,1,1]}};}if(j&&l){if(j.data.texture){f.transparent=true;}else{var v=j.data.color;switch(j.opaque){case'A_ONE':f.opacity=v[3]*l.float;break;case'RGB_ZERO':f.opacity=1-(v[0]*l.float);break;case'A_ZERO':f.opacity=1-(v[3]*l.float);break;case'RGB_ONE':f.opacity=v[0]*l.float;break;default:console.warn('THREE.ColladaLoader: Invalid opaque type "%s" of transparent tag.',j.opaque);}if(f.opacity<1)f.transparent=true;}}if(c!==undefined&&c.technique!==undefined&&c.technique.double_sided===1){f.side=THREE.DoubleSide;}return f;}function u1(i){return A(I2.materials[i],t1);}function v1(z2){var d={name:z2.getAttribute('name')};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'optics':d.optics=w1(c);break;}}I2.cameras[z2.getAttribute('id')]=d;}function w1(z2){for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];switch(c.nodeName){case'technique_common':return x1(c);}}return{};}function x1(z2){var d={};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];switch(c.nodeName){case'perspective':case'orthographic':d.technique=c.nodeName;d.parameters=y1(c);break;}}return d;}function y1(z2){var d={};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];switch(c.nodeName){case'xfov':case'yfov':case'xmag':case'ymag':case'znear':case'zfar':case'aspect_ratio':d[c.nodeName]=parseFloat(c.textContent);break;}}return d;}function z1(d){var c;switch(d.optics.technique){case'perspective':c=new THREE.PerspectiveCamera(d.optics.parameters.yfov,d.optics.parameters.aspect_ratio,d.optics.parameters.znear,d.optics.parameters.zfar);break;case'orthographic':var a=d.optics.parameters.ymag;var b=d.optics.parameters.xmag;var f=d.optics.parameters.aspect_ratio;b=(b===undefined)?(a*f):b;a=(a===undefined)?(b/f):a;b*=0.5;a*=0.5;c=new THREE.OrthographicCamera(-b,b,a,-a,d.optics.parameters.znear,d.optics.parameters.zfar);break;default:c=new THREE.PerspectiveCamera();break;}c.name=d.name;return c;}function A1(i){var d=I2.cameras[i];if(d!==undefined){return A(d,z1);}console.warn('THREE.ColladaLoader: Couldn\'t find camera with ID:',i);return null;}function B1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'technique_common':d=C1(c);break;}}I2.lights[z2.getAttribute('id')]=d;}function C1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'directional':case'point':case'spot':case'ambient':d.technique=c.nodeName;d.parameters=D1(c);}}return d;}function D1(z2){var d={};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'color':var a=n(c.textContent);d.color=new THREE.Color().fromArray(a);break;case'falloff_angle':d.falloffAngle=parseFloat(c.textContent);break;case'quadratic_attenuation':var f=parseFloat(c.textContent);d.distance=f?Math.sqrt(1/f):0;break;}}return d;}function E1(d){var l;switch(d.technique){case'directional':l=new THREE.DirectionalLight();break;case'point':l=new THREE.PointLight();break;case'spot':l=new THREE.SpotLight();break;case'ambient':l=new THREE.AmbientLight();break;}if(d.parameters.color)l.color.copy(d.parameters.color);if(d.parameters.distance)l.distance=d.parameters.distance;return l;}function F1(i){var d=I2.lights[i];if(d!==undefined){return A(d,E1);}console.warn('THREE.ColladaLoader: Couldn\'t find light with ID:',i);return null;}function G1(z2){var d={name:z2.getAttribute('name'),sources:{},vertices:{},primitives:[]};var a=h(z2,'mesh')[0];if(a===undefined)return;for(var i=0;i<a.childNodes.length;i++){var c=a.childNodes[i];if(c.nodeType!==1)continue;var b=c.getAttribute('id');switch(c.nodeName){case'source':d.sources[b]=H1(c);break;case'vertices':d.vertices=I1(c);break;case'polygons':console.warn('THREE.ColladaLoader: Unsupported primitive type: ',c.nodeName);break;case'lines':case'linestrips':case'polylist':case'triangles':d.primitives.push(J1(c));break;default:console.log(c);}}I2.geometries[z2.getAttribute('id')]=d;}function H1(z2){var d={array:[],stride:3};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'float_array':d.array=n(c.textContent);break;case'Name_array':d.array=m(c.textContent);break;case'technique_common':var a=h(c,'accessor')[0];if(a!==undefined){d.stride=parseInt(a.getAttribute('stride'));}break;}}return d;}function I1(z2){var d={};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;d[c.getAttribute('semantic')]=q(c.getAttribute('source'));}return d;}function J1(z2){var p={type:z2.nodeName,material:z2.getAttribute('material'),count:parseInt(z2.getAttribute('count')),inputs:{},stride:0,hasUV:false};for(var i=0,l=z2.childNodes.length;i<l;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'input':var a=q(c.getAttribute('source'));var b=c.getAttribute('semantic');var d=parseInt(c.getAttribute('offset'));var f=parseInt(c.getAttribute('set'));var g=(f>0?b+f:b);p.inputs[g]={id:a,offset:d};p.stride=Math.max(p.stride,d+1);if(b==='TEXCOORD')p.hasUV=true;break;case'vcount':p.vcount=o(c.textContent);break;case'p':p.p=o(c.textContent);break;}}return p;}function K1(p){var b={};for(var i=0;i<p.length;i++){var a=p[i];if(b[a.type]===undefined)b[a.type]=[];b[a.type].push(a);}return b;}function L1(p){var H2=0;for(var i=0,l=p.length;i<l;i++){var a=p[i];if(a.hasUV===true){H2++;}}if(H2>0&&H2<p.length){p.uvsNeedsFix=true;}}function M1(d){var b={};var a=d.sources;var v=d.vertices;var p=d.primitives;if(p.length===0)return{};var g=K1(p);for(var c in g){var f=g[c];L1(f);b[c]=N1(f,a,v);}return b;}function N1(a,b,v){var c={};var I={array:[],stride:0};var d={array:[],stride:0};var f={array:[],stride:0};var j={array:[],stride:0};var k={array:[],stride:0};var l={array:[],stride:4};var K2={array:[],stride:4};var L2=new THREE.BufferGeometry();var M2=[];var N2=0;for(var p=0;p<a.length;p++){var O2=a[p];var P2=O2.inputs;var H2=0;switch(O2.type){case'lines':case'linestrips':H2=O2.count*2;break;case'triangles':H2=O2.count*3;break;case'polylist':for(var g=0;g<O2.count;g++){var vc=O2.vcount[g];switch(vc){case 3:H2+=3;break;case 4:H2+=6;break;default:H2+=(vc-2)*3;break;}}break;default:console.warn('THREE.ColladaLoader: Unknow primitive type:',O2.type);}L2.addGroup(N2,H2,p);N2+=H2;if(O2.material){M2.push(O2.material);}for(var R2 in P2){var S2=P2[R2];switch(R2){case'VERTEX':for(var T2 in v){var id=v[T2];switch(T2){case'POSITION':var V2=I.array.length;O1(O2,b[id],S2.offset,I.array);I.stride=b[id].stride;if(b.skinWeights&&b.skinIndices){O1(O2,b.skinIndices,S2.offset,l.array);O1(O2,b.skinWeights,S2.offset,K2.array);}if(O2.hasUV===false&&a.uvsNeedsFix===true){var H2=(I.array.length-V2)/I.stride;for(var i=0;i<H2;i++){f.array.push(0,0);}}break;case'NORMAL':O1(O2,b[id],S2.offset,d.array);d.stride=b[id].stride;break;case'COLOR':O1(O2,b[id],S2.offset,k.array);k.stride=b[id].stride;break;case'TEXCOORD':O1(O2,b[id],S2.offset,f.array);f.stride=b[id].stride;break;case'TEXCOORD1':O1(O2,b[id],S2.offset,j.array);f.stride=b[id].stride;break;default:console.warn('THREE.ColladaLoader: Semantic "%s" not handled in geometry build process.',T2);}}break;case'NORMAL':O1(O2,b[S2.id],S2.offset,d.array);d.stride=b[S2.id].stride;break;case'COLOR':O1(O2,b[S2.id],S2.offset,k.array);k.stride=b[S2.id].stride;break;case'TEXCOORD':O1(O2,b[S2.id],S2.offset,f.array);f.stride=b[S2.id].stride;break;case'TEXCOORD1':O1(O2,b[S2.id],S2.offset,j.array);j.stride=b[S2.id].stride;break;}}}if(I.array.length>0)L2.addAttribute('position',new THREE.Float32BufferAttribute(I.array,I.stride));if(d.array.length>0)L2.addAttribute('normal',new THREE.Float32BufferAttribute(d.array,d.stride));if(k.array.length>0)L2.addAttribute('color',new THREE.Float32BufferAttribute(k.array,k.stride));if(f.array.length>0)L2.addAttribute('uv',new THREE.Float32BufferAttribute(f.array,f.stride));if(j.array.length>0)L2.addAttribute('uv2',new THREE.Float32BufferAttribute(j.array,j.stride));if(l.array.length>0)L2.addAttribute('skinIndex',new THREE.Float32BufferAttribute(l.array,l.stride));if(K2.array.length>0)L2.addAttribute('skinWeight',new THREE.Float32BufferAttribute(K2.array,K2.stride));c.data=L2;c.type=a[0].type;c.materialKeys=M2;return c;}function O1(p,f,g,j){var v=p.p;var K2=p.stride;var L2=p.vcount;function M2(i){var P2=v[i+g]*O2;var Q2=P2+O2;for(;P2<Q2;P2++){j.push(N2[P2]);}}var N2=f.array;var O2=f.stride;if(p.vcount!==undefined){var P2=0;for(var i=0,l=L2.length;i<l;i++){var H2=L2[i];if(H2===4){var a=P2+K2*0;var b=P2+K2*1;var c=P2+K2*2;var d=P2+K2*3;M2(a);M2(b);M2(d);M2(b);M2(c);M2(d);}else if(H2===3){var a=P2+K2*0;var b=P2+K2*1;var c=P2+K2*2;M2(a);M2(b);M2(c);}else if(H2>4){for(var k=1,kl=(H2-2);k<=kl;k++){var a=P2+K2*0;var b=P2+K2*k;var c=P2+K2*(k+1);M2(a);M2(b);M2(c);}}P2+=K2*H2;}}else{for(var i=0,l=v.length;i<l;i+=K2){M2(i);}}}function P1(i){return A(I2.geometries[i],M1);}function Q1(z2){var d={name:z2.getAttribute('name')||'',joints:{},links:[]};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'technique_common':T1(c,d);break;}}I2.kinematicsModels[z2.getAttribute('id')]=d;}function R1(d){if(d.build!==undefined)return d.build;return d;}function S1(i){return A(I2.kinematicsModels[i],R1);}function T1(z2,d){for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'joint':d.joints[c.getAttribute('sid')]=U1(c);break;case'link':d.links.push(W1(c));break;}}}function U1(z2){var d;for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'prismatic':case'revolute':d=V1(c);break;}}return d;}function V1(z2,d){var d={sid:z2.getAttribute('sid'),name:z2.getAttribute('name')||'',axis:new THREE.Vector3(),limits:{min:0,max:0},type:z2.nodeName,static:false,zeroPosition:0,middlePosition:0};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'axis':var a=n(c.textContent);d.axis.fromArray(a);break;case'limits':var b=c.getElementsByTagName('max')[0];var f=c.getElementsByTagName('min')[0];d.limits.max=parseFloat(b.textContent);d.limits.min=parseFloat(f.textContent);break;}}if(d.limits.min>=d.limits.max){d.static=true;}d.middlePosition=(d.limits.min+d.limits.max)/2.0;return d;}function W1(z2){var d={sid:z2.getAttribute('sid'),name:z2.getAttribute('name')||'',attachments:[],transforms:[]};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'attachment_full':d.attachments.push(X1(c));break;case'matrix':case'translate':case'rotate':d.transforms.push(Y1(c));break;}}return d;}function X1(z2){var d={joint:z2.getAttribute('joint').split('/').pop(),transforms:[],links:[]};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'link':d.links.push(W1(c));break;case'matrix':case'translate':case'rotate':d.transforms.push(Y1(c));break;}}return d;}function Y1(z2){var d={type:z2.nodeName};var a=n(z2.textContent);switch(d.type){case'matrix':d.obj=new THREE.Matrix4();d.obj.fromArray(a).transpose();break;case'translate':d.obj=new THREE.Vector3();d.obj.fromArray(a);break;case'rotate':d.obj=new THREE.Vector3();d.obj.fromArray(a);d.angle=THREE.Math.degToRad(a[3]);break;}return d;}function Z1(z2){var d={name:z2.getAttribute('name')||'',rigidBodies:{}};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'rigid_body':d.rigidBodies[c.getAttribute('name')]={};$1(c,d.rigidBodies[c.getAttribute('name')]);break;}}I2.physicsModels[z2.getAttribute('id')]=d;}function $1(z2,d){for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'technique_common':_1(c,d);break;}}}function _1(z2,d){for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'inertia':d.inertia=n(c.textContent);break;case'mass':d.mass=n(c.textContent)[0];break;}}}function a2(z2){var d={bindJointAxis:[]};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'bind_joint_axis':d.bindJointAxis.push(b2(c));break;}}I2.kinematicsScenes[q(z2.getAttribute('url'))]=d;}function b2(z2){var d={target:z2.getAttribute('target').split('/').pop()};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'axis':var p=c.getElementsByTagName('param')[0];d.axis=p.textContent;var a=d.axis.split('inst_').pop().split('axis')[0];d.jointIndex=a.substr(0,a.length-1);break;}}return d;}function c2(d){if(d.build!==undefined)return d.build;return d;}function d2(i){return A(I2.kinematicsScenes[i],c2);}function e2(){var k=Object.keys(I2.kinematicsModels)[0];var a=Object.keys(I2.kinematicsScenes)[0];var v=Object.keys(I2.visualScenes)[0];if(k===undefined||a===undefined)return;var b=S1(k);var c=d2(a);var d=w2(v);var f=c.bindJointAxis;var j={};for(var i=0,l=f.length;i<l;i++){var g=f[i];var p=A2.querySelector('[sid="'+g.target+'"]');if(p){var K2=p.parentElement;L2(g.jointIndex,K2);}}function L2(M2,N2){var O2=N2.getAttribute('name');var P2=b.joints[M2];d.traverse(function(Q2){if(Q2.name===O2){j[M2]={object:Q2,transforms:f2(N2),joint:P2,position:P2.zeroPosition};}});}var m0=new THREE.Matrix4();G2={joints:b&&b.joints,getJointValue:function(M2){var N2=j[M2];if(N2){return N2.position;}else{console.warn('THREE.ColladaLoader: Joint '+M2+' doesn\'t exist.');}},setJointValue:function(M2,N2){var O2=j[M2];if(O2){var P2=O2.joint;if(N2>P2.limits.max||N2<P2.limits.min){console.warn('THREE.ColladaLoader: Joint '+M2+' value '+N2+' outside of limits (min: '+P2.limits.min+', max: '+P2.limits.max+').');}else if(P2.static){console.warn('THREE.ColladaLoader: Joint '+M2+' is static.');}else{var Q2=O2.object;var g=P2.axis;var R2=O2.transforms;h2.identity();for(var i=0;i<R2.length;i++){var S2=R2[i];if(S2.sid&&S2.sid.indexOf(M2)!==-1){switch(P2.type){case'revolute':h2.multiply(m0.makeRotationAxis(g,THREE.Math.degToRad(N2)));break;case'prismatic':h2.multiply(m0.makeTranslation(g.x*N2,g.y*N2,g.z*N2));break;default:console.warn('THREE.ColladaLoader: Unknown joint type: '+P2.type);break;}}else{switch(S2.type){case'matrix':h2.multiply(S2.obj);break;case'translate':h2.multiply(m0.makeTranslation(S2.obj.x,S2.obj.y,S2.obj.z));break;case'scale':h2.scale(S2.obj);break;case'rotate':h2.multiply(m0.makeRotationAxis(S2.obj,S2.angle));break;}}}Q2.matrix.copy(h2);Q2.matrix.decompose(Q2.position,Q2.quaternion,Q2.scale);j[M2].position=N2;}}else{console.log('THREE.ColladaLoader: '+M2+' does not exist.');}}};}function f2(a){var b=[];var z2=A2.querySelector('[id="'+a.id+'"]');for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'matrix':var d=n(c.textContent);var h2=new THREE.Matrix4().fromArray(d).transpose();b.push({sid:c.getAttribute('sid'),type:c.nodeName,obj:h2});break;case'translate':case'scale':var d=n(c.textContent);var i2=new THREE.Vector3().fromArray(d);b.push({sid:c.getAttribute('sid'),type:c.nodeName,obj:i2});break;case'rotate':var d=n(c.textContent);var i2=new THREE.Vector3().fromArray(d);var f=THREE.Math.degToRad(d[3]);b.push({sid:c.getAttribute('sid'),type:c.nodeName,obj:i2,angle:f});break;}}return b;}function g2(z2){var a=z2.getElementsByTagName('node');for(var i=0;i<a.length;i++){var b=a[i];if(b.hasAttribute('id')===false){b.setAttribute('id',r());}}}var h2=new THREE.Matrix4();var i2=new THREE.Vector3();function j2(z2){var d={name:z2.getAttribute('name')||'',type:z2.getAttribute('type'),id:z2.getAttribute('id'),sid:z2.getAttribute('sid'),matrix:new THREE.Matrix4(),nodes:[],instanceCameras:[],instanceControllers:[],instanceLights:[],instanceGeometries:[],instanceNodes:[],transforms:{}};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];if(c.nodeType!==1)continue;switch(c.nodeName){case'node':d.nodes.push(c.getAttribute('id'));j2(c);break;case'instance_camera':d.instanceCameras.push(q(c.getAttribute('url')));break;case'instance_controller':d.instanceControllers.push(k2(c));break;case'instance_light':d.instanceLights.push(q(c.getAttribute('url')));break;case'instance_geometry':d.instanceGeometries.push(k2(c));break;case'instance_node':d.instanceNodes.push(q(c.getAttribute('url')));break;case'matrix':var a=n(c.textContent);d.matrix.multiply(h2.fromArray(a).transpose());d.transforms[c.getAttribute('sid')]=c.nodeName;break;case'translate':var a=n(c.textContent);i2.fromArray(a);d.matrix.multiply(h2.makeTranslation(i2.x,i2.y,i2.z));d.transforms[c.getAttribute('sid')]=c.nodeName;break;case'rotate':var a=n(c.textContent);var b=THREE.Math.degToRad(a[3]);d.matrix.multiply(h2.makeRotationAxis(i2.fromArray(a),b));d.transforms[c.getAttribute('sid')]=c.nodeName;break;case'scale':var a=n(c.textContent);d.matrix.scale(i2.fromArray(a));d.transforms[c.getAttribute('sid')]=c.nodeName;break;case'extra':break;default:console.log(c);}}if(r2(d.id)){console.warn('THREE.ColladaLoader: There is already a node with ID %s. Exclude current node from further processing.',d.id);}else{I2.nodes[d.id]=d;}return d;}function k2(z2){var d={id:q(z2.getAttribute('url')),materials:{},skeletons:[]};for(var i=0;i<z2.childNodes.length;i++){var c=z2.childNodes[i];switch(c.nodeName){case'bind_material':var a=c.getElementsByTagName('instance_material');for(var j=0;j<a.length;j++){var b=a[j];var f=b.getAttribute('symbol');var g=b.getAttribute('target');d.materials[f]=q(g);}break;case'skeleton':d.skeletons.push(q(c.textContent));break;default:break;}}return d;}function l2(a,b){var c=[];var d=[];var i,j,f;for(i=0;i<a.length;i++){var g=a[i];var k;if(r2(g)){k=s2(g);m2(k,b,c);}else if(v2(g)){var v=I2.visualScenes[g];var l=v.children;for(var j=0;j<l.length;j++){var p=l[j];if(p.type==='JOINT'){var k=s2(p.id);m2(k,b,c);}}}else{console.error('THREE.ColladaLoader: Unable to find root bone of skeleton with ID:',g);}}for(i=0;i<b.length;i++){for(j=0;j<c.length;j++){f=c[j];if(f.bone.name===b[i].name){d[i]=f;f.processed=true;break;}}}for(i=0;i<c.length;i++){f=c[i];if(f.processed===false){d.push(f);f.processed=true;}}var K2=[];var L2=[];for(i=0;i<d.length;i++){f=d[i];K2.push(f.bone);L2.push(f.boneInverse);}return new THREE.Skeleton(K2,L2);}function m2(a,j,b){a.traverse(function(c){if(c.isBone===true){var d;for(var i=0;i<j.length;i++){var f=j[i];if(f.name===c.name){d=f.boneInverse;break;}}if(d===undefined){d=new THREE.Matrix4();}b.push({bone:c,boneInverse:d,processed:false});}});}function n2(d){var a=[];var h2=d.matrix;var b=d.nodes;var c=d.type;var f=d.instanceCameras;var g=d.instanceControllers;var k=d.instanceLights;var p=d.instanceGeometries;var v=d.instanceNodes;for(var i=0,l=b.length;i<l;i++){a.push(s2(b[i]));}for(var i=0,l=f.length;i<l;i++){var K2=A1(f[i]);if(K2!==null){a.push(K2.clone());}}for(var i=0,l=g.length;i<l;i++){var L2=g[i];var M2=$(L2.id);var N2=P1(M2.id);var O2=q2(N2,L2.materials);var P2=L2.skeletons;var Q2=M2.skin.joints;var R2=l2(P2,Q2);for(var j=0,jl=O2.length;j<jl;j++){var T2=O2[j];if(T2.isSkinnedMesh){T2.bind(R2,M2.skin.bindMatrix);T2.normalizeSkinWeights();}a.push(T2);}}for(var i=0,l=k.length;i<l;i++){var U2=F1(k[i]);if(U2!==null){a.push(U2.clone());}}for(var i=0,l=p.length;i<l;i++){var L2=p[i];var N2=P1(L2.id);var O2=q2(N2,L2.materials);for(var j=0,jl=O2.length;j<jl;j++){a.push(O2[j]);}}for(var i=0,l=v.length;i<l;i++){a.push(s2(v[i]).clone());}var T2;if(b.length===0&&a.length===1){T2=a[0];}else{T2=(c==='JOINT')?new THREE.Bone():new THREE.Group();for(var i=0;i<a.length;i++){T2.add(a[i]);}}if(T2.name===''){T2.name=(c==='JOINT')?d.sid:d.name;}T2.matrix.copy(h2);T2.matrix.decompose(T2.position,T2.quaternion,T2.scale);return T2;}var o2=new THREE.MeshBasicMaterial({color:0xff00ff});function p2(k,a){var b=[];for(var i=0,l=k.length;i<l;i++){var c=a[k[i]];if(c===undefined){console.warn('THREE.ColladaLoader: Material with key %s not found. Apply fallback material.',k[i]);b.push(o2);}else{b.push(u1(c));}}return b;}function q2(g,a){var b=[];for(var c in g){var d=g[c];var f=p2(d.materialKeys,a);if(f.length===0){if(c==='lines'||c==='linestrips'){f.push(new THREE.LineBasicMaterial());}else{f.push(new THREE.MeshPhongMaterial());}}var j=(d.data.attributes.skinIndex!==undefined);if(j){for(var i=0,l=f.length;i<l;i++){f[i].skinning=true;}}var k=(f.length===1)?f[0]:f;var p;switch(c){case'lines':p=new THREE.LineSegments(d.data,k);break;case'linestrips':p=new THREE.Line(d.data,k);break;case'triangles':case'polylist':if(j){p=new THREE.SkinnedMesh(d.data,k);}else{p=new THREE.Mesh(d.data,k);}break;}b.push(p);}return b;}function r2(i){return I2.nodes[i]!==undefined;}function s2(i){return A(I2.nodes[i],n2);}function t2(z2){var d={name:z2.getAttribute('name'),children:[]};g2(z2);var a=h(z2,'node');for(var i=0;i<a.length;i++){d.children.push(j2(a[i]));}I2.visualScenes[z2.getAttribute('id')]=d;}function u2(d){var g=new THREE.Group();g.name=d.name;var c=d.children;for(var i=0;i<c.length;i++){var a=c[i];g.add(s2(a.id));}return g;}function v2(i){return I2.visualScenes[i]!==undefined;}function w2(i){return A(I2.visualScenes[i],u2);}function x2(z2){var i=h(z2,'instance_visual_scene')[0];return w2(q(i.getAttribute('url')));}function y2(){var c=I2.clips;if(s(c)===true){if(s(I2.animations)===false){var a=[];for(var b in I2.animations){var d=F(b);for(var i=0,l=d.length;i<l;i++){a.push(d[i]);}}F2.push(new THREE.AnimationClip('default',-1,a));}}else{for(var b in c){F2.push(T(b));}}}if(t.length===0){return{scene:new THREE.Scene()};}var z2=new DOMParser().parseFromString(t,'application/xml');var A2=h(z2,'COLLADA')[0];var B2=A2.getAttribute('version');console.log('THREE.ColladaLoader: File version',B2);var C2=u(h(A2,'asset')[0]);var D2=new THREE.TextureLoader(this.manager);D2.setPath(this.resourcePath||e).setCrossOrigin(this.crossOrigin);var E2;if(THREE.TGALoader){E2=new THREE.TGALoader(this.manager);E2.setPath(this.resourcePath||e);}var F2=[];var G2={};var H2=0;var I2={animations:{},clips:{},controllers:{},images:{},effects:{},materials:{},cameras:{},lights:{},geometries:{},nodes:{},visualScenes:{},kinematicsModels:{},physicsModels:{},kinematicsScenes:{}};y(A2,'library_animations','animation',B);y(A2,'library_animation_clips','animation_clip',R);y(A2,'library_controllers','controller',U);y(A2,'library_images','image',_);y(A2,'library_effects','effect',c1);y(A2,'library_materials','material',r1);y(A2,'library_cameras','camera',v1);y(A2,'library_lights','light',B1);y(A2,'library_geometries','geometry',G1);y(A2,'library_nodes','node',j2);y(A2,'library_visual_scenes','visual_scene',t2);y(A2,'library_kinematics_models','kinematics_model',Q1);y(A2,'library_physics_models','physics_model',Z1);y(A2,'scene','instance_kinematics_scene',a2);z(I2.animations,E);z(I2.clips,S);z(I2.controllers,Y);z(I2.images,a1);z(I2.effects,p1);z(I2.materials,t1);z(I2.cameras,z1);z(I2.lights,E1);z(I2.geometries,M1);z(I2.visualScenes,u2);y2();e2();var J2=x2(h(A2,'scene')[0]);J2.scale.multiplyScalar(C2.unit);return{animations:F2,kinematics:G2,library:I2,scene:J2};}};
