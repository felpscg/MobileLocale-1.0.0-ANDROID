/*
 * ! SAPUI5

		(c) Copyright 2009-2019 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";return{annotations:{filterRestrictions:{namespace:"Org.OData.Capabilities.V1",annotation:"FilterRestrictions",target:["EntitySet"],whiteList:{properties:["NonFilterableProperties","RequiredProperties"]},defaultValue:true,appliesTo:["filterItem/#/value"],group:["Behavior"],since:"1.28.1"},fieldGroup:{namespace:"com.sap.vocabularies.UI.v1",annotation:"FieldGroup",target:["EntityType"],defaultValue:null,appliesTo:["filterGroupItem"],group:["Behavior"],since:"1.28.1"},filterFacet:{namespace:"com.sap.vocabularies.UI.v1",annotation:"FilterFacets",target:["EntityType"],defaultValue:null,appliesTo:["filterGroupItem"],group:["Behavior"],since:"1.48"},text:{namespace:"com.sap.vocabularies.Common.v1",annotation:"Text",target:["Property"],defaultValue:null,appliesTo:["text"],group:["Appearance","Behavior"],since:"1.32.1"},textArrangement:{namespace:"com.sap.vocabularies.UI.v1",annotation:"TextArrangement",target:["EntityType","com.sap.vocabularies.Common.v1.Text"],defaultValue:null,appliesTo:["text"],group:["Appearance","Behavior"],since:"1.32.1"},valueList:{namespace:"com.sap.vocabularies.Common.v1",annotation:"ValueList",target:["Property","Parameter"],whiteList:{properties:["Label","CollectionPath","Parameters","SearchSupported"]},defaultValue:null,appliesTo:["field/#/fieldHelp"],group:["Behavior"],since:"1.28.1"},valueListWithFixedValues:{namespace:"com.sap.vocabularies.Common.v1",annotation:"ValueListWithFixedValues",target:["Property","Parameter"],defaultValue:null,appliesTo:["field/#/fieldHelp"],group:["Behavior"],since:"1.48.1"},filterLabelOnProperty:{namespace:"com.sap.vocabularies.Common.v1",annotation:"Label",target:["Property","PropertyPath"],defaultValue:null,appliesTo:["filterItem/label"],group:["Behavior"],since:"1.28.1"},filterLabelOnLineItem:{namespace:"com.sap.vocabularies.UI.v1",annotation:"DataField",target:["Property","Parameter"],whiteList:{properties:["Label"]},appliesTo:["filterItem/label"],group:["Behavior"],since:"1.28.1"},filterExpression:{namespace:"com.sap.vocabularies.Common.v1",annotation:"FilterExpressionType",target:["EntitySet"],whiteList:{values:["MultiValue","SingleValue","SingleInterval"]},defaultValue:null,appliesTo:["filterItem/#/input"],group:["Behavior"],since:"1.28.1"},FilterRestrictions:{namespace:"Org.OData.Capabilities.V1",annotation:"FilterRestrictions",target:["EntitySet"],whiteList:{values:["FilterExpressionRestrictions"]},defaultValue:null,appliesTo:["filterItem/#/input"],group:["Behavior"],since:"1.64"},selectionFields:{namespace:"com.sap.vocabularies.UI.v1",annotation:"SelectionFields",target:["EntityType"],defaultValue:null,appliesTo:["filterItem/#/value"],group:["Behavior"],since:"1.40.1"},filterVisible:{namespace:"com.sap.vocabularies.Common.v1",annotation:"FieldControlType",target:["Property"],whiteList:{values:["Hidden","Inapplicable"]},defaultValue:false,appliesTo:["property/#/visible"],group:["Behavior"],since:"1.32.1"},hiddenFilter:{namespace:"com.sap.vocabularies.UI.v1",annotation:"HiddenFilter",target:["Property"],appliesTo:["filterItem/hiddenFilter"],group:["Behavior"],since:"1.44.0"},hidden:{namespace:"com.sap.vocabularies.UI.v1",annotation:"Hidden",target:["Property"],appliesTo:["filterItem/hidden","property/visible"],group:["Behavior"],since:"1.54"},selectionBVariant:{namespace:"com.sap.vocabularies.UI.v1",annotation:"SelectionVariant",target:["EntityType"],appliesTo:["SmartVariantManagement"],group:["Behavior"],since:"1.48.0"},FilterDefaultValue:{namespace:"com.sap.vocabularies.Common.v1",annotation:"FilterDefaultValue",target:["Property"],appliesTo:["filterItem"],group:["Behavior"],since:"1.48.0"}},properties:{entitySet:{ignore:true},entityType:{ignore:true},resourceUri:{ignore:true},basicSearchFieldName:{ignore:true},enableBasicSearch:{ignore:true},considerAnalyticalParameters:{ignore:true},liveMode:{ignore:false},showMessages:{ignore:false},useDateRangeType:{ignore:true},suppressSelection:{ignore:false},considerSelectionVariants:{ignore:true},defaultSelectionVariantName:{ignore:true},useProvidedNavigationProperties:{ignore:true},navigationProperties:{ignore:true}},customData:{defaultDropDownDisplayBehaviour:{type:"sap.ui.comp.smartfilterbar.DisplayBehaviour",defaultValue:"",since:"1.28.1"},defaultTokenDisplayBehaviour:{type:"sap.ui.comp.smartfilterbar.DisplayBehaviour",defaultValue:"",since:"1.28.1"},dateFormatSettings:{type:"string",defaultValue:"\{'UTC':'true'\}",group:["Appearance"],since:"1.28.1"},useContainsAsDefaultFilter:{type:"boolean",defaultValue:false,since:"1.28.1"},executeStandardVariantOnSelect:{type:"boolean",defaultValue:false,since:"1.28.1"}},actionsEffectiveAfter:"RECREATE",aggregations:{content:{propagateMetadata:function(e){return{actions:"not-adaptable"};}},controlConfiguration:{specialIndexHandling:true},filterGroupItems:{ignore:true}}};},false);