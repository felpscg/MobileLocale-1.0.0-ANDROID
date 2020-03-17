/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/mdc/library","sap/ui/mdc/ChartDelegate","./ODataMetaModelUtil","sap/base/util/merge"],function(M,B,u,m){"use strict";var A="@Org.OData.Aggregation.V1";function f(H){this.name=H[0];this.label=H[1]||this.name;this.textProperty=H[2];this.type=u.getType(H[3]);if(H[4]||H[5]){var c=H[4],F=H[5];if(F){switch(F){case"year":this.timeUnit="fiscalyear";break;case"yearPeriod":this.timeUnit="fiscalyearperiod";break;default:this.timeUnit=undefined;break;}}if(c&&!this.timeUnit){switch(c){case"yearMonth":this.timeUnit="yearmonth";break;case"date":this.timeUnit="yearmonthday";break;case"yearQuarter":this.timeUnit="yearquarter";break;case"yearWeek":this.timeUnit="yearweek";break;default:this.timeUnit=undefined;break;}}}this.criticality=H[6];return this;}function h(R){var g=R[0],a=R[1];var H={},p={},I;p.inChart=g||a||false;if(p.inChart){p.chartItems=[];if(g){H.kind=M.ChartItemType.Dimension;H.role=M.ChartItemRoleType.category;I=Object.assign({},H);p.chartItems.push(I);}if(a){H.kind=M.ChartItemType.Measure;H.role=M.ChartItemRoleType.axis1;H.contextDefiningProperties=R[4]||[];var s=R[2]||[];var d=R[3];for(var i=0;i<s.length;i++){I=Object.assign({},H);I.aggregationMethod=s[i];I.default=I.aggregationMethod==d;p.chartItems.push(I);}}}var o=this.getModel();return Promise.all([o.requestObject("@sapui.name",this),o.requestObject("@com.sap.vocabularies.Common.v1.Label",this),o.requestObject("@com.sap.vocabularies.Common.v1.Text/$Path",this),o.requestObject("$Type",this),u.fetchCalendarTag(o,this),u.fetchFiscalTag(o,this),u.fetchCriticality(o,this)]).then(f.bind(p));}function r(e,p,o,a){var k,P,b=[],I=[],s,c=[],S,d,K={};var g=u.getAllCustomAggregates(a);for(var j in g){I.push(m({},g[j],{propertyPath:j,kind:M.ChartItemType.Measure,role:M.ChartItemRoleType.axis1,sortable:g[j].sortable,filterable:g[j].filterable}));}var t=u.getAllAggregatableProperties(a);for(var l in t){k=t[l].propertyPath;K[k]=K[k]||{};K[k][t[l].aggregationMethod]={name:t[l].name,label:t[l].label};}var n=u.getSortRestrictionsInfo(a["@Org.OData.Capabilities.V1.SortRestrictions"]);var F=u.getFilterRestrictionsInfo(a["@Org.OData.Capabilities.V1.FilterRestrictions"]);function q(P){c.push(P);u.addSortInfoForProperty(P,n);u.addFilterInfoForProperty(P,F);if(P.inChart){for(var i=0;i<P.chartItems.length;i++){var v=P.chartItems[i];v.propertyPath=P.name;v.type=P.type;v.timeUnit=P.timeUnit;v.criticality=P.criticality;if(v.kind==M.ChartItemType.Measure){if(K[v.propertyPath]&&K[v.propertyPath][v.aggregationMethod]){v.name=K[v.propertyPath][v.aggregationMethod].name;v.label=K[v.propertyPath][v.aggregationMethod].label;}else{v.name=v.aggregationMethod+v.propertyPath;v.label=P.label+" ("+v.aggregationMethod+")";}v.customAggregate=false;v.sortable=true;v.sortDirection="both";v.filterable=true;}else{v.name=P.name;v.textProperty=P.textProperty;v.label=P.label;v.sortable=P.sortable;v.sortDirection=P.sortDirection;v.filterable=P.filterable;v.allowedExpressions=P.allowedExpressions;}I.push(v);}}}for(k in e){if(k[0]!=="$"){P=e[k];if(P&&P.$kind){if(P.$kind=="Property"){s=p+k+A;b.push(Promise.all([o.requestObject(s+".Groupable"),o.requestObject(s+".Aggregatable"),o.requestObject(s+".SupportedAggregationMethods"),o.requestObject(s+".RecommendedAggregationMethod"),o.requestObject(s+".ContextDefiningProperties")]).then(h.bind(o.getMetaContext(p+k))).then(q));}}}}return Promise.all(b).then(function(){return[d,S,c,I];});}var C={};C.retrieveAggregationItem=B.retrieveAggregationItem;C.fetchProperties=function(o,c){return C.retrieveAllMetadata(o,c).then(function(a){return a.properties;});};C.retrieveAllMetadata=function(o,p){var a=o.getMetaModel(),s,t;if(p.endsWith("/")){throw new Error("The leading path for metadata calculation is the entity set not the path");}s=p;t=p+"/";function b(R){var c={sortable:R[0],filterable:R[1],attributes:R[2],properties:R[3]};return c;}var S=[a.requestObject(t),a.requestObject(s)];return Promise.all(S).then(function(T){var e=T[0];var c=[u.fetchAllAnnotations(a,t),u.fetchAllAnnotations(a,s)];return Promise.all(c).then(function(d){var g=Object.assign(d[0],d[1]);return r(e,t,a,g);});}).then(b);};return C;},false);
