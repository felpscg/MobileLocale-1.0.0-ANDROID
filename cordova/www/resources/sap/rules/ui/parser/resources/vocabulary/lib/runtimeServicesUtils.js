jQuery.sap.declare("sap.rules.ui.parser.resources.vocabulary.lib.runtimeServicesUtils");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.constants");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constantsBase");sap.rules.ui.parser.resources.vocabulary.lib.runtimeServicesUtils=sap.rules.ui.parser.resources.vocabulary.lib.runtimeServicesUtils||{};sap.rules.ui.parser.resources.vocabulary.lib.runtimeServicesUtils.lib=(function(){var v=sap.rules.ui.parser.resources.vocabulary.lib.constants.lib;var b=sap.rules.ui.parser.businessLanguage.lib.constantsBase.lib;function r(){}r.prototype.loadAllAliases=function(a,c,d){a.aliases={};var t=null;var e=a.scope!==v.GLOBAL;var i;if(c){for(i=0;i<c.length;i++){if(a.id===c[i].vocaId){if(c[i].isPrivate){t=d.getTransientVocabulary();if(t===null||(t.isChangedAlias(c[i].name)===false)){a.aliases[c[i].name]=c[i];}}else{a.aliases[c[i].name]=c[i];}}else if((e&&(c[i].scope===v.GLOBAL||(c[i].scope===a.scope&&c[i].isPrivate===false)))){if(!a.aliases[c[i].name]){a.aliases[c[i].name]=c[i];}}}}};r.prototype.getScope=function(s,i,a){var t=s;if(i===null&&s!==v.GLOBAL){t=a;}return t;};r.prototype.getIsWritable=function(i){if(i==='1'||i===true||i===1){return true;}return false;};r.prototype.getIsValueListConverted=function(i){if(i==='1'||i===true||i===1){return true;}return false;};r.prototype.getFromDigitToBoolean=function(i){var a;if(i==='0'||i===false||i===0){a=false;}else{a=true;}return a;};r.prototype.getFromNullOrDigitToBoolean=function(i){var a;if(i===null||i==='0'||i===false||i===0){a=false;}else{a=true;}return a;};r.prototype.getIsDeprecatedFromDigit=function(i){var a=false;if(i==='1'||i===true||i===1){a=true;}return a;};r.prototype.quotesAccoringToType=function(a,t){switch(t){case b.SIMPLE_SELECTION_VALUE_TYPE.STRING.string:case b.SIMPLE_SELECTION_VALUE_TYPE.DATE.string:case b.SIMPLE_SELECTION_VALUE_TYPE.TIMESTAMP.string:case b.SIMPLE_SELECTION_VALUE_TYPE.TIME.string:return"'"+a+"'";default:return a;}};r.prototype.makeGlobalObjectRTName=function(p,n){return p+'::'+n;};r.prototype.getIsPrivate=function(s,i){var a;if(i===null){if(s===v.PUBLIC||s===v.GLOBAL){a=false;}else{a=true;}}else{a=(i==='0'||i===false||i===0)?false:true;}return a;};r.prototype.getAliasType=function(t){var a=t;if(!a){a=v.ALIAS_CONTENT_EXPRESSION;}return a;};r.prototype.getContent=function(c,t){var a=c;if(t===v.ALIAS_CONTENT_DECISION_TABLE){a=JSON.parse(c);}return a;};return{runtimeServicesUtilsLib:r};}());