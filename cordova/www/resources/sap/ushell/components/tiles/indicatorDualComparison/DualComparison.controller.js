// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/library","sap/ushell/components/tiles/indicatorTileUtils/cache","sap/ui/thirdparty/jquery","sap/base/Log"],function(m,c,q,L){"use strict";var S=m.Size;var D=m.DeviationIndicator;var V=m.ValueColor;var a=m.LoadState;sap.ui.controller("tiles.indicatorDualComparison.DualComparison",{getTile:function(){return this.oDualComparisonView.oGenericTile;},_updateTileModel:function(n){var b=this.getTile().getModel().getData();q.extend(b,n);this.getTile().getModel().setData(b);},setTitle:function(){var t=this;var b=sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.oChip);this._updateTileModel({header:b.title||sap.ushell.components.tiles.indicatorTileUtils.util.getChipTitle(t.oConfig),subheader:b.subTitle||sap.ushell.components.tiles.indicatorTileUtils.util.getChipSubTitle(t.oConfig)});},logError:function(e){this.oDualComparisonView.oGenericTile.setState(a.Failed);this.oDualComparisonView.oGenericTile.setState(a.Failed);sap.ushell.components.tiles.indicatorTileUtils.util.logError(e);},formSelectStatement:function(o){var t=Object.keys(o);var f="";for(var i=0;i<t.length;i++){if((o[t[i]]!==undefined)&&(o.fullyFormedMeasure)){f+=","+o[t[i]];}}return f;},setThresholdValues:function(){var t=this;try{var T={};T.fullyFormedMeasure=this.DEFINITION_DATA.EVALUATION.COLUMN_NAME;if(this.DEFINITION_DATA.EVALUATION.VALUES_SOURCE==="MEASURE"){switch(this.DEFINITION_DATA.EVALUATION.GOAL_TYPE){case"MI":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"MA":T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;case"RA":T.sWarningHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","MEASURE");T.sCriticalHigh=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","MEASURE");T.sTarget=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","MEASURE");T.sTrend=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","MEASURE");T.sWarningLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","MEASURE");T.sCriticalLow=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","MEASURE");T.fullyFormedMeasure+=t.formSelectStatement(T);break;}}else{T.criticalHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CH","FIXED");T.criticalLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"CL","FIXED");T.warningHighValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WH","FIXED");T.warningLowValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"WL","FIXED");T.targetValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TA","FIXED");T.trendValue=sap.ushell.components.tiles.indicatorTileUtils.util.getEvalValueMeasureName(t.oConfig,"TC","FIXED");}return T;}catch(e){t.logError(e);}},getTrendColor:function(t){var b=this;var d,w,f,g;try{var i=this.DEFINITION_DATA.EVALUATION.GOAL_TYPE;var r=V.Neutral;if(i==="MI"){if(t.criticalHighValue&&t.warningHighValue){d=Number(t.criticalHighValue);w=Number(t.warningHighValue);if(this.CALCULATED_KPI_VALUE<w){r=V.Good;}else if(this.CALCULATED_KPI_VALUE<=d){r=V.Critical;}else{r=V.Error;}}}else if(i==="MA"){if(t.criticalLowValue&&t.warningLowValue){f=Number(t.criticalLowValue);g=Number(t.warningLowValue);if(this.CALCULATED_KPI_VALUE<f){r=V.Error;}else if(this.CALCULATED_KPI_VALUE<=g){r=V.Critical;}else{r=V.Good;}}}else if(t.warningLowValue&&t.warningHighValue&&t.criticalLowValue&&t.criticalHighValue){d=Number(t.criticalHighValue);w=Number(t.warningHighValue);g=Number(t.warningLowValue);f=Number(t.criticalLowValue);if(this.CALCULATED_KPI_VALUE<f||this.CALCULATED_KPI_VALUE>d){r=V.Error;}else if((this.CALCULATED_KPI_VALUE>=f&&this.CALCULATED_KPI_VALUE<=g)||(this.CALCULATED_KPI_VALUE>=w&&this.CALCULATED_KPI_VALUE<=d)){r=V.Critical;}else{r=V.Good;}}return r;}catch(e){b.logError(e);}},_processDataForComparisonChart:function(d,b,u){var f=[],e={},i,t,l;var g;var T=[];var h=this;for(i=0;i<d.results.length;i++){var j=d.results[i];}T=sap.ushell.components.tiles.indicatorTileUtils.util.getAllMeasuresWithLabelText(this.oConfig.EVALUATION.ODATA_URL,this.oConfig.EVALUATION.ODATA_ENTITYSET);for(i=0,l=T.length;i<l;i++){t=T[i];e[t.key]=t.value;}var k=h.oConfig.TILE_PROPERTIES.COLUMN_NAMES||h.oConfig.EVALUATION.COLUMN_NAMES;for(i=0;i<k.length;i++){var n={};var o=k[i];n.value=Number(j[o.COLUMN_NAME]);var p=Number(j[o.COLUMN_NAME]);if(h.oConfig.EVALUATION.SCALING===-2){p*=100;}g=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(p,h.oConfig.EVALUATION.SCALING,h.oConfig.EVALUATION.DECIMAL_PRECISION);if(h.oConfig.EVALUATION.SCALING===-2){g+=" %";}n.displayValue=g.toString();if(u[i]&&j[u[i].name]){n.displayValue+=" "+j[u[i].name];}n.color=o.semanticColor;n.title=e[o.COLUMN_NAME]||o.COLUMN_NAME;f.push(n);}return f;},getTrendIndicator:function(t,v){var b=this;t=Number(t);try{var d=D.None;if(t>v){d=D.Down;}else if(t<v){d=D.Up;}return d;}catch(e){b.logError(e);}},fetchKpiValue:function(s,E){var t=this;try{var u=this.oConfig.EVALUATION.ODATA_URL,b=this.oConfig.EVALUATION.ODATA_ENTITYSET,d;if(this.oConfig.TILE_PROPERTIES.semanticMeasure){d=this.oConfig.EVALUATION.COLUMN_NAME+","+this.oConfig.TILE_PROPERTIES.semanticMeasure;}else{d=this.oConfig.EVALUATION.COLUMN_NAME;var f=d;if(this.oConfig.TILE_PROPERTIES.COLUMN_NAMES){for(var j=0;j<this.oConfig.TILE_PROPERTIES.COLUMN_NAMES.length;j++){if(this.oConfig.TILE_PROPERTIES.COLUMN_NAMES[j].COLUMN_NAME!==this.oConfig.EVALUATION.COLUMN_NAME){f=f+","+this.oConfig.TILE_PROPERTIES.COLUMN_NAMES[j].COLUMN_NAME;}}}}var g=this.oConfig.EVALUATION_VALUES;var h=c.getKpivalueById(t.oConfig.TILE_PROPERTIES.id);if(!h){var v=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(this.oConfig.EVALUATION_FILTERS,this.oConfig.ADDITIONAL_FILTERS);var o={};o["0"]=d+",asc";o["1"]=d+",desc";var k=o[this.oConfig.TILE_PROPERTIES.sortOrder||"0"].split(",");var l=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oChip.url.addSystemToServiceUrl(u),b,f,null,v,3);if(this.oConfig.TILE_PROPERTIES.semanticMeasure){l.uri+="&$orderby="+k[0]+" "+k[2];}else{l.uri+="&$orderby="+k[0]+" "+k[1];}this.writeData={};this.comparisionChartODataRef=l.model.read(l.uri,null,null,true,function(g){if(g&&g.results&&g.results.length){if(l.unit){t.writeData.unit=l.unit;}t.oConfig.TILE_PROPERTIES.FINALVALUE=g;t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,f.split(",")[0],l.unit);t.writeData.data=g;var p;for(var i=0;i<t.oConfig.TILE_PROPERTIES.FINALVALUE.length;i++){if(t.oConfig.TILE_PROPERTIES.FINALVALUE[i].title===t.DEFINITION_DATA.EVALUATION.COLUMN_NAME){t.writeData.numericData=t.oConfig.TILE_PROPERTIES.FINALVALUE[i];p=t.oConfig.TILE_PROPERTIES.FINALVALUE[i].value;t.getTrendIndicator(t.setThresholdValues().trendValue,p);t._updateTileModel({valueColor:t.oConfig.TILE_PROPERTIES.FINALVALUE[i].color,value:sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(calculatedValueForScaling),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION).toString()});break;}}c.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(g.results.length===0){t.oConfig.TILE_PROPERTIES.FINALVALUE=g;t.writeData.data=g;c.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,t.writeData);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else{E.call(t,"no Response from QueryServiceUri");}},function(i){if(i&&i.response){L.error(i.message+" : "+i.request.requestUri);E.call(t,i);}});if(!t.writeData.numericData){var n=sap.ushell.components.tiles.indicatorTileUtils.util.prepareFilterStructure(t.DEFINITION_DATA.EVALUATION_FILTERS,t.DEFINITION_DATA.ADDITIONAL_FILTERS);var Q=sap.ushell.components.tiles.indicatorTileUtils.util.prepareQueryServiceUri(t.oChip.url.addSystemToServiceUrl(u),b,d,null,n);if(Q){t.QUERY_SERVICE_MODEL=Q.model;t.queryUriForKpiValue=Q.uri;t.numericODataReadRef=t.QUERY_SERVICE_MODEL.read(Q.uri,null,null,true,function(g){if(g&&g.results&&g.results.length){if(Q.unit){t._updateTileModel({unitNumeric:g.results[0][Q.unit.name]});t.writeData.unitNumeric=Q.unit;t.writeData.unitNumeric.name=Q.unit.name;}t.writeData.numericData=g.results[0];t.DEFINITION_DATA.value=t.writeData.numericData[t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];t.writeData.numericData.color=t.getTrendColor(t.setThresholdValues());t.DEFINITION_DATA.valueColor=t.writeData.numericData.color;var i="";var p=g.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME];var r=t.getTrendIndicator(t.setThresholdValues().trendValue,p);if(t.oConfig.EVALUATION.SCALING===-2){p*=100;t.getView().oNumericContent.setFormatterValue(false);}i=sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(p),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION);if(t.oConfig.EVALUATION.SCALING===-2){t._updateTileModel({scale:"%"});}t._updateTileModel({value:i.toString(),valueColor:t.writeData.numericData.color,indicator:r});}else{E.call(t,"no Response from QueryServiceUri");}});}}}else{if(h.unit){t._updateTileModel({unit:h.data.results[0][h.unit.name]});}if(h.data&&h.data.results&&h.data.results.length){t.oConfig.TILE_PROPERTIES.FINALVALUE=h.data;t._updateTileModel({value:h.data.results[0][t.DEFINITION_DATA.EVALUATION.COLUMN_NAME]});t.oConfig.TILE_PROPERTIES.FINALVALUE=t._processDataForComparisonChart(t.oConfig.TILE_PROPERTIES.FINALVALUE,f,t.writeData.unit);s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else if(g.results.length===0){t.oConfig.TILE_PROPERTIES.FINALVALUE=h.data;s.call(t,t.oConfig.TILE_PROPERTIES.FINALVALUE);}else{E.call(t,"no Response from QueryServiceUri");}}}catch(e){E.call(t,e);}},flowWithoutDesignTimeCall:function(){var t=this;this.DEFINITION_DATA=this.oConfig;this._updateTileModel(this.DEFINITION_DATA);if(this.oChip.visible.isVisible()&&!this.firstTimeVisible){this.firstTimeVisible=true;this.fetchKpiValue(function(k){this.CALCULATED_KPI_VALUE=k;t.oDualComparisonView.oGenericTile.setFrameType("TwoByOne");t.oDualComparisonView.oGenericTile.removeAllTileContent();t.oDualComparisonView.oGenericTile.addTileContent(t.oDualComparisonView.oNumericTile);t.oDualComparisonView.oGenericTile.addTileContent(t.oDualComparisonView.oComparisonTile);var b=this.CALCULATED_KPI_VALUE;var d,e;for(var i=0;i<b.length;i++){if(b[i].title===t.DEFINITION_DATA.EVALUATION.COLUMN_NAME){e=b[i].value;d=b[i].color||"Neutral";t._updateTileModel({value:sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(e),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION).toString(),valueColor:d});break;}}if(!d&&!e){d=t.DEFINITION_DATA.valueColor;e=t.DEFINITION_DATA.value;}this._updateTileModel({value:sap.ushell.components.tiles.indicatorTileUtils.util.getLocaleFormattedValue(Number(e),t.oConfig.EVALUATION.SCALING,t.oConfig.EVALUATION.DECIMAL_PRECISION).toString(),data:this.CALCULATED_KPI_VALUE});var n=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);t.oDualComparisonView.oGenericTile.$().wrap("<a href ='"+n+"'/>");this.oDualComparisonView.oGenericTile.setState(a.Loaded);var s="";if(d==="Error"){s="sb.error";}if(d==="Neutral"){s="sb.neutral";}if(d==="Critical"){s="sb.critical";}if(d==="Good"){s="sb.good";}var T=t.setThresholdValues();var f,g,h,v,j,l,o,p,r;if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[0]){f=this.CALCULATED_KPI_VALUE[0].title;v=this.CALCULATED_KPI_VALUE[0].value;o=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[0].color);}if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[1]){g=this.CALCULATED_KPI_VALUE[1].title;j=this.CALCULATED_KPI_VALUE[1].value;p=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[1].color);}if(this.CALCULATED_KPI_VALUE&&this.CALCULATED_KPI_VALUE[2]){h=this.CALCULATED_KPI_VALUE[2].title;l=this.CALCULATED_KPI_VALUE[2].value;r=sap.ushell.components.tiles.indicatorTileUtils.util.getSemanticColorName(this.CALCULATED_KPI_VALUE[2].color);}var u={status:s,actual:e,target:T.targetValue,cH:T.criticalHighValue,wH:T.warningHighValue,wL:T.warningLowValue,cL:T.criticalLowValue};var w={m1:f,v1:v,c1:o,m2:g,v2:j,c2:p,m3:h,v3:l,c3:r};var C=t.oDualComparisonView.oGenericTile.getTileContent()[0].getContent();var x=t.oDualComparisonView.oGenericTile.getTileContent()[1].getContent();sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(C,"NT",u);sap.ushell.components.tiles.indicatorTileUtils.util.setTooltipInTile(x,"COMP",w);},this.logError);}},flowWithDesignTimeCall:function(){var t=this;try{var b=c.getEvaluationById(this.oConfig.EVALUATION.ID);if(b){t.oConfig.EVALUATION_FILTERS=b.EVALUATION_FILTERS;t.flowWithoutDesignTimeCall();}else{sap.ushell.components.tiles.indicatorTileUtils.util.getFilterFromRunTimeService(this.oConfig,function(f){t.oConfig.EVALUATION_FILTERS=f;c.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();});}}catch(e){this.logError(e);}},refreshHandler:function(C){if(!C.firstTimeVisible){if(Number(this.oChip.configuration.getParameterValueAsString("isSufficient"))){C.flowWithoutDesignTimeCall();}else{C.flowWithDesignTimeCall();}}},visibleHandler:function(i){if(!i){this.firstTimeVisible=false;sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}if(i){this.refreshHandler(this);}},onInit:function(){var t=this;this.firstTimeVisible=false;this.oDualComparisonView=this.getView();this.oChip=this.oDualComparisonView.getViewData().chip;if(this.oChip.visible){this.oChip.visible.attachVisible(this.visibleHandler.bind(this));}this.system=this.oChip.url.getApplicationSystem();this.oDualComparisonView.oGenericTile.setState(a.Loading);try{sap.ushell.components.tiles.indicatorTileUtils.util.getParsedChip(this.oChip.configuration.getParameterValueAsString("tileConfiguration"),this.oChip.preview.isEnabled(),function(b){t.oConfig=b;if(t.oChip.preview){t.oChip.preview.setTargetUrl(sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system));}if(t.oChip.preview.isEnabled()){t.setTitle();t._updateTileModel({value:1,size:S.Auto,frameType:"TwoByOne",state:a.Loading,valueColor:V.Good,indicator:D.None,title:"Liquidity Structure",footer:"Current Quarter",description:"Apr 1st 2013 (B$)",data:[{title:"Measure 1",value:1,color:"Good"},{title:"Measure 2",value:2,color:"Good"},{title:"Measure 3",value:3,color:"Good"}]});t.oDualComparisonView.oGenericTile.setState(a.Loaded);}else{t.setTitle();t.oDualComparisonView.oGenericTile.attachPress(function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(t.comparisionChartODataRef);c.setKpivalueById(t.oConfig.TILE_PROPERTIES.id,null);window.location.hash=sap.ushell.components.tiles.indicatorTileUtils.util.getNavigationTarget(t.oConfig,t.system);});if(Number(t.oChip.configuration.getParameterValueAsString("isSufficient"))){c.setEvaluationById(t.oConfig.TILE_PROPERTIES.id,t.oConfig);t.flowWithoutDesignTimeCall();}else{t.flowWithDesignTimeCall();}}});}catch(e){this.logError(e);}},onExit:function(){sap.ushell.components.tiles.indicatorTileUtils.util.abortPendingODataCalls(this.comparisionChartODataRef);}});return{};},true);