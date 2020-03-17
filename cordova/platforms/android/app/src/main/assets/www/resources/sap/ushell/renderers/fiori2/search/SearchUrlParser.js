// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchHelper','sap/ushell/renderers/fiori2/search/SearchUrlParserInav2'],function(S,a){"use strict";var b=function(){this.init.apply(this,arguments);};b.prototype={init:function(p){this.model=p.model;this.urlParserInav2=new a(p);},parse:function(){if(S.getHashFromUrl().indexOf('#Action-search')!==0){return jQuery.when(undefined);}if(!S.hasher.hasChanged()){return jQuery.when(undefined);}return this.model.initBusinessObjSearch().then(function(){var p=S.getUrlParameters();if($.isEmptyObject(p)){return undefined;}if(p.datasource){return this.urlParserInav2.parseUrlParameters(p);}return this.parseUrlParameters(p);}.bind(this)).then(function(){this.model.setProperty("/searchTermPlaceholder",this.model.calculatePlaceholder());this.model.calculateSearchButtonStatus();this.model._firePerspectiveQuery(true);}.bind(this));},parseUrlParameters:function(p){if(p.top){var t=parseInt(p.top,10);this.model.setTop(t,false);}var f;if(p.filter){var c=JSON.parse(p.filter);try{f=this.model.sinaNext.parseFilterFromJson(c);}catch(e){f=this.model.sinaNext.createFilter();if(c.searchTerm){f.setSearchTerm(c.searchTerm);}sap.m.MessageBox.show(sap.ushell.resources.i18n.getText('searchUrlParsingErrorLong')+'\n('+e.toString()+')',{icon:sap.m.MessageBox.Icon.ERROR,title:sap.ushell.resources.i18n.getText('searchUrlParsingError'),actions:[sap.m.MessageBox.Action.OK]});}this.model.setProperty("/uiFilter",f);this.model.setDataSource(f.dataSource,false,false);}},render:function(){return this.renderFromParameters(this.model.getTop(),this.model.getProperty('/uiFilter'),true);},renderFromParameters:function(t,f,e){var h="#Action-search";h+="&/top="+t;if(e){h+="&filter="+encodeURIComponent(JSON.stringify(f.toJson()));}else{h+="&filter="+JSON.stringify(f.toJson());}return h;}};return b;});
