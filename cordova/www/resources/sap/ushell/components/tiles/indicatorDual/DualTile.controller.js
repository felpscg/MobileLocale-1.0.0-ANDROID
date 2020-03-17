//Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/MessageToast","sap/ushell/components/tiles/indicatorTileUtils/cache","sap/ushell/components/tiles/utils","sap/m/library","sap/ui/core/library","sap/ui/core/format/DateFormat","sap/ui/thirdparty/jquery"],function(M,c,u,m,a,D,q){"use strict";var b=m.DeviationIndicator;var V=m.ValueColor;var F=m.FrameType;var S=m.Size;var L=m.LoadState;var d=a.mvc.ViewType;sap.ui.controller("sap.ushell.components.tiles.indicatorDual.DualTile",{getRelativeTime:function(){var e=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();this.cacheTime=(q.type(this.cacheTime)==="date")?this.cacheTime:new Date(parseInt(this.cacheTime.substr(6),10));var r=sap.ushell.components.tiles.indicatorTileUtils.util.getTimeDifference(e-this.cacheTime),f,o;switch(r.unit){case"minutes":o=sap.ushell.components.tiles.indicatorTileUtils.util.getMillisecond(r.time,"minutes");e=e-o;f=new Date(e);break;case"hours":o=sap.ushell.components.tiles.indicatorTileUtils.util.getMillisecond(r.time,"hours");e=e-o;f=new Date(e);break;case"days":o=sap.ushell.components.tiles.indicatorTileUtils.util.getMillisecond(r.time,"days");e=e-o;f=new Date(e);break;}return f;},getTile:function(){return this.oKpiTileView.oGenericTile;},setTimeStamp:function(){this.updateTimeStampjobScheduled=false;var f=D.getDateTimeInstance({relative:true,relativeSource:"auto"});var t=f.format(this.getRelativeTime());var l=this.getView().oGenericTile.getTileContent()[0];if(l){if(l.setRefreshOption){l.setRefreshOption(true);}if(l.setTimestamp){l.setTimestamp(t);}}this.updateTimeStampjobScheduled=false;var k=this.oConfig.TILE_PROPERTIES.id+"time";var r=sap.ushell.components.tiles.indicatorTileUtils.util.getScheduledJob(k);if(r){clearTimeout(r);r=undefined;}sap.ushell.components.tiles.indicatorTileUtils.util.scheduleTimeStampJob.call(this,this.oTileApi.visible.isVisible());},getLocalCache:function(c){var l={};l.ChipId=c.ChipId;l.Data=c.Data;l.CacheMaxAge=c.CacheMaxAgeUnit;l.CacheMaxAgeUnit=c.CacheMaxAgeUnit;l.CacheType=c.CacheType;l.CachedTime=sap.ushell.components.tiles.indicatorTileUtils.util.getUTCDate();return l;},refreshPress:function(){this.initProcess(true);},_getView:function(v,e,r){var f=this.oKpiTileView.getViewData();var g=sap.ui.view({type:d.JS,viewName:v,viewData:q.extend(true,{},f,{parentController:this},{deferredObj:e},{refresh:r})});return g;},logError:function(){this._updateTileModel({value:"",scale:"",unit:""});if(this.getView().getViewData().deferredObj){this.getView().getViewData().deferredObj.reject();}},doProcess:function(r){sap.ushell.components.tiles.indicatorTileUtils.util.setUnsetCallInProgress(this.oKpiTileView.oConfig.TILE_PROPERTIES.id+"defferedLeft",this.deferred_left);sap.ushell.components.tiles.indicatorTileUtils.util.setUnsetCallInProgress(this.oKpiTileView.oConfig.TILE_PROPERTIES.id+"defferedRight",this.deferred_right);var t=this;this.getView().oGenericTile.removeAllTileContent();var s=this.getView().oGenericTile;this.system=this.oTileApi.url.getApplicationSystem();this.oKpiTileView.oGenericTile.setState(L.Loading);var f=t.tileType.split("-")[1];try{var v;v="sap.ushell.components.tiles.indicatornumeric.NumericTile";this.leftView=t._getView(v,this.deferred_left,r);this.leftView.getController().dataCallInProgress=false;s.addTileContent(this.leftView.oGenericTile.getTileContent()[0]);switch(f){case"CM":v="sap.ushell.components.tiles.indicatorcomparison.ComparisonTile";this.rightView=t._getView(v,this.deferred_right,r);this.rightView.getController().dataCallInProgress=false;s.addTileContent(this.rightView.oGenericTile.getTileContent()[0]);break;case"CT":v="sap.ushell.components.tiles.indicatorcontribution.ContributionTile";this.rightView=t._getView(v,this.deferred_right,r);this.rightView.getController().dataCallInProgress=false;s.addTileContent(this.rightView.oGenericTile.getTileContent()[0]);break;case"AT":v="sap.ushell.components.tiles.indicatordeviation.DeviationTile";this.rightView=t._getView(v,this.deferred_right,r);this.rightView.getController().dataCallInProgress=false;s.addTileContent(this.rightView.oGenericTile.getTileContent()[0]);break;case"TT":v="sap.ushell.components.tiles.indicatorArea.AreaChartTile";this.rightView=t._getView(v,this.deferred_right,r);this.rightView.getController().dataCallInProgress=false;s.addTileContent(this.rightView.oGenericTile.getTileContent()[0]);break;}this.leftView.getController().onAfterTileRendering();this.rightView.getController().onAfterTileRendering();var l=this.getView().oGenericTile.getTileContent()[0];if(l&&l.attachRefresh){l.attachRefresh(q.proxy(this.refreshPress,t));}}catch(e){this.logError(e);}},_updateTileModel:function(n){var e=this.getTile().getModel().getData();q.extend(e,n);this.getTile().getModel().setData(e);},setTextInTile:function(){var t=this;var e=sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.oTileApi);this._updateTileModel({header:e.title||sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(t.oConfig),subheader:e.subTitle||sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(t.oConfig)});},doDummyProcess:function(){var t=this;try{t.setTextInTile();switch(t.tileType){case"DT-CM":t._updateTileModel({value:1,size:S.Auto,frameType:F.TwoByOne,state:L.Loading,valueColor:V.Good,indicator:b.None,title:"Liquidity Structure",footer:"Current Quarter",description:"Apr 1st 2013 (B$)",data:[{title:"Measure 1",value:1,color:"Good"},{title:"Measure 2",value:2,color:"Good"},{title:"Measure 3",value:3,color:"Good"}]});break;case"DT-AT":t._updateTileModel({valueColor:"Good",value:100,frameType:F.TwoByOne,unit:"USD",actual:{value:120,color:V.Good},targetValue:100,thresholds:[{value:0,color:V.Error},{value:50,color:V.Critical},{value:150,color:V.Critical},{value:200,color:V.Error}],showActualValue:true,showTargetValue:true});break;case"DT-CT":t._updateTileModel({value:8888,size:S.Auto,frameType:F.TwoByOne,state:L.Loading,valueColor:V.Error,indicator:b.None,title:"US Profit Margin",footer:"Current Quarter",description:"Maximum deviation",data:[{title:"Americas",value:10,color:"Neutral",displayValue:""},{title:"EMEA",value:50,color:"Neutral",displayValue:""},{title:"APAC",value:-20,color:"Neutral",displayValue:""}]});break;case"DT-TT":this._updateTileModel({value:8888,size:S.Auto,frameType:F.TwoByOne,state:L.Loading,valueColor:V.Error,indicator:b.None,title:"Liquidity Structure",footer:"Current Quarter",description:"Apr 1st 2013 (B$)",width:"100%",height:"100%",chart:{color:"Good",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:20},{day:100,balance:80}]},target:{color:"Error",data:[{day:0,balance:0},{day:30,balance:30},{day:60,balance:40},{day:100,balance:90}]},maxThreshold:{color:"Good",data:[{day:0,balance:0},{day:30,balance:40},{day:60,balance:50},{day:100,balance:100}]},innerMaxThreshold:{color:"Error",data:[]},innerMinThreshold:{color:"Neutral",data:[]},minThreshold:{color:"Error",data:[{day:0,balance:0},{day:30,balance:20},{day:60,balance:30},{day:100,balance:70}]},minXValue:0,maxXValue:100,minYValue:0,maxYValue:100,firstXLabel:{label:"June 123",color:"Error"},lastXLabel:{label:"June 30",color:"Error"},firstYLabel:{label:"0M",color:"Good"},lastYLabel:{label:"80M",color:"Critical"},minLabel:{},maxLabel:{}});break;}}catch(e){}},visibleHandler:function(i){if(!i){if(this.leftView){this.leftView.getController().firstTimeVisible=false;}if(this.rightView){this.rightView.getController().firstTimeVisible=false;}sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.queryServiceUriODataReadRef);sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.trendChartODataReadRef);sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}if(i){if(this.leftView){this.leftView.getController().refreshHandler();}if(this.rightView){this.rightView.getController().refreshHandler();}}},initProcess:function(r){var t=this;this.oKpiTileView=this.getView();this.oResourceBundle=u.getResourceBundleModel().getResourceBundle();this.viewData={};t.viewData=this.oKpiTileView.getViewData();this.oTileApi=this.viewData.chip;if(this.oTileApi.visible){this.oTileApi.visible.attachVisible(this.visibleHandler.bind(this));}this.deferred_left=new q.Deferred();this.deferred_right=new q.Deferred();q.when(this.deferred_left,this.deferred_right).done(function(){t.setTextInTile();t.oConfig=t.oKpiTileView.oConfig;t.chipCacheTime=sap.ushell.components.tiles.indicatorTileUtils.util.getCachingTime(t.oConfig);t.chipCacheTimeUnit=sap.ushell.components.tiles.indicatorTileUtils.util.getCachingTimeUnit(t.oConfig);var l=t.leftView.getController().cacheWriteData;var e=t.rightView.getController().cacheWriteData;t.oKpiTileView.oGenericTile.setState(L.Loaded);var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oKpiTileView.oConfig,t.system);t.oKpiTileView.oGenericTile.$().wrap("<a href ='"+n+"'/>");t.oKpiTileView.oGenericTile.attachPress(function(){t.tilePressed=true;c.setKpivalueById(t.oKpiTileView.oConfig.TILE_PROPERTIES.id,null);window.location.hash=n;});var f={};var w={};w.leftData=l;w.rightData=e;f.ChipId=t.oConfig.TILE_PROPERTIES.id;f.Data=JSON.stringify(w);f.CacheMaxAge=Number(t.chipCacheTime);f.CacheMaxAgeUnit=t.chipCacheTimeUnit;f.CacheType=1;var g=t.getLocalCache(f);if(w.leftData&&w.rightData){c.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,g);}var h=c.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(t.chipCacheTime&&w.leftData&&w.rightData){sap.ushell.components.tiles.indicatorTileUtils.util.writeFrontendCacheByChipAndUserId(t.oTileApi,t.oConfig.TILE_PROPERTIES.id,f,false,function(i){if(i){c.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,i);t.cacheTime=i.CachedTime;t.setTimeStamp.call(t);}});}if(t.chipCacheTime){if(!t.cacheTime){t.cacheTime=h.CachedTime;}t.setTimeStamp.call(t);sap.ushell.components.tiles.indicatorTileUtils.util.scheduleFetchDataJob.call(t,t.oTileApi.visible.isVisible());}}).fail(function(){t.oKpiTileView.oGenericTile.setState(L.Failed);});t.tileType=t.oKpiTileView.oConfig.TILE_PROPERTIES.tileType;this.oTileApi=t.viewData.chip;if(this.oTileApi.preview.isEnabled()){this.doDummyProcess();t.oKpiTileView.oGenericTile.attachPress(function(){M.show(t.oResourceBundle.getText("sb.NavigationHelp"));});}else{this.doProcess(r);}},onAfterRendering:function(){this.initProcess();},setNoData:function(){try{this._updateTileModel({value:"",scale:"",unit:"",footerNum:this.oResourceBundle.getText("sb.noDataAvailable"),footerComp:this.oResourceBundle.getText("sb.noDataAvailable")});this.oKpiTileView.oGenericTile.setState(L.Loaded);}catch(e){}},getChipConfiguration:function(f){var t=this;try{sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(t.oTileApi.configuration.getParameterValueAsString("tileConfiguration"),t.oTileApi.preview.isEnabled(),function(g){t.oConfig=g;f.call();});}catch(e){t.logError(e.message);}}});return{};},true);
