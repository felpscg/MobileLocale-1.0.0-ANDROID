/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var P={showCount:function(c,C){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText('COLUMNSPANEL_SELECT_ALL_WITH_COUNTER',[c,C]);},determineCount:function(i){this._updateCounts();return P.showCount(this.getCountOfSelectedItems(),this.getCountOfItems());},isTrue:function(v){return!!v;},showDimMeasureType:function(m){if(m.aggregationRole==="dimension"){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText('COLUMNSPANEL_TYPE_DIMENSION');}if(m.aggregationRole==="measure"){return sap.ui.getCore().getLibraryResourceBundle("sap.m").getText('COLUMNSPANEL_TYPE_MEASURE');}return;},createChartRoleTypes:function(i,b){var a=b.getObject();return new sap.ui.core.Item({key:a.key,text:a.text});}};return P;},true);
