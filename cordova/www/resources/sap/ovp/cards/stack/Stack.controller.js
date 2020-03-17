sap.ui.define(["sap/ovp/cards/generic/Card.controller","sap/m/library","sap/ui/thirdparty/jquery","sap/ovp/ui/ObjectStream","sap/ovp/cards/AnnotationHelper","sap/ui/Device","sap/ui/base/BindingParser","sap/ui/core/ComponentContainer","sap/m/Link","sap/ovp/ui/CustomData","sap/ui/core/Icon","sap/m/FlexItemData","sap/m/Text","sap/m/VBox","sap/ovp/app/resources","sap/base/Log","sap/base/util/merge"],function(C,S,q,O,A,D,B,a,L,b,I,F,T,V,c,d,m){"use strict";return C.extend("sap.ovp.cards.stack.Stack",{onInit:function(){C.prototype.onInit.apply(this,arguments);var v=this._oCard=this.getView().byId("stackContent");v.addEventDelegate({onclick:this.openStack.bind(this),onkeydown:function(e){if(!e.shiftKey&&(e.keyCode==13||e.keyCode==32)){e.preventDefault();this.openStack();}}.bind(this)});if(D.system.phone){this.bAfterColumnUpdateAttached=false;this.bDeviceOrientationAttached=false;}this.quickViewCardContextArray=[];this.bQuickViewCardRendered=false;this._createObjectStream();},onExit:function(){if(this.oObjectStream){this.oObjectStream.destroy();}},addPlaceHolder:function(n){var v=this.getView();var o=v.getModel("ovpCardProperties");var s=o.getProperty("/objectStreamCardsNavigationProperty");var e=s?true:false;if(!e){var N=this.getEntityNavigationEntries();if(N.length>0){var f=N[0].label;if(this.sPlaceHolderText==undefined){this.sPlaceHolderText=c.getText("PlaceHolder_default");}var p=this._createPlaceHolder(n,this.sPlaceHolderText,f);var t=this;p.addEventDelegate({onclick:function(){t.doNavigation(null);}});this.oObjectStream.setPlaceHolder(p);}}},onAfterRendering:function(){C.prototype.onAfterRendering.apply(this,arguments);this.ovpLayout=sap.ui.getCore().byId("mainView--ovpLayout");if(D.system.phone){this._cardWidth=this.getView().$().width();if(!this.bAfterColumnUpdateAttached){var o=this.getOwnerComponent().getComponentData();if(o&&o.mainComponent&&o.appComponent.oOvpConfig&&o.appComponent.oOvpConfig.containerLayout!=="resizable"){var M=o.mainComponent,l=M.byId("ovpLayout");l.attachAfterColumnUpdate(function(E){this._setObjectStreamCardsSize(false);}.bind(this));this.bAfterColumnUpdateAttached=true;}}if(!this.bDeviceOrientationAttached){D.orientation.attachHandler(function(E){this._setObjectStreamCardsSize(true);}.bind(this));}}if(this.bSetErrorState&&this.bSetErrorState===true){this.setErrorState();return;}var v=this.getView();if(this.oObjectStream){var e=this.oObjectStream.getBinding("content");e.attachDataRequested(function(){if(this.getView().byId('stackSize')!==undefined&&this.getView().byId('stackTotalSize')!==undefined){q(this.getView().byId('stackSize').getDomRef()).css('visibility','hidden');q(this.getView().byId('stackTotalSize').getDomRef()).css('visibility','hidden');}},this);e.attachDataReceived(function(){var f=this.getView().getModel("ovpCardProperties").getObject("/category"),n=e.getCurrentContexts().length,g=e.getLength();v.byId("stackSize").setText(n);v.byId("stackTotalSize").setText(c.getText("Total_Size_Stack_Card",[g]));var s=this.getView().byId("stackContent").getDomRef();q(s).attr("aria-label",c.getText("stackCardContent",[n,g,f]));var h=this.getView().byId("stackSize").getDomRef();q(h).attr("aria-label",c.getText("stackCard",[n]));this.addPlaceHolder(g);if(this.getView().byId('stackSize')!==undefined&&this.getView().byId('stackTotalSize')!==undefined){q(this.getView().byId('stackSize').getDomRef()).css('visibility','visible');q(this.getView().byId('stackTotalSize').getDomRef()).css('visibility','visible');}var i=this.getView().getDomRef();var j=q(i).find('.sapOvpCardContentContainer');if(g!==0){if(j.length!==0){j.addClass('sapOvpCardNavigable');}}else{if(j.length!==0){var k=j.find("[role='button']");if(k.length!==0){k.removeAttr("role");}}}},this);this.addPlaceHolder("");if(e.bPendingRequest===false){e.fireDataReceived();}if(this.checkNavigation()){this.oObjectStream.getTitle().addStyleClass('sapOvpCardNavigable');}}},getCardItemsBinding:function(){return this.oObjectStream.getBinding("content");},_setObjectStreamCardsSize:function(i){var e=this.getView().$().width();if(this._cardWidth!=e||i){this.oObjectStream.setCardsSize(e);this._cardWidth=e;}},_createObjectStream:function(){if(this.oObjectStream instanceof O){return;}var o=this.getOwnerComponent();var e=o.getComponentData&&o.getComponentData();var p;var P;if(e.i18n){this.oi18n=e.i18n;}if(e&&e.mainComponent){p=e.mainComponent._getOvplibResourceBundle();}else{p=o.getOvplibResourceBundle();}P=o.getPreprocessors(p);this.oModel=e.model;this.oCardPropsModel=P.xml.ovpCardProperties;var E=this.oCardPropsModel.getProperty("/entitySet");var f=this.oCardPropsModel.getProperty("/objectStreamCardsSettings");this.oObjectStreamCardsSettings=f;var M=this.oModel.getMetaModel();var g=M.getODataEntitySet(E);var h=M.getODataEntityType(g.entityType);var s=this.oCardPropsModel.getProperty("/annotationPath");var i=(s)?s.split(","):[];if(e){this.oAppComponent=e.appComponent;this.oOwner=e.mainComponent;}if(this.oOwner){this.oGlobalFilter=this.oOwner.getView().byId("ovpGlobalFilter");}function j(K){if(K==="ovpCardProperties"){return this.oCardPropsModel;}else if(K==="dataModel"){return this.oModel;}else if(K==="_ovpCache"){return{};}}var k=[{getSetting:j.bind(this),bDummyContext:true},g].concat(i);var l=A.formatItems.apply(this,k);var n=B.complexParser(l);var r=this.oCardPropsModel.getProperty("/objectStreamCardsNavigationProperty");this.bStackFlavorAssociation=r?true:false;this.oStackFilterMapping;var t=this.oCardPropsModel.getProperty("/objectStreamCardsTemplate");if(this.bStackFlavorAssociation){if(t==="sap.ovp.cards.quickview"){d.error("objectStreamCardsTemplate cannot be 'sap.ovp.cards.quickview' when objectStreamCardsNavigationProperty is provided");this.bSetErrorState=true;return;}this.oStackFilterMapping=this._determineFilterPropertyId(this.oModel,g,h,r);f.entitySet=this.oModel.getMetaModel().getODataAssociationSetEnd(h,r).entitySet;}else{if(t!=="sap.ovp.cards.quickview"){d.error("objectStreamCardsTemplate must be 'sap.ovp.cards.quickview' when objectStreamCardsNavigationProperty is not provided");this.bSetErrorState=true;return;}var u=null;var v=this.oCardPropsModel.getProperty("/identificationAnnotationPath");var w=(v)?v.split(","):[];if(w&&w.length>1){u=w[1];}if(u){f.identificationAnnotationPath=u;}if(h["com.sap.vocabularies.UI.v1.HeaderInfo"]&&h["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName&&h["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName.String){f.title=h["com.sap.vocabularies.UI.v1.HeaderInfo"].TypeName.String;}else{f.title=h.name;}f.entitySet=E;}f.isObjectStream=true;n.factory=function(z,G){var H=new a();this.quickViewCardContextArray.push({sId:z,oContext:G,oComponentContainer:H});return H;}.bind(this);var x=this.oCardPropsModel.getObject("/title");this.sPlaceHolderText=this.oCardPropsModel.getObject("/itemText");var y=new L({text:x,subtle:true,press:this.handleObjectStreamTitlePressed.bind(this)}).addStyleClass("sapOvpObjectStreamHeader");y.addCustomData(new b({key:"tabindex",value:"0",writeToDom:true}));y.addCustomData(new b({key:"aria-label",value:x,writeToDom:true}));this.oObjectStream=new O(this.getView().getId()+"_ObjectStream",{title:y,content:n});this.oObjectStream.setModel(this.oModel);},_renderQuickViewCards:function(i,o,e){return new Promise(function(r,f){var s=this.oCardPropsModel.getProperty("/objectStreamCardsSettings"),g;if(this.bStackFlavorAssociation){g={filters:[{path:this.oStackFilterMapping.foreignKey,operator:"EQ",value1:o.getProperty(this.oStackFilterMapping.key)}]};s=q.extend(true,{},g,this.oObjectStreamCardsSettings);}var h={name:this.oCardPropsModel.getProperty("/objectStreamCardsTemplate"),async:true,componentData:{cardId:i,model:this.oModel,settings:s,appComponent:this.oAppComponent,mainComponent:this.oOwner}};if(this.oGlobalFilter){h.componentData.globalFilter={getUiState:this.oGlobalFilter.getUiState.bind(this.oGlobalFilter)};}var j=this.oi18n;sap.ui.component(h).then(function(k){k.setBindingContext(o);if(j){k.setModel(j,"@i18n");}e.setComponent(k);r();e.setBindingContext=function(o){k.setBindingContext(o);};});}.bind(this));},_determineFilterPropertyId:function(M,e,E,n){var N,f=E.namespace,r,o;for(var i=0;i<E.navigationProperty.length;i++){if(E.navigationProperty[i].name===n){N=E.navigationProperty[i];break;}}r=N.relationship;o=A.getAssociationObject(M,r,f);var R=o.referentialConstraint,g={};if(R){g.foreignKey=R.dependent.propertyRef[0].name;g.key=R.principal.propertyRef[0].name;return g;}},_createPlaceHolder:function(n,p,s){var i=new I({src:"sap-icon://display-more",useIconTooltip:false,layoutData:new F({alignSelf:S.FlexAlignSelf.Center,styleClass:"sapOvpStackPlaceHolderIconContainer"})});i.addStyleClass("sapOvpStackPlaceHolderIcon");var e=n+" "+p;var f=c.getText("SeeMoreContentAppName",[e,s]);var t=new T({text:f,textAlign:"Center",layoutData:new F({alignSelf:S.FlexAlignSelf.Center,maxWidth:"14rem"})});t.addCustomData(new b({key:"role",value:"heading",writeToDom:true}));t.addCustomData(new b({key:"aria-label",value:f,writeToDom:true}));t.addStyleClass("sapOvpStackPlaceHolderTextLine");var o=new V({items:[t]});o.addStyleClass("sapOvpStackPlaceHolderLabelsContainer");o.addCustomData(new b({key:"tabindex",value:"0",writeToDom:true}));o.addCustomData(new b({key:"role",value:"button",writeToDom:true}));var v=new V({items:[i,o]});v.addStyleClass("sapOvpStackPlaceHolder");v.addEventDelegate({onkeydown:function(E){if(!E.shiftKey&&(E.keyCode==13||E.keyCode==32)){E.preventDefault();E.srcControl.$().click();}}});return v;},_openStack:function(){if(this.oObjectStream){var l=this.oObjectStream.getBinding("content");if(l.getCurrentContexts().length>0){var e=this.getView().$().width();this.getView().addDependent(this.oObjectStream);this.oObjectStream.setModel(this.getView().getModel("@i18n"),"@i18n");this.oObjectStream.open(e,this._oCard);this.ovpLayout.setActive(true);}}},openStack:function(){this.ovpLayout.setActive(false);if(!this.bQuickViewCardRendered){var e=[];for(var i=0;i<this.quickViewCardContextArray.length;i++){e.push(this._renderQuickViewCards(this.quickViewCardContextArray[i].sId,this.quickViewCardContextArray[i].oContext,this.quickViewCardContextArray[i].oComponentContainer));}Promise.all(e).then(function(){this.bQuickViewCardRendered=true;this._openStack();}.bind(this));}else{this._openStack();}},handleObjectStreamTitlePressed:function(e){this.doNavigation(null);}});});
