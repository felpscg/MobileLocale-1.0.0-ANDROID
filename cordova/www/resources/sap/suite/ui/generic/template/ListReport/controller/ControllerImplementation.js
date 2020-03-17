sap.ui.define(["sap/suite/ui/generic/template/ListReport/extensionAPI/ExtensionAPI","sap/suite/ui/generic/template/listTemplates/listUtils","sap/suite/ui/generic/template/ListReport/controller/IappStateHandler","sap/suite/ui/generic/template/ListReport/controller/MultipleViewsHandler","sap/suite/ui/generic/template/ListReport/controller/WorklistHandler","sap/suite/ui/generic/template/lib/ShareUtils","sap/base/Log","sap/base/util/ObjectPath"],function(E,l,I,M,W,S,L,O){"use strict";return{getMethods:function(v,t,c){var s={};s.oWorklistData={};s.oWorklistData.bWorkListEnabled=false;s.oWorklistData.bVariantDirty=true;var b=true;var f;var w=null;function a(){var C=c.getOwnerComponent();var T=t.oComponentUtils.getTemplatePrivateModel();T.setProperty("/listReport/isLeaf",C.getIsLeaf());}function o(i){c.onInitSmartFilterBarExtension(i);c.templateBaseExtension.onInitSmartFilterBar(i);s.oIappStateHandler.onSmartFilterBarInitialise();}function d(){var A=s.oIappStateHandler.parseUrlAndApplyAppState();A.then(function(){b=false;},function(i){if(i instanceof Error){i.showMessageBox();}});}function e(){if(!b){s.oIappStateHandler.changeIappState(true,false);}}function u(C){t.oCommonUtils.setEnabledToolbarButtons(C);if(!t.oCommonUtils.isSmartChart(C)){t.oCommonUtils.setEnabledFooterButtons(C);}}function g(i){var q=i.getParameters();var r=i.getSource();t.oCommonEventHandlers.onSemanticObjectLinkNavigationPressed(r,q);}function h(i){var q,r;q=i.getParameters();r=i.getSource();t.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(r,q,s,undefined,undefined);}function j(i){var q,T,C,D,r,x;q=i.getParameters().mainNavigation;r=i.getParameters();x=i.getSource();if(q){T=x.getText&&x.getText();C=t.oCommonUtils.getCustomData(i);if(C&&C["LinkDescr"]){D=C["LinkDescr"];q.setDescription(D);}}x=x.getParent().getParent().getParent().getParent();t.oCommonEventHandlers.onSemanticObjectLinkNavigationTargetObtained(x,r,s,T,q);}function k(C){var q=v.getItems();for(var i=0;i<q.length;i++){if(!C||q[i].getBindingContextPath()===C){return q[i];}}}function n(i){t.oCommonEventHandlers.onListNavigate(i,s,c.onListNavigationExtension.bind(c),undefined,true);}function m(P,i){var q=i.getSource();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){t.oCommonEventHandlers.addEntry(q,false,s.oSmartFilterbar,P);},jQuery.noop,s);}function p(i){var C=c.getOwnerComponent().getCreateWithFilters();var q=C.strategy||"extension";var P;switch(q){case"extension":P=c.getPredefinedValuesForCreateExtension(s.oSmartFilterbar);break;default:L.error(q+" is not a valid strategy to extract values from the SmartFilterBar");return;}m(P,i);}return{onInit:function(){var A=c.getOwnerComponent().getAppComponent();var i=A.getConfig();s.oWorklistData.bWorkListEnabled=!!i.pages[0].component.settings&&i.pages[0].component.settings.isWorklist;s.oSmartFilterbar=c.byId("listReportFilter");s.oSmartTable=c.byId("listReport");s.updateControlOnSelectionChange=u;f=t.oComponentUtils.getFclProxy();s.bLoadListAndFirstEntryOnStartup=f.isListAndFirstEntryLoadedOnStartup();s.oMultipleViewsHandler=new M(s,c,t);s.oWorklistHandler=new W(s,c,t);s.oIappStateHandler=new I(s,c,t);if(s.oWorklistData.bWorkListEnabled){s.oWorklistHandler.fetchAndSaveWorklistSearchField();}var T=t.oComponentUtils.getTemplatePrivateModel();T.setProperty("/generic/bDataAreShownInTable",false);T.setProperty("/listReport/isHeaderExpanded",true);T.setProperty("/listReport/deleteEnabled",false);T.setProperty("/listReport/activeObjectEnabled",false);T.setProperty("/listReport/vDraftState","0");T.setProperty("/listReport/multipleViews/msgVisibility",false);t.oServices.oApplication.registerStateChanger({isStateChange:s.oIappStateHandler.isStateChange});v.getUrlParameterInfo=s.oIappStateHandler.getUrlParameterInfo;v.getItems=function(){var q=s.oSmartTable.getTable();if(t.oCommonUtils.isUiTable(q)){return q.getRows();}return q.getItems();};v.displayNextObject=function(q){return new Promise(function(r,x){w={aWaitingObjects:q,resolve:r,reject:x};});};v.onComponentActivate=function(){if(!b){s.oIappStateHandler.parseUrlAndApplyAppState();}};v.refreshBinding=function(U,q){if(s.oIappStateHandler.areDataShownInTable()){if(s.oMultipleViewsHandler.refreshOperation(2,null,!U&&q)){return;}if(U||q[s.oSmartTable.getEntitySet()]){t.oCommonUtils.refreshModel(s.oSmartTable);t.oCommonUtils.refreshSmartTable(s.oSmartTable);}}};a();c.byId("template::FilterText").attachBrowserEvent("click",function(){c.byId("page").setHeaderExpanded(true);});},handlers:{addEntry:m.bind(null,undefined),addEntryWithFilters:p,deleteEntries:function(i){t.oCommonEventHandlers.deleteEntries(i);},updateTableTabCounts:function(){s.oMultipleViewsHandler.fnUpdateTableTabCounts();},onSelectionChange:function(i){var T=i.getSource();u(T);},onMultiSelectionChange:function(i){t.oCommonEventHandlers.onMultiSelectionChange(i);},onSmartFieldUrlPressed:function(i){t.oCommonEventHandlers.onSmartFieldUrlPressed(i,s);},onContactDetails:function(i){t.oCommonEventHandlers.onContactDetails(i);},onSmartFilterBarInitialise:o,onSmartFilterBarInitialized:d,onBeforeSFBVariantFetch:function(){s.oIappStateHandler.onBeforeSFBVariantFetch();},onAfterSFBVariantSave:function(){s.oIappStateHandler.onAfterSFBVariantSave();},onAfterSFBVariantLoad:function(i){s.oIappStateHandler.onAfterSFBVariantLoad(i);},onDataRequested:function(){s.oMultipleViewsHandler.onDataRequested();},onDataReceived:function(q){t.oCommonEventHandlers.onDataReceived(q);if(w){var r;var x=false;for(var i=0;i<w.aWaitingObjects.length&&!x;i++){r=k(w.aWaitingObjects[i]);if(r){n(r);w.resolve();x=true;}}if(!x){r=k();if(r){n(r);w.resolve();}else{w.reject();}}w=null;return;}var T=q.getSource().getTable();f.handleDataReceived(T,n);},onSmartChartDataReceived:function(){s.oMultipleViewsHandler.onDataRequested();},onBeforeRebindTable:function(i){s.oMultipleViewsHandler.aTableFilters=i.getParameters()&&i.getParameters().bindingParams&&jQuery.extend(true,{},i.getParameters().bindingParams.filters);t.oCommonEventHandlers.onBeforeRebindTable(i,{determineSortOrder:s.oMultipleViewsHandler.determineSortOrder,ensureExtensionFields:c.templateBaseExtension.ensureFieldsForSelect,addExtensionFilters:c.templateBaseExtension.addFilters});c.onBeforeRebindTableExtension(i);s.oMultipleViewsHandler.onRebindContentControl(i);l.handleErrorsOnTableOrChart(t,i);},onListNavigate:function(i){t.oCommonEventHandlers.onListNavigate(i,s,c.onListNavigationExtension.bind(c));},onCallActionFromToolBar:function(i){t.oCommonEventHandlers.onCallActionFromToolBar(i,s);},onDataFieldForIntentBasedNavigation:function(i){t.oCommonEventHandlers.onDataFieldForIntentBasedNavigation(i,s);},onDataFieldWithIntentBasedNavigation:function(i){t.oCommonEventHandlers.onDataFieldWithIntentBasedNavigation(i,s);},onBeforeSemanticObjectLinkPopoverOpens:function(i){var q=i.getParameters();t.oCommonUtils.processDataLossConfirmationIfNonDraft(function(){var r=JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant());t.oCommonUtils.semanticObjectLinkNavigation(q,r,c);},jQuery.noop,s,jQuery.noop);},onSemanticObjectLinkNavigationPressed:g,onSemanticObjectLinkNavigationTargetObtained:h,onSemanticObjectLinkNavigationTargetObtainedSmartLink:j,onDraftLinkPressed:function(i){var B=i.getSource();var q=B.getBindingContext();t.oCommonUtils.showDraftPopover(q,B);},onAssignedFiltersChanged:function(i){if(i.getSource()){c.byId("template::FilterText").setText(i.getSource().retrieveFiltersWithValuesAsText());}},onFilterChange:e,onToggleFiltersPressed:function(){var T=t.oComponentUtils.getTemplatePrivateModel();T.setProperty("/listReport/isHeaderExpanded",!T.getProperty("/listReport/isHeaderExpanded"));},onSearchButtonPressed:function(){t.oCommonUtils.refreshModel(s.oSmartTable);s.oIappStateHandler.changeIappState(false,true);},onSemanticObjectLinkPopoverLinkPressed:function(i){t.oCommonEventHandlers.onSemanticObjectLinkPopoverLinkPressed(i,s);},onAfterTableVariantSave:function(){s.oIappStateHandler.onAfterTableVariantSave();},onAfterApplyTableVariant:function(){if(!b){s.oIappStateHandler.onAfterApplyTableVariant();}},onAfterChartVariantSave:function(i){s.oIappStateHandler.onAfterTableVariantSave();},onAfterApplyChartVariant:function(i){if(!b){s.oIappStateHandler.onAfterApplyTableVariant();}},onBeforeRebindChart:function(i){s.oMultipleViewsHandler.aTableFilters=i.getParameters()&&i.getParameters().bindingParams&&jQuery.extend(true,{},i.getParameters().bindingParams.filters);var q=i.getSource();var C={setBindingPath:q.setChartBindingPath.bind(q),ensureExtensionFields:jQuery.noop,addExtensionFilters:c.templateBaseExtension.addFilters};t.oCommonUtils.onBeforeRebindTableOrChart(i,C,s.oSmartFilterbar);c.onBeforeRebindChartExtension(i);s.oMultipleViewsHandler.onRebindContentControl(i);l.handleErrorsOnTableOrChart(t,i);},onChartInitialized:function(i){s.oMultipleViewsHandler.fnRegisterToChartEvents(i);t.oCommonUtils.checkToolbarIntentsSupported(i.getSource());},onSelectionDetailsActionPress:function(i){s.oMultipleViewsHandler.onDetailsActionPress(i);},onShareListReportActionButtonPress:function(i){var F={shareEmailPressed:function(){var r=t.oCommonUtils.getText("EMAIL_HEADER",[t.oServices.oApplication.getAppTitle()]);sap.m.URLHelper.triggerEmail(null,r,document.URL);},shareJamPressed:function(){S.openJamShareDialog(t.oServices.oApplication.getAppTitle());},getDownloadUrl:function(){var T=s.oSmartTable.getTable();var r=T.getBinding("rows")||T.getBinding("items");return r&&r.getDownloadUrl()||"";},getServiceUrl:function(){var r=F.getDownloadUrl();if(r){r+="&$top=0&$inlinecount=allpages";}var x={serviceUrl:r};if(c.onSaveAsTileExtension){c.onSaveAsTileExtension(x);}return x.serviceUrl;},getModelData:function(){var G=O.get("sap.ushell.Container.getUser");var r=c.getOwnerComponent();var A=r.getAppComponent();var x=A.getMetadata();var U=x.getManifestEntry("sap.ui");var y=(U&&U.icons&&U.icons.icon)||"";var z=x.getManifestEntry("sap.app");var T=(z&&z.title)||"";return{serviceUrl:F.getServiceUrl(),icon:y,title:T,isShareInJamActive:!!G&&G().isJamActive(),customUrl:S.getCustomUrl()};}};S.openSharePopup(t.oCommonUtils,i.getSource(),F);var q=this.getView().byId("template::Share");var B=this.getView().byId("bookmarkButton");B.setBeforePressHandler(function(){q.focus();});},onInlineDataFieldForAction:function(i){t.oCommonEventHandlers.onInlineDataFieldForAction(i,s);},onInlineDataFieldForIntentBasedNavigation:function(i){t.oCommonEventHandlers.onInlineDataFieldForIntentBasedNavigation(i.getSource(),s);},onDeterminingDataFieldForAction:function(i){t.oCommonEventHandlers.onDeterminingDataFieldForAction(i,s.oSmartTable);},onDeterminingDataFieldForIntentBasedNavigation:function(i){var B=i.getSource();t.oCommonEventHandlers.onDeterminingDataFieldForIntentBasedNavigation(B,s.oSmartTable.getTable(),s);},onTableInit:function(i){var q=i.getSource();t.oCommonUtils.checkToolbarIntentsSupported(q);},onSearchWorkList:function(i){s.oWorklistHandler.performWorklistSearch(i);},onWorkListTableSettings:function(i){s.oWorklistHandler.openWorklistPersonalisation(i);},onActiveButtonPress:function(i){var P=c.byId("template::PageVariant");var T=t.oComponentUtils.getTemplatePrivateModel();var A=T.getProperty("/listReport/activeObjectEnabled");if(s.oMultipleViewsHandler.getMode()==="multi"){s.oMultipleViewsHandler.setActiveButtonState(i);}else{T.setProperty("/listReport/activeObjectEnabled",!A);}P.currentVariantSetModified(true);s.oSmartFilterbar.search();s.oIappStateHandler.changeIappState(true,true);},onStateFilterChange:function(i){var T=t.oComponentUtils.getTemplatePrivateModel();var q=i.getSource().getSelectedKey();T.setProperty("/listReport/vDraftState",q);},onMessageCloseActionPress:function(){s.oMultipleViewsHandler.onMessageCloseActionPress();}},formatters:{formatDraftType:function(D,i,H){if(D&&D.DraftUUID){if(!i){return sap.m.ObjectMarkerType.Draft;}else if(H){return D.InProcessByUser?sap.m.ObjectMarkerType.Locked:sap.m.ObjectMarkerType.Unsaved;}}return sap.m.ObjectMarkerType.Flagged;},formatDraftVisibility:function(D,i){if(D&&D.DraftUUID){if(!i){return sap.m.ObjectMarkerVisibility.TextOnly;}}return sap.m.ObjectMarkerVisibility.IconAndText;},formatDraftLineItemVisible:function(D,A,i){if(D&&D.DraftUUID){if(i==="0"&&A){return false;}return true;}return false;},formatDraftOwner:function(D,H){var i="";if(D&&D.DraftUUID&&H){var U=D.InProcessByUserDescription||D.InProcessByUser||D.LastChangedByUserDescription||D.LastChangedByUser;if(U){i=t.oCommonUtils.getText("ST_DRAFT_OWNER",[U]);}else{i=t.oCommonUtils.getText("ST_DRAFT_ANOTHER_USER");}}return i;},formatItemTextForMultipleView:function(i){return s.oMultipleViewsHandler?s.oMultipleViewsHandler.formatItemTextForMultipleView(i):"";}},extensionAPI:new E(t,c,s)};}};});
