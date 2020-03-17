/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global","./library","sap/ui/core/Control","sap/rules/ui/InstructionRenderer","sap/rules/ui/ExpressionBase"],function(q,l,C,I,E){"use strict";var a=E.extend("sap.rules.ui.ExpressionBasic",{metadata:{properties:{value:{type:"string",defaultValue:"",bindable:"bindable"}},aggregations:{_instructionRenderer:{type:"sap.rules.ui.InstructionRenderer",multiple:false}}},init:function(){this.shouldReload=true;},_removeFurtherInstructions:function(i){var n=this.instructions.length;var b=n-i-1;this.instructions.splice(i+1,b);},_onChange:function(e){var i=e.getParameter("instructionNum");this._onChangeByIndex(i);},_onChangeByIndex:function(b,p,o){p=p||"";o=(o===undefined||o===null)?b:o;var c=this.getAggregation("_instructionRenderer");var u=c.getExpression();if(b>1){this.setProperty("value",u);return;}this._removeFurtherInstructions(o);u=c.getExpression();var e=sap.ui.getCore().byId(this.getExpressionLanguage());var s=sap.rules.ui.SuggestionsPart;var d;var f;if(b==0){d=e._getBasicSuggestions(u,s.compPart);}if(b==1){d=e._getBasicSuggestions(p+" "+u,s.rightPart);}this.oDeferred=new q.Deferred();for(var i=0;i<d.length;i++){if(d[i].valueListObject&&i===d.length-1){this.oDeferred.done(function(g,m){if(m){this.instructions=this.instructions.concat(f);c.setInstructions(this.instructions);this.setProperty("value",u);return;}f=g;this.instructions=this.instructions.concat(f);c.setInstructions(this.instructions);this.setProperty("value",u);return;}.bind(this));}}f=this._createInstructions(d);if(f){this.instructions=this.instructions.concat(f);c.setInstructions(this.instructions);this.setProperty("value",u);}},_callbackForActionControl:function(i,s){var b=this._createInstructions(s);this.instructions.splice.apply(this.instructions,[i,0].concat(b));var o=this.getAggregation("_instructionRenderer");o.setInstructions(this.instructions);},_createInstructions:function(s){var b=[];var c;var d;var e;for(var i=0;i<s.length;i++){d={};c=s[i];if(Array.isArray(c)){d.type="action";d.callback=this._callbackForActionControl.bind(this,i,c);d.editable=true;}else{e=c.sugg;if(e&&e.length!==0){d.valueOptions={};d.valueOptions.type="Set";d.valueOptions.values=[];var v=d.valueOptions.values;for(var j=0;j<e.length;j++){v.push({"token":e[j],"text":e[j]});}}d.text=c.currentValue;d.token=c.currentValue;if(c.BDT){d.businessDataType=c.BDT;}if(c.BDT===sap.rules.ui.ExpressionType.Number){var L=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();var f=sap.ui.core.format.NumberFormat.getFloatInstance(L);var F=function(n){n=f.parse(n);if(isNaN(n)){return'';}return n;};d.text=F(d.text);d.token=F(d.token);}d.editable=true;}d.visible=true;if(c.tokenCategory==="reservedword.undefined"||c.tokenCategory==="reservedword.null"){d.editable=false;}else{d.editable=true;}if(c.valueListObject){var m=[c.valueListObject];d.valueListObject=c.valueListObject;var g=sap.ui.getCore().byId(this.getExpressionLanguage());d.expressionLanguage=g;if(m&&m instanceof Array&&!m[0].metadata.HasValueSource){d.valueListObject=m[0];var M=d.valueListObject.model;if(M&&!M.getMetaModel().oModel){var h=function(){var k=g.getValueHelpCallback();k.call(this,m);var t=d.valueListObject.model;var o=new sap.ui.comp.odata.MetadataAnalyser(t);var A=d.valueListObject.metadata.propertyPath;var V=o.getValueListAnnotation(A);b.forEach(function(d){d.valueListAnnotation=V;}.bind(this));this.oDeferred.resolve(b);}.bind(this);if(i===s.length-1){M.attachMetadataLoaded(h);M.attachMetadataFailed(function(){this.oDeferred.resolve(b,true);}.bind(this));}}}}b.push(d);}return b;},setValue:function(v){this.shouldReload=true;this.setProperty("value",v);},_reload:function(){this.shouldReload=false;var s=sap.ui.getCore().byId(this.getExpressionLanguage())._getBasicSuggestions(this.getValue());if(this._checkForValueHelpSuggestions(s)){return;}this.instructions=this._createInstructions(s);var i=new I({instructions:this.instructions,useIndent:false,change:this._onChange.bind(this)});this.setAggregation("_instructionRenderer",i,true);},onBeforeRendering:function(){if(this.shouldReload==true){this._reload();}},onAfterRendering:function(){if(this.shouldReload==true){this._reload();}var i=this.getAggregation("_instructionRenderer");if(!i){return;}var c=i.getAggregation("_content");if(!c){return;}var t=this.instructions[this.instructions.length-2];if(t&&!t.editable&&c[c.length-3]){c[c.length-3].focus()}else{c[c.length-1].focus();}q.sap.byId(this.getId()).on("change",null,function(e){this.focus();}.bind(this));},_checkForValueHelpSuggestions:function(s){this.oDeferred=new q.Deferred();for(var i=0;i<s.length;i++){if(s[i].valueListObject){this.oDeferred.done(function(b){var c=new I({instructions:this.instructions,useIndent:false,change:this._onChange.bind(this)});this.setAggregation("_instructionRenderer",c,true);this.shouldReload=false;this.rerender();}.bind(this));this.instructions=this._createInstructions(s);return true;}}return false;}});return a;},true);
