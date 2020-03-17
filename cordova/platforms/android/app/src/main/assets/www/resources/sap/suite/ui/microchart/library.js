/*!
 * SAPUI5

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/library","sap/m/library"],function(q){"use strict";sap.ui.getCore().initLibrary({name:"sap.suite.ui.microchart",version:"1.71.11",dependencies:["sap.ui.core","sap.m"],types:["sap.suite.ui.microchart.AreaMicroChartViewType","sap.suite.ui.microchart.BulletMicroChartModeType","sap.suite.ui.microchart.CommonBackgroundType","sap.suite.ui.microchart.ComparisonMicroChartViewType","sap.suite.ui.microchart.DeltaMicroChartViewType","sap.suite.ui.microchart.HorizontalAlignmentType","sap.suite.ui.microchart.LoadStateType","sap.suite.ui.microchart.LineType"],interfaces:[],controls:["sap.suite.ui.microchart.AreaMicroChart","sap.suite.ui.microchart.BulletMicroChart","sap.suite.ui.microchart.ColumnMicroChart","sap.suite.ui.microchart.ComparisonMicroChart","sap.suite.ui.microchart.DeltaMicroChart","sap.suite.ui.microchart.HarveyBallMicroChart","sap.suite.ui.microchart.LineMicroChart","sap.suite.ui.microchart.InteractiveBarChart","sap.suite.ui.microchart.InteractiveDonutChart","sap.suite.ui.microchart.InteractiveLineChart","sap.suite.ui.microchart.RadialMicroChart","sap.suite.ui.microchart.StackedBarMicroChart"],elements:["sap.suite.ui.microchart.AreaMicroChartPoint","sap.suite.ui.microchart.AreaMicroChartItem","sap.suite.ui.microchart.AreaMicroChartLabel","sap.suite.ui.microchart.BulletMicroChartData","sap.suite.ui.microchart.ColumnMicroChartData","sap.suite.ui.microchart.ColumnMicroChartLabel","sap.suite.ui.microchart.ComparisonMicroChartData","sap.suite.ui.microchart.HarveyBallMicroChartItem","sap.suite.ui.microchart.LineMicroChartPoint","sap.suite.ui.microchart.LineMicroChartEmphasizedPoint","sap.suite.ui.microchart.LineMicroChartLine","sap.suite.ui.microchart.InteractiveBarChartBar","sap.suite.ui.microchart.InteractiveDonutChartSegment","sap.suite.ui.microchart.InteractiveLineChartPoint","sap.suite.ui.microchart.StackedBarMicroChartBar"]});sap.suite.ui.microchart.AreaMicroChartViewType={Normal:"Normal",Wide:"Wide"};sap.suite.ui.microchart.BulletMicroChartModeType={Actual:"Actual",Delta:"Delta"};sap.suite.ui.microchart.CommonBackgroundType={Lightest:"Lightest",ExtraLight:"ExtraLight",Light:"Light",MediumLight:"MediumLight",Medium:"Medium",Dark:"Dark",ExtraDark:"ExtraDark",Darkest:"Darkest",Transparent:"Transparent"};sap.suite.ui.microchart.LineType={Solid:"Solid",Dashed:"Dashed",Dotted:"Dotted"};sap.suite.ui.microchart.HorizontalAlignmentType={Left:"Left",Center:"Center",Right:"Right"};sap.suite.ui.microchart.ComparisonMicroChartViewType={Normal:"Normal",Wide:"Wide",Responsive:"Responsive"};sap.suite.ui.microchart.DeltaMicroChartViewType={Normal:"Normal",Wide:"Wide",Responsive:"Responsive"};sap.suite.ui.microchart.LoadStateType={Loading:"Loading",Loaded:"Loaded",Failed:"Failed",Disabled:"Disabled"};sap.suite.ui.microchart._aStandardMarginClassNames=["sapUiTinyMargin","sapUiSmallMargin","sapUiMediumMargin","sapUiLargeMargin","sapUiTinyMarginBeginEnd","sapUiTinyMarginTopBottom","sapUiSmallMarginBeginEnd","sapUiSmallMarginTopBottom","sapUiMediumMarginBeginEnd","sapUiMediumMarginTopBottom","sapUiLargeMarginBeginEnd","sapUiLargeMarginTopBottom","sapUiTinyMarginTop","sapUiTinyMarginBottom","sapUiTinyMarginBegin","sapUiTinyMarginEnd","sapUiSmallMarginTop","sapUiSmallMarginBottom","sapUiSmallMarginBegin","sapUiSmallMarginEnd","sapUiMediumMarginTop","sapUiMediumMarginBottom","sapUiMediumMarginBegin","sapUiMediumMarginEnd","sapUiLargeMarginTop","sapUiLargeMarginBottom","sapUiLargeMarginBegin","sapUiLargeMarginEnd","sapUiResponsiveMargin","sapUiNoMargin","sapUiNoMarginTop","sapUiNoMarginBottom","sapUiNoMarginBegin","sapUiNoMarginEnd"];sap.suite.ui.microchart._removeStandardMargins=function(c){for(var i=0;i<sap.suite.ui.microchart._aStandardMarginClassNames.length;i++){if(c.hasStyleClass(sap.suite.ui.microchart._aStandardMarginClassNames[i])){c.removeStyleClass(sap.suite.ui.microchart._aStandardMarginClassNames[i]);}}};sap.suite.ui.microchart._passParentContextToChild=function(c,C){if(c.data("_parentRenderingContext")){C.data("_parentRenderingContext",c.data("_parentRenderingContext"));}else if(q.isFunction(c.getParent)){C.data("_parentRenderingContext",c.getParent());}};sap.suite.ui.microchart._isTooltipSuppressed=function(t){return t!==null&&t!==undefined&&!t.trim();};sap.suite.ui.microchart._checkControlIsVisible=function(c,a){function i(){return c.getVisible()&&c.getDomRef()&&c.$().is(":visible")&&c.getDomRef().getBoundingClientRect().width!==0;}function d(){if(i()){sap.ui.getCore().detachIntervalTimer(d);a.call(c);}}var o=c.exit;c.exit=function(){sap.ui.getCore().detachIntervalTimer(d);if(o){o.call(c);}};if(i()){a.call(c);}else{sap.ui.getCore().attachIntervalTimer(d);}};return sap.suite.ui.microchart;});
