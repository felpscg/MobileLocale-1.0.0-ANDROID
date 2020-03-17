// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/components/container/ApplicationContainer","sap/ushell/components/applicationIntegration/application/PostMessageAPI","sap/ushell/utils","sap/ui/thirdparty/jquery","sap/ushell/components/applicationIntegration/eventDelegation/tunnels","sap/ui/thirdparty/URI"],function(A,P,u,q,t,U){"use strict";var a,B,T={},o={},f={},b=0;function c(){var d=this;this.handleMessageEvent=function(C,m){var M=m.data;if(typeof M==="string"){try{M=d.parse(m.data);}catch(e){q.sap.log.debug("Message received from origin '"+m.origin+"' cannot be parsed: "+e,M,"sap.ushell.components.container.ApplicationContainer");return;}}if(M.action==="pro54_setGlobalDirty"&&localStorage.getItem(C.globalDirtyStorageKey)===sap.ushell.Container.DirtyState.PENDING){if(!A.prototype._isTrustedPostMessageSource(C,m)){q.sap.log.warning("Received message from untrusted origin: "+m.origin,M,"sap.ushell.components.container.ApplicationContainer");return;}q.sap.log.debug("getGlobalDirty() pro54_setGlobalDirty SetItem key:"+C.globalDirtyStorageKey+" value: "+M.parameters.globalDirty,null,"sap.ushell.components.container.ApplicationContainer");u.localStorageSetItem(C.globalDirtyStorageKey,M.parameters.globalDirty,true);}else{d.handleServiceMessageEvent(C,m,M);}};this.handleServiceMessageEvent=function(C,m,M){var p=q.sap.getObject("sap-ushell-config.services.PostMessage.config",0),s=M&&M.service,S=t.getPairedServiceCall(s),g,h,i,j,I=false,k=P.getAPIs();q.sap.log.debug("Received post message request from origin '"+m.origin+"': "+JSON.stringify(M),null,"sap.ushell.components.container.ApplicationContainer");if(S){l(S);return;}if(M.type!=="request"||!s){return;}for(var E in k){if(k.hasOwnProperty(E)){if(s.indexOf(E)!==-1){h=k[E];i=E;I=true;break;}}}if(I===false){return;}g=s.split(".")[3];if(p&&p.enabled===false){q.sap.log.warning("Received message for "+g+", but this "+"feature is disabled. It can be enabled via launchpad configuration "+"property 'services.PostMessage.config.enabled: true'",undefined,"sap.ushell.components.container.ApplicationContainer");return;}if(!A.prototype._isTrustedPostMessageSource(C,m)){q.sap.log.warning("Received message from untrusted origin '"+m.origin+"': "+JSON.stringify(m.data),null,"sap.ushell.components.container.ApplicationContainer");return;}function l(e){var y={matchesLocalSid:x,getLocalSystemInSidForma:w,storeSapSystemData:v,executeSetBackNavigationService:r,sendResponseMessage:n,oMessage:m,oMessageData:M,oContainer:C};try{e(y).done(function(R){n("success",{result:R});}).fail(function(D){n("error",{message:D});});}catch(z){n("error",{message:z.message});}}function n(e,y){var R=d.stringify({type:"response",service:M.service,request_id:M.request_id,status:e,body:y});q.sap.log.debug("Sending post message response to origin ' "+m.origin+"': "+R,null,"sap.ushell.components.container.ApplicationContainer");if(typeof m.source!=="object"||m.source===null){q.sap.log.debug("Cannot send response message to origin ' "+m.origin,"`source` member of request message is not an object","sap.ushell.components.container.ApplicationContainer");return;}m.source.postMessage(R,m.origin);}function r(m,M){var D=new q.Deferred(),e;if(M.body&&M.body.callbackMessage&&M.body.callbackMessage.service){e=A.prototype._backButtonPressedCallback.bind(null,m.source,M.body.callbackMessage.service,m.origin);}D.resolve(C.getShellUIService().setBackNavigation(e));return D.promise();}function v(y,z){var K,L,D,F=[y.id];if(arguments.length>1){F.unshift(z);}try{D=JSON.stringify(y);}catch(e){q.sap.log.error("Cannot stringify and store expanded system data: "+e);}if(D){L=u.getLocalStorage();K=u.generateLocalStorageKey("sap-system-data",F);L.setItem(K,D);}}function w(){var e=sap.ushell.Container.getLogonSystem();var y=e.getName();var z=e.getClient();return"sid("+y+"."+z+")";}function x(e){return w().toLowerCase()===e.toLowerCase();}j=h.oServiceCalls[M.service.replace(i+".","")];if(j&&j.executeServiceCallFn){l(j.executeServiceCallFn);}else{n("error",{message:"Unknown service name: '"+M.service+"'"});}};this.init=function(i){B=i;this.registerShellCommunicationHandler({"sap.ushell.PostMessage":{oServiceCalls:{"callTunnelFunction":{executeServiceCallFn:function(s){var e=s.oMessageData.body.content,g=d.restoreArray(e.arguments),r;r=T[e.UUID].fnCallback.apply(this,g);return new q.Deferred().resolve(r).promise();}}},oRequestCalls:{"callTunnelFunction":{isActiveOnly:true,distributionType:["URL"]}}}});};this.restoreArray=function(e){var g=[],i=0;while(e[i]){g.push(e[i]);i++;}return g;};this._createWaitForRendererCreatedPromise=function(){var p,r;r=sap.ushell.Container.getRenderer();if(r){q.sap.log.debug("Shell controller._createWaitForRendererCreatedPromise: shell renderer already created, return empty array.");return[];}p=new Promise(function(e,g){var O;O=function(){q.sap.log.info("Shell controller: resolving component waitFor promise after shell renderer created event fired.");e();sap.ushell.Container.detachRendererCreatedEvent(O);};r=sap.ushell.Container.getRenderer();if(r){q.sap.log.debug("Shell controller: resolving component waitFor promise immediately (shell renderer already created");e();}else{sap.ushell.Container.attachRendererCreatedEvent(O);}});return[p];};this.createComponent=function(r,p){return sap.ushell.Container.getService("Ui5ComponentLoader").createComponent(r,p,this._createWaitForRendererCreatedPromise());};this.stripURL=function(s){var n=s.indexOf("?"),e=s.indexOf("#"),g;if(n>=0){g=s.substr(0,n);}else if(e>=0){g=s.substr(0,e);}else{g=s;}return g;};this.createApplicationContainer=function(s,r){a=new A("application"+s,r);a.setHandleMessageEvent(this.handleMessageEvent);B.setAppCapabilities(a,r.appCapabilities);return a;};this.active=function(e){if(e){if(e.active){e.active();}}};this.restore=function(e){var D;if(e){if(e.getUrl){D=e.getUrl();a=B.get(this.stripURL(D));if(a){B.restoreApp(a.sApplication);}}if(e.restore){e.restore();}if(e.setInitialConfiguration){e.setInitialConfiguration();}if(e.getRouter&&e.getRouter()&&e.getRouter().initialize){e.getRouter().initialize();}a=e;}};this.store=function(e){var D;if(e){if(e.getUrl){D=e.getUrl();a=B.get(this.stripURL(D));if(a){B.storeApp(a.sApplication);}}if(e.suspend){e.suspend();}if(e.getRouter&&e.getRouter()){e.getRouter().stop();}}};this.destroy=function(e){var D,a,g=false;if(e){if(e.getUrl){D=e.getUrl();a=B.get(this.stripURL(D));if(B.isStatefulContainerSupported(a)){g=true;B.destroyApp(a.sApplication);}}if(e.destroy&&g===false){e.destroy();}}};this.getActiveAppContainer=function(){return a;};}c.prototype.stringify=function(d){var e=function(C){b++;T[b]={fnCallback:C};return{type:"tunnel",UUID:b};},g=[],r=JSON.stringify(d,function(k,v){if(v!==null){if(typeof v==="object"||typeof v==="function"){if(g.indexOf(v)!==-1){return;}g.push(v);}}if(typeof v==="function"){var n=o[v];if(n){return{type:"reversetunnel",UUID:n};}return e(v);}return v;});return r;};c.prototype.parse=function(d){var e=this;return JSON.parse(d,function(k,v){if(v&&v.type==="reversetunnel"){return T[v.UUID].fnCallback;}else if(v&&v.type==="tunnel"){var g;if(f[v.UUID]){g=f[v.UUID];}else{var h=e.getActiveAppContainer();g=function(){e.postMessageToIframeApp(h,"sap.ushell.PostMessage","callTunnelFunction",{"content":{UUID:v.UUID,arguments:arguments}},true);};g.getUUID=function(){return v.UUID;};o[g]=v.UUID;f[v.UUID]=g;}return g;}return v;});};c.prototype.getResponseHandler=function(s,i){return P.getResponseHandler(s,i);};c.prototype.isActiveOnly=function(s,i){return P.isActiveOnly(s,i);};c.prototype.isAppTypeSupported=function(C,s,i){var d=P._getPostMesageInterface(s,i);return this.isAppTypeSupportedByPolicy(C,d);};c.prototype.isAppTypeSupportedByPolicy=function(C,p){if(C&&C.getAdditionalInformation&&C.getAdditionalInformation().startsWith("SAPUI5.Component=")){return false;}var d=p;if(!d||!d.distributionType){return false;}if(d.distributionType.indexOf("all")>=0){return true;}if(d.distributionType.indexOf("URL")>=0){return false;}if(C.getApplicationType&&d.distributionType.indexOf(C.getApplicationType())>=0){return true;}return false;};c.prototype.postMessageToIframeApp=function(C,s,i,m,w){var S=s+"."+i,M=this.createPostMessageRequest(S,m);return this.postMessageToIframe(M,C,w);};c.prototype.createPostMessageRequest=function(s,m){var r=Date.now().toString();return{"type":"request","request_id":r,"service":s,"body":m};};c.prototype.postMessageToIframe=function(m,C,w){var d=this,r=m.request_id,i=C._getIFrame();return new Promise(function(n,N){function p(E){var j;try{j=d.parse(E.data,d);if(r!==j.request_id){return;}if(j.status==="success"){n(j);}else{N(j);}window.removeEventListener("message",p);}catch(e){n();q.sap.log.warning("Obtained bad response from framework in response to message "+m.request_id);q.sap.log.debug("Underlying framework returned invalid response data: '"+E.data+"'");}}var M=d.stringify(m);q.sap.log.debug("Sending postMessage "+M+" to application container '"+C.getId()+"'");var g,h;if(!i){n();}else if(w){window.addEventListener("message",p,false);g=new U(i.src);h=g.protocol()+"://"+g.host();i.contentWindow.postMessage(M,h);}else{g=new U(i.src);h=g.protocol()+"://"+g.host();i.contentWindow.postMessage(M,h);n();}});};c.prototype.registerShellCommunicationHandler=function(C){P.registerShellCommunicationHandler(C);};c.prototype.addShellCommunicationHandler=function(k,C){P.addShellCommunicationHandler(k,C);};c.prototype._getPostMesageInterface=function(s,i){return P._getPostMesageInterface(s,i);};return new c();},true);
