
VBI.isInt=function(i){"use strict";return((i-0)==i&&i%1==0);};
VBI.IndexOf=function(a,e){"use strict";var l=a.length;for(var n=0;n<l;++n){if(e==a[n]){return n;}}return-1;};
VBI.Types={st_unknown:0,st_vector:1,st_string:2,st_vectorarray:3,st_float:4,st_color:5,st_long:6,st_bool:7,st_vectorarraymulti:8,string2bool:function(a){"use strict";if(typeof a=="boolean"){return a;}if(typeof a=="number"){return a?true:false;}var t=a.slice(0,1);return(t=='t'||t=='1'||t=='X')?true:false;},string2vector:function(a){"use strict";var e=false;var b=a.split(';');for(var n=0,l=b.length;n<l;++n){b[n]=parseFloat(b[n]);if(!e&&(isNaN(b[n])||!isFinite(b[n]))){e=true;jQuery.sap.log.error("The string contains invalid numbers");}}return b;},stringarray2vectorarray:function(a){"use strict";var r=[];for(var n=0,l=a.length;n<l;++n){var p=[];for(var b=0,c=a[n].length;b<c;++b){p.push(this.string2vector(a[n][b]));}r.push(p);}return r;},string2rgba:function(a){"use strict";var c,r;if((c=/^rgba\(([\d]+)[,;]\s*([\d]+)[,;]\s*([\d]+)[,;]\s*([\d]+|[\d]*.[\d]+)\)/.exec(a))){return[+c[1],+c[2],+c[3],+c[4],1];}else if((c=/^rgba\(([\d]+)\%[,;]\s*([\d]+)\%[,;]\s*([\d]+)\%[,;]\s*([\d]+|[\d]*.[\d]+)\)/.exec(a))){return[+Math.round(c[1]*2.55),+Math.round(c[2]*2.55),+Math.round(c[3]*2.55),+c[4],1];}else if((c=/^rgb\(([\d]+)[,;]\s*([\d]+)[,;]\s*([\d]+)\)/.exec(a))){return[+c[1],+c[2],+c[3],1.0,0];}else if((c=/^rgb\(([\d]+)\%[,;]\s*([\d]+)\%[,;]\s*([\d]+)\%\)/.exec(a))){return[+Math.round(c[1]*2.55),+Math.round(c[2]*2.55),+Math.round(c[3]*2.55),1.0,0];}else if(a.charAt(0)==="#"){var C;if(a.length<7){C=a.substring(0,2)+a.substring(1,2)+a.substring(2,3)+a.substring(2,3)+a.substring(3,4)+a.substring(3,4);}else{C=a;}return[parseInt(C.substring(1,3),16),parseInt(C.substring(3,5),16),parseInt(C.substring(5,7),16),1.0,1];}else if((c=/^hsla\(([\d]+)[,]\s*([\d]+)\%[,]\s*([\d]+)\%[,]\s*([\d]+|[\d]*.[\d]+)\)/.exec(a))){c=[+c[1],+c[2],+c[3],+c[4]];r=VBI.Utilities.HLS2RGB(c[0]/360.0,c[2]/100.0,c[1]/100.0);return[r[0],r[1],r[2],c[3],1];}else if((c=/^hsl\(([\d]+)[,]\s*([\d]+)\%[,]\s*([\d]+)\%\)/.exec(a))){c=[+c[1],+c[2],+c[3]];r=VBI.Utilities.HLS2RGB(c[0]/360.0,c[2]/100.0,c[1]/100.0);return[r[0],r[1],r[2],1.0,0];}else if((c=/^RGBA\(([\d]+)[,;]([\d]+)[,;]([\d]+)[,;]([\d]+|[\d]*.[\d]+)\)/.exec(a))){return[+c[1],+c[2],+c[3],parseFloat(+c[4])/255.0,1];}else if((c=/^RGB\(([\d]+)[,;]([\d]+)[,;]([\d]+)\)/.exec(a))){return[+c[1],+c[2],+c[3],1.0,0];}else if((c=/^ARGB\((0[xX][0-9A-Fa-f]+)[,;](0[xX][0-9A-Fa-f]+)[,;](0[xX][0-9A-Fa-f]+)[,;](0[xX][0-9A-Fa-f]+)\)/.exec(a))){return[parseInt(c[2],16),parseInt(c[3],16),parseInt(c[4],16),parseFloat(+c[1])/255.0,1];}else if((c=/^ARGB\(([\d]+)[,;]([\d]+)[,;]([\d]+)[,;]([\d]+)\)/.exec(a))){return[+c[2],+c[3],+c[4],parseFloat(+c[1])/255.0,1];}else if((c=/^HLSA\(([\d]+)[,;]([\d]+)[,;]([\d]+)[,;]([\d]+)\)/.exec(a))){c=[+c[1],+c[2],+c[3],+c[4]];r=VBI.Utilities.HLS2RGB(c[0]/600.0,c[1]/600.0,c[2]/600.0);return[r[0],r[1],r[2],c[3]/255,1];}else if((c=/^HLS\(([\d]+)[,;]([\d]+)[,;]([\d]+)\)/.exec(a))){c=[+c[1],+c[2],+c[3]];r=VBI.Utilities.HLS2RGB(c[0]/600.0,c[1]/600.0,c[2]/600.0);return[r[0],r[1],r[2],1.0,0];}return[255,0,0,1.0,0];},string2color:function(a){"use strict";var r=this.string2rgba(a);return"rgba("+r[0]+","+r[1]+","+r[2]+","+r[3]+")";},string2rhls:function(a){"use strict";var c;if((c=/^RHLS\(([\d]+|[\d]*.[\d]+)[,;]([\d]+|[\d]*.[\d]+)[,;]([\d]+|[\d]*.[\d]+)\)/.exec(a))){return[parseFloat(+c[1])/360.0,parseFloat(+c[2]),parseFloat(+c[3]),1.0];}else if((c=/^RHLSA\(([\d]+|[\d]*.[\d]+)[,;]([\d]+|[\d]*.[\d]+)[,;]([\d]+|[\d]*.[\d]+)[,;]([\d]+|[\d]*.[\d]+)\)/.exec(a))){return[parseFloat(+c[1])/360.0,parseFloat(+c[2]),parseFloat(+c[3]),parseFloat(+c[4])];}return null;},color2array:function(a){"use strict";var c;if((c=/^rgba\(([\d]+)[,]([\d]+)[,]([\d]+)[,]([\d]+|[\d]*.[\d]+)\)/.exec(a))){c=[parseInt(+c[1],10),parseInt(+c[2],10),parseInt(+c[3],10),parseFloat(+c[4])];return c;}return null;},string2long:function(a){"use strict";if(typeof a=="boolean"){return a?1:0;}return parseInt(a,10);},string2float:function(a){"use strict";if(typeof a=="boolean"){return a?1.0:0.0;}return parseFloat(a);},float2string:function(a){"use strict";return a.toString();},vector2string:function(a){"use strict";var t="";for(var n=0;n<a.length;++n){t+=a[n];if((n+1)<a.length){t+=";";}}return t;},color2string:function(a){"use strict";var r;if((r=/^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(a))){r=[+r[1],+r[2],+r[3],parseInt(parseFloat(+r[4])*255.0,10)];return"RGBA("+r[0]+","+r[1]+","+r[2]+","+r[3]+")";}return null;},long2float:function(a){"use strict";return parseFloat(a,10);},float2long:function(a){"use strict";return parseInt(a,10);}};
VBI.DataTypeProvider=function(){"use strict";var d={};d.m_datatypenodes=[];d.vbiclass="DataTypeProvider";d.isParentOf=function(p,c){if(!c){return false;}var t=c;while((t=t.m_Parent)){if(t==p){return true;}}return false;};d.clear=function(){var o,n=this.m_datatypenodes.length;for(var a=0;a<n;++a){if((o=this.m_datatypenodes[a])){o.clear();}}this.m_datatypenodes=[];};d.set=function(a,c){if(a.type&&a.name){if((a.type=="N")){if(jQuery.type(a.N)=='object'){var b;if((b=d.GetTypeNode(a.name,true))){b.load(a.N);return;}}}}else{this.clear();}var e;if(jQuery.type(a.N)=='object'){this.m_datatypenodes.push(e=new VBI.DataTypeProvider.DataTypeNode(this,this.m_datatypenodes.length));if(a.name){e.m_Name=a.name;}if(a.N.key){e.m_Key=a.N.key;}e.load(a.N);}else if(jQuery.type(a.N)=='array'){for(var i=0,l=a.N.length;i<l;++i){this.m_datatypenodes.push(e=new VBI.DataTypeProvider.DataTypeNode(this,this.m_datatypenodes.length));if(a.N[i].name){e.m_Name=a.N[i].name;}if(a.N[i].key){e.m_Key=a.N[i].key;}e.load(a.N[i]);}}};d.load=function(a,c){if(a.Set){if(jQuery.type(a.Set)=='object'){d.set(a.Set,c);}else if(jQuery.type(a.Set)=='array'){for(var i=0,l=a.Set.length;i<l;++i){d.set(a.Set[i],c);}}}};d.GetTypeNode=function(n,b){for(var i=0;i<this.m_datatypenodes.length;++i){if(this.m_datatypenodes[i].m_Name==n){return this.m_datatypenodes[i];}}if(!b){return null;}var a;this.m_datatypenodes.push(a=new VBI.DataTypeProvider.DataTypeNode(null,this.m_datatypenodes.length));a.m_Name=n;return a;};d.FindTypeRefs=function(){var r=[];for(var i=0,l=this.m_datatypenodes.length;i<l;++i){var a=this.m_datatypenodes[i].m_Ref;if(a){r.push({m_Ref:a,m_DTN:this.m_datatypenodes[i]});}}return r;};d.FindTypeNodeFromPath=function(p){var n,a=this.GetTypeNode(p[0],false);for(var b=1;b<p.length;++b){if(!(n=a.GetTypeNode(p[b],false))){continue;}a=n;}return a;};d.FindTypeAttributeFromPath=function(p){var n=[];for(var a=0;a<(p.length-1);++a){n.push(p[a]);}var b=this.FindTypeNodeFromPath(n);return b?b.GetTypeAttribute(p[p.length-1]):null;};VBI.DataTypeProvider.DataTypeNode=function(p,a){var b={};b.m_datatypenodes=[];b.m_datatypeattributes=[];b.m_nArrayIndex=a;b.m_Name="";b.m_Key=null;b.m_Ref=null;b.m_Parent=p;b.m_MinSelect=1;b.m_MaxSelect=1;b.clear=function(){var o,n,c;b.m_Parent=null;c=b.m_datatypenodes.length;for(n=0;n<c;++n){if((o=b.m_datatypenodes[n])){o.clear();}}b.m_datatypenodes=[];c=b.m_datatypeattributes.length;for(n=0;n<c;++n){if((o=b.m_datatypeattributes[n])){o.clear();}}b.m_datatypeattributes=[];};b.load=function(c){if(c.name){b.m_Name=c.name;}if(c.key){b.m_Key=c.key;}if(c.ref){b.m_Ref=c.ref;}if(c.minSel){b.m_MinSelect=parseInt(c.minSel,10);}if(c.maxSel){b.m_MaxSelect=parseInt(c.maxSel,10);}var i;if(c.A){var t;if(jQuery.type(c.A)=='array'){for(i=0;i<c.A.length;++i){t=b.GetTypeAttribute(c.A[i].name,true);t.load(c.A[i]);}}else if(jQuery.type(c.A)=='object'){t=b.GetTypeAttribute(c.A.name,true);t.load(c.A);}}if(c.N){var e;if(jQuery.type(c.N)=='array'){for(i=0;i<c.N.length;++i){b.m_datatypenodes.push(e=new VBI.DataTypeProvider.DataTypeNode(this,b.m_datatypenodes.length));e.load(c.N[i]);}}else if(jQuery.type(c.N)=='object'){b.m_datatypenodes.push(e=new VBI.DataTypeProvider.DataTypeNode(this,b.m_datatypenodes.length));e.load(c.N);}}};b.GetTypeNode=function(n,c){var e=b.m_datatypenodes;for(var i=0,l=e.length;i<l;++i){if(e[i].m_Name==n){return e[i];}}if(!c){return null;}var f;e.push(f=new VBI.DataTypeProvider.DataTypeNode(this,e.length));f.m_Name=n;return f;};b.GetKeyTypeAttribute=function(){if(b.m_Key){return b.GetTypeAttribute(b.m_Key,true);}else{return b.GetTypeAttribute("VB:ix",true);}return null;};b.GetSelectTypeAttribute=function(c){return b.GetTypeAttribute("VB:s",c);};b.GetPath=function(){var n=[];var c=this;do{n.splice(0,0,c.m_Name);}while((c=c.m_Parent)&&c['m_Name']);return n;};b.GetTypeAttribute=function(n,c){var e=b.m_datatypeattributes;for(var i=0,l=e.length;i<l;++i){var f=e[i];if(f.m_Alias==n||f.m_Name==n){return f;}}if(c){var g;e.push(g=new VBI.DataTypeProvider.DataTypeAttribute(e.length));g.m_Name=n;g.m_Parent=this;g.m_Type=(n=="VB:s")?VBI.Types.st_bool:VBI.Types.st_string;return g;}return null;};return b;};VBI.DataTypeProvider.DataTypeAttribute=function(a){var b={};b.m_Name="";b.m_Alias="";b.m_bChangeable=false;b.m_Type=VBI.Types.st_unknown;b.m_nArrayIndex=a;b.m_Parent=null;b.clear=function(){b.m_Parent=null;};b.load=function(c){if(c.name){b.m_Name=c.name;}if(c.alias){b.m_Alias=c.alias;}if(c.changeable){b.m_bChangeable=VBI.Types.string2bool(c.changeable);}if(c.type){switch(c.type){case"vectorarraymulti":b.m_Type=VBI.Types.st_vectorarraymulti;break;case"vectorarray":b.m_Type=VBI.Types.st_vectorarray;break;case"vector":b.m_Type=VBI.Types.st_vector;break;case"long":b.m_Type=VBI.Types.st_long;break;case"string":b.m_Type=VBI.Types.st_string;break;case"color":b.m_Type=VBI.Types.st_color;break;case"boolean":b.m_Type=VBI.Types.st_bool;break;case"float":b.m_Type=VBI.Types.st_float;break;default:b.m_Type=VBI.Types.st_string;break;}}};return b;};return d;};
VBI.DataProvider=function(){"use strict";var d={};var N=0,E=1,A=2;d.vbiclass="DataProvider";d.m_datanodes=[];d.m_dtp=null;d.m_Ctx=null;d.clear=function(){var o,n=d.m_datanodes.length;for(var a=0;a<n;++a){if((o=d.m_datanodes[a])){o.clear();}}d.m_datanodes=[];d.m_Ctx=null;d.m_dtp=null;};d.set=function(a,c){var b=c.m_DataTypeProvider;if(!b){jQuery.sap.log.error("Data types are not available");return;}if(a.type&&a.name){if((a.type=="N")){if(jQuery.type(a.N)=='object'){var e;var p=a.name.split(".");if((e=this.FindNodeFromPath(p))){if(a.name!=a.N.name){jQuery.sap.log.error("Node loading delta operation failed");return;}e.load(a.N,b.FindTypeNodeFromPath(p));return;}}}}else{this.clear();}if(a.N){var f,n,g;if(jQuery.type(a.N)=='object'){f=b.GetTypeNode(g=a.N.name,true);this.m_datanodes[f.m_nArrayIndex]=(n=new VBI.DataProvider.DataNode());n.m_Parent=this;n.m_Name=g;n.load(a.N,f);}else if(jQuery.type(a.N)=='array'){for(var i=0;i<a.N.length;++i){f=b.GetTypeNode(g=a.N[i].name,true);this.m_datanodes[f.m_nArrayIndex]=(n=new VBI.DataProvider.DataNode());n.m_Parent=this;n.m_Name=g;n.load(a.N[i],f);}}}};d.remove=function(i,c){var a,n;if(i.type=="N"&&(n=i.name)){if((a=this.FindNodeFromPath(n.split(".")))){a.m_Parent.RemoveNode(a);}}else if(i.type=="E"&&(n=i.name)){if((a=this.FindNodeFromPath(n.split(".")))){a.RemoveElements(i.N);}}};d.load=function(a,c){var b=c.m_DataTypeProvider;if(a.Remove){if(jQuery.type(a.Remove)=='object'){this.remove(a.Remove,c);}else if(jQuery.type(a.Remove)=='array'){for(var n=0,l=a.Remove.length;n<l;++n){this.remove(a.Remove[n],c);}}}if(a.Set){if(jQuery.type(a.Set)=='object'){d.set(a.Set,c);}else if(jQuery.type(a.Set)=='array'){for(var i=0;i<a.Set.length;++i){d.set(a.Set[i],c);}}}d.m_dtp=b;d.m_Ctx=c;};d.store=function(a){if(this.IsModified()){a.Data={};a.Data.Merge={};var n=a.Data.Merge.N=[];var t;for(var b=0;b<this.m_datanodes.length;++b){if((t=this.m_datanodes[b])&&t.IsModified()){var c={};n.push(c);t.store(c);}}}};d.OnAttributeChanged=function(a){var b;if((b=d.m_Ctx.m_Actions)){var c;if((c=b.findAction("AttributeChanged",null,null))){var i=a.m_Parent.GetPath()+"."+a.m_dta.m_Name;d.m_Ctx.FireAction(c,null,null,null,null,i);}}};d.OnNodeChanged=function(n){var a;if((a=d.m_Ctx.m_Actions)){var b;if((b=a.findAction("NodeChanged",null,null))){var p=null;if(n.m_Parent&&n.m_Parent.GetPath){p=n.m_Parent.GetPath()+".";}else{p="";}d.m_Ctx.FireAction(b,null,null,null,null,p+n.m_dtn.m_Name);}}};d.OnElementChanged=function(e){var a;if((a=d.m_Ctx.m_Actions)){var b;if((b=a.findAction("ElementChanged",null,null))){d.m_Ctx.FireAction(b,null,null,null,null,e.GetPath());}}};d.IsModified=function(){var t;for(var n=0;n<this.m_datanodes.length;++n){if((t=this.m_datanodes[n])&&t.IsModified()){return true;}}return false;};d.RemoveNode=function(n){var a=n.m_dtn.m_nArrayIndex;this.m_datanodes[a].clear();this.m_datanodes[a]=null;};d.FindFromPathEx=function(p,s,t,e,n){var P=false,c=null,a=null,b=null;if(n){P=true;b=n;c=n.m_dtn;}else if(e){a=e;c=e.m_Parent.m_dtn;}for(var f=s,l=p.length;f<l;++f){if(P){if(c.m_Key){if((a=b.FindElementByKey(p[f]))){P=false;continue;}}else if(VBI.isInt(p[f])){a=b.m_dataelements[parseInt(p[f],10)];P=false;continue;}else{if(b.m_dataelements.length){a=b.m_dataelements[0];}if(!a){VBI.m_bTrace&&VBI.Trace("Error: invalid lead selected element");}}}if(t==A&&(f+1)==l){var g;if((g=c.GetTypeAttribute(p[f],false))){return a.m_dataattributes[g.m_nArrayIndex];}}c=c.GetTypeNode(p[f],true);if(!a){VBI.m_bTrace&&VBI.Trace("Error: Invalid Binding Path "+p);return false;}b=a.m_datanodes[c.m_nArrayIndex];P=true;}if(t==A||t==E){return null;}return b;};d.FindFromPath=function(p,t){if(!d.m_dtp){return null;}var c=d.m_dtp.GetTypeNode(p[0],false);if(!c){return null;}var a=d.m_datanodes[c.m_nArrayIndex];if(!a){return null;}return d.FindFromPathEx(p,1,t,null,a);};d.FindAttributeFromPath=function(p){return d.FindFromPath(p,A);};d.FindNodeFromPath=function(p){return d.FindFromPath(p,N);};d.SetSelection=function(s,c){var t,n=d.m_datanodes;for(var a=0,l=n.length;a<l;++a){if((t=n[a])){t.SetSelection(s,c);}}};VBI.DataProvider.DataNode=function(){var a={};a.m_Name="";a.m_dataelements=[];a.m_Parent=null;a.m_dtn=null;a.m_bModified=false;a.clear=function(){a.m_dtn=null;for(var n=0;n<a.m_dataelements.length;++n){a.m_dataelements[n].clear();a.m_dataelements[n].m_Parent=null;}a.m_dataelements=[];a.m_Parent=null;};a.IsModifiedSelection=function(){return a.m_bModified?true:false;};a.IsModifiedElements=function(){var e=a.m_dataelements;for(var n=0;n<e.length;++n){if(e[n].IsModified()){return true;}}return false;};a.IsModified=function(){if(a.IsModifiedSelection()||a.IsModifiedElements()){return true;}return false;};a.store=function(b){b.name=a.m_dtn.m_Name;if(a.IsModifiedElements()){b.E=[];for(var n=0;n<a.m_dataelements.length;++n){if(a.m_dataelements[n].IsModified()){var e={};b.E.push(e);a.m_dataelements[n].store(e);}}}};a.RemoveNode=function(n){var b=n.m_dtn.m_nArrayIndex;a.m_datanodes[b].clear();a.m_datanodes[b]=null;};a.RemoveElements=function(b){var k=a.m_dtn.GetKeyTypeAttribute();var c=a.GetElementKeyMap(k);if(b.E){if(jQuery.type(b.E)=='object'){a.InternalFindAndRemoveExistingElement(b.E,0,k,c);}else if(jQuery.type(b.E)=='array'){for(var i=0;i<b.E.length;++i){a.InternalFindAndRemoveExistingElement(b.E[i],i,k,c);}}}};a.GetElementKeyMap=function(k){var t,b=[];var c=k?k:a.m_dtn.GetKeyTypeAttribute();for(var n=0;n<a.m_dataelements.length;++n){b[(t=a.m_dataelements[n]).m_dataattributes[c.m_nArrayIndex].m_Value]=t;}return b;};a.FindElementByKey=function(k,b,c){var t;if(c){return(t=c[k])?t:null;}var e=b?b:a.m_dtn.GetKeyTypeAttribute();var f,g=this.m_dataelements;for(var n=0,l=g.length;n<l;++n){if((f=g[n])){if(f.m_dataattributes[e.m_nArrayIndex].m_Value==k){return f;}}}return null;};a.FindElementByIndex=function(i){return this.m_dataelements[i];};a.InternalFindAndRemoveExistingElement=function(b,i,k,c){var e=null,f=null;if(k.m_Alias&&(e=b[k.m_Alias])){f=this.FindElementByKey(e,k,c);}else if(k.m_Name&&(e=b[k.m_Name])){f=this.FindElementByKey(e,k,c);}else{f=this.FindElementByKey(e=i,k,c);}if(f){this.m_dataelements.splice(VBI.IndexOf(this.m_dataelements,f),1);if(c){c.splice(e,1);}f.clear();}};a.InternalFindOrCreateExistingElement=function(b,i,k,c){var e=null,f=null;if(k.m_Alias&&(e=b[k.m_Alias])){f=a.FindElementByKey(e,k,c);}else if(k.m_Name&&(e=b[k.m_Name])){f=a.FindElementByKey(e,k,c);}else{f=a.FindElementByKey(e=i,k,c);}if(f){return f;}f=new VBI.DataProvider.DataElement();a.m_dataelements.push(f);if(c){c[e]=f;}return f;};a.load=function(b,c){a.m_dtn=c;var k=a.m_dtn.GetKeyTypeAttribute();var e=a.GetElementKeyMap(k);if(b.E){var f,g;if(jQuery.type(b.E)=='object'){g=a.InternalFindOrCreateExistingElement(b.E,0,k,e);g.m_Parent=a;g.load(b.E,c);if(g.m_dataattributes[k.m_nArrayIndex]==null){f=new VBI.DataProvider.DataAttribute(k,null,g);f.m_Value=0;g.m_dataattributes[k.m_nArrayIndex]=f;}}else if(jQuery.type(b.E)=='array'){for(var i=0,l=b.E.length;i<l;++i){g=a.InternalFindOrCreateExistingElement(b.E[i],i,k,e);g.m_Parent=a;g.load(b.E[i],c);if(g.m_dataattributes[k.m_nArrayIndex]==null){f=new VBI.DataProvider.DataAttribute(k,null,g);f.m_Value=i;g.m_dataattributes[k.m_nArrayIndex]=f;}}}}};a.GetName=function(){return this.m_Name;};a.GetPath=function(){return this.m_dtn.GetPath();};a.SetModified=function(){this.m_bModified=true;var p=this;while(p.m_Parent){p=p.m_Parent;}if(p){p.OnNodeChanged(this);}};a.GetSelectedElements=function(){var s=[];var e=this.m_dataelements;var k=this.m_dtn.GetTypeAttribute("VB:s",true);for(var n=0,l=e.length;n<l;++n){if(e[n].IsSelected(k)){s.push(e[n]);}}return s;};a.GetNumOfSelectedElements=function(){return(a.m_NumSelectedEltes!=undefined)?a.m_NumSelectedEltes:a.GetSelectedElements().length;};a.SetNumOfSelectedElements=function(){a.m_NumSelectedEltes=a.GetSelectedElements().length;};a.UnSetNumOfSelectedElements=function(){a.m_NumSelectedEltes=undefined;};a.SetSelection=function(s,c){var e=this.m_dataelements;var t=null,k=this.m_dtn.GetTypeAttribute("VB:s",true);if(!s&&c){this.SetNumOfSelectedElements();}for(var n=0,l=e.length;n<l;++n){if((t=e[n])){if(c){t.Select(s);}else{t.SetElementSelectionState(s,k);}}}this.UnSetNumOfSelectedElements();return null;};return a;};VBI.DataProvider.DataElement=function(){this.m_dataattributes=[];this.m_datanodes=[];this.m_Parent=null;this.m_bChangeable=false;};VBI.DataProvider.DataElement.prototype={m_dataattributes:null,m_datanodes:null,m_Parent:null,m_nModified:0,m_bChangeable:false,clear:function(){var n,t;for(n=0;n<this.m_datanodes.length;++n){if((t=this.m_datanodes[n])){t.clear();t.m_Parent=null;}}this.m_datanodes=[];for(n=0;n<this.m_dataattributes.length;++n){if((t=this.m_dataattributes[n])){t.clear();t.m_Parent=null;}}this.m_dataattributes=[];},load:function(b,c){var m=false;this.m_nModified=0;if(b["VB:m"]){if((m=VBI.Types.string2bool(b["VB:m"]))){this.m_nModified=7;}delete b["VB:m"];}if(b["VB:c"]){this.m_bChangeable=VBI.Types.string2bool(b["VB:c"]);delete b["VB:c"];}for(var a in b){if(!b.hasOwnProperty(a)){continue;}if(a=="N"&&!(typeof b[a]=='string')){var l,n;if(jQuery.type(b[a])=='object'){l=c.GetTypeNode(b.N.name,true);this.m_datanodes[l.m_nArrayIndex]=(n=new VBI.DataProvider.DataNode());n.m_Parent=this;n.m_Name=b.N.name;n.load(b[a],l);}else if(jQuery.type(b[a])=='array'){var e=b[a];for(var f=0;f<e.length;++f){var g=e[f];l=c.GetTypeNode(g.name,true);this.m_datanodes[l.m_nArrayIndex]=(n=new VBI.DataProvider.DataNode());n.m_Parent=this;n.m_Name=g.name;n.load(g,l);}}}else{var h=c.GetTypeAttribute(a,true);this.m_dataattributes[h.m_nArrayIndex]=new VBI.DataProvider.DataAttribute(h,b[a],this,m);}}},IsModified:function(a){if(this.m_nModified){return true;}var n,l,t;for(n=0,l=this.m_dataattributes.length;n<l;++n){if((t=this.m_dataattributes[n])&&t.IsModified()){return true;}}for(n=0,l=this.m_datanodes.length;n<l;++n){if((t=this.m_datanodes[n])&&t.IsModified()){return true;}}return false;},IsChangeable:function(){return this.m_bChangeable;},IsSelected:function(k){var i,a=k?k:this.m_Parent.m_dtn.GetSelectTypeAttribute(false);if(a&&((i=a.m_nArrayIndex)<this.m_dataattributes.length)){var t;if((t=this.m_dataattributes[i])){if(a.m_Type==VBI.Types.st_string){return VBI.Types.string2bool(t.m_Value);}else{return(t.m_Value?true:false);}}}return false;},SetModified:function(){this.m_nModified|=1;var p=this;while(p.m_Parent){p=p.m_Parent;}if(p){p.OnElementChanged(this);}},store:function(a){var k=this.m_Parent.m_dtn.GetKeyTypeAttribute();var b=k.m_Alias?k.m_Alias:k.m_Name;a[b]=this.m_dataattributes[k.m_nArrayIndex].GetStringValue();if(this.m_nModified&2){a["VB:c"]=this.m_bChangeable?"true":"false";}if(this.m_nModified&4){a["VB:m"]="true";}var n,l,t;for(n=0,l=this.m_dataattributes.length;n<l;++n){if((t=this.m_dataattributes[n])&&t.IsModified()){var c=t.m_dta.m_Alias?t.m_dta.m_Alias:t.m_dta.m_Name;a[c]=t.GetStringValue();}}for(n=0,l=this.m_datanodes.length;n<l;++n){if((t=this.m_datanodes[n])&&t.IsModified()){t.store(a["N"]={});}}},GetKeyValue:function(){var k;if(this.m_Parent&&(k=this.m_Parent.m_dtn.GetKeyTypeAttribute())){return this.m_dataattributes[k.m_nArrayIndex].m_Value;}return null;},GetPath:function(){var p=null;var c=this;while(c){var k=c.GetKeyValue();if(p){p=k+"."+p;}else{p=k;}var n;if((n=this.m_Parent)){p=this.m_Parent.m_dtn.m_Name+"."+p;}else{break;}if(n.m_Parent&&n.m_Parent.m_Parent){c=n.m_Parent?n.m_Parent:null;}else{break;}}return p;},SetElementSelectionState:function(s,t){var k=t;if(!k){k=t?t:this.m_Parent.m_dtn.GetTypeAttribute("VB:s",true);k.m_Type=VBI.Types.st_bool;}var i=k.m_nArrayIndex;if(this.m_dataattributes[i]==null){this.m_dataattributes[i]=new VBI.DataProvider.DataAttribute(k,null,this);}var S,a=this.m_dataattributes[i];if((S=(a.m_Value!=(s?true:false)))){a.m_Value=s?true:false;a.m_bModified=true;}if(S){this.SetModified();return true;}return false;},GlobalSingleSelect:function(){var a=this.m_Parent.m_dtn;if(a.m_MaxSelect==0){return 0;}this.m_Parent.SetSelection(false,false);this.Select(true);return 1;},Select:function(s,o){var a=this.m_Parent.m_dtn;if(!o){o=0;}var n;if(s){if(a.m_MaxSelect==0){return 0;}if(a.m_MaxSelect<0){n=this.SetElementSelectionState(true)?1:0;return o+n;}if(a.m_MaxSelect==1){this.m_Parent.SetSelection(false,false);this.SetElementSelectionState(true);return 1;}}else{if(((a.m_MinSelect==1)&&(this.m_Parent.GetNumOfSelectedElements()>1))||(a.m_MinSelect==0)){n=this.SetElementSelectionState(false)?1:0;return o-n;}}},FindNodeFromPath:function(p){return d.FindFromPathEx(p,0,N,this,null);},FindAttributeFromPath:function(p){return d.FindFromPathEx(p,0,A,this,null);}};VBI.DataProvider.DataAttribute=function(a,v,p,m){this.m_dta=a;this.m_Parent=p;if(m){this.m_bModified=true;}if(v===null){return;}var b=VBI.Types;if(a.m_Type==b.st_vectorarraymulti){this.m_Value=b.stringarray2vectorarray(v);}else if(a.m_Type==b.st_vectorarray||a.m_Type==b.st_vector){this.m_Value=b.string2vector(v);}else if(a.m_Type==b.st_long){this.m_Value=b.string2long(v);}else if(a.m_Type==b.st_float){this.m_Value=b.string2float(v);}else if(a.m_Type==b.st_bool){this.m_Value=b.string2bool(v);}else if(a.m_Type==b.st_color){this.m_Value=b.string2color(v);}else if(a.m_Type==b.st_string){this.m_Value=v;}else{this.m_Value=v;}};VBI.DataProvider.DataAttribute.prototype={m_dta:null,m_Value:null,m_Parent:null,m_bModified:false,clear:function(){this.m_Parent=null;this.m_dta=null;},store:function(a){},set:function(v){if(v!=this.m_Value){this.SetModified();}this.m_Value=v;},SetModified:function(){this.m_bModified=true;var p=this;while(p.m_Parent){p=p.m_Parent;}if(p){p.OnAttributeChanged(this);}},IsModified:function(){return this.m_bModified;},IsChangeable:function(){return(this.m_dta.m_bChangeable&&this.m_Parent.m_bChangeable);},GetStringValue:function(){var t="";switch(this.m_dta.m_Type){case VBI.Types.st_vectorarray:case VBI.Types.st_vector:return VBI.Types.vector2string(this.m_Value);case VBI.Types.st_long:t+=this.m_Value;return t;case VBI.Types.st_float:t+=this.m_Value;return t;case VBI.Types.st_string:return this.m_Value;case VBI.Types.st_bool:return this.m_Value?"true":"false";case VBI.Types.st_color:var c;if((c=/^rgba\(([\d]+),([\d]+),([\d]+),([\d]+|[\d]*.[\d]+)\)/.exec(this.m_Value))){c=[+c[1],+c[2],+c[3],parseInt(parseFloat(+c[4])*255.0,10)];return"RGBA("+c[0]+","+c[1]+","+c[2]+","+c[3]+")";}break;default:return this.m_Value;}}};return d;};
VBI.Adaptor=function(c){"use strict";var C=c;this.RecursiveLoadElement=function(d,o,a){var n;for(n=0;n<a.m_datatypeattributes.length;++n){var b=a.m_datatypeattributes[n];var e=o[b.m_Name];if(e===undefined){continue;}if((b.m_Type==VBI.Types.st_vector)&&jQuery.type(e)=="array"){d[b.m_Alias]=""+e[0]+";"+e[1]+";0";}else{d[b.m_Alias]=e.toString();}}if(a.m_datatypenodes.length){var f=d.N=[];for(n=0;n<a.m_datatypenodes.length;++n){var g=f[n]={};var h=a.m_datatypenodes[n];var i=o[h.m_Name];if(i){this.RecursiveLoad(g,i,h);}}}};this.RecursiveLoad=function(d,o,a){d.name=a.m_Name;d.E=[];var b;if(jQuery.type(o)=='array'){for(var n=0;n<o.length;++n){b=d.E[n]={};this.RecursiveLoadElement(b,o[n],a);}}else{b=d.E[0]={};this.RecursiveLoadElement(b,o,a);}};this.LoadFindRefNode=function(d){var r=C.m_DataTypeProvider.FindTypeRefs();for(var n=0,l=r.length;n<l;++n){var s=d;var p=r[n].m_Ref.split(".");for(var a=0,b=p.length;a<b;++a){s=s[p[a]];if(s&&((a+1)==b)){r[n].m_Root=s;return r[n];}if(!s){break;}}}return null;};this.CreateLoadData=function(d){if(!C.m_DataTypeProvider){return null;}var r=null;if(!(r=this.LoadFindRefNode(d))){return null;}var a=r.m_DTN;var b=r.m_Root;var v={SAPVB:{"version":"2.0","Data":{"Remove":{"type":"N","name":a.m_Name},"Set":{"type":"N","name":a.m_Name,"N":{}}}}};var o=b;var e=v.SAPVB.Data.Set.N;this.RecursiveLoad(e,o,a);return v;};};
