/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(['sap/collaboration/components/utils/CommonUtil','sap/ui/core/UIComponent','sap/ui/core/mvc/View','sap/ui/core/library','sap/m/Dialog','sap/m/Button','sap/ui/Device','jquery.sap.global'],function(C,U,V,c,D,B,a,q){"use strict";var b=c.mvc.ViewType;var d=U.extend("sap.collaboration.components.fiori.sharing.dialog.Component",{metadata:{includes:["../../../resources/css/Sharing.css"],properties:{attachments:{type:"object"},object:{type:"object"},externalObject:{type:"object"}},aggregations:{},events:{}},systemSettings:{width:"400px",height:"",oDataServiceUrl:"/sap/opu/odata/sap/SM_INTEGRATION_V2_SRV",collaborationHostODataServiceUrl:"/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1/OData",collaborationHostRestService:{url:"/sap/bc/ui2/smi/rest_tunnel/Jam/api/v1",urlParams:""}},init:function(){this.oCommonUtil=new C();this.oLangBundle=this.oCommonUtil.getLanguageBundle();},setSettings:function(s){this.setObject(s.object);this.setAttachments(s.attachments);if(JSON.stringify(s.externalObject)==='{}'){this.setExternalObject(undefined);}else{this.setExternalObject(s.externalObject);}},_createSharingView:function(){var s=this;var o;var O;var e;var f=this.getObject();if(f){e=s._handleObjectId(f.id);o=f.display;O=f.share;}var n=function(){s.close();s.openoNoGroupsDialog(s.oSharingView.getController().sJamUrl);};if(!this.oSharingView){this.oSharingView=sap.ui.view({id:this.getId()+"_SharingView",viewData:{controlId:this.getId(),odataServiceUrl:this.systemSettings.oDataServiceUrl,collaborationHostODataServiceUrl:this.systemSettings.collaborationHostODataServiceUrl,collaborationHostRestService:this.systemSettings.collaborationHostRestService,langBundle:this.oLangBundle,jamGroups:this.aJamGroups,sharingDialog:this._oSharingDialog,noGroupsCallBack:n,objectDisplay:o,objectShare:O,objectId:e,attachments:this.getAttachments(),externalObject:this.getExternalObject()},type:b.JS,viewName:"sap.collaboration.components.fiori.sharing.Sharing"});}else{this.oSharingView.getViewData().objectId=e;this.oSharingView.getViewData().objectShare=O;this.oSharingView.getViewData().objectDisplay=o;this.oSharingView.getViewData().externalObject=this.getExternalObject();this.oSharingView.getViewData().attachments=this.getAttachments();}},_createSharingDialog:function(){var s=new D(this.getId()+"_SharingDialog",{title:this.oLangBundle.getText("SHARING_PAGE_TITLE"),contentWidth:this.systemSettings.width,stretch:false,afterClose:function(){}}).addStyleClass("sapUiPopupWithPadding");return s;},createNoGroupsDialog:function(j){if(!this.oNoGroupsView){this.oNoGroupsView=sap.ui.view({id:this.getId()+"_NoGroupsView",viewData:{controlId:this.getId(),langBundle:this.oLangBundle,jamUrl:j},type:b.JS,viewName:"sap.collaboration.components.fiori.sharing.NoGroups"});}var n=new D(this.getId()+"_NoGroupsDialog",{title:this.oLangBundle.getText("SHARING_PAGE_TITLE"),stretch:false,content:this.oNoGroupsView,beginButton:new B(this.getId()+"_CloseButton",{text:this.oLangBundle.getText("CLOSE_BUTTON_TEXT"),press:function(){n.close();}})}).addStyleClass("sapUiPopupWithPadding");return n;},open:function(){if(this.bStopRendering===undefined||this.bStopRendering===false){if(!this._oSharingDialog){this._logComponentProperties();this._oSharingDialog=this._createSharingDialog();}try{this._createSharingView();this._oSharingDialog.addAriaLabelledBy(this.getId()+"_SharingView");this._oSharingDialog.addContent(this.oSharingView);this._oSharingDialog.setInitialFocus(this.oSharingView);this._createDialogButtons();if(a.system.phone){this._oSharingDialog.setStretch(true);}this._oSharingDialog.open();}catch(e){q.sap.log.error(e);this.oCommonUtil.displayError();}}},close:function(){if(this._oSharingDialog){this._oSharingDialog.close();}},openoNoGroupsDialog:function(j){this._oSharingDialog.removeAllContent();if(!this.oNoGroupsDialog){this.oNoGroupsDialog=this.createNoGroupsDialog(j);}this.oNoGroupsDialog.open();},_createDialogButtons:function(){if(!this.oMentionButton){this.oMentionButton=new B(this.getId()+"_mentionButton",{text:"@",enabled:false,press:[function(){this.oSharingView.getController().atMentionsButtonPressed();},this]});this._oSharingDialog.addButton(this.oMentionButton);}if(a.system.phone){this.oMentionButton.setVisible(false);}if(!this.oLeftButton){this.oLeftButton=new B(this.getId()+"_LeftButton",{text:this.oLangBundle.getText("OK_BUTTON_TEXT"),enabled:false,press:[function(){this.oSharingView.getController().shareToJam();this._oSharingDialog.close();},this]});this._oSharingDialog.addButton(this.oLeftButton);}if(!this.oRightButton){this.oRightButton=new B(this.getId()+"_RightButton",{text:this.oLangBundle.getText("CANCEL_BUTTON_TEXT"),press:[function(){this._oSharingDialog.close();},this]});this._oSharingDialog.addButton(this.oRightButton);}},setDialogButtons:function(){},setCloseButton:function(){this._oSharingDialog.destroyBeginButton();this._oSharingDialog.setEndButton(this.oCloseButton);},_handleObjectId:function(o){var O=typeof o;var s;switch(O){case"undefined":case"":case"string":s=o;break;case"function":s=o();if(typeof s=="string"){break;};default:q.sap.log.error("object->id is not a sting or callback function that returns a string");throw new Error();};return s;},_logComponentProperties:function(){q.sap.log.debug("Share Component properties:","","sap.collaboration.components.fiori.sharing.Component._logComponentProperties()");q.sap.log.debug("width: "+this.systemSettings.width);q.sap.log.debug("height: "+this.systemSettings.height);q.sap.log.debug("oDataServiceUrl: "+this.systemSettings.oDataServiceUrl);q.sap.log.debug("collaborationHostODataServiceUrl: "+this.systemSettings.collaborationHostODataServiceUrl);q.sap.log.debug("collaborationHostRestService: "+this.systemSettings.collaborationHostRestService.url+this.systemSettings.collaborationHostRestService.urlParams);if(this.getObject()){q.sap.log.debug("object->id: "+this.getObject().id);q.sap.log.debug("object->display: "+this.getObject().display);q.sap.log.debug("object->share: "+this.getObject().share);}else{q.sap.log.debug("object: undefined");}if(this.getAttachments()&&this.getAttachments().attachmentsArray){q.sap.log.debug("Attachments:");var e=this.getAttachments().attachmentsArray;for(var i=0;i<e.length;i++){q.sap.log.debug("Attachments"+(i+1)+":");q.sap.log.debug(e[i].mimeType);q.sap.log.debug(e[i].name);q.sap.log.debug(e[i].url);}}else{q.sap.log.debug("attachments: undefined");}if(this.getExternalObject()){q.sap.log.debug("externalObject->appContext: "+this.getExternalObject().appContext);q.sap.log.debug("externalObject->odataServicePath: "+this.getExternalObject().odataServicePath);q.sap.log.debug("externalObject->collection: "+this.getExternalObject().collection);q.sap.log.debug("externalObject->key: "+this.getExternalObject().key);q.sap.log.debug("object->name: "+this.getExternalObject().name);q.sap.log.debug("object->summary: "+this.getExternalObject().summary);}else{q.sap.log.debug("externalObject: undefined");}}});return d;});