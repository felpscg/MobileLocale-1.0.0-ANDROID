sap.ui.define(["sap/ovp/cards/generic/Card.controller","sap/ui/thirdparty/jquery","sap/ovp/cards/charts/VizAnnotationManager","sap/ui/comp/odata/MetadataAnalyser","sap/ovp/cards/charts/SmartAnnotationManager","sap/ui/model/Filter","sap/ovp/cards/AnnotationHelper","sap/ui/model/Sorter","sap/ovp/app/resources","sap/base/Log","sap/base/util/each"],function(C,q,V,M,S,F,A,a,O,L,e){"use strict";return C.extend("sap.ovp.cards.charts.smart.chart.analyticalChart",{onInit:function(){C.prototype.onInit.apply(this,arguments);V.formatChartAxes();this.bFlag=true;var b=M.prototype._enrichChartAnnotation;var l,i,o;M.prototype._enrichChartAnnotation=function(c,d){if(d){if(!d.Measures){d.Measures=[];if(d.MeasureAttributes){l=d.MeasureAttributes.length;for(i=0;i<l;i++){o=d.MeasureAttributes[i];d.Measures.push({"PropertyPath":o.Measure.PropertyPath});}}}if(!d.Dimensions){d.Dimensions=[];if(d.DimensionAttributes){l=d.DimensionAttributes.length;for(i=0;i<l;i++){o=d.DimensionAttributes[i];d.Dimensions.push({"PropertyPath":o.Dimension.PropertyPath});}}}}b.apply(this,arguments);};},onBeforeRendering:function(){var s=this.getView().byId("analyticalChart2");var v=s&&s._getVizFrame();if(v){this.vizFrame=v;var b=this.getView().byId("vbLayout");this.vbLayout=b;this.isVizPropSet=false;var c=s.getChart();c.setProperty("enableScalingFactor",true);S.getSelectedDataPoint(v,this);S.attachDataReceived(s,this);}},getCardItemsBinding:function(){var s=this.getView().byId("analyticalChart2");var v=s&&s._getVizFrame();if(v&&v.getDataset()&&v.getDataset().getBinding("data")&&this.vbLayout){this.vbLayout.setBusy(false);}if(v&&v.getParent()){return v.getParent().getBinding("data");}return null;},onAfterRendering:function(){C.prototype.onAfterRendering.apply(this,arguments);var s=this.getView().byId("analyticalChart2");var c=this.getOwnerComponent().getComponentData();if(this.getCardPropertiesModel().getProperty("/layoutDetail")==="resizable"&&c.appComponent){var d=c.appComponent.getDashboardLayoutUtil(),b=d.getCardDomId(c.cardId),o=d.dashboardLayoutModel.getCardById(c.cardId),f=document.getElementById(b),h=this.getHeaderHeight();f.getElementsByClassName("sapOvpWrapper")[0].style.height=o.dashboardLayout.rowSpan*d.ROW_HEIGHT_PX-(h+2*d.CARD_BORDER_PX)+"px";var m=Math.round((h+2*d.CARD_BORDER_PX)/d.ROW_HEIGHT_PX);if(o.dashboardLayout.rowSpan<=m){f.classList.add("sapOvpMinHeightContainer");}if(s){s._getVizFrame().setHeight(this._calculateVizFrameHeight()+"px");}}var g=s&&s.getChart();if(g){var v=s&&s._getVizFrame();g.attachRenderComplete(function(){var D="";if(v&&v._states()&&v._states()["dynamicScale"]){var i=this.getView().byId("ovpUoMTitle");var j=g.getScalingFactor();var k=j&&j.primaryValues&&j.primaryValues.scalingFactor;var u=j&&j.primaryValues&&j.primaryValues.unit;if(k&&u){D=O.getText("IN",[k,u]);}else if(k&&!u){D=O.getText("IN_NO_SCALE",[k]);}else if(!k&&u){D=O.getText("IN_NO_SCALE",[u]);}if(D!==""){i.setText(D);}}}.bind(this));}},beforeRebindSmartChart:function(E){var c=this.getView().byId("analyticalChart2");c.attachBeforeRebindChart(q.proxy(this.beforeRebindSmartChart,this));var b=E.getParameter("bindingParams");this.dataLength=this.getChartBindingLength();b.length=this.dataLength;var f=b.filters;var s=b.sorter;var o=this.getCardPropertiesModel();var d=o.getData();var g=d.entityType[d.selectionAnnotationPath];var h=g&&g.SelectOptions;var i=this.getModel();var j=this.getEntitySet();var m=S.getMetadata(this.getModel(),d.entitySet);var p=d.entityType[d.presentationAnnotationPath];var k=p&&p.SortOrder;var l=p&&p.MaxItems,n=null;if(l){n=l.Int32?l.Int32:l.Int;}if(n){if(n=="0"){L.error("OVP-AC: Analytic card Error: maxItems is configured as "+n);}if(!/^\d+$/.test(n)){L.error("OVP-AC: Analytic card Error: maxItems is Invalid. "+"Please enter an Integer.");}}if(h){e(g.SelectOptions,function(){var v=this.PropertyName.PropertyPath;e(this.Ranges,function(){if(this.Sign.EnumMember==="com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"){var w=S.getPrimitiveValue(this.Low);var x=this.High&&this.High.String;w=S.formatByType(m,v,w);var y={path:v,operator:this.Option.EnumMember.split("/")[1],value1:w};if(x){y.value2=S.formatByType(m,v,x);}f.push(new F(y));}});});}if(k){if(p.SortOrder.Path&&p.SortOrder.Path.indexOf('@')>=0){var r=p.SortOrder.Path.split('@')[1];var t=i.getServiceAnnotations()[j.entityType];p.SortOrder=t[r];}e(p.SortOrder,function(){var v=this.Property.PropertyPath;var w=this.Descending.Boolean||this.Descending.Bool;var x={sPath:v,bDescending:w=="true"?true:false};s.push(new a(v,x.bDescending));});}var u="";var P=o.getProperty('/parameters');var G=this.oMainComponent&&this.oMainComponent.getGlobalFilter();u=A.resolveParameterizedEntitySet(i,j,g,P,G);c.setChartBindingPath(u);},getChartBindingLength:function(){var c=this.getView().byId("analyticalChart2"),o=S.getMaxItems(c),b=+this.getCardPropertiesModel().getProperty("/cardLayout/colSpan")-1,l;if(o&&o.itemsLength&&o.dataStep&&this.getCardPropertiesModel().getProperty('/layoutDetail')==='resizable'){l=o.itemsLength+b*o.dataStep;}else if(o&&o.itemsLength&&this.getCardPropertiesModel().getProperty('/layoutDetail')!=='resizable'){l=o.itemsLength;}else{l=100;}return l;},resizeCard:function(n,$){var c=this.getCardPropertiesModel(),s=this.getView().byId("analyticalChart2"),o=this.getCardPropertiesModel().getProperty("/cardLayout"),b=this.getView().byId('ovpCardContentContainer').getDomRef();c.setProperty("/cardLayout/rowSpan",n.rowSpan);c.setProperty("/cardLayout/colSpan",n.colSpan);this.bSorterSetForCustomCharts=false;n.showOnlyHeader?b.classList.add('sapOvpContentHidden'):b.classList.remove('sapOvpContentHidden');q(this.getView().$()).find(".sapOvpWrapper").css({height:(n.rowSpan*o.iRowHeightPx)-(o.headerHeight+2*o.iCardBorderPx)+"px"});if(s){if(this.dataLength!==this.getChartBindingLength()||(n.showOnlyHeader===false&&(this.oldShowOnlyHeaderFlag===true||this.oldShowOnlyHeaderFlag===undefined))){s.rebindChart();}s._getVizFrame().setHeight(this._calculateVizFrameHeight()+"px");}this.oldShowOnlyHeaderFlag=n.showOnlyHeader;},_calculateVizFrameHeight:function(){var v,c=this.getCardPropertiesModel().getProperty('/cardLayout');if(c&&c.rowSpan){var g=this.getView().getController(),d=this.getItemHeight(g,'toolbar'),b=this.getView().byId('bubbleText'),i=this.getView().byId('ovpChartTitle')?this.getItemHeight(g,'ovpChartTitle'):0,B=b&&b.getVisible()?this.getItemHeight(g,'bubbleText'):0;v=c.rowSpan*c.iRowHeightPx-(c.headerHeight+2*c.iCardBorderPx+d+i+B);}return v;}});});