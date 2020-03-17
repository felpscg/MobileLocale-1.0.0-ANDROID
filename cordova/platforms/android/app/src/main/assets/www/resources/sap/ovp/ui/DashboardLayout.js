sap.ui.define(["sap/ui/core/Control","sap/ui/thirdparty/jquery","sap/ui/Device","sap/ui/core/ResizeHandler","sap/ovp/app/resources","sap/ovp/app/OVPUtils","sap/ui/events/KeyCodes","sap/ui/events/F6Navigation"],function(C,q,D,R,O,a,K,F){"use strict";var b=C.extend("sap.ovp.ui.DashboardLayout",{metadata:{designTime:true,library:"sap.ovp",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},defaultAggregation:"content",events:{afterRendering:{},afterDragEnds:{}},properties:{dragAndDropRootSelector:{group:"Misc",type:"string"},dragAndDropEnabled:{group:"Misc",type:"boolean",defaultValue:true},debounceTime:{group:"Misc",type:"int",defaultValue:150}}},renderer:{render:function(r,o){var d=o.$().width();var e=sap.ui.getCore().getConfiguration().getRTL();var l=o.dashboardLayoutUtil.updateLayoutData(d?d:q(window).width());var f=o.dashboardLayoutUtil.getCards(l.colCount);function g(n){return n.getVisible();}function h(n){return n.id===this.getId().split("--")[1];}var i=o.getContent().filter(g);r.write("<div");r.writeControlData(o);r.addClass("sapUshellEasyScanLayout");if(!D.system.phone){r.addClass("sapOvpDashboardDragAndDrop");}r.addClass("sapOvpDashboard");r.writeClasses();e?r.addStyle("margin-right",l.marginPx+"px"):r.addStyle("margin-left",l.marginPx+"px");r.writeStyles();r.write(">");r.write("<div class='sapUshellEasyScanLayoutInner' role='list' aria-label='Cards' tabindex='0'>");if(f.length>0){var j={},k,L,s,m=o.getDashboardLayoutModel().getColCount();for(k=0,L=i.length;k<L;k++){var S=['easyScanLayoutItemWrapper','sapOvpDashboardLayoutItem'];j=f.filter(h.bind(i[k]))[0];o.dashboardLayoutUtil.setCardCssValues(j);s=j.dashboardLayout.column+j.dashboardLayout.colSpan===m+1;if(s){j.dashboardLayout.colSpan===1?S.push('sapOvpNotResizableLeftRight'):S.push('sapOvpNotResizableRight');}if(j.template==='sap.ovp.cards.stack'||j.settings.stopResizing||!D.system.desktop){S.push('sapOvpDashboardLayoutItemNoDragIcon');}r.write("<div id='"+o.dashboardLayoutUtil.getCardDomId(j.id)+"' class='"+S.join(' ')+"' style='"+"; transform:translate3d("+j.dashboardLayout.left+" ,"+j.dashboardLayout.top+" ,0px)"+"; -ms-transform:translate3d("+j.dashboardLayout.left+" ,"+j.dashboardLayout.top+" ,0px)"+"; -moz-transform:translate3d("+j.dashboardLayout.left+" ,"+j.dashboardLayout.top+" ,0px)"+"; -webkit-transform:translate3d("+j.dashboardLayout.left+" ,"+j.dashboardLayout.top+" ,0px)"+"; height:"+j.dashboardLayout.height+"; width:"+j.dashboardLayout.width+";'"+" tabindex='0'; aria-setsize="+L+" aria-posinset="+(k+1));r.writeAccessibilityState(undefined,{role:"listitem"});r.write(">");r.renderControl(i[k]);r.write("<div class='lastElement' tabindex='0'></div>");r.write("</div>");}}r.write("</div>");r.write("<div class='after' tabindex='0'></div>");r.write("</div>");}},init:function(){this.data("sap-ui-fastnavgroup","true",true);this.oColumnLayoutData={};this.resizeHandlerId=this.initResizeHandler();var o=sap.ui.getCore().getComponent(this._sOwnerId);this.dashboardLayoutUtil=o.getDashboardLayoutUtil();this.dashboardLayoutUtil.setLayout(this);},exit:function(){if(this.resizeHandlerId){R.deregister(this.resizeHandlerId);}if(this.layoutDragAndDrop){this.layoutDragAndDrop.destroy();delete this.layoutDragAndDrop;}},onBeforeRendering:function(){},onAfterRendering:function(){this.keyboardNavigation=new c(this);if(!this.getDragAndDropRootSelector()){this.setDragAndDropRootSelector("#"+this.getId());}if(this.layoutDragAndDrop){this.layoutDragAndDrop.destroy();}if(this.getDragAndDropEnabled()){this.layoutDragAndDrop=this.dashboardLayoutUtil.getRearrange({rootSelector:this.getDragAndDropRootSelector(),layout:this});this.fireAfterRendering();}},getLayoutDataJSON:function(){return this.dashboardLayoutUtil.getDashboardLayoutModel().getLayoutVariants4Pers();},filterVisibleCards:function(e){return e.getVisible();},getDashboardLayoutUtil:function(){return this.dashboardLayoutUtil;},getDashboardLayoutModel:function(){return this.dashboardLayoutUtil.getDashboardLayoutModel();},getVisibleLayoutItems:function(){var d=this.getContent();var f=d.filter(this.filterVisibleCards);return f;},initResizeHandler:function(){var r;var d=this.getDebounceTime();var e=function(f){window.clearTimeout(r);r=window.setTimeout(this.oControl.resizeHandler.bind(this,f),d);};return R.register(this,e);},resizeHandler:function(e){this.oControl.dashboardLayoutUtil.resizeLayout(e.size.width);},setActive:function(s){if(s){this.removeStyleClass("ovpOverlay");}else{this.addStyleClass("ovpOverlay");}},getActive:function(){return!this.hasStyleClass("ovpOverlay");}});var c=function(o){this.init(o);};c.prototype.init=function(o){this.layoutUtil=o.getDashboardLayoutUtil();this.layoutModel=o.getDashboardLayoutModel();this.keyCodes=K;this.jqElement=o.$();this.bIgnoreSelfFocus=false;this.sLastFocusableCard=null;this.lastFocussedElement=null;this.jqElement.on('keydown',this.keyDownHandler.bind(this));this.jqElement.on('keyup',this.keyUpHandler.bind(this));this.jqElement.find(".sapUshellEasyScanLayoutInner").on("focus.keyboardNavigation",this.layoutFocusHandler.bind(this));this.jqElement.on("focus.keyboardNavigation",".easyScanLayoutItemWrapper",this.layoutItemFocusHandler.bind(this));q('body').on('keyup',this.bodyKeyupHandler.bind(this));q('body').on('keydown',this.bodyKeydownHandler.bind(this));q(".sapFDynamicPageContent").on("click",this.layoutClickHandler.bind(this));this.jqElement.find(".after").on("focus.keyboardNavigation",this.afterFocusHandler.bind(this));};c.prototype.spacebarHandler=function(e){a.bCRTLPressed=e.ctrlKey||e.metaKey;var i=sap.ui.getCore().byId(e.target.id);if(i&&i.mEventRegistry.hasOwnProperty('press')){q('#'+e.target.id).addClass('sapMLIBActive');q('#'+e.target.id+' span').css('color','#FFFFFF');i.firePress();}};c.prototype.bodyKeyupHandler=function(e){if(e.ctrlKey||e.metaKey){a.bCRTLPressed=false;}};c.prototype.bodyKeydownHandler=function(e){if(e.ctrlKey||e.metaKey){a.bCRTLPressed=true;}};c.prototype.layoutItemFocusHandler=function(){var j=q(document.activeElement);if(j){var l=j.find("[aria-label]");var i,s="";if(j.find('.valueStateText').length==1){var t=j.find('.valueStateText').find('.sapMObjectNumberText').text();var v=j.find('.valueStateText').find('.sapUiInvisibleText').text();j.find('.valueStateText').attr('aria-label',t+" "+v);j.find('.valueStateText').attr('aria-labelledby',"");}j.find("[role='listitem']").attr('aria-label',"");if(j.hasClass('easyScanLayoutItemWrapper')){var d="";var e=j.find('.cardCount');var f=O.getText("cardPositionInApp",[j.attr('aria-posinset'),j.attr('aria-setsize')]);if(e.length===0){d="countDiv_"+new Date().getTime();var g='<div id="'+d+'" class="cardCount" aria-label="'+f+'" hidden></div>';j.append(g);}else{d=e[0].id;e.attr('aria-label',f);}s+=d+" ";var o=j.find('.cardType');if(o.length!==0){s+=o[0].id+" ";}}if(j.hasClass('sapOvpCardHeader')&&!j.hasClass('sapOvpStackCardContent')){var h="";var k=j.find('.cardHeaderType');if(k.length===0){var m=O.getText("CardHeaderType");h="cardHeaderType_"+new Date().getTime();var n='<div id="'+h+'" class="cardHeaderType" aria-label="'+m+'" hidden></div>';j.append(n);}else{h=k[0].id;}s+=h+" ";}for(i=0;i<l.length;i++){if(l[i].getAttribute("role")==="heading"){s+=l[i].id+" ";}}if(j.hasClass('sapOvpCardHeader')){var p=j.find('.cardHeaderText');if(p.length!==0){for(var i=0;i<p.length;i++){if(s.indexOf(p[i].id)===-1){s+=p[i].id+" ";}}}}if(s.length){j.attr("aria-labelledby",s);}if(j.prop('nodeName')==="LI"&&j.find('.linkListHasPopover').length!==0){if(j.find('#hasDetails').length===0){j.append("<div id='hasDetails' hidden>"+O.getText("HAS_DETAILS")+"</div>");j.attr('aria-describedby',"hasDetails");}}var r=j.attr("id");if((r&&r.indexOf("ovpTable")!=-1)&&j.find("[role='Link']")&&!j.hasClass('sapUiCompSmartLink')){var u=j.closest("td").attr("data-sap-ui-column"),w=j.closest("tbody").siblings().children().filter("tr").children();for(var i=0;i<w.length;i++){if(w[i].getAttribute("data-sap-ui")==u&&w[i].hasChildNodes("span")){var x=w[i].firstElementChild.getAttribute("id");j.attr("aria-labelledby",x);}}}}};c.prototype.layoutFocusHandler=function(e){if(q(e.relatedTarget).hasClass('easyScanLayoutItemWrapper')){return;}if(this.sLastFocusableCard){this.sLastFocusableCard.focus();this.layoutUtil.sLastFocusableCard=this.sLastFocusableCard;return;}this.jqElement.find(".easyScanLayoutItemWrapper").first().focus();this.sLastFocusableCard=this.jqElement.find(".easyScanLayoutItemWrapper").first();this.layoutUtil.sLastFocusableCard=this.sLastFocusableCard;};c.prototype.layoutClickHandler=function(e){if(e&&e.target&&e.target.getAttribute("id")&&e.target.getAttribute("id").indexOf("mainView")!==-1){if(this.sLastFocusableCard){this.sLastFocusableCard.focus();this.layoutUtil.sLastFocusableCard=this.sLastFocusableCard;return;}this.jqElement.find(".easyScanLayoutItemWrapper").first().focus();this.sLastFocusableCard=this.jqElement.find(".easyScanLayoutItemWrapper").first();this.layoutUtil.sLastFocusableCard=this.sLastFocusableCard;}};c.prototype.ctrlArrowHandler=function(o,d){var e=this.layoutUtil.dashboardLayoutModel.getCardById(d),f=o.dashboardLayout.row,g=e.dashboardLayout.row,n=e.dashboardLayout.column,h=[],i;if(g>f&&e.dashboardLayout.rowSpan>=o.dashboardLayout.rowSpan){i=f+e.dashboardLayout.rowSpan;}else{i=g;}this.layoutUtil.dashboardLayoutModel._arrangeCards(o,{row:i,column:n},'drag',h);this.layoutUtil.dashboardLayoutModel._removeSpaceBeforeCard(h);this.layoutUtil._positionCards(this.layoutModel.aCards);this.layoutUtil.oLayoutCtrl.fireAfterDragEnds({positionChanges:h});};c.prototype.shiftArrowHandler=function(o,s,d){if(o.template==="sap.ovp.cards.stack"){return;}this.resizeStartHandler(o,d);var e=this.layoutUtil.calculateCardProperties(o.id),l=e.leastHeight+2*this.layoutUtil.CARD_BORDER_PX,L=Math.ceil(l/this.layoutUtil.getRowHeightPx());if(s.rowSpan<=L){s.rowSpan=L;s.showOnlyHeader=true;d.classList.add("sapOvpMinHeightContainer");}else{s.showOnlyHeader=false;d.classList.remove("sapOvpMinHeightContainer");}var r=this.layoutUtil.dashboardLayoutModel.resizeCard(o.id,s,true,this.layoutUtil.dragOrResizeChanges);this.resizeStopHandler(r.resizeCard,d);};c.prototype.resizeStartHandler=function(o,d){this.layoutUtil.dragOrResizeChanges=[];this.layoutUtil.resizeStartCard={cardId:o.id,rowSpan:o.dashboardLayout.rowSpan,colSpan:o.dashboardLayout.colSpan,maxColSpan:o.dashboardLayout.maxColSpan,noOfItems:o.dashboardLayout.noOfItems,autoSpan:o.dashboardLayout.autoSpan,showOnlyHeader:o.dashboardLayout.showOnlyHeader};d.classList.add('sapOvpCardResize');o.dashboardLayout.autoSpan=false;};c.prototype.resizeStopHandler=function(o,d){d.classList.remove('sapOvpCardResize');d.style.zIndex='auto';this.layoutUtil._sizeCard(o);this.layoutUtil._positionCards(this.layoutModel.aCards);o.dashboardLayout.maxColSpan=o.dashboardLayout.colSpan;this.layoutUtil.dragOrResizeChanges.push({changeType:"dragOrResize",content:{cardId:o.id,dashboardLayout:{rowSpan:o.dashboardLayout.rowSpan,oldRowSpan:this.layoutUtil.resizeStartCard.rowSpan,colSpan:o.dashboardLayout.colSpan,oldColSpan:this.layoutUtil.resizeStartCard.colSpan,maxColSpan:o.dashboardLayout.maxColSpan,oldMaxColSpan:this.layoutUtil.resizeStartCard.maxColSpan,noOfItems:o.dashboardLayout.noOfItems,oldNoOfItems:this.layoutUtil.resizeStartCard.noOfItems,autoSpan:o.dashboardLayout.autoSpan,oldAutoSpan:this.layoutUtil.resizeStartCard.autoSpan,showOnlyHeader:o.dashboardLayout.showOnlyHeader,oldShowOnlyHeader:this.layoutUtil.resizeStartCard.showOnlyHeader}},isUserDependent:true});this.layoutUtil.getDashboardLayoutModel().extractCurrentLayoutVariant();this.layoutUtil.oLayoutCtrl.fireAfterDragEnds({positionChanges:this.layoutUtil.dragOrResizeChanges});};c.prototype.keyUpHandler=function(e){switch(e.keyCode){case this.keyCodes.SPACE:this.spacebarHandler(e);break;default:break;}};c.prototype.keyDownHandler=function(e){var d=document.activeElement,s=this.layoutUtil.getCardId(d.id),f=q.extend([],this.layoutModel.aCards),o=this.layoutModel.getCardById(s),g=this.layoutModel.iColCount,t={},h,l,m,r,n,p,u,S,I=sap.ui.getCore().getConfiguration().getRTL(),v=q(document.activeElement);this.layoutModel._sortCardsByRow(f);for(var i=1;i<=g;i++){t[i]=[];}for(var j=0;j<f.length;j++){h=f[j].dashboardLayout.column;l=f[j].dashboardLayout.colSpan;if(l===1){t[h].push(f[j]);}else{for(var k=h;k<h+l;k++){t[k].push(f[j]);}}}r=this.getCardPosition(s,t[o.dashboardLayout.column]);switch(e.keyCode){case this.keyCodes.TAB:if(e.shiftKey){this.shiftTabButtonHandler(e);}else{this.tabButtonHandler(e);}break;case this.keyCodes.F6:if(e.shiftKey){this.bIgnoreSelfFocus=true;this.jqElement.find(".sapUshellEasyScanLayoutInner").focus();F.handleF6GroupNavigation(e);}else{this.bIgnoreSelfFocus=true;var w=this.jqElement.scrollTop();this.jqElement.find(".after").focus();F.handleF6GroupNavigation(e);this.jqElement.scrollTop(w);}break;case this.keyCodes.F7:e.preventDefault();if(v.hasClass("easyScanLayoutItemWrapper")){v.find(":sapTabbable").first().focus();}else{v.closest(".easyScanLayoutItemWrapper").focus();}break;case this.keyCodes.ARROW_UP:e.preventDefault();m=o.dashboardLayout.column;r--;n=t[m][r]&&t[m][r].id;if(n&&e.ctrlKey){this.ctrlArrowHandler(o,n);this.setFocusOnCard(s);}else if(e.shiftKey){S={rowSpan:o.dashboardLayout.rowSpan-3,colSpan:o.dashboardLayout.colSpan};this.shiftArrowHandler(o,S,e.target);this.setFocusOnCard(s);}else if(v&&v.hasClass("easyScanLayoutItemWrapper")){this.setFocusOnCard(n);}break;case this.keyCodes.ARROW_DOWN:e.preventDefault();m=o.dashboardLayout.column;r++;n=t[m][r]&&t[m][r].id;if(n&&e.ctrlKey){this.ctrlArrowHandler(o,n);this.setFocusOnCard(s);}else if(e.shiftKey){if((o.template==="sap.ovp.cards.linklist"&&o.settings.listFlavor==='carousel'&&o.dashboardLayout.rowSpan>=45)){return;}S={rowSpan:o.dashboardLayout.rowSpan+3,colSpan:o.dashboardLayout.colSpan};this.shiftArrowHandler(o,S,e.target);this.setFocusOnCard(s);}else{this.setFocusOnCard(n);}break;case this.keyCodes.ARROW_LEFT:var x=q(document.activeElement);if(!x.hasClass('easyScanLayoutItemWrapper')){return;}e.preventDefault();m=o.dashboardLayout.column;m--;if(!t[m]||!t[m][r]){do{if(m===0){m=g;r--;break;}if(r<0){break;}m--;}while(!t[m]||!t[m][r])}n=t[m][r]&&t[m][r].id;if(n&&e.ctrlKey){this.ctrlArrowHandler(o,n);this.setFocusOnCard(s);}else if(e.shiftKey){if(I){if((o.template==="sap.ovp.cards.list"&&o.dashboardLayout.colSpan===2)||(o.template==="sap.ovp.cards.linklist"&&o.settings.listFlavor==='carousel'&&o.dashboardLayout.colSpan===3)){return;}S={rowSpan:o.dashboardLayout.rowSpan,colSpan:o.dashboardLayout.colSpan+1};}else{if(o.dashboardLayout.colSpan===1){return;}S={rowSpan:o.dashboardLayout.rowSpan,colSpan:o.dashboardLayout.colSpan-1};}this.shiftArrowHandler(o,S,e.target);this.setFocusOnCard(s);}else{this.setFocusOnCard(n);}break;case this.keyCodes.ARROW_RIGHT:e.preventDefault();m=o.dashboardLayout.column+o.dashboardLayout.colSpan;if(!t[m]||!t[m][r]){do{if(m>g){m=1;r++;break;}m++;}while(!t[m]||!t[m][r])}n=t[m][r]&&t[m][r].id;if(n&&e.ctrlKey){this.ctrlArrowHandler(o,n);this.setFocusOnCard(s);}else if(e.shiftKey){if(I){if(o.dashboardLayout.colSpan===1){return;}S={rowSpan:o.dashboardLayout.rowSpan,colSpan:o.dashboardLayout.colSpan-1};}else{if((o.template==="sap.ovp.cards.list"&&o.dashboardLayout.colSpan===2)||(o.template==="sap.ovp.cards.linklist"&&o.settings.listFlavor==='carousel'&&o.dashboardLayout.colSpan===3)){return;}S={rowSpan:o.dashboardLayout.rowSpan,colSpan:o.dashboardLayout.colSpan+1};}this.shiftArrowHandler(o,S,e.target);this.setFocusOnCard(s);}else{this.setFocusOnCard(n);}break;case this.keyCodes.PAGE_UP:e.preventDefault();m=o.dashboardLayout.column;if(e.altKey==true){(m===1)?r=0:m=1;n=t[m][r]&&t[m][r].id;}else{p=t[m].length-1;for(var i=p;i>0;i--){u=document.getElementById(this.layoutUtil.getCardDomId(t[m][i].id));if(u.getBoundingClientRect().bottom<0){n=t[m][i].id;break;}}if(!n){n=t[m][0].id;}}this.setFocusOnCard(n);break;case this.keyCodes.PAGE_DOWN:e.preventDefault();m=o.dashboardLayout.column;if(e.altKey==true){n=(m+o.dashboardLayout.colSpan)>g?f[f.length-1].id:t[g][r]&&t[g][r].id;}else{var y=q(window).height();p=t[m].length;for(var i=0;i<p;i++){u=document.getElementById(this.layoutUtil.getCardDomId(t[m][i].id));if(u.getBoundingClientRect().top>y){n=t[m][i].id;break;}}if(!n){n=t[m][p-1].id;}}this.setFocusOnCard(n);break;case this.keyCodes.HOME:e.preventDefault();m=o.dashboardLayout.column;if(e.ctrlKey==true){(r===0)?m=1:r=0;}else{(m===1)?r=0:m=1;}n=t[m][r]&&t[m][r].id;this.setFocusOnCard(n);break;case this.keyCodes.END:e.preventDefault();m=o.dashboardLayout.column;if(e.ctrlKey==true){var z=t[m].length-1;n=(z===r)?f[f.length-1].id:t[m][z]&&t[m][z].id;}else{n=(m+o.dashboardLayout.colSpan)>g?f[f.length-1].id:t[g][r]&&t[g][r].id;}this.setFocusOnCard(n);break;case this.keyCodes.ENTER:this.spacebarHandler(e);break;default:break;}};c.prototype.setFocusOnCard=function(d){if(d){var e=document.getElementById(this.layoutUtil.getCardDomId(d));e&&e.focus();this.sLastFocusableCard=e;this.layoutUtil.sLastFocusableCard=this.sLastFocusableCard;}};c.prototype.getCardPosition=function(d,e){for(var i=0;i<e.length;i++){if(e[i].id===d){break;}}return i;};c.prototype.tabButtonHandler=function(e){var j=q(document.activeElement);this.lastFocussedElement=j;if(j.hasClass("easyScanLayoutItemWrapper")){return;}var d=j.closest(".easyScanLayoutItemWrapper");if(!d.length){return;}var l=d.find(q(".lastElement"));if(j.is(l)){e.stopPropagation();e.stopImmediatePropagation();var f=this.jqElement.scrollTop();this._ignoreSelfFocus=true;this.jqElement.find(".after").focus();this.jqElement.scrollTop(f);}};c.prototype.shiftTabButtonHandler=function(e){var j=q(document.activeElement);if(j.hasClass('after')&&this.lastFocussedElement){this.lastFocussedElement.focus();return;}if(!j.hasClass("easyScanLayoutItemWrapper")){return;}this._ignoreSelfFocus=true;this.lastFocussedElement=j;this.jqElement.find(".sapUshellEasyScanLayoutInner").focus();};c.prototype.afterFocusHandler=function(){if(this._ignoreSelfFocus){this._ignoreSelfFocus=false;return;}var j,l;if(this.lastFocussedElement&&this.lastFocussedElement.hasClass('lastElement')){j=this.jqElement.find(this.lastFocussedElement.parent());l=j.find(":sapTabbable").last();}else if(this.lastFocussedElement&&this.lastFocussedElement.hasClass('easyScanLayoutItemWrapper')){l=this.lastFocussedElement;}else{j=this.jqElement.find(".easyScanLayoutItemWrapper:sapTabbable").first();l=j.find(":sapTabbable").last();}if(!l.length){l=j;}l.focus();};return b;});
