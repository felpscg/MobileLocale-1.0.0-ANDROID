/*!
 * SAPUI5

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */
sap.ui.define(['sap/ui/core/Core','sap/ui/core/library',"sap/base/Log","sap/base/util/ObjectPath","sap/ui/thirdparty/jquery","sap/viz/libs/CssPlugin",'sap/viz/ui5/format/ChartFormatter','sap/viz/ui5/api/env/Format',"sap/ui/thirdparty/d3","sap/ui/thirdparty/jqueryui/jquery-ui-core","sap/ui/thirdparty/jqueryui/jquery-ui-widget","sap/ui/thirdparty/jqueryui/jquery-ui-mouse","sap/ui/thirdparty/jqueryui/jquery-ui-draggable","sap/ui/thirdparty/jqueryui/jquery-ui-droppable","sap/viz/libs/canvg","sap/viz/libs/rgbcolor","sap/viz/libs/sap-viz-info-framework","sap/viz/libs/sap-viz-info-charts","sap/viz/resources/chart/templates/standard_fiori/template","sap/viz/ui5/controls/libs/sap-viz-vizframe/sap-viz-vizframe","sap/viz/ui5/controls/libs/sap-viz-vizservices/sap-viz-vizservices"],function(C,l,L,O,q,a){"use strict";sap.ui.getCore().initLibrary({name:"sap.viz",dependencies:["sap.ui.core"],types:["sap.viz.ui5.types.Area_drawingEffect","sap.viz.ui5.types.Area_marker_shape","sap.viz.ui5.types.Area_mode","sap.viz.ui5.types.Area_orientation","sap.viz.ui5.types.Axis_gridline_type","sap.viz.ui5.types.Axis_label_unitFormatType","sap.viz.ui5.types.Axis_position","sap.viz.ui5.types.Axis_type","sap.viz.ui5.types.Background_direction","sap.viz.ui5.types.Background_drawingEffect","sap.viz.ui5.types.Bar_drawingEffect","sap.viz.ui5.types.Bar_orientation","sap.viz.ui5.types.Bubble_drawingEffect","sap.viz.ui5.types.Bullet_drawingEffect","sap.viz.ui5.types.Bullet_orientation","sap.viz.ui5.types.Combination_drawingEffect","sap.viz.ui5.types.Combination_orientation","sap.viz.ui5.types.Datalabel_orientation","sap.viz.ui5.types.Datalabel_outsidePosition","sap.viz.ui5.types.Datalabel_paintingMode","sap.viz.ui5.types.Datalabel_position","sap.viz.ui5.types.Legend_layout_position","sap.viz.ui5.types.Line_drawingEffect","sap.viz.ui5.types.Line_marker_shape","sap.viz.ui5.types.Line_orientation","sap.viz.ui5.types.Pie_drawingEffect","sap.viz.ui5.types.Pie_valign","sap.viz.ui5.types.Scatter_drawingEffect","sap.viz.ui5.types.StackedVerticalBar_drawingEffect","sap.viz.ui5.types.StackedVerticalBar_mode","sap.viz.ui5.types.StackedVerticalBar_orientation","sap.viz.ui5.types.Title_alignment","sap.viz.ui5.types.Tooltip_drawingEffect","sap.viz.ui5.types.VerticalBar_drawingEffect","sap.viz.ui5.types.VerticalBar_orientation","sap.viz.ui5.types.controller.Interaction_pan_orientation","sap.viz.ui5.types.controller.Interaction_selectability_mode","sap.viz.ui5.types.legend.Common_alignment","sap.viz.ui5.types.legend.Common_drawingEffect","sap.viz.ui5.types.legend.Common_position","sap.viz.ui5.types.legend.Common_type"],interfaces:[],controls:["sap.viz.ui5.VizContainer","sap.viz.ui5.controls.Popover","sap.viz.ui5.controls.VizTooltip","sap.viz.ui5.controls.VizFrame","sap.viz.ui5.controls.VizSlider","sap.viz.ui5.controls.common.BaseControl","sap.viz.ui5.core.BaseChart","sap.viz.ui5.Area","sap.viz.ui5.Area100","sap.viz.ui5.Bar","sap.viz.ui5.Bubble","sap.viz.ui5.Bullet","sap.viz.ui5.Column","sap.viz.ui5.Combination","sap.viz.ui5.Donut","sap.viz.ui5.DualBar","sap.viz.ui5.DualColumn","sap.viz.ui5.DualCombination","sap.viz.ui5.DualLine","sap.viz.ui5.DualStackedColumn","sap.viz.ui5.DualStackedColumn100","sap.viz.ui5.Heatmap","sap.viz.ui5.HorizontalArea","sap.viz.ui5.HorizontalArea100","sap.viz.ui5.Line","sap.viz.ui5.Pie","sap.viz.ui5.Scatter","sap.viz.ui5.StackedColumn","sap.viz.ui5.StackedColumn100","sap.viz.ui5.TimeBubble","sap.viz.ui5.Treemap"],elements:["sap.viz.ui5.controls.common.feeds.AnalysisObject","sap.viz.ui5.controls.common.feeds.FeedItem","sap.viz.ui5.core.BaseStructuredType","sap.viz.ui5.data.Dataset","sap.viz.ui5.data.CustomDataset","sap.viz.ui5.data.DimensionDefinition","sap.viz.ui5.data.FlattenedDataset","sap.viz.ui5.data.MeasureDefinition","sap.viz.ui5.types.Area","sap.viz.ui5.types.Area_animation","sap.viz.ui5.types.Area_hoverline","sap.viz.ui5.types.Area_marker","sap.viz.ui5.types.Area_tooltip","sap.viz.ui5.types.Axis","sap.viz.ui5.types.Axis_axisTick","sap.viz.ui5.types.Axis_axisline","sap.viz.ui5.types.Axis_gridline","sap.viz.ui5.types.Axis_indicator","sap.viz.ui5.types.Axis_label","sap.viz.ui5.types.Axis_layoutInfo","sap.viz.ui5.types.Axis_scale","sap.viz.ui5.types.Axis_title","sap.viz.ui5.types.Background","sap.viz.ui5.types.Background_border","sap.viz.ui5.types.Background_border_bottom","sap.viz.ui5.types.Background_border_left","sap.viz.ui5.types.Background_border_right","sap.viz.ui5.types.Background_border_top","sap.viz.ui5.types.Bar","sap.viz.ui5.types.Bar_animation","sap.viz.ui5.types.Bar_tooltip","sap.viz.ui5.types.Bubble","sap.viz.ui5.types.Bubble_animation","sap.viz.ui5.types.Bubble_axisTooltip","sap.viz.ui5.types.Bubble_hoverline","sap.viz.ui5.types.Bullet","sap.viz.ui5.types.Bullet_tooltip","sap.viz.ui5.types.Combination","sap.viz.ui5.types.Combination_animation","sap.viz.ui5.types.Combination_bar","sap.viz.ui5.types.Combination_dataShape","sap.viz.ui5.types.Combination_line","sap.viz.ui5.types.Combination_line_marker","sap.viz.ui5.types.Combination_tooltip","sap.viz.ui5.types.Datalabel","sap.viz.ui5.types.Datatransform","sap.viz.ui5.types.Datatransform_autoBinning","sap.viz.ui5.types.Datatransform_dataSampling","sap.viz.ui5.types.Datatransform_dataSampling_grid","sap.viz.ui5.types.Heatmap","sap.viz.ui5.types.Heatmap_animation","sap.viz.ui5.types.Heatmap_border","sap.viz.ui5.types.Heatmap_tooltip","sap.viz.ui5.types.Legend","sap.viz.ui5.types.Legend_layout","sap.viz.ui5.types.Line","sap.viz.ui5.types.Line_animation","sap.viz.ui5.types.Line_hoverline","sap.viz.ui5.types.Line_marker","sap.viz.ui5.types.Line_tooltip","sap.viz.ui5.types.Pie","sap.viz.ui5.types.Pie_animation","sap.viz.ui5.types.Pie_tooltip","sap.viz.ui5.types.RootContainer","sap.viz.ui5.types.RootContainer_layout","sap.viz.ui5.types.Scatter","sap.viz.ui5.types.Scatter_animation","sap.viz.ui5.types.Scatter_axisTooltip","sap.viz.ui5.types.Scatter_hoverline","sap.viz.ui5.types.StackedVerticalBar","sap.viz.ui5.types.StackedVerticalBar_animation","sap.viz.ui5.types.StackedVerticalBar_tooltip","sap.viz.ui5.types.Title","sap.viz.ui5.types.Title_layout","sap.viz.ui5.types.Tooltip","sap.viz.ui5.types.Tooltip_background","sap.viz.ui5.types.Tooltip_bodyDimensionLabel","sap.viz.ui5.types.Tooltip_bodyDimensionValue","sap.viz.ui5.types.Tooltip_bodyMeasureLabel","sap.viz.ui5.types.Tooltip_bodyMeasureValue","sap.viz.ui5.types.Tooltip_closeButton","sap.viz.ui5.types.Tooltip_footerLabel","sap.viz.ui5.types.Tooltip_separationLine","sap.viz.ui5.types.Treemap","sap.viz.ui5.types.Treemap_animation","sap.viz.ui5.types.Treemap_border","sap.viz.ui5.types.Treemap_tooltip","sap.viz.ui5.types.VerticalBar","sap.viz.ui5.types.VerticalBar_animation","sap.viz.ui5.types.VerticalBar_tooltip","sap.viz.ui5.types.XYContainer","sap.viz.ui5.types.controller.Interaction","sap.viz.ui5.types.controller.Interaction_pan","sap.viz.ui5.types.controller.Interaction_selectability","sap.viz.ui5.types.layout.Dock","sap.viz.ui5.types.layout.Stack","sap.viz.ui5.types.legend.Common","sap.viz.ui5.types.legend.Common_title"],version:"1.71.11"});sap.viz.ui5.types.Area_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Area_marker_shape={circle:"circle",diamond:"diamond",triangleUp:"triangleUp",triangleDown:"triangleDown",triangleLeft:"triangleLeft",triangleRight:"triangleRight",cross:"cross",intersection:"intersection"};sap.viz.ui5.types.Area_mode={comparison:"comparison",percentage:"percentage"};sap.viz.ui5.types.Area_orientation={vertical:"vertical",horizontal:"horizontal"};sap.viz.ui5.types.Axis_gridline_type={line:"line",dotted:"dotted",incised:"incised"};sap.viz.ui5.types.Axis_label_unitFormatType={MetricUnits:"MetricUnits",FinancialUnits:"FinancialUnits"};sap.viz.ui5.types.Axis_position={left:"left",right:"right",top:"top",bottom:"bottom"};sap.viz.ui5.types.Axis_type={value:"value",category:"category",timeValue:"timeValue"};sap.viz.ui5.types.Background_direction={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Background_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Bar_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Bar_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Bubble_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Bullet_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Bullet_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Combination_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Combination_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Datalabel_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Datalabel_outsidePosition={up:"up",down:"down",left:"left",right:"right"};sap.viz.ui5.types.Datalabel_paintingMode={rectCoordinate:"rectCoordinate",polarCoordinate:"polarCoordinate"};sap.viz.ui5.types.Datalabel_position={inside:"inside",outside:"outside"};sap.viz.ui5.types.Legend_layout_position={top:"top",bottom:"bottom",right:"right",left:"left"};sap.viz.ui5.types.Line_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Line_marker_shape={circle:"circle",diamond:"diamond",triangleUp:"triangleUp",triangleDown:"triangleDown",triangleLeft:"triangleLeft",triangleRight:"triangleRight",cross:"cross",intersection:"intersection"};sap.viz.ui5.types.Line_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Pie_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.Pie_valign={top:"top",center:"center"};sap.viz.ui5.types.Scatter_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.StackedVerticalBar_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.StackedVerticalBar_mode={comparison:"comparison",percentage:"percentage"};sap.viz.ui5.types.StackedVerticalBar_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.Title_alignment={left:"left",center:"center",right:"right"};sap.viz.ui5.types.Tooltip_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.VerticalBar_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.VerticalBar_orientation={horizontal:"horizontal",vertical:"vertical"};sap.viz.ui5.types.controller.Interaction_pan_orientation={horizontal:"horizontal",vertical:"vertical",both:"both"};sap.viz.ui5.types.controller.Interaction_selectability_mode={exclusive:"exclusive",inclusive:"inclusive",single:"single",multiple:"multiple",none:"none"};sap.viz.ui5.types.legend.Common_alignment={start:"start",middle:"middle",end:"end"};sap.viz.ui5.types.legend.Common_drawingEffect={normal:"normal",glossy:"glossy"};sap.viz.ui5.types.legend.Common_position={top:"top",bottom:"bottom",right:"right",left:"left"};sap.viz.ui5.types.legend.Common_type={ColorLegend:"ColorLegend",BubbleColorLegend:"BubbleColorLegend",SizeLegend:"SizeLegend",MeasureBasedColoringLegend:"MeasureBasedColoringLegend"};sap.viz.__svg_support=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect;sap.ui.requireSync("sap/ui/thirdparty/require");if(window.define){window.define("css",new a());}function b(){var d={"sap.viz.core.BaseChart":"sap.viz.ui5.core.BaseChart","sap.viz.core.BaseStructuredType":"sap.viz.ui5.core.BaseStructuredType","sap.viz.core.Dataset":"sap.viz.ui5.data.Dataset","sap.viz.core.DimensionDefinition":"sap.viz.ui5.data.DimensionDefinition","sap.viz.core.FlattenedDataset":"sap.viz.ui5.data.FlattenedDataset","sap.viz.core.MeasureDefinition":"sap.viz.ui5.data.MeasureDefinition","sap.viz.Bar":"sap.viz.ui5.Bar","sap.viz.Bubble":"sap.viz.ui5.Bubble","sap.viz.VerticalBar":"sap.viz.ui5.Column","sap.viz.Combination":"sap.viz.ui5.Combination","sap.viz.Donut":"sap.viz.ui5.Donut","sap.viz.Line":"sap.viz.ui5.Line","sap.viz.Pie":"sap.viz.ui5.Pie","sap.viz.Scatter":"sap.viz.ui5.Scatter","sap.viz.StackedVerticalBar":"sap.viz.ui5.StackedColumn","sap.viz.PercentageStackedVerticalBar":"sap.viz.ui5.StackedColumn100"};q.each(d,function(s,n){O.set(s,function(){L.warning("[Deprecated] chart '"+s+"' has been deprecated for several releases and will be removed soon. Use '"+n+"' instead.");var N=O.get(n||"");var i=Object.create(N.prototype||null);return N.apply(i,arguments)||i;});O.set(s+".extend",function(){L.warning("[Deprecated] chart '"+s+"' has been deprecated for several releases and will be removed soon. Use '"+n+"' instead.");return O.get(n||"").extend.apply(this,arguments);});O.set(s+".getMetadata",function(){L.warning("[Deprecated] chart '"+s+"' has been deprecated for several releases and will be removed soon. Use '"+n+"' instead.");return O.get(n||"").getMetadata.apply(this,arguments);});});var o=sap.ui.getCore().getLoadedLibraries()["sap.viz"];if(o&&o.types){q.each(o.types,function(i,n){if(n.indexOf("sap.viz.ui5.types.")===0){O.set("sap.viz.types."+n.slice("sap.viz.ui5.types.".length),O.get(n||""));}});}}b();var c=false;var v={'status':'unloaded'};sap.viz._initializeVIZ=function(){if(!sap.viz.__svg_support){return;}if(c){return;}sap.viz._initializeENV(true);c=true;};sap.viz._initializeVIZControls=function(d,e){if(!sap.viz.__svg_support){e(false);}if(v.status==='unloaded'){v.callbacks=[e];v.status='loading';sap.viz._initializeENV(!c,d?'container':'controls',function(){v.status='loaded';if(v&&v.callbacks){for(var i=0;i<v.callbacks.length;i++){v.callbacks[i](true);}delete v.callbacks;}});c=true;}else if(v.status==='loading'){v.callbacks.push(e);}else if(v.status==='loaded'){e(true);}};sap.viz._initializeENV=function(d,p,e){var P=sap.viz.api.env.Resource.path("sap.viz.api.env.Language.loadPaths")||[];if(d){P=[];P.push(sap.ui.require.toUrl("sap/viz/resources/chart/langs")+"/");P.push(sap.ui.require.toUrl("sap/viz/resources/framework/langs")+"/");}if(p==='container'){P.push(sap.ui.require.toUrl("sap/viz/ui5/container/libs/locale")+"/");}else if(p==='controls'){P.push(sap.ui.require.toUrl("sap/viz/ui5/controls/libs/sap-viz-vizframe/resources/locale")+"/");}var t="auto";if(sap.ui&&sap.ui.Device&&sap.ui.Device.system){if(sap.ui.Device.system.desktop===true){t="off";}else if(sap.ui.Device.system.desktop===false){t="on";}}sap.viz.api.env.globalSettings({"treatAsMobile":t});if(P.length>0){if(p){sap.viz.api.env.Format.useDefaultFormatter(true);sap.viz.api.env.globalSettings({"useLatestFormatPrefix":true});}sap.viz.api.env.Resource.path("sap.viz.api.env.Language.loadPaths",P);L.info("VIZ: load path for lang manager set to "+P);if(p){if(p==='container'){var G=sap.viz.controls.common.config.GlobalConfig;G.defaultAssetsRoot(sap.ui.require.toUrl("sap/viz/ui5/container/libs")+"/");}}if(p){sap.viz.api.env.Resource.path("sap.viz.api.env.Template.loadPaths",[sap.ui.require.toUrl("sap/viz/resources/chart/templates")+"/"]);sap.ui.getCore().attachThemeChanged(function(f){sap.viz._applyTheme();});sap.viz._applyTheme();}sap.viz._applyLocale(e);}};sap.viz._applyTheme=function(){sap.viz._changeTemplate('standard_fiori');sap.ui.requireSync("sap/ui/core/theming/Parameters");var m={};var w=function(k){var d=sap.ui.core.theming.Parameters.get(k);if(d){m[k]=d;}};w('sapUiChartPaletteQualitativeHue1');w('sapUiChartPaletteQualitativeHue2');w('sapUiChartPaletteQualitativeHue3');w('sapUiChartPaletteQualitativeHue4');w('sapUiChartPaletteQualitativeHue5');w('sapUiChartPaletteQualitativeHue6');w('sapUiChartPaletteQualitativeHue7');w('sapUiChartPaletteQualitativeHue8');w('sapUiChartPaletteQualitativeHue9');w('sapUiChartPaletteQualitativeHue10');w('sapUiChartPaletteQualitativeHue11');w('sapUiChartPaletteQualitativeHue12');w('sapUiChartPaletteQualitativeHue13');w('sapUiChartPaletteQualitativeHue14');w('sapUiChartPaletteQualitativeHue15');w('sapUiChartPaletteQualitativeHue16');w('sapUiChartPaletteQualitativeHue17');w('sapUiChartPaletteQualitativeHue18');w('sapUiChartPaletteQualitativeHue19');w('sapUiChartPaletteQualitativeHue20');w('sapUiChartPaletteQualitativeHue21');w('sapUiChartPaletteQualitativeHue22');w('sapUiChartPaletteSemanticBadLight3');w('sapUiChartPaletteSemanticBadLight2');w('sapUiChartPaletteSemanticBadLight1');w('sapUiChartPaletteSemanticBad');w('sapUiChartPaletteSemanticBadDark1');w('sapUiChartPaletteSemanticBadDark2');w('sapUiChartPaletteSemanticCriticalLight3');w('sapUiChartPaletteSemanticCriticalLight2');w('sapUiChartPaletteSemanticCriticalLight1');w('sapUiChartPaletteSemanticCritical');w('sapUiChartPaletteSemanticCriticalDark1');w('sapUiChartPaletteSemanticCriticalDark2');w('sapUiChartPaletteSemanticGoodLight3');w('sapUiChartPaletteSemanticGoodLight2');w('sapUiChartPaletteSemanticGoodLight1');w('sapUiChartPaletteSemanticGood');w('sapUiChartPaletteSemanticGoodDark1');w('sapUiChartPaletteSemanticGoodDark2');w('sapUiChartPaletteSemanticNeutralLight3');w('sapUiChartPaletteSemanticNeutralLight2');w('sapUiChartPaletteSemanticNeutralLight1');w('sapUiChartPaletteSemanticNeutral');w('sapUiChartPaletteSemanticNeutralDark1');w('sapUiChartPaletteSemanticNeutralDark2');w('sapUiChartPaletteNoSemDiv1Dark2');w('sapUiChartPaletteNoSemDiv1Dark1');w('sapUiChartPaletteNoSemDiv1');w('sapUiChartPaletteNoSemDiv1Light1');w('sapUiChartPaletteNoSemDiv1Light2');w('sapUiChartPaletteNoSemDiv1Light3');w('sapUiChartPaletteSequentialHue1Light3');w('sapUiChartPaletteSequentialHue1Light2');w('sapUiChartPaletteSequentialHue1Light1');w('sapUiChartPaletteSequentialHue1');w('sapUiChartPaletteSequentialHue1Dark1');w('sapUiChartPaletteSequentialHue1Dark2');w('sapUiChartPaletteSequentialHue2Light3');w('sapUiChartPaletteSequentialHue2Light2');w('sapUiChartPaletteSequentialHue2Light1');w('sapUiChartPaletteSequentialHue2');w('sapUiChartPaletteSequentialHue2Dark1');w('sapUiChartPaletteSequentialHue2Dark2');w('sapUiChartPaletteSequentialHue3Light3');w('sapUiChartPaletteSequentialHue3Light2');w('sapUiChartPaletteSequentialHue3Light1');w('sapUiChartPaletteSequentialHue3');w('sapUiChartPaletteSequentialHue3Dark1');w('sapUiChartPaletteSequentialHue3Dark2');w('sapUiChartPaletteSequentialHue6Light3');w('sapUiChartPaletteSequentialHue6Light2');w('sapUiChartPaletteSequentialHue6Light1');w('sapUiChartPaletteSequentialHue6');w('sapUiChartPaletteSequentialHue6Dark1');w('sapUiChartPaletteSequentialHue6Dark2');w('sapUiChartPaletteSequentialNeutralLight3');w('sapUiChartPaletteSequentialNeutralLight2');w('sapUiChartPaletteSequentialNeutralLight1');w('sapUiChartPaletteSequentialNeutral');w('sapUiChartPaletteSequentialNeutralDark1');w('sapUiChartPaletteSequentialNeutralDark2');w('sapUiChoroplethRegionBG');w('sapUiChartZeroAxisColor');w('sapUiNegativeElement');w('sapUiCriticalElement');w('sapUiPositiveElement');w('sapUiNeutralElement');sap.viz.api.env.globalSettings({'colorMapping':m});};sap.viz._changeTemplate=function(t){if(sap.viz.api.env.Template.get()!==t){sap.viz.api.env.Template.set(t);}};sap.viz._applyLocale=function(d){var o=sap.ui.getCore().getConfiguration();var e=o.getLocale();var V=e.getLanguage();if(V==='zh'){V=(o.getSAPLogonLanguage()==='ZH')?'zh_CN':'zh_TW';}sap.viz.api.env.Locale.set(V,function(){if(d){d();}});L.info("VIZ: env initialized (locale="+sap.ui.getCore().getConfiguration().getLanguage()+")");};return sap.viz;});
