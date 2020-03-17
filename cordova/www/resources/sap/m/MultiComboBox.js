/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./InputBase','./ComboBoxTextField','./ComboBoxBase','./Tokenizer','./Token','./List','./StandardListItem','./Popover','./GroupHeaderListItem','./library','sap/ui/core/EnabledPropagator','sap/ui/core/IconPool','sap/ui/core/library','sap/ui/Device','sap/ui/core/Item','sap/ui/core/SeparatorItem','sap/ui/core/ResizeHandler','./MultiComboBoxRenderer',"sap/ui/dom/containsOrEquals","sap/ui/events/KeyCodes","sap/base/util/deepEqual","sap/base/assert","sap/base/Log","sap/ui/core/Core","sap/ui/thirdparty/jquery","sap/ui/dom/jquery/cursorPos","sap/ui/dom/jquery/control"],function(I,C,a,T,b,L,S,P,G,l,E,c,d,D,e,f,R,M,g,K,h,j,k,m,q){"use strict";var n=l.ListType;var o=l.ListMode;var V=d.ValueState;var O=d.OpenState;var p=l.PlacementType;var r=a.extend("sap.m.MultiComboBox",{metadata:{library:"sap.m",designtime:"sap/m/designtime/MultiComboBox.designtime",properties:{selectedKeys:{type:"string[]",group:"Data",defaultValue:[]}},associations:{selectedItems:{type:"sap.ui.core.Item",multiple:true,singularName:"selectedItem"}},events:{selectionChange:{parameters:{changedItem:{type:"sap.ui.core.Item"},selected:{type:"boolean"}}},selectionFinish:{parameters:{selectedItems:{type:"sap.ui.core.Item[]"}}}},dnd:{draggable:false,droppable:true}}});c.insertFontFaceStyle();E.apply(r.prototype,[true]);r.prototype.clone=function(i){var s=a.prototype.clone.apply(this,arguments),t=this._getList();if(t){s.syncPickerContent();}return s;};r.prototype.open=function(){if(!this.isOpen()){this._bPickerIsOpening=true;}this.syncPickerContent();return a.prototype.open.apply(this,arguments);};r.prototype.onsapend=function(i){if(i.isMarked("forwardFocusToParent")){this.focus();}};r.prototype.onsaphome=function(i){if(!this.getFocusDomRef().selectionStart){T.prototype.onsaphome.apply(this._oTokenizer,arguments);}i.setMarked();};r.prototype.onsapdown=function(i){if(!this.getEnabled()||!this.getEditable()){return;}i.setMarked();i.preventDefault();this.syncPickerContent();var s=this.getSelectableItems();var t=s[0];var u=this;if(t&&this.isOpen()){setTimeout(function(){u.getListItem(t).focus();},0);return;}if(this.isFocusInTokenizer()){return;}this._oTraversalItem=this._getNextTraversalItem();if(this._oTraversalItem&&!this.isComposingCharacter()){this.updateDomValue(this._oTraversalItem.getText());this.selectText(0,this.getValue().length);}};r.prototype.onsapup=function(i){if(!this.getEnabled()||!this.getEditable()){return;}i.setMarked();i.preventDefault();if(this.isFocusInTokenizer()){return;}this._oTraversalItem=this._getPreviousTraversalItem();if(this._oTraversalItem){this.updateDomValue(this._oTraversalItem.getText());this.selectText(0,this.getValue().length);}};r.prototype.isFocusInTokenizer=function(){return q.contains(this._oTokenizer.getFocusDomRef(),document.activeElement);};r.prototype.onsapshow=function(i){var s,t,u,v,w,x,y,z;this.syncPickerContent();v=this.getPicker();w=this._getList();x=this.getSelectableItems();y=this.getSelectedItems();z=w.getItemNavigation();u=q(document.activeElement).control()[0];if(u instanceof sap.m.Token){s=this._getItemByToken(u);}else{s=y.length?this._getItemByListItem(this._getList().getSelectedItems()[0]):x[0];}t=this.getItems().indexOf(s);if(z){z.setSelectedIndex(t);}else{this._bListItemNavigationInvalidated=true;this._iInitialItemFocus=t;}v.setInitialFocus(w);a.prototype.onsapshow.apply(this,arguments);};r.prototype.onsaphide=r.prototype.onsapshow;r.prototype._selectItemByKey=function(s){var v,t,u,i,w,x=this.isOpen();if(!this.getEnabled()||!this.getEditable()){return;}if(s){s.setMarked();}v=this._getUnselectedItems(x?"":this.getValue());for(i=0;i<v.length;i++){if(v[i].getText().toUpperCase()===this.getValue().toUpperCase()){u=v[i];w=true;break;}}if(w){t={item:u,id:u.getId(),key:u.getKey(),fireChangeEvent:true,fireFinishEvent:true,suppressInvalidate:true,listItemUpdated:false};this._bPreventValueRemove=false;if(this.getValue()===""||(typeof this.getValue()==="string"&&u.getText().toLowerCase().startsWith(this.getValue().toLowerCase()))){if(this.getListItem(u).isSelected()){this.setValue('');}else{this.setSelection(t);}}}else{if(this.isPickerDialog()){this._showAlreadySelectedVisualEffect();}this._bPreventValueRemove=true;!this.isComposingCharacter()&&this._showWrongValueVisualEffect();}if(s){this.close();}};r.prototype.onsapenter=function(i){I.prototype.onsapenter.apply(this,arguments);this._showAlreadySelectedVisualEffect();if(this.getValue()){this._selectItemByKey(i);}};r.prototype.onsaptabnext=function(i){var s=this.getValue();if(s){var t=this._getUnselectedItemsStartingText(s);if(t.length===1){this._selectItemByKey(i);}else{this._showWrongValueVisualEffect();}}};r.prototype.onsapfocusleave=function(i){var t=this.isPlatformTablet(),s=m.byId(i.relatedControlId),F=s&&s.getFocusDomRef(),u=this.getValue(),v=this.getPicker();if(!this._bPickerIsOpening&&(!v||!v.getFocusDomRef()||!F||!q.contains(v.getFocusDomRef(),F))){this.setValue(null);if(u){this.fireChangeEvent("",{value:u});}if(!(s instanceof b||i.srcControl instanceof b)){this._oTokenizer.scrollToEnd();}if(!q.contains(this.getDomRef(),document.activeElement)){this._oTokenizer._useCollapsedMode(true);}}if(v&&F){if(h(v.getFocusDomRef(),F)&&!t&&!this.isPickerDialog()){this.focus();}}};r.prototype.onfocusin=function(i){var s=this.getPicker();var t=false;var u=s&&s.getFocusDomRef();var v=(s&&s.oPopup.getOpenState())||O.CLOSED;var w=v===O.CLOSING||v===O.CLOSED;var x=this.getPickerType()==="Dropdown";if(x){t=u&&q.contains(u,i.relatedTarget);}if(this.getEditable()){this._oTokenizer._useCollapsedMode(false);this._oTokenizer.scrollToEnd();}if(i.target===this.getFocusDomRef()){this.getEnabled()&&this.addStyleClass("sapMFocus");!w&&t&&this.handleInputValidation(i,false);}if(i.target===this.getOpenArea()&&x&&!this.isPlatformTablet()){this.focus();}if(!this.isOpen()&&this.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}};r.prototype._handleItemTap=function(i){var t=q(i.target).control(0);if(!t.isA("sap.m.CheckBox")&&!t.isA("sap.m.GroupHeaderListItem")){this._bCheckBoxClicked=false;}};r.prototype._handleItemPress=function(i){if(this.isOpen()&&this._isListInSuggestMode()&&this.getPicker().oPopup.getOpenState()!==O.CLOSING){this.clearFilter();var s=this._getLastSelectedItem();if(s){this.getListItem(s).focus();}}};r.prototype._handleSelectionLiveChange=function(i){var s=i.getParameter("listItem");var t=i.getParameter("selected");var N=this._getItemByListItem(s);var u=this.isPickerDialog()?this.getPickerTextField():this;if(s.getType()==="Inactive"){return;}j(N,"The corresponding mapped item was not found on "+this);if(!N){return;}var v={item:N,id:N.getId(),key:N.getKey(),fireChangeEvent:true,suppressInvalidate:true,listItemUpdated:true};if(t){this.fireChangeEvent(N.getText());this.setSelection(v);}else{this.fireChangeEvent(N.getText());this.removeSelection(v);}if(this._bCheckBoxClicked){u.setValue(this._sOldInput);if(this.isOpen()&&this.getPicker().oPopup.getOpenState()!==O.CLOSING){s.focus();}}else{this._bCheckBoxClicked=true;this.setValue("");this.close();}};r.prototype.onkeydown=function(i){a.prototype.onkeydown.apply(this,arguments);if(!this.getEnabled()||!this.getEditable()){return;}this._bIsPasteEvent=(i.ctrlKey||i.metaKey)&&(i.which===K.V);if(this.getValue().length===0&&(i.ctrlKey||i.metaKey)&&(i.which===K.A)&&this._hasTokens()){this._oTokenizer.focus();this._oTokenizer.selectAllTokens(true);i.preventDefault();}if(this.isPickerDialog()){this._sOldValue=this.getPickerTextField().getValue();this._iOldCursorPos=q(this.getFocusDomRef()).cursorPos();}this._bDoTypeAhead=!D.os.android&&(i.which!==K.BACKSPACE)&&(i.which!==K.DELETE);};r.prototype.oninput=function(i){a.prototype.oninput.apply(this,arguments);var s=i.srcControl,t=this.getPickerTextField();if(this.isPickerDialog()&&t.getValueState()===V.Error){t.setValueState(V.None);}else if(this.getValueState()===V.Error){this.setValueState(V.None);}if(!this.getEnabled()||!this.getEditable()){return;}this.syncPickerContent();if(this._bIsPasteEvent){s.updateDomValue(this._sOldValue||"");return;}this.handleInputValidation(i,this.isComposingCharacter());if(this.isOpen()){setTimeout(this._highlightList.bind(this,this._sOldInput));}};r.prototype.filterItems=function(i){var F=this.fnFilter?this.fnFilter:a.DEFAULT_TEXT_FILTER;var s=[];var t=false;var u=[];i.items.forEach(function(v){if(v.isA("sap.ui.core.SeparatorItem")){u.push({separator:v});this.getListItem(v).setVisible(false);t=true;return;}var w=!!F(i.value,v,"getText");if(i.value===""){w=true;if(!this.bOpenedByKeyboardOrButton&&!this.isPickerDialog()){return;}}if(t&&w){this.getListItem(u[u.length-1].separator).setVisible(true);}var x=this.getListItem(v);if(x){x.setVisible(w);w&&s.push(v);}},this);return s;};r.prototype.onkeyup=function(i){if(!this.getEnabled()||!this.getEditable()){return;}this._sOldValue=this.getValue();this._iOldCursorPos=q(this.getFocusDomRef()).cursorPos();};r.prototype._showWrongValueVisualEffect=function(){var i=this.getPickerTextField(),s=this.isPickerDialog()?i.getValueState():this.getValueState(),t=this._sOriginalValueStateText||this._oRbC.getText("VALUE_STATE_ERROR");if(s===V.Error){return;}if(this.isPickerDialog()){i.setValueState(V.Error);i.setValueStateText(t);setTimeout(i["setValueState"].bind(i,s),1000);}else{this.setValueState(V.Error);this.setValueStateText(t);setTimeout(this["setValueState"].bind(this,s),1000);}this._syncInputWidth(this._oTokenizer);};r.prototype._showAlreadySelectedVisualEffect=function(){var i=this.isPickerDialog(),s=this.getPickerTextField(),v=i?s.getValueState():this.getValueState(),t=this.getValue().toLowerCase(),u=this.getSelectedItems().map(function(w){return w.getText().toLowerCase();}),A=this._oRbM.getText("VALUE_STATE_ERROR_ALREADY_SELECTED");if(u.indexOf(t)>-1&&v!==V.Error&&!this.isComposingCharacter()){if(i){s.setValueState(V.Error);s.setValueStateText(A);s.selectText(0,this.getValue().length);}else{this.setValueState(V.Error);this.setValueStateText(A);this.selectText(0,this.getValue().length);}}else{i?s.setValueState(V.None):this.setValueState(V.None);}};r.prototype._hasShowSelectedButton=function(){return true;};r.prototype.forwardEventHandlersToSuggPopover=function(s){a.prototype.forwardEventHandlersToSuggPopover.apply(this,arguments);s.setShowSelectedPressHandler(this._filterSelectedItems.bind(this));};r.prototype._getReadOnlyPopover=function(){if(!this._oReadOnlyPopover){this._oReadOnlyPopover=this._createReadOnlyPopover();}return this._oReadOnlyPopover;};r.prototype._createReadOnlyPopover=function(){return new P({showArrow:true,placement:p.Auto,showHeader:false,contentMinWidth:"auto"}).addStyleClass("sapMMultiComboBoxReadOnlyPopover");};r.prototype.configPicker=function(i){var s=this.getRenderer(),t=s.CSS_CLASS_MULTICOMBOBOX;i.setHorizontalScrolling(false).addStyleClass(s.CSS_CLASS_COMBOBOXBASE+"Picker").addStyleClass(t+"Picker").addStyleClass(t+"Picker-CTX").attachBeforeOpen(this.onBeforeOpen,this).attachAfterOpen(this.onAfterOpen,this).attachBeforeClose(this.onBeforeClose,this).attachAfterClose(this.onAfterClose,this).addEventDelegate({onBeforeRendering:this.onBeforeRenderingPicker,onAfterRendering:this.onAfterRenderingPicker},this);};r.prototype._configureList=function(i){if(!i){return;}i.setMode(o.MultiSelect);i.setIncludeItemInSelection(true);i.attachBrowserEvent("tap",this._handleItemTap,this).attachSelectionChange(this._handleSelectionLiveChange,this).attachItemPress(this._handleItemPress,this);i.addEventDelegate({onAfterRendering:this.onAfterRenderingList,onfocusin:this.onFocusinList},this);};r.prototype._modifyPopupInput=function(i){a.prototype._modifyPopupInput.apply(this,arguments);i.attachSubmit(function(s){var v=i.getValue();if(v){this.setValue(v);this._selectItemByKey();this.setValue(this._sOldInput);this.close();}}.bind(this));i.addEventDelegate({onfocusout:this._handleInputFocusOut},this);return i;};r.prototype.onBeforeRendering=function(){a.prototype.onBeforeRendering.apply(this,arguments);this._bInitialSelectedKeysSettersCompleted=true;this._oTokenizer.setEnabled(this.getEnabled());this.setEditable(this.getEditable());this._deregisterResizeHandler();this._synchronizeSelectedItemAndKey();};r.prototype.syncPickerContent=function(F){var i,s,t=this.getPicker();if(!t){t=this.createPicker(this.getPickerType());this._updateSuggestionsPopoverValueState();F=true;}if(F){i=this.getItems();s=this._getList();this._synchronizeSelectedItemAndKey();s.destroyItems();this._clearTokenizer();this._fillList(i);if(s.getItemNavigation()){this._iFocusedIndex=s.getItemNavigation().getFocusedIndex();}}return t;};r.prototype._registerResizeHandler=function(){j(!this._iResizeHandlerId,"Resize handler already registered");this._iResizeHandlerId=R.register(this,this._onResize.bind(this));};r.prototype._deregisterResizeHandler=function(){if(this._iResizeHandlerId){R.deregister(this._iResizeHandlerId);this._iResizeHandlerId=null;}};r.prototype._onResize=function(){this._oTokenizer.setMaxWidth(this._calculateSpaceForTokenizer());this._syncInputWidth(this._oTokenizer);};r.prototype.onBeforeRenderingPicker=function(){var i=this["_onBeforeRendering"+this.getPickerType()];if(i){i.call(this);}};r.prototype.onAfterRenderingPicker=function(){var i=this["_onAfterRendering"+this.getPickerType()];if(i){i.call(this);}};r.prototype.onBeforeOpen=function(){var i=this["_onBeforeOpen"+this.getPickerType()];this.addStyleClass(I.ICON_PRESSED_CSS_CLASS);this._resetCurrentItem();this.addContent();this._aInitiallySelectedItems=this.getSelectedItems();this._synchronizeSelectedItemAndKey();if(i){i.call(this);}};r.prototype.onAfterOpen=function(){var i=this.getFocusDomRef();i&&this.getRoleComboNodeDomRef().setAttribute("aria-expanded","true");this._bPickerIsOpening=false;if(!this.isPlatformTablet()){this.getPicker().setInitialFocus(this);}this.closeValueStateMessage();};r.prototype.onBeforeClose=function(){a.prototype.onBeforeClose.apply(this,arguments);};r.prototype.onAfterClose=function(){var u=!q.contains(this.getDomRef(),document.activeElement)||this.isPickerDialog(),i=this.getFocusDomRef();i&&this.getRoleComboNodeDomRef().setAttribute("aria-expanded","false");this.removeStyleClass(I.ICON_PRESSED_CSS_CLASS);this.clearFilter();!this.isComposingCharacter()&&!this._bPreventValueRemove&&this.setValue("");this._sOldValue="";this._sOldInput="";this._getSuggestionsPopover()._sTypedInValue="";if(this.isPickerDialog()){this._showAlreadySelectedVisualEffect();this.getPickerTextField().setValue("");this.getFilterSelectedButton()&&this.getFilterSelectedButton().setPressed(false);}this.fireSelectionFinish({selectedItems:this.getSelectedItems()});this._oTokenizer._useCollapsedMode(u);if(this.getValueState()==V.Error&&document.activeElement===this.getFocusDomRef()){this.selectText(0,this.getValue().length);this.openValueStateMessage();}};r.prototype._onBeforeOpenDialog=function(){};r.prototype._onBeforeOpenDropdown=function(){var i=this.getPicker(),s=this.getDomRef(),w;if(s&&i){w=(s.offsetWidth/parseFloat(l.BaseFontSize))+"rem";i.setContentMinWidth(w);}};r.prototype.getFilterSelectedButton=function(){return this._getSuggestionsPopover().getFilterSelectedButton();};r.prototype._filterSelectedItems=function(i,F){var s=i.oSource,t,u,v=this.getPickerTextField()?this.getPickerTextField().getValue():"",w=(s&&s.getPressed&&s.getPressed())||F,x=this.getVisibleItems(),y=this.getItems(),z=this.getSelectedItems(),A=null;if(w){x.forEach(function(B){u=z.indexOf(B)>-1?true:false;t=this.getListItem(B);if(!t){return;}if(t.isA("sap.m.GroupHeaderListItem")){t.setVisible(false);A=t;}else{t.setVisible(u);if(u&&A){A.setVisible(true);}}},this);}else{this.filterItems({value:v,items:y});}};r.prototype.revertSelection=function(){this.setSelectedItems(this._aInitiallySelectedItems);};r.prototype.setSelection=function(i){var s=this._getList();if(i.item&&this.isItemSelected(i.item)){return;}if(!i.item){return;}if(!i.listItemUpdated&&this.getListItem(i.item)&&s){s.setSelectedItem(this.getListItem(i.item),true);}var t=new b({key:i.key});t.setText(i.item.getText());i.item.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"Token",t);this._oTokenizer.addToken(t);this.$().toggleClass("sapMMultiComboBoxHasToken",this._hasTokens());this.setValue('');this.addAssociation("selectedItems",i.item,i.suppressInvalidate);var u=this.getSelectedKeys();var v=this.getKeys([i.item])[0];if(v===""||u.indexOf(v)===-1){u.push(v);this.setProperty("selectedKeys",u,i.suppressInvalidate);}if(i.fireChangeEvent){this.fireSelectionChange({changedItem:i.item,selected:true});}if(i.fireFinishEvent){if(!this.isOpen()){this.fireSelectionFinish({selectedItems:this.getSelectedItems()});}}};r.prototype.removeSelection=function(i){if(i.item&&!this.isItemSelected(i.item)){return;}if(!i.item){return;}this.removeAssociation("selectedItems",i.item,i.suppressInvalidate);var s=this.getSelectedKeys();var t=s.indexOf(i.item.getKey());s.splice(t,1);this.setProperty("selectedKeys",s,i.suppressInvalidate);if(!i.listItemUpdated&&this.getListItem(i.item)){var u=this.getListItem(i.item);this._getList().setSelectedItem(u,false);}if(!i.tokenUpdated){var v=this._getTokenByItem(i.item);i.item.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"Token",null);this._oTokenizer.removeToken(v);}this.$().toggleClass("sapMMultiComboBoxHasToken",this._hasTokens());if(i.fireChangeEvent){this.fireSelectionChange({changedItem:i.item,selected:false});}if(i.fireFinishEvent){if(!this.isOpen()){this.fireSelectionFinish({selectedItems:this.getSelectedItems()});}}};r.prototype.setValueStateText=function(v){var i=[this._oRbC.getText("VALUE_STATE_ERROR"),this._oRbM.getText("VALUE_STATE_ERROR_ALREADY_SELECTED")];if(i.indexOf(v)===-1){this._sOriginalValueStateText=v;}a.prototype.setValueStateText.apply(this,arguments);return this;};r.prototype._synchronizeSelectedItemAndKey=function(){var s=this.getSelectedKeys();var t=this.getKeys(this.getSelectedItems());if(!s.length){k.info("Info: _synchronizeSelectedItemAndKey() the MultiComboBox control does not contain any item on ",this);return;}for(var i=0,u=null,v=null,w=s.length;i<w;i++){u=s[i];if(t.indexOf(u)>-1){continue;}v=this.getItemByKey(""+u);if(v){this.setSelection({item:v,id:v.getId(),key:v.getKey(),fireChangeEvent:false,suppressInvalidate:true,listItemUpdated:false});}}};r.prototype._getTokenByItem=function(i){return i?i.data(this.getRenderer().CSS_CLASS_COMBOBOXBASE+"Token"):null;};r.prototype.updateItems=function(s){var i=function(w){return w&&w.getKey&&w.getKey();},t,u=this.getSelectedItems().map(i),v=this.getSelectedKeys();var U=a.prototype.updateItems.apply(this,arguments);u=this.getSelectedItems().map(i).filter(function(w){return u.indexOf(w)>-1;});t=v.concat(u);this.setSelectedKeys(t);return U;};r.prototype._getSelectedItemsOf=function(s){for(var i=0,t=s.length,u=[];i<t;i++){if(this.getListItem(s[i]).isSelected()){u.push(s[i]);}}return u;};r.prototype._getLastSelectedItem=function(){var t=this._oTokenizer.getTokens();var i=t.length?t[t.length-1]:null;if(!i){return null;}return this._getItemByToken(i);};r.prototype._getOrderedSelectedItems=function(){var s=[];for(var i=0,t=this._oTokenizer.getTokens(),u=t.length;i<u;i++){s[i]=this._getItemByToken(t[i]);}return s;};r.prototype._getFocusedListItem=function(){if(!document.activeElement){return null;}var F=m.byId(document.activeElement.id);if(this._getList()&&g(this._getList().getFocusDomRef(),F.getFocusDomRef())){return F;}return null;};r.prototype._getFocusedItem=function(){var i=this._getFocusedListItem();return this._getItemByListItem(i);};r.prototype._isRangeSelectionSet=function(i){var $=i.getDomRef();return $.indexOf(this.getRenderer().CSS_CLASS_MULTICOMBOBOX+"ItemRangeSelection")>-1?true:false;};r.prototype._hasTokens=function(){return this._oTokenizer.getTokens().length>0;};r.prototype._getCurrentItem=function(){if(!this._oCurrentItem){return this._getFocusedItem();}return this._oCurrentItem;};r.prototype._setCurrentItem=function(i){this._oCurrentItem=i;};r.prototype._resetCurrentItem=function(){this._oCurrentItem=null;};r.prototype._decorateListItem=function(i){i.addDelegate({onkeyup:function(s){var t=null;if(s.which==K.SPACE&&this.isOpen()&&this._isListInSuggestMode()){this.open();t=this._getLastSelectedItem();if(t){this.getListItem(t).focus();}return;}},onkeydown:function(s){var t=null,u=null;if(s.shiftKey&&s.which==K.ARROW_DOWN){u=this._getCurrentItem();t=this._getNextVisibleItemOf(u);}if(s.shiftKey&&s.which==K.ARROW_UP){u=this._getCurrentItem();t=this._getPreviousVisibleItemOf(u);}if(s.shiftKey&&s.which===K.SPACE){u=this._getCurrentItem();this._selectPreviousItemsOf(u);}if(t&&t!==u){if(this.getListItem(u).isSelected()){this.setSelection({item:t,id:t.getId(),key:t.getKey(),fireChangeEvent:true,suppressInvalidate:true});this._setCurrentItem(t);}else{this.removeSelection({item:t,id:t.getId(),key:t.getKey(),fireChangeEvent:true,suppressInvalidate:true});this._setCurrentItem(t);}return;}this._resetCurrentItem();if((s.ctrlKey||s.metaKey)&&s.which==K.A){s.setMarked();s.preventDefault();var v=this.getSelectableItems();var w=this._getSelectedItemsOf(v);if(w.length!==v.length){v.forEach(function(t){this.setSelection({item:t,id:t.getId(),key:t.getKey(),fireChangeEvent:true,suppressInvalidate:true,listItemUpdated:false});},this);}else{v.forEach(function(t){this.removeSelection({item:t,id:t.getId(),key:t.getKey(),fireChangeEvent:true,suppressInvalidate:true,listItemUpdated:false});},this);}}}},true,this);i.addEventDelegate({onsapbackspace:function(s){s.preventDefault();},onsapshow:function(s){s.setMarked();if(this.isOpen()){this.close();return;}if(this.hasContent()){this.open();}},onsaphide:function(s){this.onsapshow(s);},onsapenter:function(s){s.setMarked();this.close();},onsaphome:function(s){s.setMarked();s.preventDefault();var v=this.getSelectableItems();var t=v[0];this.getListItem(t).focus();},onsapend:function(s){s.setMarked();s.preventDefault();var v=this.getSelectableItems();var t=v[v.length-1];this.getListItem(t).focus();},onsapup:function(s){s.setMarked();s.preventDefault();var v=this.getSelectableItems();var t=v[0];var u=q(document.activeElement).control()[0];if(u===this.getListItem(t)){this.focus();s.stopPropagation(true);}},onfocusin:function(s){this.addStyleClass(this.getRenderer().CSS_CLASS_MULTICOMBOBOX+"Focused");},onfocusout:function(s){this.removeStyleClass(this.getRenderer().CSS_CLASS_MULTICOMBOBOX+"Focused");},onsapfocusleave:function(s){var t=this.getAggregation("picker");var u=m.byId(s.relatedControlId);if(t&&u&&h(t.getFocusDomRef(),u.getFocusDomRef())){if(s.srcControl){s.srcControl.focus();}}}},this);if(D.support.touch){i.addEventDelegate({ontouchstart:function(s){s.setMark("cancelAutoClose");}});}};r.prototype._handleInputFocusOut=function(){var i=this.isPickerDialog()?this.getPickerTextField():this,u=this._sOldInput||this._sOldValue||"";i.updateDomValue(u);};r.prototype.onItemChange=function(i){var v=a.prototype.onItemChange.apply(this,arguments);this._forwardItemInfoToToken(i);return v;};r.prototype._forwardItemInfoToToken=function(i){var s=i.getSource(),t=i.getParameters(),u=this._getTokenByItem(s);if(t.name==="enabled"&&u){u.setVisible(t.newValue);}};r.prototype._handleIndicatorPress=function(i){var s;this.syncPickerContent();this._filterSelectedItems(i,true);this.focus();if(this.getEditable()){s=this.getPicker();s.open();}else{this._updatePopoverBasedOnEditMode(false);this._getReadOnlyPopover().openBy(this._oTokenizer);}if(this.isPickerDialog()){this.getFilterSelectedButton().setPressed(true);this.bOpenedByKeyboardOrButton=true;}else{setTimeout(this._oTokenizer["scrollToEnd"].bind(this._oTokenizer),0);}};r.prototype._createTokenizer=function(){var t=new T({tokens:[]}).attachTokenChange(this._handleTokenChange,this);t._setAdjustable(true);t._handleNMoreIndicatorPress(this._handleIndicatorPress.bind(this));t.setParent(this);t.addEventDelegate({onAfterRendering:this._onAfterRenderingTokenizer,onfocusin:function(i){if(this.getEditable()&&q(i.target).hasClass("sapMToken")){t._useCollapsedMode(false);}}},this);return t;};r.prototype._onAfterRenderingTokenizer=function(){setTimeout(this._syncInputWidth.bind(this,this._oTokenizer),0);setTimeout(this._oTokenizer["scrollToEnd"].bind(this._oTokenizer),0);};r.prototype._handleTokenChange=function(i){var t=i.getParameter("type");var s=i.getParameter("token");var u=null;if(t!==T.TokenChangeType.Removed&&t!==T.TokenChangeType.Added){return;}if(t===T.TokenChangeType.Removed){u=(s&&this._getItemByToken(s));if(u&&this.isItemSelected(u)){this.removeSelection({item:u,id:u.getId(),key:u.getKey(),tokenUpdated:true,fireChangeEvent:true,fireFinishEvent:true,suppressInvalidate:true});!this.isPickerDialog()&&!this.isFocusInTokenizer()&&this.focus();this.fireChangeEvent("");}}};r.prototype.onAfterRenderingList=function(){var i=this._getList();if(this._iFocusedIndex!=null&&i.getItems().length>this._iFocusedIndex){i.getItems()[this._iFocusedIndex].focus();this._iFocusedIndex=null;}};r.prototype.onFocusinList=function(){if(this._bListItemNavigationInvalidated){this._getList().getItemNavigation().setSelectedIndex(this._iInitialItemFocus);this._bListItemNavigationInvalidated=false;}};r.prototype.onAfterRendering=function(){a.prototype.onAfterRendering.apply(this,arguments);this._oTokenizer.setMaxWidth(this._calculateSpaceForTokenizer());this._registerResizeHandler();};r.prototype.onfocusout=function(i){this.isOpen()&&this._handleInputFocusOut();this.removeStyleClass("sapMFocus");if(this.getValueState()===V.Error&&this.getValueStateText()===this._oRbM.getText("VALUE_STATE_ERROR_ALREADY_SELECTED")){this.setValueState(V.None);}a.prototype.onfocusout.apply(this,arguments);};r.prototype.onpaste=function(i){var s;if(window.clipboardData){s=window.clipboardData.getData("Text");}else{s=i.originalEvent.clipboardData.getData('text/plain');}var t=this._oTokenizer._parseString(s);if(t&&t.length>0){this.getSelectableItems().forEach(function(u){if(t.indexOf(u.getText())>-1){this.setSelection({item:u,id:u.getId(),key:u.getKey(),fireChangeEvent:true,fireFinishEvent:true,suppressInvalidate:true,listItemUpdated:false});}},this);}};r.prototype.onsapbackspace=function(i){this._showAlreadySelectedVisualEffect();if(!this.getEnabled()||!this.getEditable()){i.preventDefault();return;}if(this.getCursorPosition()>0||this.getValue().length>0){return;}if(!i.isMarked()){T.prototype.onsapbackspace.apply(this._oTokenizer,arguments);}if(i.isMarked("forwardFocusToParent")){this.focus();}i.preventDefault();};r.prototype.onsapdelete=function(i){this._showAlreadySelectedVisualEffect();if(!this.getEnabled()||!this.getEditable()){return;}if(this.getValue()&&!this._isCompleteTextSelected()){return;}if(!i.isMarked()){T.prototype.onsapbackspace.apply(this._oTokenizer,arguments);}if(i.isMarked("forwardFocusToParent")){this.focus();}};r.prototype.onsapnext=function(i){if(i.isMarked()){return;}var F=q(document.activeElement).control()[0];if(!F){return;}if(F===this._oTokenizer||this._oTokenizer.$().find(F.$()).length>0&&this.getEditable()){this.focus();}};r.prototype.onsapprevious=function(i){if(this.getCursorPosition()===0&&!this._isCompleteTextSelected()){if(i.srcControl===this){T.prototype.onsapprevious.apply(this._oTokenizer,arguments);}}};r.prototype.ontap=function(i){a.prototype.ontap.apply(this,arguments);var s=this.getOpenArea();if(!this.getEnabled()||!this.getEditable()){return;}i.setMarked();if(this.isPickerDialog()&&s.contains(i.target)){this.open();}};r.prototype.getOpenArea=function(){if(this.isPickerDialog()){return this.getDomRef();}else{return a.prototype.getOpenArea.apply(this,arguments);}};r.prototype._getItemsStartingWithPerTerm=function(t,i){var s=[],u=i?this.getEnabledItems():this.getSelectableItems(),F=this.fnFilter?this.fnFilter:a.DEFAULT_TEXT_FILTER;u.forEach(function(v){if(F(t,v,"getText")){s.push(v);}},this);return s;};r.prototype._getItemsStartingWith=function(t,i){var s=[],u=i?this.getEnabledItems():this.getSelectableItems();u.forEach(function(v){if(typeof t==="string"&&t!==""&&v.getText().toLowerCase().startsWith(t.toLowerCase())){s.push(v);}},this);return s;};r.prototype._getUnselectedItemsStartingText=function(t){var i=[];this._getUnselectedItems().forEach(function(s){if(typeof t==="string"&&t!==""&&s.getText().toLowerCase().startsWith(t.toLowerCase())){i.push(s);}},this);return i;};r.prototype.getCursorPosition=function(){return this._$input.cursorPos();};r.prototype._isCompleteTextSelected=function(){if(!this.getValue().length){return false;}var i=this._$input[0];if(i.selectionStart!==0||i.selectionEnd!==this.getValue().length){return false;}return true;};r.prototype._selectPreviousItemsOf=function(i){var s;do{s=true;var t=this._getPreviousVisibleItemOf(i);if(t){var u=this.getListItem(t);if(u){s=this.getListItem(t).getSelected();}}this.setSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:true,suppressInvalidate:true});i=t;}while(!s);};r.prototype._getNextVisibleItemOf=function(i){var s=this.getSelectableItems();var t=s.indexOf(i)+1;if(t<=0||t>s.length-1){return null;}return s[t];};r.prototype._getPreviousVisibleItemOf=function(i){var s=this.getSelectableItems();var t=s.indexOf(i)-1;if(t<0){return null;}return s[t];};r.prototype._getNextUnselectedItemOf=function(i){var s=this._getUnselectedItems();var t=s.indexOf(i)+1;if(t<=0||t>s.length-1){return null;}return s[t];};r.prototype._getPreviousUnselectedItemOf=function(i){var s=this._getUnselectedItems();var t=s.indexOf(i)-1;if(t<0){return null;}return s[t];};r.prototype._getNextTraversalItem=function(){var v=this.getValue();var i=v?this._getItemsStartingWithPerTerm(v):[];var s=this._getUnselectedItems();if(i.indexOf(this._oTraversalItem)>-1&&this._oTraversalItem.getText()===this.getValue()){return this._getNextUnselectedItemOf(this._oTraversalItem);}if(i.length&&i[0].getText()===this.getValue()){return this._getNextUnselectedItemOf(i[0]);}return i.length?i[0]:s[0];};r.prototype._getPreviousTraversalItem=function(){var v=this.getValue();var i=v?this._getItemsStartingWithPerTerm(v):[];if(i.indexOf(this._oTraversalItem)>-1&&this._oTraversalItem.getText()===this.getValue()){return this._getPreviousUnselectedItemOf(this._oTraversalItem);}if(i.length&&i[i.length-1].getText()===this.getValue()){return this._getPreviousUnselectedItemOf(i[i.length-1]);}if(i.length){return i[i.length-1];}else{var s=this._getUnselectedItems();if(s.length>0){return s[s.length-1];}else{return null;}}};r.prototype.setSelectedItems=function(i){this.removeAllSelectedItems();if(!i||!i.length){return this;}if(!Array.isArray(i)){k.warning("Warning: setSelectedItems() has to be an array of sap.ui.core.Item instances or of valid sap.ui.core.Item IDs",this);return this;}i.forEach(function(s){if(!(s instanceof e)&&(typeof s!=="string")){k.warning("Warning: setSelectedItems() has to be an array of sap.ui.core.Item instances or of valid sap.ui.core.Item IDs",this);return;}if(typeof s==="string"){s=m.byId(s);}this.setSelection({item:s?s:null,id:s?s.getId():"",key:s?s.getKey():"",suppressInvalidate:true});},this);return this;};r.prototype.addSelectedItem=function(i){if(!i){return this;}if(typeof i==="string"){i=m.byId(i);}this.setSelection({item:i?i:null,id:i?i.getId():"",key:i?i.getKey():"",fireChangeEvent:false,suppressInvalidate:true});return this;};r.prototype.removeSelectedItem=function(i){if(!i){return null;}if(typeof i==="string"){i=m.byId(i);}if(!this.isItemSelected(i)){return null;}this.removeSelection({item:i,id:i.getId(),key:i.getKey(),fireChangeEvent:false,suppressInvalidate:true});return i;};r.prototype.removeAllSelectedItems=function(){var i=[];var s=this.getAssociation("selectedItems",[]);s.forEach(function(t){var u=this.removeSelectedItem(t);if(u){i.push(u.getId());}},this);return i;};r.prototype.removeSelectedKeys=function(i){var s,t=[];if(!i||!i.length||!Array.isArray(i)){return t;}i.forEach(function(u){s=this.getItemByKey(u);if(s){this.removeSelection({item:s?s:null,id:s?s.getId():"",key:s?s.getKey():"",fireChangeEvent:false,suppressInvalidate:true});t.push(s);}},this);return t;};r.prototype.setSelectedKeys=function(i){if(this._bInitialSelectedKeysSettersCompleted){this.setProperty("selectedKeys",[],true);this.removeAllSelectedItems();}this.addSelectedKeys(i);this._bInitialSelectedKeysSettersCompleted=true;return this;};r.prototype.addSelectedKeys=function(i){var s,t=[];i=this.validateProperty("selectedKeys",i);i.forEach(function(u){var v=this.getItemByKey(u);if(v){this.addSelectedItem(v);}else if(u!=null){t.push(u);}},this);if(t.length>0){s=this.getProperty("selectedKeys").filter(function(u){return t.indexOf(u)===-1;});t=s.concat(t);this.setProperty("selectedKeys",t,true);}return this;};r.prototype._getUnselectedItems=function(){var i=q(this.getSelectableItems()).not(this.getSelectedItems()).get();if(!this.isOpen()){return i.filter(function(s){return!s.isA("sap.ui.core.SeparatorItem");});}return i;};r.prototype.getSelectedItems=function(){var i=[],s=this.getAssociation("selectedItems")||[];s.forEach(function(t){var u=m.byId(t);if(u){i.push(u);}},this);return i;};r.prototype.getWidth=function(){return this.getProperty("width")||"100%";};r.prototype.setEditable=function(i){var s=this._getList();a.prototype.setEditable.apply(this,arguments);this._oTokenizer.setEditable(i);if(s){this.syncPickerContent(true);this._updatePopoverBasedOnEditMode(i);}return this;};r.prototype._updatePopoverBasedOnEditMode=function(i){var s=this._getList(),t=i?this.getPicker():this._getReadOnlyPopover(),u=i?o.MultiSelect:o.None;if(s&&!t.getContent().length){s.setMode(u);t.addContent(s);}};r.prototype._mapItemToListItem=function(i){var s,t,u,A;var v=this.getRenderer();if(!i){return null;}A=(i.getAdditionalText&&this.getShowSecondaryValues())?i.getAdditionalText():"";if(i.isA("sap.ui.core.SeparatorItem")){s=this._mapSeparatorItemToGroupHeader(i,v);i.data(v.CSS_CLASS_COMBOBOXBASE+"ListItem",s);this._decorateListItem(s);return s;}t=v.CSS_CLASS_MULTICOMBOBOX+"Item";u=(this.isItemSelected(i))?t+"Selected":"";s=new S({type:n.Active,visible:i.getEnabled()}).addStyleClass(t+" "+u);s.setTooltip(i.getTooltip());i.data(v.CSS_CLASS_COMBOBOXBASE+"ListItem",s);s.setTitle(i.getText());s.setInfo(A);if(u){var w=new b({key:i.getKey()});w.setText(i.getText());i.data(v.CSS_CLASS_COMBOBOXBASE+"Token",w);this._oTokenizer.addToken(w,true);}this.setSelectable(i,i.getEnabled());this._decorateListItem(s);return s;};r.prototype.setSelectable=function(i,s){a.prototype.setSelectable.call(this,i,s);var t=this._getTokenByItem(i);if(t){t.setVisible(s);}};r.prototype._fillList=function(s){if(!s){return null;}if(!this._oListItemEnterEventDelegate){this._oListItemEnterEventDelegate={onsapenter:function(v){if(v.srcControl.isSelected()){v.setMarked();}}};}for(var i=0,t,u=s.length;i<u;i++){t=this._mapItemToListItem(s[i]);t.removeEventDelegate(this._oListItemEnterEventDelegate);t.addDelegate(this._oListItemEnterEventDelegate,true,this,true);this._getList().addAggregation("items",t,true);if(this.isItemSelected(s[i])){this._getList().setSelectedItem(t,true);}}};r.prototype.handleInputValidation=function(i,s){var v=i.target.value,t=this._sOldInput&&this._sOldInput.length>v.length,u=this.isValueValid(v),w,x,y;var z=i.srcControl;if(!u&&v!==""&&!s){this._handleFieldValidationState(z);return;}y=this._getItemsStartingWith(v,true);!s&&this._handleTypeAhead(v,y,z);w=this.getEnabledItems();if(this.isPickerDialog()){x=this.getFilterSelectedButton();if(x!=null&&x.getPressed()){x.setPressed(false);}}if(t){w=this.getItems();}this.filterItems({value:v,items:w});this._sOldInput=v;if((!this.getValue()||!u)&&!this.bOpenedByKeyboardOrButton&&!this.isPickerDialog()){this.close();}else{this.open();}};r.prototype.isValueValid=function(v){var s=this._getItemsStartingWith(v,true);var i=this._getItemsStartingWithPerTerm(v,true);return s.length||i.length;};r.prototype._handleTypeAhead=function(v,i,s){var t=this.getSelectedItems();var u=i.filter(function(w){if(w.isA("sap.ui.core.SeparatorItem")){return false;}return t.indexOf(w)===-1;});if(this._bDoTypeAhead&&u.length){s.updateDomValue(u[0].getText());if(document.activeElement===s.getFocusDomRef()){s.selectText(v.length,s.getValue().length);}}};r.prototype._handleFieldValidationState=function(i){if(this._sOldInput&&this.isValueValid(this._sOldInput)){i.updateDomValue(this._sOldInput);}else if(this._sOldValue&&this.isValueValid(this._sOldValue)){i.updateDomValue(this._sOldValue);}else{i.updateDomValue("");}if(this._iOldCursorPos){q(i.getFocusDomRef()).cursorPos(this._iOldCursorPos);}this._showWrongValueVisualEffect();};r.prototype.init=function(){this._oRb=m.getLibraryResourceBundle("sap.m");a.prototype.init.apply(this,arguments);this._bInitialSelectedKeysSettersCompleted=false;this._bListItemNavigationInvalidated=false;this._iInitialItemFocus=-1;this._bCheckBoxClicked=true;this._bPreventValueRemove=false;this._oTokenizer=this._createTokenizer();this._aInitiallySelectedItems=[];this._oRbM=m.getLibraryResourceBundle("sap.m");this._oRbC=m.getLibraryResourceBundle("sap.ui.core");this._fillList();};r.prototype.clearSelection=function(){this.removeAllSelectedItems();};r.prototype.insertItem=function(i,s){this.insertAggregation("items",i,s,true);if(i){i.attachEvent("_change",this.onItemChange,this);}if(this._getList()){this._getList().insertItem(this._mapItemToListItem(i),s);}return this;};r.prototype.removeItem=function(i){i=this.removeAggregation("items",i);if(this._getList()){this._getList().removeItem(i&&this.getListItem(i));}this.removeSelection({item:i,id:i?i.getId():"",key:i?i.getKey():"",fireChangeEvent:false,suppressInvalidate:true,listItemUpdated:true});return i;};r.prototype.isItemSelected=function(i){return this.getSelectedItems().indexOf(i)>-1;};r.prototype._clearTokenizer=function(){this._oTokenizer.destroyAggregation("tokens");};r.prototype.exit=function(){var i=["_oTokenizer","_oSuggestionPopover","_oToggleButton","_oPickerCustomHeader","_oCustomHeaderToolbar","_oPickerCloseButton"],t=this;a.prototype.exit.apply(this,arguments);this._deregisterResizeHandler();i.forEach(function(s){if(t[s]){t[s].destroy();t[s]=null;}});};r.prototype.destroyItems=function(){this.destroyAggregation("items");this.setProperty("selectedKeys",[],true);if(this._getList()){this._getList().destroyItems();}this._oTokenizer.destroyTokens();return this;};r.prototype.removeAllItems=function(){var i=this.removeAllAggregation("items");this.removeAllSelectedItems();if(this._getList()){this._getList().removeAllItems();}return i;};r.prototype._getItemByToken=function(t){return this._getItemBy(t,"Token");};r.prototype.getAccessibilityInfo=function(){var t=this.getSelectedItems().map(function(s){return s.getText();}).join(" ");var i=a.prototype.getAccessibilityInfo.apply(this,arguments);i.type=m.getLibraryResourceBundle("sap.m").getText("ACC_CTR_TYPE_MULTICOMBO");i.description=((i.description||"")+" "+t).trim();return i;};r.prototype._calculateSpaceForTokenizer=function(){if(this.getDomRef()){var s,i=this.getDomRef().offsetWidth,t=this._calculateIconsSpace(),u=this.$().find(".sapMInputBaseInner"),v=["min-width","padding-right","padding-left"],w=v.reduce(function(A,x){return A+(parseInt(u.css(x))||0);},0);s=i-(t+w);s=s<0?0:s;return s+"px";}else{return null;}};r.prototype._syncInputWidth=function(t){var F=this.getDomRef('inner'),s,i;if(!F||(t&&!t.getDomRef())){return;}s=this._calculateIconsSpace();i=Math.ceil(t.getDomRef().getBoundingClientRect().width);F.style.width='calc(100% - '+Math.floor(s+i)+"px";};r.prototype.applyShowItemsFilters=function(){this.syncPickerContent();this.filterItems({value:this.getValue()||"_",items:this.getItems()});};return r;});
