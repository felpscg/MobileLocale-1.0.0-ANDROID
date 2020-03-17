/*
 * jQuery Iframe Transport Plugin 1.7
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
try{(function(f){'use strict';if(typeof define==='function'&&define.amd){define(['jquery'],f);}else{f(window.jQuery);}}(function($){'use strict';var c=0;$.ajaxTransport('iframe',function(o){if(o.async){var f,i,a;return{send:function(_,b){f=$('<form style="display:none;"></form>');f.attr('accept-charset',o.formAcceptCharset);a=/\?/.test(o.url)?'&':'?';if(o.type==='DELETE'){o.url=o.url+a+'_method=DELETE';o.type='POST';}else if(o.type==='PUT'){o.url=o.url+a+'_method=PUT';o.type='POST';}else if(o.type==='PATCH'){o.url=o.url+a+'_method=PATCH';o.type='POST';}c+=1;i=$('<iframe src="about:blank" name="iframe-transport-'+c+'"></iframe>').bind('load',function(){var d,p=$.isArray(o.paramName)?o.paramName:[o.paramName];i.unbind('load').bind('load',function(){var r;try{r=i.contents();if(!r.length||!r[0].firstChild){throw new Error();}}catch(e){r=undefined;}b(200,'success',{'iframe':r});$('<iframe src="about:blank"></iframe>').appendTo(f);window.setTimeout(function(){f.remove();},0);});f.prop('target',i.prop('name')).prop('action',o.url).prop('method',o.type);if(o.formData){$.each(o.formData,function(e,g){$('<input type="hidden"/>').prop('name',g.name).val(g.value).appendTo(f);});}if(o.fileInput&&o.fileInput.length&&o.type==='POST'){d=o.fileInput.clone();o.fileInput.after(function(e){return d[e];});if(o.paramName){o.fileInput.each(function(e){$(this).prop('name',p[e]||o.paramName);});}f.append(o.fileInput).prop('enctype','multipart/form-data').prop('encoding','multipart/form-data');}f.submit();if(d&&d.length){o.fileInput.each(function(e,g){var h=$(d[e]);$(g).prop('name',h.prop('name'));h.replaceWith(g);});}});f.append(i).appendTo(document.body);},abort:function(){if(i){i.unbind('load').prop('src','about:blank');}if(f){f.remove();}}};}});$.ajaxSetup({converters:{'iframe text':function(i){return i&&$(i[0].body).text();},'iframe json':function(i){return i&&$.parseJSON($(i[0].body).text());},'iframe html':function(i){return i&&$(i[0].body).html();},'iframe xml':function(i){var x=i&&i[0];return x&&$.isXMLDoc(x)?x:$.parseXML((x.XMLDocument&&x.XMLDocument.xml)||$(x.body).html());},'iframe script':function(i){return i&&$.globalEval($(i[0].body).text());}}});}));}catch(e){console.log(e);}