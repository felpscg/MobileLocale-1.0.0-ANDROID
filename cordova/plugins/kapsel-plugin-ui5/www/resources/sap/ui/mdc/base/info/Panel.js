/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/XMLComposite','sap/ui/mdc/library','sap/m/HBox','sap/m/VBox','sap/m/Text','sap/m/Image','sap/m/Link','./ILinkHandler','sap/ui/comp/personalization/Controller','sap/ui/comp/personalization/SelectionWrapper','sap/ui/comp/personalization/ColumnWrapper','sap/ui/core/CustomData','sap/base/Log','sap/m/SelectDialog','sap/m/StandardListItem','./SelectionDialog','./SelectionDialogItem','sap/ui/model/json/JSONModel','sap/ui/model/BindingMode','sap/ui/base/ManagedObjectObserver','sap/ui/mdc/base/info/flexibility/PanelItem.flexibility','sap/ui/mdc/base/info/flexibility/Panel.flexibility'],function(X,m,H,V,T,I,L,a,C,S,b,c,d,e,f,g,h,J,B,M,P,i){"use strict";var j=X.extend("sap.ui.mdc.base.info.Panel",{metadata:{library:"sap.ui.mdc",defaultAggregation:"items",properties:{enablePersonalization:{type:"boolean",defaultValue:true},metadataHelperPath:{type:"string"}},aggregations:{items:{type:"sap.ui.mdc.base.info.PanelItem",multiple:true,singularName:"item"},extraContent:{type:"sap.ui.core.Control",multiple:true,forwarding:{idSuffix:"--idSectionExtraContent",aggregation:"items"}}},events:{beforeSelectionDialogOpen:{},afterSelectionDialogClose:{}}}});j.prototype.init=function(){X.prototype.init.call(this);var o=new J({countMainItems:0,countNonMainItemsWithIcon:0,countNonMainItemsWithoutIcon:0,showResetEnabled:false,runtimeItems:[]});o.setDefaultBindingMode(B.TwoWay);o.setSizeLimit(1000);this.setModel(o,"$sapuimdcbaseinfoPanel");this._oObserver=new M(_.bind(this));this._oObserver.observe(this,{aggregations:["items"]});};j.prototype.exit=function(o){if(this._oObserver){this._oObserver.disconnect();this._oObserver=null;}};j.prototype.onPressLinkPersonalization=function(){this.openSelectionDialog(false,true,true,undefined);};j.prototype.openSelectionDialog=function(F,s,k,l){this.fireBeforeSelectionDialogOpen();return sap.ui.getCore().loadLibrary('sap.ui.fl',{async:true}).then(function(){sap.ui.require(['sap/ui/fl/FlexControllerFactory','sap/ui/fl/ControlPersonalizationAPI','sap/ui/fl/Utils',this.getMetadataHelperPath()],function(n,o,U,p){return n.createForControl(this).waitForChangesToBeApplied(this).then(function(){return new Promise(function(r){var q=p.retrieveAllMetadata(this).filter(function(A){return A.isMain!==true;});var t=q.some(function(A){return!!A.icon;});var u=p.retrieveBaseline(this);var v=q.map(function(A){var D=j._getItemById(A.id,u);A.visible=D?D.visible:false;return A;});var w=jQuery.extend(true,[],this._getInternalModel().getProperty("/runtimeItems")).filter(function(A){return A.isMain!==true;});var x=jQuery.extend(true,[],w);var y=function(z){x=[];z.close();z.destroy();this.fireAfterSelectionDialogClose();}.bind(this);var z=new g({showItemAsLink:!F,showReset:s,showResetEnabled:{path:'$selectionDialog>/showResetEnabled'},items:q.map(function(A){var D=j._getItemById(A.id,w);var E=A.icon;if(t&&!E){E="sap-icon://chain-link";}return new h({key:A.id,text:A.text,description:A.description,href:A.href,target:A.target,icon:E,visible:D?D.visible:false});}),change:function(){this._getInternalModel().setProperty("/showResetEnabled",!j._isEqual(v,j._convertSelectionDialogItems2MItems(z.getItems())));}.bind(this),ok:function(){var A=j._getUnion(q,x);var D=j._getDiffToBase(A,j._convertSelectionDialogItems2MItems(z.getItems()));var E=i.createChanges(this,D);y(z);var G=[];o.addPersonalizationChanges({controlChanges:E,ignoreVariantManagement:true}).then(function(K){G=G.concat(K);var N=P.createChanges(D);return o.addPersonalizationChanges({controlChanges:N,ignoreVariantManagement:true});}).then(function(K){G=G.concat(K);return o.saveChanges(G,U.getAppComponentForControl(this));}.bind(this)).then(function(){return r(true);});}.bind(this),cancel:function(){y(z);return r(true);},reset:function(){z.getItems().forEach(function(A){var D=j._getItemById(A.getKey(),v);A.setVisible(D?D.visible:false);});}});if(l){z.addStyleClass(l);}this._getInternalModel().setProperty("/showResetEnabled",!j._isEqual(v,j._convertSelectionDialogItems2MItems(z.getItems())));jQuery.sap.syncStyleClass("sapUiSizeCompact",this,z);z.setModel(this._getInternalModel(),"$selectionDialog");this.addDependent(z);z.open();}.bind(this));}.bind(this));}.bind(this));}.bind(this));};j._getItemById=function(s,A){return A.filter(function(o){return o.id===s;})[0];};j._getDiffToBase=function(k,l){if(!l||!k||k.length!==l.length){return false;}return l.filter(function(o){var n=j._getItemById(o.id,k);return o.id!==n.id||o.visible!==n.visible;});};j._convertSelectionDialogItems2MItems=function(s){return s.map(function(o){return{id:o.getKey(),visible:o.getVisible()};});};j._isEqual=function(k,l){var n=j._getUnion(k,l);return j._getDiffToBase(n,k).length===0;};j._getUnion=function(k,l){if(!l){return jQuery.extend(true,[],k);}var u=jQuery.extend(true,[],l);k.forEach(function(o){var n=j._getItemById(o.id,u);if(!n){u.push(o);return;}if(n.visible===undefined&&o.visible!==undefined){n.visible=o.visible;}});return u;};j.prototype._getInternalModel=function(){return this.getModel("$sapuimdcbaseinfoPanel");};j.prototype._propagateDefaultIcon=function(s){if(!s){return;}var o=this._getInternalModel();o.getProperty("/runtimeItems").forEach(function(k,l){if(k.isMain===true||!!k.icon){return;}o.setProperty("/runtimeItems/"+l+"/icon","sap-icon://chain-link");});};function _(o){var k=this._getInternalModel();if(o.object.isA("sap.ui.mdc.base.info.Panel")){switch(o.name){case"items":var l=o.child?[o.child]:o.children;l.forEach(function(p){switch(o.mutation){case"insert":k.setProperty("/countMainItems",p.getIsMain()?k.getProperty("/countMainItems")+1:k.getProperty("/countMainItems"));if(!p.getIsMain()){k.setProperty("/countNonMainItemsWithIcon",p.getIcon()?k.getProperty("/countNonMainItemsWithIcon")+1:k.getProperty("/countNonMainItemsWithIcon"));k.setProperty("/countNonMainItemsWithoutIcon",p.getIcon()?k.getProperty("/countNonMainItemsWithoutIcon"):k.getProperty("/countNonMainItemsWithoutIcon")+1);}var r=k.getProperty("/runtimeItems/");r.splice(this.indexOfItem(p),0,p.getJson());k.setProperty("/runtimeItems",r);this._propagateDefaultIcon(k.getProperty("/countNonMainItemsWithIcon")>0&&k.getProperty("/countNonMainItemsWithoutIcon")>0);this._oObserver.observe(p,{properties:["visible"]});break;case"remove":this._oObserver.unobserve(p);d.error("Deletion of items is not supported yet");break;default:d.error("Mutation '"+o.mutation+"' is not supported yet.");}},this);break;default:d.error("The property or aggregation '"+o.name+"' has not been registered.");}}else if(o.object.isA("sap.ui.mdc.base.info.PanelItem")){switch(o.name){case"visible":var p=o.object;k.setProperty("/runtimeItems/"+this.indexOfItem(p)+"/visible",p.getVisible());break;default:d.error("The '"+o.name+"' of PanelItem is not supported yet.");}}}return j;},true);
