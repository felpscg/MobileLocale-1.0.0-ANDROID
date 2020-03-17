/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/EventProvider','sap/ui/core/InvisibleText','sap/ui/core/ListItem','sap/ui/core/ResizeHandler','sap/ui/core/ValueStateSupport','sap/m/library','sap/ui/core/library','sap/m/Bar','sap/m/Toolbar','sap/m/Button','sap/m/ToggleButton','sap/m/ColumnListItem','sap/m/GroupHeaderListItem','sap/ui/core/SeparatorItem','sap/m/Dialog','sap/m/DisplayListItem','sap/m/List','sap/m/Popover','sap/m/StandardListItem','sap/m/Table','sap/m/Title','sap/m/Text','sap/ui/core/IconPool',"sap/base/security/encodeXML","sap/ui/events/KeyCodes"],function(D,E,I,L,R,V,l,c,B,T,a,b,C,G,S,d,e,f,P,g,h,j,k,m,n,K){"use strict";var o=l.ListMode;var p=l.PlacementType;var q=l.ListType;var r=l.ListSeparators;var s="sapMSuggestionsPopover";var t=c.ValueState;var u=E.extend("sap.m.SuggestionsPopover",{constructor:function(i){E.apply(this,arguments);this._oInput=i;this._bUseDialog=D.system.phone;this._iPopupListSelectedIndex=-1;this._sPopoverContentWidth=null;this._bEnableHighlighting=true;this._bIsInputIncrementalType=false;this._bAutocompleteEnabled=false;this._sTypedInValue='';this._sOldValueState=t.None;this._oInput.addEventDelegate({onsapup:function(v){this._onsaparrowkey(v,"up",1);},onsapdown:function(v){this._onsaparrowkey(v,"down",1);},onsappageup:function(v){this._onsaparrowkey(v,"up",5);},onsappagedown:function(v){this._onsaparrowkey(v,"down",5);},onsaphome:function(v){if(this._oList){this._onsaparrowkey(v,"up",this._oList.getItems().length);}},onsapend:function(v){if(this._oList){this._onsaparrowkey(v,"down",this._oList.getItems().length);}},onsapright:this._onsapright},this);},destroy:function(){if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}if(this._oList){this._oList.destroy();this._oList=null;}if(this._oSuggestionTable){this._oSuggestionTable.destroy();this._oSuggestionTable=null;}this._oProposedItem=null;this._oInputDelegate=null;}});u.M_EVENTS={SELECTION_CHANGE:"selectionChange"};u._wordStartsWithValue=function(i,v){var w;if(!i||!v||typeof i!=="string"||typeof v!=="string"){return false;}while(i){if(typeof v==="string"&&v!==""&&i.toLowerCase().indexOf(v.toLowerCase())===0){return true;}w=i.indexOf(' ');if(w===-1){break;}i=i.substring(w+1);}return false;};u._DEFAULTFILTER=function(v,i){if(i instanceof L&&u._wordStartsWithValue(i.getAdditionalText(),v)){return true;}return u._wordStartsWithValue(i.getText(),v);};u._DEFAULTFILTER_TABULAR=function(v,w){var x=w.getCells(),i=0;for(;i<x.length;i++){if(x[i].getText){if(u._wordStartsWithValue(x[i].getText(),v)){return true;}}}return false;};u._DEFAULTRESULT_TABULAR=function(v){var w=v.getCells(),i=0;for(;i<w.length;i++){if(w[i].getText){return w[i].getText();}}return"";};u.prototype.isOpen=function(){return this._oPopover&&this._oPopover.isOpen();};u.prototype.setInputLabels=function(i){this._fnInputLabels=i;};u.prototype._getInputLabels=function(){return this._fnInputLabels();};u.prototype.updatePickerHeaderTitle=function(){var i=sap.ui.getCore().getLibraryResourceBundle("sap.m"),v=this.getPickerTitle(),w,x;if(!v){return;}x=this._getInputLabels();if(x.length){w=x[0];if(w&&(typeof w.getText==="function")){v.setText(w.getText());}}else{v.setText(i.getText("COMBOBOX_PICKER_TITLE"));}return v;};u.prototype.getPickerTitle=function(){return this._oPopover.getCustomHeader().getContentMiddle()[0];};u.prototype.getOkButton=function(){var i=this._oPopover&&this._oPopover.getBeginButton();return i||null;};u.prototype.getCancelButton=function(){var i=this._oPopover&&this._oPopover.getCustomHeader()&&this._oPopover.getCustomHeader().getContentRight()[0];return i||null;};u.prototype.getFilterSelectedButton=function(){var i=this._oPopover&&this._oPopover.getSubHeader()&&this._oPopover.getSubHeader().getContent()[1];return i||null;};u.prototype._createFilterSelectedButton=function(){var i=m.getIconURI("multiselect-all");return new b({icon:i});};u.prototype._createSuggestionPopup=function(O){O=O||[];var i=this._oInput,v=this,M=i._oRb;this._oPopover=!this._bUseDialog?(new P(i.getId()+"-popup",{showArrow:false,showHeader:true,placement:p.VerticalPreferredBottom,initialFocus:i,horizontalScrolling:true})):(new d(i.getId()+"-popup",{beginButton:new a(i.getId()+"-popup-closeButton",{text:M.getText("SUGGESTIONSPOPOVER_CLOSE_BUTTON")}),stretch:true,customHeader:new B(i.getId()+"-popup-header",{contentMiddle:new j(),contentRight:new a({icon:m.getIconURI("decline")})}),subHeader:this.createSubHeaderContent(O),horizontalScrolling:false,initialFocus:this._oPopupInput,beforeOpen:function(){v.updatePickerHeaderTitle();},afterClose:function(){i.focus();l.closeKeyboard();}}));this._registerAutocomplete();this._oPopover.addStyleClass(s);this._oPopover.addAriaLabelledBy(I.getStaticId("sap.m","INPUT_AVALIABLE_VALUES"));if(!this._bUseDialog){this._overwritePopover();}if(this._oList){this._oPopover.addContent(this._oList);}};u.prototype.createSubHeaderContent=function(O){var i=[this._oPopupInput];if(O.showSelectedButton){i.push(this._createFilterSelectedButton());}return new T({content:i});};u.prototype._createSuggestionPopupContent=function(i,v){var w=this._oInput;if(!v&&!i){this._oList=new f(w.getId()+"-popup-list",{showNoData:false,mode:o.SingleSelectMaster,rememberSelections:false,width:"100%",showSeparators:r.None,busyIndicatorDelay:0});this._oList.addEventDelegate({onAfterRendering:function(){var z,A;if(!this._bEnableHighlighting){return;}z=this._oList.$().find('.sapMDLILabel, .sapMSLITitleOnly, .sapMDLIValue');A=(this._sTypedInValue||this._oInput.getValue()).toLowerCase();this.highlightSuggestionItems(z,A);}.bind(this)});}else{this._oList=this._getSuggestionsTable();}if(this._oPopover){if(this._bUseDialog){this._oPopover.addAggregation("content",this._oList,true);var x=this._oPopover.$("scrollCont")[0];if(x){var y=sap.ui.getCore().createRenderManager();y.renderControl(this._oList);y.flush(x);y.destroy();}}else{this._oPopover.addContent(this._oList);}}};u.prototype._destroySuggestionPopup=function(){if(this._oPopover){if(this._oList instanceof h){this._oPopover.removeAllContent();}this._oPopover.destroy();this._oPopover=null;}if(this._oList instanceof f){this._oList.destroy();this._oList=null;}this._getInput().removeEventDelegate(this._oInputDelegate,this);};u.prototype._overwritePopover=function(){var i=this._oInput;this._oPopover.open=function(){this.openBy(i,false,true);};this._oPopover.oPopup.setAnimations(function($,v,O){O();},function($,v,w){w();});};u.prototype._resizePopup=function(){var i=this._oInput;if(this._oList&&this._oPopover){if(this._sPopoverContentWidth){this._oPopover.setContentWidth(this._sPopoverContentWidth);}else{this._oPopover.setContentWidth((i.$().outerWidth())+"px");}setTimeout(function(){if(this._oPopover&&this._oPopover.isOpen()&&this._oPopover.$().outerWidth()<i.$().outerWidth()){this._oPopover.setContentWidth((i.$().outerWidth())+"px");}}.bind(this),0);}};u.prototype._registerResize=function(){if(!this._bUseDialog){this._sPopupResizeHandler=R.register(this._oInput,this._resizePopup.bind(this));}};u.prototype._deregisterResize=function(){if(this._sPopupResizeHandler){this._sPopupResizeHandler=R.deregister(this._sPopupResizeHandler);}};u.prototype._onsaparrowkey=function(i,v,w){var x=this._oInput,y,z=x.$("inner");if(i.isMarked()){return;}if(i.isMarked()){return;}if(!x.getEnabled()||!x.getEditable()){return;}if(v!=="up"&&v!=="down"){return;}if(this._bIsInputIncrementalType){i.setMarked();}if(!this._oPopover||!this._oPopover.isOpen()){return;}i.preventDefault();i.stopPropagation();var F=false,A=this._oList,H=A.getItems(),J=this._iPopupListSelectedIndex,N,O=J;if(v==="up"&&J===0){return;}if(v=="down"&&J===H.length-1){return;}var M;if(w>1){if(v=="down"&&J+w>=H.length){v="up";w=1;H[J].setSelected(false);M=J;J=H.length-1;F=true;}else if(v=="up"&&J-w<0){v="down";w=1;H[J].setSelected(false);M=J;J=0;F=true;}}if(J===-1){J=0;if(this._isSuggestionItemSelectable(H[J])){O=J;F=true;}else{v="down";}}if(v==="down"){while(J<H.length-1&&(!F||!this._isSuggestionItemSelectable(H[J]))){H[J].setSelected(false);J=J+w;F=true;w=1;if(M===J){break;}}}else{while(J>0&&(!F||!H[J].getVisible()||!this._isSuggestionItemSelectable(H[J]))){H[J].setSelected(false);J=J-w;F=true;w=1;if(M===J){break;}}}if(!this._isSuggestionItemSelectable(H[J])){if(O>=0){H[O].setSelected(true).updateAccessibilityState();z.attr("aria-activedescendant",H[O].getId());}return;}else{y=H[J];y.setSelected(true).updateAccessibilityState();if(y.isA("sap.m.GroupHeaderListItem")){z.removeAttr("aria-activedescendant");}else{z.attr("aria-activedescendant",H[J].getId());}}if(D.system.desktop){this._scrollToItem(J);}this._oLastSelectedHeader&&this._oLastSelectedHeader.removeStyleClass("sapMInputFocusedHeaderGroup");if(C&&H[J]instanceof C){N=x._getInputValue(x._fnRowResultFilter(H[J]));}else{if(H[J].isA("sap.m.GroupHeaderListItem")){N="";H[J].addStyleClass("sapMInputFocusedHeaderGroup");this._oLastSelectedHeader=H[J];}else if(H[J]instanceof e){N=x._getInputValue(H[J].getLabel());}else{N=x._getInputValue(H[J].getTitle());}}this._iPopupListSelectedIndex=J;this._bSuggestionItemChanged=true;this.fireEvent(u.M_EVENTS.SELECTION_CHANGE,{newValue:N});};u.prototype._isSuggestionItemSelectable=function(i){var v=this._hasTabularSuggestions()||i.getType()!==q.Inactive||i.isA("sap.m.GroupHeaderListItem");return i.getVisible()&&v;};u.prototype._hasTabularSuggestions=function(){if(!this._oSuggestionTable){return;}return!!(this._oSuggestionTable.getColumns()&&this._oSuggestionTable.getColumns().length);};u.prototype.setOkPressHandler=function(H){var O=this.getOkButton();O&&O.attachPress(H);return O;};u.prototype.setCancelPressHandler=function(H){var i=this.getCancelButton();i&&i.attachPress(H);};u.prototype.setShowSelectedPressHandler=function(H){var F=this.getFilterSelectedButton();F&&F.attachPress(H);return F;};u.prototype._scrollToItem=function(i){var v=this._oPopover,w=this._oList,x,y,z,A,F;if(!(v instanceof P)||!w){return;}x=v.getScrollDelegate();if(!x){return;}var H=w.getItems()[i],J=H&&H.getDomRef();if(!J){return;}y=v.getDomRef("cont").getBoundingClientRect();z=J.getBoundingClientRect();A=y.top-z.top;F=z.bottom-y.bottom;if(A>0){x.scrollTo(x._scrollX,Math.max(x._scrollY-A,0));}else if(F>0){x.scrollTo(x._scrollX,x._scrollY+F);}};u.prototype._getSuggestionsTable=function(){var i=this._oInput;if(i._bIsBeingDestroyed){return this._oSuggestionTable;}if(!this._oSuggestionTable){this._oSuggestionTable=new h(i.getId()+"-popup-table",{mode:o.SingleSelectMaster,showNoData:false,showSeparators:r.None,width:"100%",enableBusyIndicator:false,rememberSelections:false,itemPress:function(v){if(D.system.desktop){i.focus();}this._bSuggestionItemTapped=true;var w=v.getParameter("listItem");i.setSelectionRow(w,true);}.bind(this)});this._oSuggestionTable.addEventDelegate({onAfterRendering:function(){var v,w;if(!i.getEnableSuggestionsHighlighting()){return;}v=this._oSuggestionTable.$().find('tbody .sapMLabel');w=(this._sTypedInValue||this._oInput.getValue()).toLowerCase();this.highlightSuggestionItems(v,w);}.bind(this)});if(this._bUseDialog){this._oSuggestionTable.addStyleClass("sapMInputSuggestionTableHidden");}this._oSuggestionTable.updateItems=function(){h.prototype.updateItems.apply(i,arguments);i._refreshItemsDelayed();return i;};}i._oSuggestionTable=this._oSuggestionTable;return this._oSuggestionTable;};u.prototype._createHighlightedText=function(i,v,w){var x,y,z,N,A,F=i?i.innerText:"",H="";if(!u._wordStartsWithValue(F,v)){return n(F);}v=v.toLowerCase();z=v.length;while(u._wordStartsWithValue(F,v)){x=F.toLowerCase();y=x.indexOf(v);y=(y>0)?x.indexOf(' '+v)+1:y;A=F.substring(0,y);F=F.substring(y);H+=n(A);A=F.substring(0,z);F=F.substring(z);H+='<span class="sapMInputHighlight">'+n(A)+'</span>';N=F.indexOf(" ");N=N===-1?F.length:N;A=F.substring(0,N);F=F.substring(N);H+=n(A);if(!w){break;}}if(F){H+=n(F);}return H;};u.prototype.highlightSuggestionItems=function(v,w,W){var i;if(!this._bEnableHighlighting||(!v&&!v.length)){return;}for(i=0;i<v.length;i++){v[i].innerHTML=this._createHighlightedText(v[i],w,W);}};u.prototype._registerAutocomplete=function(){var i=this._oPopover,U=this._getInput(),v=this._bUseDialog;if(v){i.addEventDelegate({ontap:function(){if(!this._bSuggestionItemTapped&&this._sProposedItemText){U.setValue(this._sProposedItemText);this._sProposedItemText=null;}}},this);}else{i.attachAfterOpen(this._handleTypeAhead,this);}i.attachAfterOpen(this._setSelectedSuggestionItem,this);i.attachAfterClose(this._finalizeAutocomplete,this);this._oInputDelegate={onkeydown:function(w){this._bDoTypeAhead=!D.os.android&&this._bAutocompleteEnabled&&(w.which!==K.BACKSPACE)&&(w.which!==K.DELETE);},oninput:this._handleTypeAhead};U.addEventDelegate(this._oInputDelegate,this);};u.prototype._handleTypeAhead=function(){var v=this._getInput(),w=v.getValue();this._oProposedItem=null;this._sProposedItemText=null;this._sTypedInValue=w;if(!this._bDoTypeAhead||w===""){return;}if(!this._oPopover.isOpen()||w.length<this._oInput.getStartSuggestion()){return;}if(document.activeElement!==v.getFocusDomRef()){return;}var x=w.toLowerCase(),y=this._hasTabularSuggestions(),z=y?this._oInput.getSuggestionRows():this._oInput.getSuggestionItems(),A,N,F,i;z=z.filter(function(H){return!(H.isA("sap.ui.core.SeparatorItem")||H.isA("sap.m.GroupHeaderListItem"));});A=z.length;for(i=0;i<A;i++){F=y?this._oInput._fnRowResultFilter(z[i]):z[i].getText();if(F.toLowerCase().indexOf(x)===0){this._oProposedItem=z[i];N=F;break;}}this._sProposedItemText=N;if(N){N=this._formatTypedAheadValue(N);if(!v.isComposingCharacter()){v.updateDomValue(N);}if(D.system.desktop){v.selectText(w.length,N.length);}else{setTimeout(function(){v.selectText(w.length,N.length);},0);}}};u.prototype._setSelectedSuggestionItem=function(){var F;if(this._oList){F=this._oList.getItems();for(var i=0;i<F.length;i++){if((F[i]._oItem||F[i])===this._oProposedItem){F[i].setSelected(true);break;}}}};u.prototype._getInput=function(){return this._bUseDialog?this._oPopupInput:this._oInput;};u.prototype._finalizeAutocomplete=function(){if(this._oInput.isComposingCharacter()){return;}if(!this._bAutocompleteEnabled){return;}if(!this._bSuggestionItemTapped&&!this._bSuggestionItemChanged&&this._oProposedItem){if(this._hasTabularSuggestions()){this._oInput.setSelectionRow(this._oProposedItem,true);}else{this._oInput.setSelectionItem(this._oProposedItem,true);}}if(this._oProposedItem&&document.activeElement===this._oInput.getFocusDomRef()){var i=this._oInput.getValue().length;this._oInput.selectText(i,i);}this._resetTypeAhead();};u.prototype._resetTypeAhead=function(){this._oProposedItem=null;this._sProposedItemText=null;this._sTypedInValue='';this._bSuggestionItemTapped=false;this._bSuggestionItemChanged=false;};u.prototype._formatTypedAheadValue=function(N){return this._sTypedInValue.concat(N.substring(this._sTypedInValue.length,N.length));};u.prototype._onsapright=function(){var i=this._oInput,v=i.getValue();if(!this._bAutocompleteEnabled){return;}if(this._sTypedInValue!==v){this._sTypedInValue=v;i.fireLiveChange({value:v,newValue:v});}};u.prototype.updateValueState=function(v,i,w){var x=w&&v!==t.None;this._showValueStateText(x);i=i||V.getAdditionalText(v);this._setValueStateText(i);this._alignValueStateStyles(v);return this;};u.prototype._getPickerValueStateText=function(){var i=this._oPopover;if(!this._oPickerValueStateText){this._oPickerValueStateText=new k({width:"100%"});i.insertContent(this._oPickerValueStateText,0);}return this._oPickerValueStateText;};u.prototype._showValueStateText=function(i){var v;if(this._bUseDialog){if(this._oPickerValueStateText){this._oPickerValueStateText.setVisible(i);}}else{v=this._getPickerCustomHeader();if(v){v.setVisible(i);}}};u.prototype._setValueStateText=function(i){var H;if(this._bUseDialog){this._oPickerValueStateText=this._getPickerValueStateText();this._oPickerValueStateText.setText(i);}else{H=this._getPickerCustomHeader();if(H){H.getContentLeft()[0].setText(i);}}};u.prototype._getPickerCustomHeader=function(){var i,v,w=this._oPopover,x=s+"Title";if(!w){return null;}if(w.getCustomHeader()){return w.getCustomHeader();}i=new j({textAlign:"Left"}).addStyleClass(x);v=new B({visible:false,contentLeft:i});w.setCustomHeader(v);return v;};u.prototype._alignValueStateStyles=function(v){var i=s+"ValueState",O=s+this._sOldValueState+"State",w=s+v+"State",x;if(this._bUseDialog&&this._oPickerValueStateText){this._oPickerValueStateText.addStyleClass(i);this._oPickerValueStateText.removeStyleClass(O);this._oPickerValueStateText.addStyleClass(w);}else{x=this._getPickerCustomHeader();if(x){x.addStyleClass(i);x.removeStyleClass(O);x.addStyleClass(w);}}this._sOldValueState=v;};return u;});
