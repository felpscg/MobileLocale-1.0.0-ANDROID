// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../../../core/core','./NavigationTargetTemplate'],function(c,N){"use strict";return c.defineClass({_init:function(p){this.sina=p.sina;this.navigationTargetGenerator=p.navigationTargetGenerator;this.sourceObjectType=p.sourceObjectType;this.targetObjectType=p.targetObjectType;this.conditions=[];},add:function(a){this.conditions.push(a);},hasDuplicateSemanticObject:function(){var m={};for(var i=0;i<this.conditions.length;++i){var a=this.conditions[i];if(m[a.semanticObjectType]){return true;}m[a.semanticObjectType]=true;}return false;},hasDistinctValue:function(s,p){var v;for(var i=0;i<this.conditions.length;++i){var a=this.conditions[i];if(a.semanticObjectType!==s){continue;}if(!v){v=a[p];continue;}if(v!==a[p]){return false;}}return true;},generateNavigationTargetTemplates:function(){if(this.hasDuplicateSemanticObject()){return this.createSingleConditionsTemplates();}return this.createMultipleConditionsTemplates();},createSingleConditionsTemplates:function(){var n=[];for(var i=0;i<this.conditions.length;++i){var a=this.conditions[i];var s=this.hasDistinctValue(a.semanticObjectType,'sourcePropertyName');var t=this.hasDistinctValue(a.semanticObjectType,'targetPropertyName');if(!s&&!t){continue;}var b=new N({sina:this.sina,navigationTargetGenerator:this.navigationTargetGenerator,label:'dummy',sourceObjectType:this.sourceObjectType,targetObjectType:this.targetObjectType,conditions:[a]});b._condition=a;n.push(b);}this.assembleSingleConditionTemplateLabels(n);return n;},createMultipleConditionsTemplates:function(){return[new N({sina:this.sina,navigationTargetGenerator:this.navigationTargetGenerator,label:this.navigationTargetGenerator.objectTypeMap[this.targetObjectType].label,sourceObjectType:this.sourceObjectType,targetObjectType:this.targetObjectType,conditions:this.conditions})];},assembleSingleConditionTemplateLabels:function(n){var t={};var a,l,b,m;for(var i=0;i<n.length;++i){b=n[i];m=this.navigationTargetGenerator.objectTypeMap[this.targetObjectType];l=m.label+' to:'+m.propertyMap[b._condition.targetPropertyName].label;b.label=l;a=t[l];if(!a){a=[];t[l]=a;}a.push(b);}m=this.navigationTargetGenerator.objectTypeMap[this.sourceObjectType];for(l in t){a=t[l];if(a.length>1){for(var j=0;j<a.length;++j){b=a[j];b.label+=' from:'+m.propertyMap[b._condition.sourcePropertyName].label;}}}}});});
