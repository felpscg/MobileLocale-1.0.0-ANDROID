sap.ui.define(["sap/m/HeaderContainer","sap/suite/ui/generic/template/AnalyticalListPage/controller/VisualFilterDialogController","sap/ui/comp/odata/ODataModelUtil","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider","sap/ui/comp/smartvariants/PersonalizableInfo","sap/ui/comp/smartvariants/SmartVariantManagement","sap/ui/model/Filter","sap/m/OverflowToolbar","sap/m/ToolbarSpacer","sap/ui/comp/odata/MetadataAnalyser","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms","sap/m/VBox","sap/m/Button","sap/m/Title","sap/suite/ui/generic/template/AnalyticalListPage/controller/DropDownController","sap/suite/ui/generic/template/AnalyticalListPage/controller/DatePickerController","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroBar","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroLine","sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/FilterItemMicroDonut","sap/ui/model/json/JSONModel","sap/ui/core/CustomData","sap/m/Text","sap/m/OverflowToolbarLayoutData","sap/ui/model/FilterOperator","sap/ui/Device","sap/ui/model/SimpleType","sap/ui/core/library","sap/m/library","sap/m/DatePicker","sap/base/Log","sap/ui/core/InvisibleText","sap/suite/ui/generic/template/js/StableIdHelper"],function(H,V,O,a,P,S,F,b,T,M,c,d,f,B,g,D,h,k,l,m,J,C,n,o,p,q,r,s,t,u,L,I,v){"use strict";var w="Donut";var x="Line";var y="Bar";var z=r.extend("sap.ui.model.DimensionFilterType",{formatValue:function(e){return e;},parseValue:function(e){return e;},validateValue:function(e){}});var A=H.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",{metadata:{designTime:true,properties:{entitySet:{type:"string",group:"Misc",defaultValue:null},config:{type:"object",group:"Misc",defaultValue:null},persistencyKey:{type:"string",group:"Misc",defaultValue:null},lazyLoadVisualFilter:{type:"boolean",group:"Misc",defaultValue:false},displayCurrency:{type:"string",group:"Misc",defaultValue:null},smartFilterId:{type:"string",group:"Misc",defaultValue:null}},associations:{smartVariant:{type:"sap.ui.core.Control",multiple:false}},events:{filterChange:{},Initialized:{},onFilterItemAdded:{}}},renderer:{}});A.prototype.init=function(){if(H.prototype.init){H.prototype.init.apply(this,arguments);}var i=jQuery(document.body).hasClass("sapUiSizeCozy");this._cellItemHeightNorth=i?"3rem":"2rem";this._cellItemHeightSouth=i?"9.9rem":"7.5rem";q.system.phone?this._cellItemHeightSouth="9rem":"";this._cellHeight=i?"12rem":"11rem";this._cellWidth="20rem";this.labelHeight=2.0;this.compHeight=i?9.9:7.9;this.cellHeightPadding=1;this.cellHeight=(this.labelHeight+this.compHeight+this.cellHeightPadding)+"rem";this.cellWidth=320;this._dialogFilters={};this._compactFilters={};this._oVariantConfig={};this._smartFilterContext;this._oMetadataAnalyser;this.setModel(new J(),'_visualFilterConfigModel');if(i){if(q.system.phone){this.setOrientation("Vertical");this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBarCozyPhone");}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBarCozy");}}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterBar");}};A.prototype.propagateProperties=function(){H.prototype.propagateProperties.apply(this,arguments);this._initMetadata();};A.prototype._initMetadata=function(){if(!this.bIsInitialised){O.handleModelInit(this,this._onMetadataInit);}};A.prototype._onMetadataInit=function(){if(this._smartFilterContext.isInitialised()){this._initiateVisualFilterLoad();}else{this._smartFilterContext.attachInitialized(this._initiateVisualFilterLoad,this);}};A.prototype._initiateVisualFilterLoad=function(){if(this.bIsInitialised){return;}this._annoProvider=this._createVisualFilterProvider();if(!this._annoProvider){return;}this._oMetadataAnalyser=this._annoProvider.getMetadataAnalyser();this.bIsInitialised=true;this._updateFilterBar();};A.prototype._createVisualFilterProvider=function(){var e=this.getModel();var i=this.getEntitySet();if(!e||!i){return null;}return new a(this);};A.prototype._getBasicGroupTitle=function(){return this.getModel("i18n").getResourceBundle().getText("VIS_FILTER_GRP_BASIC_TITLE");};A.prototype._getFieldGroupForProperty=function(e,i){return this._annoProvider?this._annoProvider._getFieldGroupForProperty(e,i):undefined;};A.prototype._getGroupList=function(){return this._annoProvider?this._annoProvider.getGroupList():[];};A.prototype._getGroupMap=function(){return this._annoProvider?this._annoProvider.getGroupMap():{};};A.prototype._getMeasureMap=function(){return this._annoProvider?this._annoProvider.getMeasureMap():{};};A.prototype._getDimensionMap=function(){return this._annoProvider?this._annoProvider.getDimensionMap():{};};A.prototype.setSmartFilterContext=function(e){this._smartFilterContext=e;};A.prototype._updateFilterBar=function(){var e=this._getAnnotationSettings();if(e&&e.filterList){var i=this._convertSettingsToConfig(e);}else{i={filterCompList:[]};this.getModel('_visualFilterConfigModel').setData(i);return;}var j=this._getVariantConfig();if(j&&j.config){i.filterCompList.forEach(function(E){if(j.config[E.component.properties.parentProperty]){jQuery.extend(true,E,j.config[E.component.properties.parentProperty]);}});this._oVariantConfig=i;}this.unbindAggregation('content',true);this.getModel('_visualFilterConfigModel').setData(i);this.bindAggregation('content',{path:"_visualFilterConfigModel>/filterCompList",factory:function(E,G){var K=G.getProperty('component'),N=K?K.properties:undefined,Q=this._resolveChartType(K?K.type:undefined);return this._createHeaderItems(G.sPath,Q,N);}.bind(this),filters:new F("shownInFilterBar",p.EQ,true)});this.attachBrowserEvent("keyup",c.onKeyUpVisualFilter.bind(c));this.fireInitialized();};A.prototype._createHeaderItems=function(j,E,G){var K=this._createFilterItemOfType(E,G,true);K.data("isDialogFilterItem","false");var N=G.selectFilters&&G.selectFilters.SelectOptions,Q=K.getInParameters(),R=[],U=this;if(Q&&Q.length>0){Q.forEach(function(e){R.push({path:'_filter>/'+e.localDataProperty});});}K.addCustomData(new C({key:'sPath',value:j}));if(G.stringdate){K.addCustomData(new C({key:'stringdate',value:G.stringdate}));}if(U.getEntitySet()===K.getEntitySet()){var W=U._smartFilterContext.determineMandatoryFilterItems();if(W&&W.length>0){W.forEach(function(e){if(!e.data("isCustomField")){R.push({path:'_filter>/'+e.getName()});}});}}K.bindProperty('dimensionFilter',{path:'_filter>/'+K.getParentProperty(),type:new z()});K.bindProperty('measureField',{path:'_visualFilterConfigModel>'+j+'/component/properties/measureField'});K.bindProperty('sortOrder',{path:'_visualFilterConfigModel>'+j+'/component/properties/sortOrder'});K.bindProperty('unitField',{path:'_visualFilterConfigModel>'+j+'/component/properties/measureField',formatter:function(){var e=U._getMeasureMap();var e1=e[this.getEntitySet()][this.getMeasureField()];return e1?e1.fieldInfo.unit:"";}});if(R&&R.length>0){K.bindProperty('dimensionFilterExternal',{parts:R,formatter:function(){var Q=this.getInParameters()||[];var e1=this.getParentProperty();var f1,g1;if(U.getEntitySet()===this.getEntitySet()){var W=U._smartFilterContext.determineMandatoryFilterItems();W.forEach(function(v1){var w1=v1.getName();var x1=Q&&Q.some(function(e){return e.localDataProperty===w1;});if(w1.indexOf("$Parameter")===-1&&!x1){Q.push({localDataProperty:w1,valueListProperty:w1});}});}if(!(U.getEntitySet()===this.getEntitySet()&&U._smartFilterContext.getAnalyticBindingPath()!=="")&&(U._smartFilterContext.getAnalyticBindingPath()===""||U._smartFilterContext.getAnalyticBindingPath().indexOf("P_DisplayCurrency")!=-1)){var h1=this.getMeasureField();var i1=U.getModel();var j1=i1.getMetaModel();var k1=j1.getODataEntityType(U._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet()));var l1=j1.getODataEntitySet(this.getEntitySet());var m1=j1.getODataProperty(k1,h1);var n1=U.getProperty("displayCurrency");var o1=m1&&m1[d.ISOCurrency];if(n1&&o1){var p1=o1.Path;for(var q1=(Q.length-1);q1>-1;q1--){var r1=Q[q1].valueListProperty;var s1=Q[q1].localDataProperty;if(r1===p1){var t1=U._smartFilterContext.getFilterData();if(!t1[s1]){g1=j1.getODataProperty(k1,p1);var u1=g1&&c.isPropertyNonFilterable(l1,g1.name);if(!u1){f1=new F({aFilters:[new F({path:p1,operator:"EQ",value1:n1,value2:undefined})],and:false});}}break;}}}}if(this._chart instanceof sap.suite.ui.microchart.InteractiveDonutChart){this._inParameterFilterList=new F({aFilters:[],bAnd:true});}return U._getFiltersForFilterItem(Q,e1,f1,p1,N,this._inParameterFilterList);}});}else if(N&&N.length>0){var X=new F({aFilters:[],bAnd:true});for(var i in N){var Y=N[i];X=this.fnAddSelectOptionsToFilters(Y,X);}K.setProperty('dimensionFilterExternal',X);}if(K.attachFilterChange){K.attachFilterChange(this._onFilterChange,this);}if(K.attachTitleChange){K.attachTitleChange(this._onTitleChange,this);}var Z=this._createTitleToolbar(G,K),$=new f({height:this._cellItemHeightNorth,items:[Z]});var _=new f({width:"100%",height:this._cellItemHeightSouth,items:[new n({width:this.cellWidth+"px",textAlign:s.TextAlign.Center,text:{path:'_visualFilterConfigModel>'+j+'/overlayMessage',formatter:function(e){return e&&this.getModel("i18n").getResourceBundle().getText(e);}}})],visible:{path:'_visualFilterConfigModel>'+j+'/showChartOverlay',formatter:function(e){return e;}}});_.addStyleClass("sapUiOverlay");_.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflow");_.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflowCozy");var a1=new f({height:this._cellItemHeightSouth,items:[K],visible:{path:"_visualFilterConfigModel>"+j+"/showChartOverlay",formatter:function(e){return!e;}}});var b1="visualFilterBarInvisibleText"+K.getParentProperty();var c1=new I({id:b1});if(this.getAriaLabelledBy().indexOf(b1)===-1){this.addAriaLabelledBy(b1);}var d1=new f({id:v.getStableId({type:"VisualFilter",subType:"VBox",sContainerType:"VisualFilterBar",sParentProperty:K.getParentProperty()}),fieldGroupIds:["headerBar"],height:this._cellHeight,width:(this.cellWidth+16)+"px",items:[$,_,a1,c1]});$.addStyleClass("sapSmartTemplatesAnalyticalListPageVFTitle");_.addStyleClass("sapSmartTemplatesAnalyticalListPageVFChart");a1.addStyleClass("sapSmartTemplatesAnalyticalListPageVFChart");this.fireOnFilterItemAdded(K);return d1;};A.prototype.fnAddSelectOptionsToFilters=function(e,i){var j=new F({aFilters:[],bAnd:false});var E=this,G=e.PropertyName&&e.PropertyName.PropertyPath;e.Ranges.forEach(function(R){var K=R.Low&&R.Low.String,N=R.Sign&&R.Sign.EnumMember&&R.Sign.EnumMember.split("/")[1],Q=R.Option&&R.Option.EnumMember&&R.Option.EnumMember.split("/")[1],U=R.High&&R.High.String;var W=E._getSelectOptionFilters(G,K,U,Q,N);j.aFilters.push(W);});i.aFilters.push(j);return i;};A.prototype._getAnnotationSettings=function(){return this._annoProvider?this._annoProvider.getVisualFilterConfig():null;};A.prototype._convertSettingsToConfig=function(e,E){var G={filterCompList:[]};var K=this._getGroupList();var N={};for(var i=0;i<K.length;i++){var Q=K[i];for(var j=0;j<Q.fieldList.length;j++){var R=Q.fieldList[j];N[R.name]={name:Q.name,label:Q.label};}}var U=this._getGroupMap();var W=U["_BASIC"];var X=[];if(W&&W.fieldList){for(var i=0;i<W.fieldList.length;i++){X.push(W.fieldList[i].name);}}var Y=this._getMeasureMap(),Z=e.filterList,$={};for(var i=0;i<Z.length;i++){var _=Z[i];var a1=_.dimension.field;var b1=Y[_.collectionPath][_.measure.field];var c1=false;if(b1.fieldInfo[d.ISOCurrency]){c1=true;}var d1={shownInFilterBar:_.selected,component:{type:_.type,properties:{sortOrder:_.sortOrder,measureField:_.measure.field,parentProperty:_.parentProperty?_.parentProperty:undefined,stringdate:_.stringdate}}};if(!E){var e1={shownInFilterDialog:_.selected||X.indexOf(a1)!=-1,group:N[_.parentProperty],component:{properties:{selectFilters:_.selectionVariant?_.selectionVariant:undefined,scaleFactor:_.scaleFactor,numberOfFractionalDigits:_.numberOfFractionalDigits,filterRestriction:_.filterRestriction,lazyLoadVisualFilter:this.getLazyLoadVisualFilter(),width:this.cellWidth+"px",height:this.compHeight+"rem",entitySet:_.collectionPath?_.collectionPath:this.getEntitySet(),dimensionField:a1,dimensionFieldDisplay:_.dimension.fieldDisplay,dimensionFilter:_.dimensionFilter,unitField:b1?b1.fieldInfo.unit:"",isCurrency:c1,isDropDown:_.isDropDown,isMandatory:_.isMandatory,outParameter:_.outParameter?_.outParameter:undefined,inParameters:_.inParameters?_.inParameters:undefined,textArrangement:_.displayBehaviour,chartQualifier:_.chartQualifier?_.chartQualifier:undefined,dimensionFieldIsDateTime:_.dimensionFieldIsDateTime,dimensionFieldIsDateTimeOffset:_.dimensionFieldIsDateTimeOffset}}};jQuery.extend(true,d1,e1);G.filterCompList.push(d1);}else{$[_.parentProperty]=d1;}}return E?$:G;};A.prototype._setVariantModified=function(){if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(true);}};A.prototype._checkMandatoryFilters=function(){var e=this._smartFilterContext.getFilterData();var j=this._smartFilterContext.determineMandatoryFilterItems();var E=false;for(var i=0;i<j.length;i++){if(e[j[i].getName()]===undefined){if(e._CUSTOM["sap.suite.ui.generic.template.customData"][j[i].getName()]===undefined){E=true;break;}}}if(E){this._smartFilterContext.showFilterDialog();}};A.prototype._onFilterChange=function(e){this._setVariantModified();this.fireFilterChange();this._checkMandatoryFilters();};A.prototype._getFiltersForFilterItem=function(e,j,E,G,K,N){var Q={},R=[],U=[],W=new F({aFilters:[],bAnd:true});if(e&&e.length>0){var X=function(d1){d1.sPath=$;};for(var Y=(e.length-1);Y>-1;Y--){var Z=e[Y].localDataProperty,$=e[Y].valueListProperty;if(K){for(var i=0;i<K.length;i++){var _=K[i];var a1=_.PropertyName&&_.PropertyName.PropertyPath;if(U.indexOf(a1)===-1){if(a1===j){W=this.fnAddSelectOptionsToFilters(_,W);U.push(a1);}else{var b1=this._smartFilterContext.determineFilterItemByName(a1);if(b1&&(b1.getVisibleInFilterBar()||b1.getPartOfCurrentVariant())){var c1=this._smartFilterContext.getFilters([a1]);if((c1&&c1.length)||(R.indexOf(a1)!==-1)){continue;}else{W=this.fnAddSelectOptionsToFilters(_,W);U.push(a1);}}else{W=this.fnAddSelectOptionsToFilters(_,W);U.push(a1);}}}}}if(Z!==j&&R.indexOf(Z)===-1){var b1=this._smartFilterContext.determineFilterItemByName(Z);if(b1&&(b1.getVisibleInFilterBar()||b1.getPartOfCurrentVariant())){Q=this._smartFilterContext.getFilters([Z]);if(Q&&Q.length>0){if(Q[0].aFilters){Q[0].aFilters.forEach(X.bind(this));}else{X(Q[0]);}R.push(Z);W.aFilters.push(Q[0]);if(N){N.aFilters.push(Q[0]);}}}}}if(E){W.aFilters.push(E);}}else{if(K&&K.length){for(var i=0;i<K.length;i++){var _=K[i];W=this.fnAddSelectOptionsToFilters(_,W);}}}return W;};A.prototype._getSelectOptionFilters=function(e,i,j,E,G){if(G==="E"){if(E!==p.EQ){L.error("Exclude sign is supported only with EQ operator");return;}else{E=p.NE;G="I";}}if(E==="CP"){E=p.Contains;if(i.indexOf("*")!==-1){var K=i.indexOf('*');var N=i.lastIndexOf('*');if(K>-1){if((K===0)&&(N!==(i.length-1))){E=p.EndsWith;i=i.substring(1,i.length);}else if((K!==0)&&(N===(i.length-1))){E=p.StartsWith;i=i.substring(0,i.length-1);}else{i=i.substring(1,i.length-1);}}}}var Q=new F({path:e,sign:G,operator:E,value1:i,value2:j});return Q;};A.prototype._createTitleToolbar=function(e,i){var j=this.getModel("@i18n");var E=i.getTitle(j);var G=new g({text:E.titleMD,titleStyle:s.TitleLevel.H6});if(i.getProperty("isMandatory")){G.addStyleClass("sapMLabelRequired");}var K=new g({text:E.titleUnitCurr.length>1?"| "+E.titleUnitCurr:"",titleStyle:s.TitleLevel.H6,width:"4.15rem"});G.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleText");K.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleText");var N=this._smartFilterContext.getControlByKey(e.parentProperty);this._smartFilterContext.ensureLoadedValueHelp(e.parentProperty);if(N){var Q=c.getPropertyNameDisplay(this.getModel(),i.getEntitySet(),i.getDimensionField(),j),R=this.getModel("i18n").getResourceBundle(),U=N.getShowValueHelp&&N.getShowValueHelp()&&!e.dimensionFieldIsDateTimeOffset,W=N.getMetadata().getName()==="sap.m.DateTimePicker",X=N instanceof u,Y=(X&&!W)?"sap-icon://appointment-2":"",Z=(e.isDropDown)?"sap-icon://slim-arrow-down":"",$=U?"sap-icon://value-help":Y||Z,_,a1=new B({id:v.getStableId({type:"VisualFilter",subType:"F4Button",sContainerType:"VisualFilterBar",sParentProperty:i.getParentProperty()}),text:{path:"_filter>/"+i.getParentProperty(),formatter:function(c1){var d1=i.getFilterRestriction();_=0;if(c1){if(d1==='single'){_=1;}else{if(typeof c1==="object"){if(c1.value){_++;}if(c1.items&&c1.items.length){_+=c1.items.length;}if(c1.ranges&&c1.ranges.length){_+=c1.ranges.length;}}else{_++;}}}return _?"("+_+")":"";}},icon:(U||e.isDropDown||X)?$:"",customData:[new C({key:'isF4Enabled',value:(U||e.isDropDown||X)?true:false})],visible:{path:"_filter>/"+i.getParentProperty(),formatter:function(c1){if(U||e.isDropDown||(X&&!W)){return true;}else{if(!c1){return false;}if(typeof c1==="object"){if(c1 instanceof Date){return true;}return(c1.value||(c1.items&&c1.items.length)||(c1.ranges&&c1.ranges.length))?true:false;}return true;}}},enabled:{path:'_visualFilterConfigModel>'+i.data("sPath")+'/showChartOverlay',formatter:function(c1){return!c1;}},press:function(c1){if(U){if(N.getParent().getParent()===null){this._smartFilterContext.addAggregation('dependents',N.getParent());}N.fireValueHelpRequest.call(N);}else if(e.isDropDown){var d1=this._isDimensionFieldFilterable(this.getModel(),e.entitySet,e.dimensionField),e1=this.getModel("visualFilter")||this.getModel();D.createDropdown(c1.getSource(),i,e1,Q,e,d1);}else if(X&&!W){h._createDatePicker(c1.getSource(),i);}else{V.launchAllFiltersPopup(a1,i,c1.getSource().getModel('i18n'));}}.bind(this),layoutData:new o({priority:t.OverflowToolbarPriority.NeverOverflow}),tooltip:{path:"_filter>/"+i.getParentProperty(),formatter:function(){return c.getTooltipForValueHelp(U,Q,R,_,X);}}});}var b1=new b({design:t.ToolbarDesign.Transparent,width:this.cellWidth+"px",content:[G,K,new T(),a1]});b1.addStyleClass("sapSmartTemplatesAnalyticalListPageVisualFilterTitleToolbar");return b1;};A.prototype._isDimensionFieldFilterable=function(e,E,i){var j=e.getMetaModel(),G=j.getODataEntitySet(E),K=j.getODataEntityType(G.entityType),N=j.getODataProperty(K,i);return(N["sap:filterable"]===undefined)?true:N["sap:filterable"];};A.prototype.getTitleByFilterItemConfig=function(e,i,j){var E=e.component.properties;var G=E.entitySet;var K=this.getModel();var N=this.getModel("@i18n");if(!K){return"";}var Q=c.getPropertyNameDisplay(K,G,E.measureField,N);var R=c.getPropertyNameDisplay(K,G,E.dimensionField,N);if(!i){i="";}if(!j){j="";}var U=this.getModel("i18n").getResourceBundle();var W=U.getText("VIS_FILTER_TITLE_MD",[Q,R]);var X=j+" "+i;X=X.trim();var Y={titleMD:W,titleUnitCurr:X};return Y;};A.prototype._updateVisualFilterAria=function(e,i,j){var E=e.getItems();var R=this.getModel("i18n").getResourceBundle();var G=R.getText("VIS_FILTER_ITEM_ARIA");var K=i.getParentProperty();if(i.getProperty("isMandatory")){G+=" "+R.getText("VIS_FILTER_MANDATORY_PROPERTY_ARIA",K);}var N=E[0].getItems()[0].getContent()[0];var Q=E[0].getItems()[0].getContent()[1];G+=" "+(Q.getText().length>0?N.getText()+Q.getText():N.getText());if(j==="true"){G+=" "+E[1].getItems()[0].getText();G+=" "+R.getText("VIS_FILTER_BAR_NAVIGATE_ARIA");}else{G+=" "+R.getText("VIS_FILTER_BAR_NAVIGATE_ARIA")+" "+R.getText("VIS_FILTER_ACCESS_FIELDS_ARIA");}E[E.length-1].setText(G);};A.prototype._onTitleChange=function(e){var i=e.getSource().getParent().getParent();var j=i.getItems()[i.getItems().length-2].getItems()[0];if(j.data("sOverlay")!=="true"){var E=i.getItems()[0].getItems()[0].getContent()[0];var G=i.getItems()[0].getItems()[0].getContent()[1];var K=this.getModel("i18n");var N=this.getModel("@i18n");if(!K){return"";}var Q=K.getResourceBundle();if(e.getSource().getProperty("isMandatory")){E.addStyleClass("sapMLabelRequired");}var R=e.getSource().getTitle(N);E.setText(R.titleMD);var U=R.titleUnitCurr==""?R.titleMD:Q.getText("VIS_FILTER_TITLE_MD_WITH_UNIT_CURR",[R.titleMD,R.titleUnitCurr]);E.setTooltip(U);G.setText(R.titleUnitCurr.length>0?"| "+R.titleUnitCurr:"");G.setTooltip("");var W=R.titleUnitCurr.split(" ");if(R.titleUnitCurr==""){G.setVisible(false);}else{G.setVisible(true);var X=W.length>1?"4.15rem":"2.4rem";G.setWidth(X);}}this._updateVisualFilterAria(i,j,j.data("sOverlay"));};A.prototype._getSupportedFilterItemList=function(){if(!this._supportedFilterItemList){this._supportedFilterItemList=[{type:"Bar",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroBar",iconLink:"sap-icon://horizontal-bar-chart",textKey:"VISUAL_FILTER_CHART_TYPE_BAR"},{type:"Donut",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroDonut",iconLink:"sap-icon://donut-chart",textKey:"VISUAL_FILTER_CHART_TYPE_Donut"},{type:"Line",className:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.FilterItemMicroLine",iconLink:"sap-icon://line-charts",textKey:"VISUAL_FILTER_CHART_TYPE_Line"}];}return this._supportedFilterItemList;};A.prototype._getSupportedFilterItemMap=function(){if(!this._supportedFilterItemMap){this._supportedFilterItemMap={};var e=this._getSupportedFilterItemList();for(var i=0;i<e.length;i++){var j=e[i];this._supportedFilterItemMap[j.type]=j;}}return this._supportedFilterItemMap;};A.prototype._resolveChartType=function(e){var i=this._getSupportedFilterItemMap();var j=i[e];if(!j){var E;for(E in i){j=i[E];break;}L.error("Could not resolve the filter component type: \""+e+"\", falling back to "+E);e=E;}return e;};A.prototype._createFilterItemOfType=function(e,i,j){var E;var G=v.getStableId({type:"VisualFilter",subType:"FilterItemMicroChart",sContainerType:(j?"VisualFilterBar":"VisualFilterDialog"),sParentProperty:i.parentProperty});if(e===y){E=new k(G,i);}else if(e===x){E=new l(G,i);}else if(e===w){E=new m(G,i);}E.setSmartFilterId(this.getSmartFilterId());E.setModel(this.getModel('i18n'),'i18n');E.setModel(this.getModel("_templPriv"),"_templPriv");if(!this._smartFilterContext.isDialogOpen()){E.setModel(this.getModel('_filter'),'_filter');E.setModel(this.getModel('_visualFilterConfigModel'),"_visualFilterConfigModel");}E.setModel(this.getModel());var K=this.getModel("visualFilter");if(K){E.setModel(K,"visualFilter");}return E;};A.prototype.getConfig=function(e){var j=this.getModel('_visualFilterConfigModel').getData(),E={};if(!j){return{filterCompList:[]};}var G=0;var K=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<j.filterCompList.length;i++){var N=j.filterCompList[i];if(e){E[N.component.properties.parentProperty]={shownInFilterBar:N.shownInFilterBar,shownInFilterDialog:N.shownInFilterDialog,component:{type:N.component.type,properties:{measureField:N.component.properties.measureField,sortOrder:N.component.properties.sortOrder,parentProperty:N.component.properties.parentProperty}}};}else{if(!N.shownInFilterBar){continue;}var Q=K[G];if(!Q){L.error("The configured selected filter bar items do not correspond to the actual filter bar items.  Could be an error during initialization, e.g. a chart class not found");return{filterCompList:[]};}G++;if(Q._chart){var R=Q;N.component.properties=R.getP13NConfig();}}}return e?E:j;};A.prototype.setSmartVariant=function(e){this.setAssociation("smartVariant",e);if(e){var i=new P({type:"sap.suite.ui.generic.template.AnalyticalListPage.control.visualfilterbar.SmartVisualFilterBar",keyName:"persistencyKey"});i.setControl(this);}this._oVariantManagement=this._getVariantManagementControl(e);if(this._oVariantManagement){this._oVariantManagement.addPersonalizableControl(i);this._oVariantManagement.initialise(this._variantInitialised,this);this._oVariantManagement.attachSave(this._onVariantSave,this);}else if(e){if(typeof e==="string"){L.error("Variant with id="+e+" cannot be found");}else if(e instanceof sap.ui.core.Control){L.error("Variant with id="+e.getId()+" cannot be found");}}else{L.error("Missing SmartVariant");}};A.prototype._getVariantManagementControl=function(e){var i=null;if(e){i=typeof e=="string"?sap.ui.getCore().byId(e):e;if(i&&!(i instanceof S)){L.error("Control with the id="+e.getId?e.getId():e+" not of expected type");return null;}}return i;};A.prototype._variantInitialised=function(){if(!this._oCurrentVariant){this._oCurrentVariant="STANDARD";}};A.prototype._onVariantSave=function(){if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant={config:this.getConfig(true)};}};A.prototype.applyVariant=function(e,i){this._oCurrentVariant=e;if(this._oCurrentVariant=="STANDARD"){this._oCurrentVariant=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config&&this._oCurrentVariant.config.filterCompList){this._oCurrentVariant.config=null;}if(this._oCurrentVariant&&this._oCurrentVariant.config==null){var j=this._getAnnotationSettings();if(j&&j.filterList){this._oCurrentVariant.config=this._convertSettingsToConfig(j,true);}}this._updateFilterBar();if(this._oVariantManagement){this._oVariantManagement.currentVariantSetModified(false);}};A.prototype._getVariantConfig=function(){return this._oCurrentVariant;};A.prototype.fetchVariant=function(){if(!this._oCurrentVariant||this._oCurrentVariant=="STANDARD"){var e=this._getAnnotationSettings();if(e&&e.filterList){this._oCurrentVariant={config:this._convertSettingsToConfig(e,true)};return this._oCurrentVariant;}else{return{config:null};}}return{config:this.getConfig(true)};};A.prototype._getStandardVariantConfig=function(){var e=this._getAnnotationSettings();var i=this._convertSettingsToConfig(e);return i;};A.prototype.updateVisualFilterBindings=function(e,U){if(U){for(var i in this.filterChartList){var j=this.filterChartList[i];if(j._chart){j._updateBinding();j._bAllowBindingUpdateOnPropertyChange=e===true;}}}else{var E=sap.ui.getCore().byFieldGroupId("headerBar");for(var i=0;i<E.length;i++){if(E[i]._chart){E[i]._updateBinding();E[i]._bAllowBindingUpdateOnPropertyChange=e===true;}}}};A.prototype.addVisualFiltersToBasicArea=function(e){var j=jQuery.extend(true,{},this.getModel('_visualFilterConfigModel').getData()),E=(e&&e.constructor===Array&&e.length)?e.length:0,G=0;if(!j){L.error("Could not add filter to basic area. No config found!");return false;}else if(!E){L.error("Improper parameter passed. Pass an array of properties.");return false;}else{for(var i=0;i<j.filterCompList.length;i++){var K=j.filterCompList[i];if(e.indexOf(c.readProperty(K.component.properties.parentProperty))!==-1&&!K.shownInFilterBar){K.shownInFilterBar=true;K.shownInFilterDialog=true;G++;}}if(G){this.getModel('_visualFilterConfigModel').setData(j);return true;}else{L.info("Filters already present in visual filter basic area");return false;}}};return A;},true);