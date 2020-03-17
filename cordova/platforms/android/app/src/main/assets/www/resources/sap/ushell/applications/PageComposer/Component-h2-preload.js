//@ui5-bundle Component-h2-preload.js
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/applications/PageComposer/Component.js":["sap/ui/core/UIComponent.js","sap/ushell/applications/PageComposer/controller/CopyDialog.js","sap/ushell/applications/PageComposer/controller/DeleteDialog.controller.js","sap/ushell/applications/PageComposer/controller/ErrorDialog.js"],
"sap/ushell/applications/PageComposer/controller/App.controller.js":["sap/ushell/applications/PageComposer/controller/BaseController.js"],
"sap/ushell/applications/PageComposer/controller/BaseController.js":["sap/base/Log.js","sap/m/MessageBox.js","sap/m/library.js","sap/ui/core/UIComponent.js","sap/ui/core/mvc/Controller.js","sap/ushell/applications/PageComposer/i18n/resources.js","sap/ushell/applications/PageComposer/util/PagePersistence.js","sap/ushell/applications/PageComposer/util/Transport.js"],
"sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js":["sap/base/strings/formatMessage.js","sap/ui/core/Fragment.js","sap/ushell/applications/PageComposer/controller/BaseController.js","sap/ushell/applications/PageComposer/i18n/resources.js"],
"sap/ushell/applications/PageComposer/controller/CopyDialog.js":["sap/base/strings/formatMessage.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller.js":["sap/base/util/merge.js","sap/ui/core/Fragment.js","sap/ui/core/library.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js","sap/ushell/applications/PageComposer/i18n/resources.js"],
"sap/ushell/applications/PageComposer/controller/DeleteDialog.controller.js":["sap/base/strings/formatMessage.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/EditDialog.controller.js":["sap/base/strings/formatMessage.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js"],
"sap/ushell/applications/PageComposer/controller/ErrorDialog.js":["sap/m/MessageToast.js","sap/ui/core/Fragment.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/i18n/resources.js"],
"sap/ushell/applications/PageComposer/controller/Page.js":["sap/base/util/isEmptyObject.js","sap/m/GenericTile.js","sap/m/ImageContent.js","sap/m/NumericContent.js","sap/m/TileContent.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js"],
"sap/ushell/applications/PageComposer/controller/PageDetail.controller.js":["sap/base/Log.js","sap/base/strings/formatMessage.js","sap/m/MessageToast.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js","sap/ushell/applications/PageComposer/controller/Page.js"],
"sap/ushell/applications/PageComposer/controller/PageDetailEdit.controller.js":["sap/m/MessageBox.js","sap/m/MessageItem.js","sap/m/MessagePopover.js","sap/m/MessageToast.js","sap/ui/core/library.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js","sap/ushell/applications/PageComposer/controller/Page.js","sap/ushell/applications/PageComposer/controller/TileSelector.js"],
"sap/ushell/applications/PageComposer/controller/PageOverview.controller.js":["sap/base/Log.js","sap/m/MessageToast.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/controller/BaseController.js"],
"sap/ushell/applications/PageComposer/controller/TileSelector.js":["sap/m/Button.js","sap/m/List.js","sap/m/ResponsivePopover.js","sap/m/StandardListItem.js","sap/m/library.js","sap/ui/model/Filter.js","sap/ui/model/FilterOperator.js","sap/ui/model/Sorter.js","sap/ui/model/json/JSONModel.js","sap/ushell/applications/PageComposer/i18n/resources.js","sap/ushell/services/Container.js"],
"sap/ushell/applications/PageComposer/i18n/resources.js":["sap/ui/model/resource/ResourceModel.js"],
"sap/ushell/applications/PageComposer/util/PagePersistence.js":["sap/ushell/applications/PageComposer/i18n/resources.js"],
"sap/ushell/applications/PageComposer/util/Transport.js":["sap/ui/core/Component.js","sap/ui/model/odata/v2/ODataModel.js","sap/ushell/Config.js","sap/ushell/applications/PageComposer/i18n/resources.js"],
"sap/ushell/applications/PageComposer/view/App.view.xml":["sap/m/NavContainer.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/App.controller.js"],
"sap/ushell/applications/PageComposer/view/CopyDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Label.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/CreatePageDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Input.js","sap/m/Label.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js","sap/ui/layout/form/SimpleForm.js"],
"sap/ushell/applications/PageComposer/view/DeleteDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/EditDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Text.js","sap/ui/core/ComponentContainer.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/ErrorDialog.fragment.xml":["sap/m/Button.js","sap/m/Dialog.js","sap/m/Link.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/core/Fragment.js"],
"sap/ushell/applications/PageComposer/view/Page.fragment.xml":["sap/ui/core/Fragment.js","sap/ui/core/dnd/DropInfo.js"],
"sap/ushell/applications/PageComposer/view/PageDetail.view.xml":["sap/f/DynamicPage.js","sap/f/DynamicPageHeader.js","sap/f/DynamicPageTitle.js","sap/m/Button.js","sap/m/HBox.js","sap/m/ObjectAttribute.js","sap/m/Title.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/PageDetail.controller.js","sap/ushell/applications/PageComposer/view/Page.fragment.xml","sap/ushell/applications/PageComposer/view/PageInfo.fragment.xml"],
"sap/ushell/applications/PageComposer/view/PageDetailEdit.view.xml":["sap/f/DynamicPage.js","sap/f/DynamicPageHeader.js","sap/f/DynamicPageTitle.js","sap/m/Button.js","sap/m/HBox.js","sap/m/ObjectAttribute.js","sap/m/OverflowToolbar.js","sap/m/Page.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/Fragment.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/DynamicSideContent.js","sap/ushell/applications/PageComposer/controller/PageDetailEdit.controller.js","sap/ushell/applications/PageComposer/view/Page.fragment.xml","sap/ushell/applications/PageComposer/view/PageInfoEdit.fragment.xml","sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"],
"sap/ushell/applications/PageComposer/view/PageInfo.fragment.xml":["sap/m/Text.js","sap/ui/core/Fragment.js","sap/ui/layout/form/Form.js","sap/ui/layout/form/FormContainer.js","sap/ui/layout/form/FormElement.js","sap/ui/layout/form/ResponsiveGridLayout.js"],
"sap/ushell/applications/PageComposer/view/PageInfoEdit.fragment.xml":["sap/m/Input.js","sap/m/Text.js","sap/m/TextArea.js","sap/ui/core/Fragment.js","sap/ui/layout/form/Form.js","sap/ui/layout/form/FormContainer.js","sap/ui/layout/form/FormElement.js","sap/ui/layout/form/ResponsiveGridLayout.js"],
"sap/ushell/applications/PageComposer/view/PageOverview.view.xml":["sap/m/Bar.js","sap/m/Button.js","sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/ObjectIdentifier.js","sap/m/OverflowToolbar.js","sap/m/Page.js","sap/m/SearchField.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/ui/core/mvc/XMLView.js","sap/ushell/applications/PageComposer/controller/PageOverview.controller.js"],
"sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml":["sap/m/Button.js","sap/m/CustomTreeItem.js","sap/m/FlexBox.js","sap/m/FlexItemData.js","sap/m/HBox.js","sap/m/OverflowToolbar.js","sap/m/OverflowToolbarButton.js","sap/m/Page.js","sap/m/SearchField.js","sap/m/Text.js","sap/m/Title.js","sap/m/ToolbarSpacer.js","sap/m/Tree.js","sap/m/VBox.js","sap/ui/core/Fragment.js","sap/ui/core/dnd/DragInfo.js"]
}});
