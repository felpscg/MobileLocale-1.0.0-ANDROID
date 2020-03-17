//@ui5-bundle Component-preload.js
sap.ui.require.preload({
	"sap/ushell/applications/PageComposer/Component.js":function(){//${copyright}

sap.ui.define([
    "sap/ui/core/UIComponent",
    "./controller/CopyDialog",
    "./controller/DeleteDialog.controller",
    "./controller/ErrorDialog"
], function (UIComponent, CopyDialog, DeleteDialog, ErrorDialog) {
    "use strict";

    return UIComponent.extend("sap.ushell.applications.PageComposer.Component", {

        metadata: {
            "manifest": "json"
        },

        /**
         * Initializes the component
         *
         * @protected
         */
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRouter().initialize();

            this.getModel("PageRepository").setHeaders({
                "sap-language": sap.ushell.Container.getUser().getLanguage(),
                "sap-client": sap.ushell.Container.getLogonSystem().getClient()
            });
        },

        /**
         * Shows an error dialog
         * @param {object} oError The error object
         *
         * @protected
         */
        showErrorDialog: function (oError) {
            ErrorDialog.open(oError);
        },

        /**
         * Get the component defined in the metadata "componentUsages" property
         *
         * @param {string} [pagePackage] The page package name
         * @returns {Promise<sap.ui.core.Component>} Promise resolving to the component instance
         *
         * @protected
         */
        createTransportComponent: function (pagePackage) {
            return this.createComponent({
                async: true,
                usage: "transportInformation",
                componentData: {
                    "package": pagePackage
                }
            });
        }

    });
});
},
	"sap/ushell/applications/PageComposer/controller/App.controller.js":function(){// ${copyright}
sap.ui.define([
    "sap/ushell/applications/PageComposer/controller/BaseController"
], function (BaseController) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.App", {});
});
},
	"sap/ushell/applications/PageComposer/controller/BaseController.js":function(){// ${copyright}
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ushell/applications/PageComposer/util/PagePersistence",
    "sap/ushell/applications/PageComposer/util/Transport",
    "sap/m/MessageBox",
    "sap/m/library",
    "sap/base/Log",
    "sap/ushell/applications/PageComposer/i18n/resources"
], function (
    Controller,
    UIComponent,
    PagePersistence,
    transportHelper,
    MessageBox,
    sapMLibrary,
    Log,
    resources
) {
    "use strict";

    return Controller.extend("sap.ushell.applications.PageComposer.controller.BaseController", {
        /**
         * Instantiates the page persistence utility and returns the created instance.
         *
         * @returns {sap.ushell.applications.PageComposer.util.PagePersistence} An instance of the page persistence utility
         *
         * @protected
         */
        getPageRepository: function () {
            if (!this.oPagePersistenceInstance) {
                this.oPagePersistenceInstance = new PagePersistence(this.getView().getModel("PageRepository"));
            }
            return this.oPagePersistenceInstance;
        },

        /**
         * Convenience method for accessing the router.
         *
         * @returns {sap.ui.core.routing.Router} The router for this component.
         *
         * @protected
         */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Convenience method for getting the view model by name.
         *
         * @param {string} [sName] The model name
         * @returns {sap.ui.model.Model} The model instance
         *
         * @protected
         */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         *
         * @param {sap.ui.model.Model} oModel The model instance
         * @param {string} [sName] The model name
         * @returns {sap.ui.mvc.View} The view instance
         *
         * @protected
         */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Getter for the resource bundle.
         *
         * @returns {sap.ui.model.resource.ResourceModel} The resource model of the component
         *
         * @protected
         */
        getResourceBundle: function () {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /**
         * Creates an edit dialog
         *
         * @param {function} onConfirm The confirm function
         * @param {function} onCancel Function to call when delete is cancelled
         * @returns {Promise<object>} A promise resolving to the EditPage dialog controller
         *
         * @private
         */
        _createEditDialog: function (onConfirm, onCancel) {
            var oView = this.getOwnerComponent().getRootControl();

            return new Promise(function (resolve, reject) {
                sap.ui.require(["sap/ushell/applications/PageComposer/controller/EditDialog.controller"], function (EditPageDialogController) {
                    if (!this.oEditPageDialogController) {
                        this.oEditPageDialogController = new EditPageDialogController(oView);
                    }
                    this.oEditPageDialogController.attachCancel(onCancel);
                    this.oEditPageDialogController.attachConfirm(onConfirm);
                    this.oEditPageDialogController.load().then(function () {
                        resolve(this.oEditPageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the create page dialog and enhances it with transport fields if required
         *
         * @param {function} onConfirm Function to call when create is confirmed
         * @param {function} onCancel Function to call when create is cancelled
         *
         * @protected
         */
        showCreateDialog: function (onConfirm, onCancel) {
            var oView = this.getOwnerComponent().getRootControl();
            sap.ui.require([
                "sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller"
            ], function (CreatePageDialogController) {
                if (!this.oCreatePageDialogController) {
                    this.oCreatePageDialogController = new CreatePageDialogController(oView);
                }
                this.oCreatePageDialogController.attachConfirm(onConfirm);
                this.oCreatePageDialogController.attachCancel(onCancel);
                this.oCreatePageDialogController.load().then(function () {
                    if (transportHelper.isTransportSupported()) {
                        return this.getOwnerComponent().createTransportComponent().then(function (transportComponent) {
                            return transportHelper.enhanceDialogWithTransport(
                                this.oCreatePageDialogController,
                                transportComponent,
                                onConfirm
                            );
                        }.bind(this));
                    }

                    return this.oCreatePageDialogController;
                }.bind(this)).then(function (enhancedDialog) {
                    if (enhancedDialog) {
                        enhancedDialog.open();
                    }
                }).catch(function (error) {
                    this.oCreatePageDialogController.destroy();
                    this.handleBackendError(error);
                }.bind(this));
            }.bind(this));
        },

        /**
         * Shows the delete page dialog
         *
         * @param {function} onConfirm Function to call when delete is confirmed
         * @param {function} onCancel Function to call when delete is cancelled
         *
         * @returns {Promise<object>} A promise resolving to the delete dialog controller
         *
         * @private
         */
        _createDeleteDialog: function (onConfirm, onCancel) {
            var oView = this.getOwnerComponent().getRootControl();

            return new Promise(function (resolve, reject) {
                sap.ui.require(["sap/ushell/applications/PageComposer/controller/DeleteDialog.controller"], function (DeleteDialogController) {
                    if (!this.oDeletePageDialogController) {
                        this.oDeletePageDialogController = new DeleteDialogController(oView);
                    }
                    this.oDeletePageDialogController.attachCancel(onCancel);
                    this.oDeletePageDialogController.attachConfirm(onConfirm);
                    this.oDeletePageDialogController.load().then(function () {
                        resolve(this.oDeletePageDialogController);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        },

        /**
         * Checks if the edit dialog should be shown and creates the dialog if required
         *
         * @param {object} page The page to edit
         * @param {function} onConfirm The confirm function
         * @param {function} onCancel Function to call when delete is cancelled
         *
         * @protected
         */
        checkShowEditDialog: function (page, onConfirm, onCancel) {
            transportHelper.checkShowTransport(page).then(function (showTransport) {
                if (showTransport) {
                    return Promise.all([
                        this.getOwnerComponent().createTransportComponent(page.metadata.devclass),
                        this._createEditDialog(onConfirm, onCancel)
                    ]).then(function (result) {
                        var oTransportComponent = result[0];
                        var oDialog = result[1];
                        oDialog.getModel().setProperty("/message", resources.i18n.getText("EditDialog.TransportRequired"));
                        var oEnhancedDialog = transportHelper.enhanceDialogWithTransport(oDialog, oTransportComponent, onConfirm);
                        oEnhancedDialog.open();
                    });
                }

                return transportHelper.checkShowLocked(page).then(function (transportInformation) {
                    if (transportInformation) {
                        return this.showMessageBoxError(resources.i18n.getText(
                            "EditDialog.LockedText",
                            [transportInformation.foreignOwner]
                        ), true);
                    }
                }.bind(this));
            }.bind(this)).catch(function (error) {
                this.handleBackendError(error);
            }.bind(this));
        },

        /**
         * Checks if the delete dialog should be shown and creates the dialog if required
         *
         * @param {object} page The page object
         * @param {function} [onConfirm] The confirm function handler
         * @param {function} [onCancel] The cancel function handler
         * @protected
         */
        checkShowDeleteDialog: function (page, onConfirm, onCancel) {
            transportHelper.checkShowTransport(page).then(function (showTransport) {
                if (showTransport) {
                    return Promise.all([
                        this.getOwnerComponent().createTransportComponent(page.metadata.devclass),
                        this._createDeleteDialog(onConfirm, onCancel)
                    ]).then(function (result) {
                        var oTransportComponent = result[0];
                        var oDialog = result[1];
                        oDialog.getModel().setProperty("/message", resources.i18n.getText("DeleteDialog.TransportRequired"));
                        var oEnhancedDialog = transportHelper.enhanceDialogWithTransport(oDialog, oTransportComponent, onConfirm);
                        oEnhancedDialog.open();
                    });
                }

                return transportHelper.checkShowLocked(page).then(function (transportInformation) {
                    if (transportInformation) {
                        return this.showMessageBoxError(resources.i18n.getText(
                            "DeleteDialog.LockedText",
                            [transportInformation.foreignOwner]
                        ), true);
                    }

                    return this._createDeleteDialog(onConfirm, onCancel).then(function (oDialog) {
                        oDialog.getModel().setProperty("/message", resources.i18n.getText("DeleteDialog.Text"));
                        oDialog.open();
                    });
                }.bind(this));
            }.bind(this)).catch(function (error) {
                this.handleBackendError(error);
            }.bind(this));
        },

        /**
         * Displays a MessageBox with an error message
         *
         * @param {string} sErrorMsg The error message
         * @param {boolean} [bNavToPageOverview] Indicates whether to navigate to the page overview after close
         *
         * @protected
         */
        showMessageBoxError: function (sErrorMsg, bNavToPageOverview) {
            if (bNavToPageOverview) {
                MessageBox.error(sErrorMsg, {onClose: function () {
                    this.navigateToPageOverview();
                }.bind(this)});
            } else {
                MessageBox.error(sErrorMsg);
            }
        },

        /**
         * Navigates to the pageOverview page
         *
         * @protected
         */
        navigateToPageOverview: function () {
            this.getRouter().navTo("overview");
        },

        /**
         * Navigates to the preview mode of the page
         *
         * @param {string} sPageId The ID of the page to preview
         *
         * @protected
         */
        preview: function (sPageId) {
            if (sap.ushell.Container.getDirtyFlag()) {
                this.showMessageBoxError(this.getResourceBundle().getText("Message.SaveChanges"));
            } else {
                var oUrlParsing = sap.ushell.Container.getService("URLParsing");

                var oParams = oUrlParsing.parseParameters(window.location.search);
                oParams["sap-ushell-xx-overwrite-config"] = ["ushell/pages/enable:true"];
                oParams["sap-ushell-page"] = [sPageId];

                var sParams = oUrlParsing.paramsToString(oParams);
                var sPreviewUrl = window.location.pathname + "?" + sParams;

                sapMLibrary.URLHelper.redirect(sPreviewUrl, true);
            }
        },

        /**
         * Called if a backend error needs to be handled
         *
         * @param {object} oError The error object
         *
         * @protected
         */
        handleBackendError: function (oError) {
            if (oError.responseText) {
                this.getOwnerComponent().showErrorDialog(oError);
            } else {
                Log.error(oError);
            }
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/BaseDialog.controller.js":function(){// ${copyright}

sap.ui.define([
    "sap/base/strings/formatMessage",
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ushell/applications/PageComposer/i18n/resources"
], function (
    formatMessage,
    BaseController,
    Fragment,
    resources
) {
    "use strict";

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.BaseDialog.controller", {
        /**
         * Destroys the control
         * @protected
         */
        destroy: function () {
            if (this._oView.byId(this.sViewId)) {
                this._oView.byId(this.sViewId).destroy();
            }
        },
        /**
         * Closes the dialog
         * @protected
         */
        onCancel: function () {
            this._oView.byId(this.sViewId).close();

            if (this._fnCancel) {
                this._fnCancel();
            }
        },

        /**
         * Attaches a confirm function which is called when dialog confirm button is pressed
         *
         * @param {function} confirm The confirm function
         * @protected
         */
        attachConfirm: function (confirm) {
            this._fnConfirm = confirm;
        },

        /**
         * Called when the user presses the confirm button.
         * Calls the attached confirm function if there is one.
         *
         * @param {sap.ui.base.Event} event The press event
         * @protected
         */
        onConfirm: function (event) {
            if (this._fnConfirm) {
                this._fnConfirm(event);
            }
        },

        /**
         * Returns the model of this dialog instance
         *
         * @returns {sap.ui.model.json.JSONModel} The JSONModel
         * @protected
         */
        getModel: function () {
            return this._oModel;
        },

        /**
         * Returns true if all values of the given object are truthy
         *
         * @param {object} validation The object containing the validation keys
         * @param {boolean} validation.id Whether the ID is valid
         * @param {boolean} validation.title Whether the title is valid
         *
         * @returns {boolean} The validation result
         * @private
         */
        validate: function (validation) {
            for (var i in validation) {
                if (!validation[i]) {
                    return false;
                }
            }
            return true;
        },

        /**
         * Attaches a cancel function which is called when dialog cancel button is pressed
         *
         * @param {function} cancel The cancel function
         * @protected
         */
        attachCancel: function (cancel) {
            this._fnCancel = cancel;
        },

        /**
         * Inserts the given component into the ComponentContainer control with id "transportContainer"
         *
         * @param {object} component The component to insert
         * @protected
         */
        transportExtensionPoint: function (component) {
            this._oView.byId("transportContainer").setComponent(component);
        },

        /**
         * Loads the dialog fragment without displaying it
         *
         * @returns {Promise<void>} Promise resolving when the fragment is loaded
         * @protected
         */
        load: function () {
            var oFragmentLoadOptions = {
                id: this._oView.getId(),
                name: this.sId,
                controller: this
            };

            return Fragment.load(oFragmentLoadOptions).then(function (fragment) {
                fragment.setModel(this._oModel);
                fragment.setModel(resources.i18nModel, "i18n");
            }.bind(this));
        },

        /**
         * Shows the dialog
         * @protected
         */
        open: function () {
            var oDialog = this._oView.byId(this.sViewId);
            this._oView.addDependent(oDialog);

            oDialog.open();
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/CopyDialog.js":function(){// ${copyright}

sap.ui.define([
    "sap/base/strings/formatMessage",
    "sap/ui/core/Fragment"
], function (
    formatMessage,
    Fragment
) {
    "use strict";

    return function (oView) {
        this._oView = oView;

        this.destroy = function () {
            delete this._oView;
        };

        /**
         * Loads the fragment and opens the dialog.
         *
         * @param {sap.ui.model.Model} oModel The model to set to the dialog
         * @param {function} fnResolve Function called if the dialog action is confirmed
         *
         * @protected
         */
        this.open = function (oModel, fnResolve) {
            var oThisView = this._oView;
            var oFragmentLoadOptions = {
                id: oThisView.getId(),
                name: "sap.ushell.applications.PageComposer.view.CopyDialog",
                controller: {
                    formatMessage: formatMessage,

                    /**
                     * Called after the dialog closes. Destroys the control.
                     *
                     * @private
                     */
                    onAfterClose: function () {
                        oThisView.byId("copyDialog").destroy();
                    },

                    /**
                     * Called if the cancel button is pressed
                     *
                     * @private
                     */
                    onCancel: function () {
                        oThisView.byId("copyDialog").close();
                    },

                    onConfirm: fnResolve
                }
            };
            Fragment.load(oFragmentLoadOptions).then(function (fragment) {
                fragment.setModel(oModel);
                oThisView.addDependent(fragment);
                fragment.open();
            });
        };
    };
});
},
	"sap/ushell/applications/PageComposer/controller/CreatePageDialog.controller.js":function(){// ${copyright}

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ushell/applications/PageComposer/controller/BaseDialog.controller",
    "sap/ushell/applications/PageComposer/i18n/resources",
    "sap/base/util/merge",
    "sap/ui/core/Fragment",
    "sap/ui/core/library"
], function (JSONModel, BaseDialogController, resources, merge, Fragment, coreLibrary) {
    "use strict";

    // shortcut for sap.ui.core.ValueState
    var ValueState = coreLibrary.ValueState;

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.CreatePageDialog", {
        constructor: function (oView) {
            this._oView = oView;
            this._oModel = new JSONModel({
                validation: {
                    id: false,
                    title: false
                }
            });

            this.sViewId = "createPageDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.CreatePageDialog";
        },

        /**
         * Pre-filter packages by the ID namespace
         *
         * @param {string} sId The entered PageId
         * @param {boolean} bFetchSuggestionOnly Whether to only fetch suggestions or also set the value to the package input
         */
        handlePackageNamespaceChange: function (sId, bFetchSuggestionOnly) {
            var oTransportContainer = this._oView.byId("transportContainer");
            var oTransportComponent = oTransportContainer.getComponentInstance();
            var oPackageInput = oTransportComponent && oTransportComponent.getRootControl().byId("packageInput");
            if (oPackageInput && !oPackageInput.getValue().length) {
                var sPackageNamespace = sId.split("/"); sPackageNamespace.pop(); sPackageNamespace = sPackageNamespace.join("/");
                if (sPackageNamespace) {
                    if (bFetchSuggestionOnly) {
                        oPackageInput.fireLiveChange({ value: sPackageNamespace });
                    } else {
                        oPackageInput.setValue(sPackageNamespace);
                        oPackageInput.fireChange({ value: sPackageNamespace });
                    }
                }
            }
        },

        /**
         * Called if the save button is clicked
         * Retrieves all values and calls the confirm handler if set
         *
         * @private
         */
        onConfirm: function () {
            var oModel = this.getModel();

            var oResolvedResult = {
                content: {
                    id: oModel.getProperty("/id"),
                    title: oModel.getProperty("/title")
                },
                metadata: {}
            };

            if (this._fnConfirm) {
                this._fnConfirm(oResolvedResult);
            }
        },

        /**
         * Resets all fields to their initial values. If there are other values in the validation path, keep them.
         *
         * @param {sap.ui.model.json.JSONModel} oModel The JSONModel instance to reset
         *
         * @private
         */
        _resetModel: function (oModel) {
            oModel.setProperty("/id", "");
            oModel.setProperty("/title", "");
            var oValidation = merge({}, oModel.getProperty("/validation"), {
                id: false,
                title: false
            });
            oModel.setProperty("/validation", oValidation);
        },

        /**
         * Called before the CreatePageDialog opens.
         * Creates the validation model.
         *
         * @private
         */
        onBeforeOpen: function () {
            var oFragment = this._oView.byId("createPageDialog");
            sap.ui.getCore().getMessageManager().registerObject(oFragment, true);
            oFragment.setModel(resources.i18nModel, "i18n");
            this._resetModel(oFragment.getModel());
        },

        /**
         * Called on the change of the ID.
         *
         * @param {sap.ui.base.Event} oEvent The change event
         *
         * @private
         */
        onIdChange: function (oEvent) {
            var sNewId = oEvent.getParameters().value;
            this.handlePackageNamespaceChange(sNewId, false);
        },

        /**
         * Called on the live change of the ID
         *
         * @param {sap.ui.base.Event} oEvent The change event
         *
         * @private
         */
        onIdLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = this._isValidID(sInputValue),
                oValidation = merge({}, oModel.getProperty("/validation"), { id: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
            if (sInputValue.length > 0) {
                oInput.setValueStateText(resources.i18n.getText("Message.InvalidPageID"));
            } else {
                oInput.setValueStateText(resources.i18n.getText("Message.EmptyPageID"));
            }
            this.handlePackageNamespaceChange(sInputValue, true);
        },

        /**
         * Called on the live change of the title
         *
         * @param {sap.ui.base.Event} oEvent The change event
         *
         * @private
         */
        onTitleLiveChange: function (oEvent) {
            var oInput = oEvent.getSource(),
                oModel = this.getModel(),
                sInputValue = oInput.getValue(),
                bIsValid = this._isValidTitle(sInputValue),
                oValidation = merge({}, oModel.getProperty("/validation"), { title: bIsValid }),
                sValueState = bIsValid ? ValueState.None : ValueState.Error;
            oModel.setProperty("/validation", oValidation);
            oInput.setValueState(sValueState);
        },

        /**
         * Returns true if the entered id is valid
         *
         * @param {string} id The given ID
         * @returns {boolean} The boolean result
         *
         * @private
         */
        _isValidID: function (id) {
            return /^[\w/]{1,35}$/g.test(id);
        },

        /**
         * Returns true if the entered title is valid
         *
         * @param {string} title The given title
         * @returns {boolean} The boolean result
         *
         * @private
         */
        _isValidTitle: function (title) {
            return /^.{1,100}$/g.test(title);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/DeleteDialog.controller.js":function(){// ${copyright}

sap.ui.define([
    "sap/base/strings/formatMessage",
    "sap/ushell/applications/PageComposer/controller/BaseDialog.controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (
    formatMessage,
    BaseDialogController,
    Fragment,
    JSONModel
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.DeleteDialog.controller", {
        constructor: function (oView) {
            this._oView = oView;
            this._createOrResetModel();

            this.sViewId = "deleteDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.DeleteDialog";
        },
        /**
         * Create model or reset if it doesn't exist.
         *
         * @private
         */
        _createOrResetModel: function () {
            if (!this._oModel) {
                this._oModel = new JSONModel();
            }
            this._oModel.setData({
                title: "",
                message: "",
                validation: {}
            });
        },
        /**
         * Destroys the control
         *
         * @private
         */
        destroy: function () {
            this._createOrResetModel();
            BaseDialogController.prototype.destroy.apply(this, arguments);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/EditDialog.controller.js":function(){// ${copyright}

sap.ui.define([
    "sap/base/strings/formatMessage",
    "sap/ushell/applications/PageComposer/controller/BaseDialog.controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel"
], function (
    formatMessage,
    BaseDialogController,
    Fragment,
    JSONModel
) {
    "use strict";

    return BaseDialogController.extend("sap.ushell.applications.PageComposer.controller.EditDialog.controller", {
        constructor: function (oView) {
            this._oView = oView;
            this._oModel = new JSONModel({
                title: "",
                message: "",
                validation: {}
            });

            this.sViewId = "editDialog";
            this.sId = "sap.ushell.applications.PageComposer.view.EditDialog";
        },

        /**
         * Called if the delete dialog is confirmed
         * Close the dialog
         * @protected
         */
        onConfirm: function () {
            this._oView.byId("editDialog").close();
            BaseDialogController.prototype.onConfirm.apply(this, arguments);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/ErrorDialog.js":function(){// ${copyright}

sap.ui.define([
    "sap/ui/core/Fragment",
    "sap/ushell/applications/PageComposer/i18n/resources",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (
    Fragment,
    resources,
    JSONModel,
    MessageToast
) {
    "use strict";

    /**
     * @typedef {object} BackendError An error object sent from backend
     * @property {string} message The error message
     * @property {string} statusCode The HTML status code
     * @property {string} statusText The status text
     */

    var oController = {

        /**
         * Destroy the dialog after each use.
         *
         * @param {sap.ui.base.Event} oEvent The closing event
         *
         * @private
        */
        onAfterClose: function (oEvent) {
            oEvent.getSource().destroy();
        },


        /**
         * Show error details.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
        */
        onShowDetails: function (oEvent) {
            oEvent.getSource().getModel().setProperty("/showDetails", true);
        },

        /**
         * Closes the dialog.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
        */
        onConfirm: function (oEvent) {
            oEvent.getSource().getParent().close(); // The parent of the button id the dialog
        },

        /**
         * Copies the error message to the clipboard.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onCopy: function (oEvent) {
            var oTemporaryDomElement = document.createElement("textarea");
            try {
                oTemporaryDomElement.contentEditable = true;
                oTemporaryDomElement.readonly = false;
                oTemporaryDomElement.textContent = oEvent.getSource().getModel().getProperty("/description");
                document.documentElement.appendChild(oTemporaryDomElement);

                if (navigator.userAgent.match(/ipad|iphone/i)) {
                    var oRange = document.createRange();
                    oRange.selectNodeContents(oTemporaryDomElement);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(oRange);
                    oTemporaryDomElement.setSelectionRange(0, 999999);
                } else {
                    jQuery(oTemporaryDomElement).select();
                }

                document.execCommand("copy");
                MessageToast.show(resources.i18n.getText("Message.ClipboardCopySuccess"), {
                    closeOnBrowserNavigation: false
                });
            } catch (oException) {
                MessageToast.show(resources.i18n.getText("Message.ClipboardCopyFail"), {
                    closeOnBrowserNavigation: false
                });
            } finally {
                jQuery(oTemporaryDomElement).remove();
            }
        }
    };

    /**
     * Load the fragment and open the dialog
     *
     * @param {BackendError} error The error object
     *
     * @protected
     */
    function open (error) {
        var oResponse = JSON.parse(error.responseText);

        var oModel = new JSONModel({
            message: oResponse.error.message.value,
            description: JSON.stringify(oResponse, null, 3).replace(/\{|\}/g, ""),
            statusCode: error.statusCode,
            statusText: error.statusText,
            showDetails: false
        });
        Fragment.load({
            name: "sap.ushell.applications.PageComposer.view.ErrorDialog",
            controller: oController
        }).then(function (oDialog) {
            oDialog.setModel(oModel);
            oDialog.setModel(resources.i18nModel, "i18n");
            oDialog.open();
        });
    }

    return {open: open};
});
},
	"sap/ushell/applications/PageComposer/controller/Page.js":function(){// ${copyright}

sap.ui.define([
    "sap/base/util/isEmptyObject",
    "sap/ui/model/json/JSONModel",
    "sap/m/GenericTile",
    "sap/m/ImageContent",
    "sap/m/NumericContent",
    "sap/m/TileContent",
    "sap/ushell/Config"
], function (
    isEmptyObject,
    JSONModel,
    GenericTile,
    ImageContent,
    NumericContent,
    TileContent,
    Config
) {
    "use strict";

    /**
     * @typedef {object} GroupError An error that occured in a group
     * @property {string} type The error type
     * @property {string} title The title of the error
     * @property {string} subtitle The subtitle of the error
     * @property {string} description The description of the error
     */

    var oMainController,
        oPage,
        resources = {};

    var oViewSettingsModel = new JSONModel({
        sizeBehavior: Config.last("/core/home/sizeBehavior")
    });

    var _aDoableObject = Config.on("/core/home/sizeBehavior").do(function (sSizeBehavior) {
        oViewSettingsModel.setProperty("/sizeBehavior", sSizeBehavior);
    });

    /**
     * Returns the model relevant indicies from the given widget
     *
     * @param {sap.ui.core.Control} oWidget The widget that is inside of a model.
     * @return {object} The relevant indicies of the model
     * @private
     */
    function _getModelDataFromWidget (oWidget) {
        var aPath = oWidget.getBindingContext().getPath().split("/"),
            iWidgetIndex = aPath.pop();

        aPath.pop();
        return {
            widgetIndex: iWidgetIndex,
            groupIndex: aPath.pop()
        };
    }

    return {
        /**
         * Initializes the Page fragment logic
         *
         * @param {sap.ui.core.mvc.Controller} oController The controller that uses the Page fragment
         *
         * @protected
         */
        init: function (oController) {
            oMainController = oController;

            oPage = oController.getView().byId("page");
            oPage.setModel(oController.getModel());
            oPage.setModel(oViewSettingsModel, "viewSettings");

            resources.i18n = oController.getResourceBundle();

            var bEdit = oController.getModel().getProperty("/edit");
            oPage.toggleStyleClass("sapUshellPageComposing", !!bEdit);
        },

        exit: function () {
            _aDoableObject.off();
        },

        /**
         * Creates the content inside of the GridContainers
         *
         * @param {string} sId The ID of the content
         * @param {sap.ui.model.Context} oContext The data for the specific content
         * @returns {sap.m.GenericTile} A control that is a content of the GridContainer
         *
         * @private
         */
        itemFactory: function (sId, oContext) {
            var oContextData = oContext.getProperty(oContext.sPath),
                oCatalogTile = oMainController.mCatalogTiles[oContextData.vizId],
                oControl;

            if (oCatalogTile) {
                var oLPService = sap.ushell.Container.getService("LaunchPage");
                var sHeader = oLPService.getCatalogTilePreviewTitle(oCatalogTile) || oLPService.getCatalogTileTitle(oCatalogTile);
                var sSubheader = oLPService.getCatalogTilePreviewSubtitle(oCatalogTile);
                var sFooter = oLPService.getCatalogTilePreviewInfo(oCatalogTile);
                var sIcon = oLPService.getCatalogTilePreviewIcon(oCatalogTile);
                var bShowCount;
                var oContentControl;

                // TBD: The following content definition logic is a temporary solution
                // until the corresponding API is provided by the service:
                if (oCatalogTile.getChip) { // ABAP
                    bShowCount = oCatalogTile.getChip().getBaseChipId() === "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER";
                } else if (oCatalogTile.tileResolutionResult) { // CDM
                    bShowCount = !!oCatalogTile.tileResolutionResult.indicatorDataSource;
                } else { // Local
                    bShowCount = oCatalogTile.tileType === "sap.ushell.ui.tile.DynamicTile";
                }

                if (bShowCount) {
                    oContentControl = new NumericContent({ // Dynamic Tile
                        icon: sIcon,
                        value: "0",
                        width: "100%"
                    });
                } else {
                    oContentControl = new ImageContent({ // Static Tile
                        src: sIcon
                    });
                }

                oControl = new GenericTile(sId, {
                    header: sHeader,
                    subheader: sSubheader,
                    tileContent: [new TileContent({
                        footer: sFooter,
                        content: [oContentControl]
                    })]
                });

                if (oContextData.error) {
                    oControl.setState("Failed");
                }
            } else if (!isEmptyObject(oMainController.mCatalogTiles)) {
                oControl = new GenericTile(sId, { state: "Failed" });
            } else {
                oControl = new GenericTile(sId, { state: "Loading" });
            }

            oControl.attachPress(function (oEvent) {
                if (oEvent.getParameter("action") === "Remove") {
                    var oContent = oEvent.getSource(),
                        oWidgetModelData = _getModelDataFromWidget(oContent);

                    oMainController.deleteContentInGroup(oWidgetModelData.widgetIndex, oWidgetModelData.groupIndex);
                }
            });

            // sizeBehavior for tiles: Small/Responsive
            oControl.bindProperty("sizeBehavior", "viewSettings>/sizeBehavior");
            oControl.setScope(oMainController.getModel().getProperty("/edit") ? "Actions" : "Display");

            return oControl;
        },

        /**
         * Collects all errors that occured in the groups.
         *
         * @returns {GroupError[]} A collection of errors that occured in the groups.
         *
         * @protected
         */
        collectErrors: function () {
            var aErrors = [];

            oPage.getGroups().forEach(function (oGroup, iGroupIndex) {

                var oGroupTitle = oGroup.byId("title-edit");
                if (oGroup.getTitle() === "") {
                    oGroupTitle.setValueState("Warning");
                    oGroupTitle.setValueStateText(resources.i18n.getText("Message.InvalidGroupTitle"));
                    aErrors.push({
                        type: "Warning",
                        title: resources.i18n.getText("Title.NoGroupTitle", iGroupIndex + 1),
                        description: resources.i18n.getText("Message.NoGroupTitle", iGroupIndex + 1)
                    });
                } else {
                    oGroupTitle.setValueState("None");
                }

                oGroup.getWidgets().forEach(function (oTile, iTileIndex) {
                    if (oTile.getState() === "Failed") {
                        if (oTile.getHeader() === "" && oTile.getSubheader() === "") {
                            aErrors.push({
                                type: "Error",
                                title: resources.i18n.getText("Title.UnsufficientRoles"),
                                subtitle: resources.i18n.getText("Title.ContentIsNotVisible"),
                                description: resources.i18n.getText("Message.LoadTileError", [(iTileIndex + 1) + ".", oGroup.getTitle()])
                            });
                        } else {
                            aErrors.push({
                                type: "Warning",
                                title: resources.i18n.getText("Message.NavigationTargetError"),
                                subtitle: resources.i18n.getText("Title.ContentNotNavigateable"),
                                description: resources.i18n.getText("Message.NavTargetResolutionError", oTile.getHeader())
                            });
                        }
                    }
                });
            });

            return aErrors;
        },

        /**
         * Adds a new Group to the Page.
         *
         * @param {sap.ui.base.Event} [oEvent] The event data. If not given, group is added at the first position.
         *
         * @protected
         */
        addGroup: function (oEvent) {
            var iGroupIndex = oEvent ? oEvent.getParameter("index") : 0;

            oMainController.addGroupAt(iGroupIndex);
        },

        /**
         * Deletes a Group from the Page
         *
         * @param {sap.ui.base.Event} oEvent contains event data
         *
         * @private
         */
        deleteGroup: function (oEvent) {
            var oGroup = oEvent.getSource();

            sap.ui.require(["sap/m/MessageBox"], function (MessageBox) {
                function deleteGroup (oAction) {
                    if (oAction === MessageBox.Action.DELETE) {
                        oMainController.deleteGroup(oPage.indexOfGroup(oGroup));
                    }
                }

                sap.ushell.Container.getService("Message").confirm(
                    resources.i18n.getText("Message.DeleteGroup", oGroup.getTitle()),
                    deleteGroup,
                    resources.i18n.getText("Button.Delete"),
                    [
                        MessageBox.Action.DELETE,
                        MessageBox.Action.CANCEL
                    ]
                );
            });
        },

        /**
         * Moves a group inside of the Page
         *
         * @param {object} oInfo Drag and drop event data
         * @private
         */
        moveGroup: function (oInfo) {
            var oDragged = oInfo.getParameter("draggedControl"),
                oDropped = oInfo.getParameter("droppedControl"),
                sInsertPosition = oInfo.getParameter("dropPosition"),
                iDragPosition = oPage.indexOfGroup(oDragged),
                iDropPosition = oPage.indexOfGroup(oDropped);

            if (sInsertPosition === "After") {
                if (iDropPosition < iDragPosition) {
                    iDropPosition++;
                }
            } else if (iDropPosition > iDragPosition) {
                iDropPosition--;
            }

            oMainController.moveGroup(iDragPosition, iDropPosition);
        },

        /**
         * Moves a content inside or between different groups.
         *
         * @param {object} oDropInfo Drag and drop event data
         *
         * @private
         */
        moveContent: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                sInsertPosition = oDropInfo.getParameter("dropPosition"),
                oDroppedModelData = _getModelDataFromWidget(oDropped),
                iDropContentPosition = oDroppedModelData.widgetIndex,
                iDropGroupPosition = oDroppedModelData.groupIndex;

            if (oDragged.isA("sap.m.CustomTreeItem")) {
                var fnDragSessionCallback = oDropInfo.getParameter("dragSession").getComplexData("callback");
                if (sInsertPosition === "After") {
                    iDropContentPosition++;
                }
                fnDragSessionCallback(iDropContentPosition, iDropGroupPosition);
                return;
            }
            var oDraggedModelData = _getModelDataFromWidget(oDragged),
                iDragContentPosition = oDraggedModelData.widgetIndex,
                iDragGroupPosition = oDraggedModelData.groupIndex;

            if (iDragGroupPosition === iDropGroupPosition) {
                if (sInsertPosition === "After") {
                    if (iDropContentPosition < iDragContentPosition) {
                        iDropContentPosition++;
                    }
                } else if (iDropContentPosition > iDragContentPosition) {
                    iDropContentPosition--;
                }
            } else if (sInsertPosition === "After") {
                iDropContentPosition++;
            }

            oMainController.moveContentInGroup(iDragContentPosition, iDropContentPosition, iDragGroupPosition, iDropGroupPosition);
        },

        /**
         * Adds content to a group in the Page.
         *
         * @param {object} oDropInfo Drag and drop event data
         *
         * @private
         */
        addContent: function (oDropInfo) {
            var oDragged = oDropInfo.getParameter("draggedControl"),
                oDropped = oDropInfo.getParameter("droppedControl"),
                iDropContentPosition = oDropped.getWidgets().length,
                iDropGroupPosition = oPage.indexOfGroup(oDropped);

            if (oDragged.isA("sap.m.CustomTreeItem")) {
                oDropInfo.getParameter("dragSession").getComplexData("callback")(iDropContentPosition, iDropGroupPosition);
                return;
            }

            var oDraggedModelData = _getModelDataFromWidget(oDragged),
                iDragContentPosition = oDraggedModelData.widgetIndex,
                iDragGroupPosition = oDraggedModelData.groupIndex;

            oMainController.moveContentInGroup(iDragContentPosition, iDropContentPosition, iDragGroupPosition, iDropGroupPosition);
        }
    };
});
},
	"sap/ushell/applications/PageComposer/controller/PageDetail.controller.js":function(){// ${copyright}

sap.ui.define([
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ushell/applications/PageComposer/controller/Page",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/base/Log",
    "sap/base/strings/formatMessage"
], function (
    BaseController,
    Page,
    JSONModel,
    MessageToast,
    Log,
    formatMessage
) {
    "use strict";

    /**
     * @typedef {object} ContentCatalogs Contains the titles of each catalog, the tiles of each catalog and a map of vizIds to catalog tiles
     * @property {string} catalogTitles The catalog titles
     * @property {string} catalogTiles The catalog tiles in a catalog
     * @property {string} mCatalogTiles A map from vizId to tile
     */

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetail", {
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("detail").attachPatternMatched(this._onPageMatched, this);

            this.oCopyDialogModel = new JSONModel({
                page: null,
                approvalText: ""
            });

            this.setModel(new JSONModel({
                page: {},
                editMode: false
            }));

            this.Page.init(this);
        },
        /**
         * Called when page detail view is exited.
         *
         * @private
         */
        onExit: function () {
            this.Page.exit();
        },

        mCatalogTiles: {},
        Page: Page,
        formatMessage: formatMessage,

        /**
         * Called if the route matched the pattern for viewing a page.
         * Loads the page with the id given in the URL parameter
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var sPageId = event.getParameter("arguments").pageId;

            this._loadPage(decodeURIComponent(sPageId)).then(function (oPage) {
                this.getModel().setProperty("/page", oPage);

                this.Page.init(this);
                this._fetchCatalogInfo().then(function (catalogInfo) {
                    this.mCatalogTiles = catalogInfo.mCatalogTiles;
                    this.getModel().updateBindings(true);
                }.bind(this));
            }.bind(this), function (sErrorMsg) {
                this.showMessageBoxError(sErrorMsg, true);
            }.bind(this));
        },

        /**
         * Loads the page with the given pageId from the PagePersistence
         *
         * @param {string} pageId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         *
         * @private
         */
        _loadPage: function (pageId) {
            return this.getPageRepository().getPage(pageId);
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (pageId) {
            this.getRouter().navTo("edit", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Called if the delete action has been cancelled
         *
         * @private
         */
        onDeleteCancel: function () {
            var oDialog = this.byId("deleteDialog");
            oDialog.close();
        },

        /**
         * Called if the delete action has been confirmed
         *
         * @param {sap.ui.base.Event} oEvent The deletePage event
         * @returns {Promise<void>} A promise resolving when the page has been deleted
         *
         * @private
         */
        _deletePage: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var sPageToDeleteId = this.getModel().getProperty("/page/content/id");
            var sSuccessMsg = this.getResourceBundle().getText("Message.SuccessDeletePage");

            return this.getPageRepository().deletePage(sPageToDeleteId, sTransportId)
                .then(function () {
                    this.navigateToPageOverview();
                    MessageToast.show(sSuccessMsg, {
                        closeOnBrowserNavigation: false
                    });
                    oDialog.close();
                }.bind(this))
                .catch(this.handleBackendError.bind(this));
        },

        /**
         * Copies a page
         *
         * @private
         */
        _copyPage: function () {
            //@TODO: implement
            // var oDialog = oEvent.getSource().getParent();
        },

        /**
         * Called if the Edit button is clicked.
         * Loads the edit route
         *
         * @private
         */
        onEdit: function () {
            this._navigateToEdit(this.getModel().getProperty("/page/content/id"));
        },

        /**
         * Called if the delete button is clicked
         * Shows the Delete Dialog
         *
         * @private
         */
        onDelete: function () {
            var oPage = this.getModel().getProperty("/page");
            this.checkShowDeleteDialog(oPage, this._deletePage.bind(this));
        },

        /**
         * Called if the copy button is clicked
         *
         * @private
         */
        onCopy: function () {
            var oPage = this.getModel().getProperty("/page");
            var sApprovalText = this.getResourceBundle().getText("CopyDialog.Message", [oPage.content.id, oPage.content.title]);
            this.oCopyDialogModel.setProperty("/page", oPage);
            this.oCopyDialogModel.setProperty("/approvalText", sApprovalText);
            this.getOwnerComponent().showCopyDialog(this.oCopyDialogModel, this._copyPage.bind(this));
        },

        /**
         * Fetches the catalog information.
         *
         * @returns {ContentCatalogs} Contains the titles of each catalog, the tiles of each catalog and a map of vizIds to catalogtiles
         *
         * @private
         */
        _fetchCatalogInfo: function () {
            return sap.ushell.Container.getServiceAsync("LaunchPage").then(function (launchPageService) {
                return launchPageService.getCatalogs().then(function (aCatalogs) {
                    var aCatalogTitles = aCatalogs.map(function (oCatalog) {
                        var sCatalogId = launchPageService.getCatalogId(oCatalog) || "";
                        return launchPageService.getCatalogTitle(oCatalog) || sCatalogId.split(":").slice(1).join(":");
                    });

                    // CDM catalogs do not have the tiles[] array, get the tiles in a separate call
                    return Promise.all(aCatalogs.map(function (oCatalog) {
                        return launchPageService.getCatalogTiles(oCatalog);
                    })).then(function (catalogTiles) {
                        var mVizIdToCatalogTiles = {};
                        for (var i = 0; i < catalogTiles.length; i++) {
                            for (var j = 0; j < catalogTiles[i].length; j++) {
                                mVizIdToCatalogTiles[launchPageService.getCatalogTileId(catalogTiles[i][j])] = catalogTiles[i][j];
                            }
                        }

                        return {
                            catalogTitles: aCatalogTitles,
                            catalogTiles: catalogTiles,
                            mCatalogTiles: mVizIdToCatalogTiles
                        };
                    });
                });
            });
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/PageDetailEdit.controller.js":function(){// ${copyright}

sap.ui.define([
    "sap/m/MessagePopover",
    "sap/m/MessageItem",
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/ushell/applications/PageComposer/controller/Page",
    "sap/ushell/applications/PageComposer/controller/TileSelector",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/core/library",
    "sap/m/MessageToast"
], function (
    MessagePopover,
    MessageItem,
    BaseController,
    Page,
    TileSelector,
    JSONModel,
    MessageBox,
    coreLibrary,
    MessageToast
) {
    "use strict";

    /**
     * @typedef {object} ContentCatalogs Contains the titles of each catalog, the tiles of each catalog and a map of vizIds to catalog tiles
     * @property {string} catalogTitles The catalog titles
     * @property {string} catalogTiles The catalog tiles in a catalog
     * @property {string} mCatalogTiles A map from vizId to tile
     */

    var oModel = new JSONModel();
    var resources = {};
    /**
     * Convenience method to initialize the page model
     *
     * @param {object} model Page model to be initialized
     * @property {object} model.page Page of the model
     * @property {boolean} model.edit Wheter the page is in edit mode
     * @property {array} model.errors The errors on the page
     * @property {number} model.errorslength The number of errors on the page
     * @property {boolean} model.headerExpanded Wheter the page header is expanded
     *
     * @private
     */
    function _initModel (model) {
        model.setData({
            page: {},
            edit: true,
            errors: [],
            errorslength: 0,
            headerExpanded: true
        });
    }

    //JSONModel change event does not work properly
    oModel.setProperty = function (sPath) {
        if (sPath.indexOf("/page") === 0 && !jQuery.isEmptyObject(oModel.getProperty("/page"))) {
            sap.ushell.Container.setDirtyFlag(true);
        }
        JSONModel.prototype.setProperty.apply(this, arguments);
    };


    return BaseController.extend("sap.ushell.applications.PageComposer.controller.PageDetailEdit", {
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            var oRouter = this.getRouter();
            oRouter.getRoute("edit").attachPatternMatched(this._onPageMatched, this);
            this.setModel(oModel);
            resources.i18n = this.getResourceBundle();

            this.Page.init(this);
            this.TileSelector.init(this);
            this.TileSelector.setAddTileHandler(this._addContentToGroup.bind(this));
        },

        /**
         * Called when page detail view is exited.
         *
         * @private
         */
        onExit: function () {
            this.Page.exit();
        },

        mCatalogTiles: {},
        Page: Page,
        TileSelector: new TileSelector(),
        oMessagePopover: new MessagePopover({
            items: {
                path: "/errors",
                template: new MessageItem({
                    type: "{type}",
                    title: "{title}",
                    activeTitle: "{active}",
                    description: "{description}",
                    subtitle: "{subtitle}",
                    counter: "{counter}"
                })
            }
        }).setModel(oModel),

        /**
         * Handles the message popover press in the footer bar.
         *
         * @param {sap.ui.base.Event} oEvent The press event.
         *
         * @private
         */
        handleMessagePopoverPress: function (oEvent) {
            this.oMessagePopover.toggle(oEvent.getSource());
        },

        /**
         * Called if the show/hide catalogs button is called.
         * Used to show or hide the side content.
         *
         * @private
         */
        onUpdateSideContentVisibility: function () {
            var oPageDesigner = this.getView().byId("layoutContent");
            oPageDesigner.setShowSideContent(!oPageDesigner.isSideContentVisible());
        },

        /**
         * Called if the title is changed
         * If the title is empty, the valueState changes to ERROR
         *
         * @param {sap.ui.base.Event} oEvent The change event
         *
         * @private
         */
        onTitleChange: function (oEvent) {
            var oInput = oEvent.getSource();
            oInput.setValueStateText(resources.i18n.getText("Message.EmptyTitle"));

            if (!oInput.getValue()) {
                oInput.setValueState(coreLibrary.ValueState.Error);
            } else {
                oInput.setValueState(coreLibrary.ValueState.None);
            }
        },

        /**
         * Called if the save button is pressed.
         * MessageToast will confirm that the changes have been successfully saved
         *
         * @private
         */
        onSave: function () {
            var fnSave = function (sClickedAction) {
                if (sClickedAction === MessageBox.Action.OK) {
                    this._savePage(oModel.getProperty("/page")).then(function () {
                        sap.ushell.Container.setDirtyFlag(false);
                        MessageToast.show(resources.i18n.getText("Message.SavedChanges"), {
                            closeOnBrowserNavigation: false
                        });
                    }, function (sErrorMsg) {
                        this.showMessageBoxError(sErrorMsg, false);
                    }.bind(this));
                }
            }.bind(this);

            if (!oModel.getProperty("/page/content/title")) {
                this.showMessageBoxError(resources.i18n.getText("Message.EmptyTitle"));
                oModel.setProperty("/headerExpanded", true);

                return;
            }

            if (!window.navigator.onLine) {
                this.showMessageBoxError(resources.i18n.getText("Message.NoInternetConnection"));

                return;
            }

            if (oModel.getProperty("/errorslength") > 0) {
                var sTitle = resources.i18n.getText("Title.TilesHaveErrors"),
                    sMessage = resources.i18n.getText("Message.TilesHaveErrors");
                sap.ushell.Container.getService("Message").confirm(sMessage, fnSave, sTitle);

                return;
            }

            fnSave(MessageBox.Action.OK);
        },

        /**
         * Called if the cancel button is pressed.
         * Navigates to the page overview without saving changes.
         *
         * @private
         */
        onCancel: function () {
            this.navigateToPageOverview();
        },

        /**
         * Set the new transportId to the page object
         *
         * @param {sap.ui.base.Event} event The object containing the metadata
         *
         * @private
         */
        _updatePageWithMetadata: function (event) {
            if (event && event.metadata && event.metadata.transportId) {
                oModel.setProperty("/page/metadata/transportId", event.metadata.transportId);
            }
        },

        /**
         * Called if the route matched the pattern for the editing of a page.
         * Loads the page with the id given in the URL parameter.
         *
         * @param {sap.ui.base.Event} event The routing event
         *
         * @private
         */
        _onPageMatched: function (event) {
            var sPageId = event.getParameter("arguments").pageId;
            _initModel(oModel);
            this._loadPage(decodeURIComponent(sPageId)).then(function (oPage) {
                oModel.setProperty("/page", oPage);
                oModel.setProperty("/edit", true);

                this.checkShowEditDialog(
                    oPage,
                    this._updatePageWithMetadata.bind(this),
                    this.navigateToPageOverview.bind(this)
                );

                this.Page.init(this);
                this._fetchCatalogInfo().then(function (catalogInfo) {
                    this.mCatalogTiles = catalogInfo.mCatalogTiles;
                    this.TileSelector.initTiles(catalogInfo);
                    oModel.updateBindings(true);
                    this._pageUpdated();
                    if (!oModel.getProperty("/page/content/sections").length) {
                        this.Page.addGroup();
                    }
                }.bind(this)).then(function () {
                    sap.ushell.Container.setDirtyFlag(false);
                }).catch(function (sErrorMsg) {
                    this.showMessageBoxError(sErrorMsg, true);
                }.bind(this));
            }.bind(this));
        },

        /**
         * Loads the page with the given pageId from the PagePersistence.
         *
         * @param {string} pageId The pageId to load
         * @returns {Promise<object>} A promise resolving to the page
         *
         * @private
         */
        _loadPage: function (pageId) {
            return this.getPageRepository().getPage(pageId);
        },

        /**
         * Saves the page model using the PagePersistence service
         *
         * @param {object} page The page model to save
         * @returns {Promise<void>} A promise
         *
         * @private
         */
        _savePage: function (page) {
            return this.getPageRepository().updatePage(page);
        },

        /**
         * Fetches the catalog information.
         *
         * @returns {ContentCatalogs} Contains the titles of each catalog, the tiles of each catalog and a map of vizIds to catalogtiles
         *
         * @private
         */
        _fetchCatalogInfo: function () {
            return sap.ushell.Container.getServiceAsync("LaunchPage").then(function (launchPageService) {
                return launchPageService.getCatalogs().then(function (aCatalogs) {
                    var aCatalogTitles = aCatalogs.map(function (oCatalog) {
                        var sCatalogId = launchPageService.getCatalogId(oCatalog) || "";
                        return launchPageService.getCatalogTitle(oCatalog) || sCatalogId.split(":").slice(1).join(":");
                    });

                    // CDM catalogs do not have the tiles[] array, get the tiles in a separate call
                    return Promise.all(aCatalogs.map(function (oCatalog) {
                        return launchPageService.getCatalogTiles(oCatalog);
                    })).then(function (aCatalogTiles) {
                        var mVizIdToCatalogTiles = {};
                        for (var i = 0; i < aCatalogTiles.length; i++) {
                            for (var j = 0; j < aCatalogTiles[i].length; j++) {
                                mVizIdToCatalogTiles[launchPageService.getCatalogTileId(aCatalogTiles[i][j])] = aCatalogTiles[i][j];
                            }
                        }

                        return {
                            catalogTitles: aCatalogTitles,
                            catalogTiles: aCatalogTiles,
                            mCatalogTiles: mVizIdToCatalogTiles
                        };
                    });
                });
            });
        },

        /**
         * Updates the error count and sets the dirty flag.
         *
         * @private
         */
        _pageUpdated: function () {
            sap.ushell.Container.setDirtyFlag(true);

            var aErrors = this.Page.collectErrors();

            oModel.setProperty("/errors", aErrors);
            oModel.setProperty("/errorslength", aErrors.length);
        },

        /* Group - Model API */

        /**
         * Adds a group to the model at the given index.
         *
         * @param {integer} groupIndex The index of where to add the group in the array
         *
         * @protected
         */
        addGroupAt: function (groupIndex) {
            var aGroups = oModel.getProperty("/page/content/sections");

            if (!groupIndex && groupIndex !== 0) {
                groupIndex = aGroups.length;
            }
            aGroups.splice(groupIndex, 0, {
                visualizations: []
            });

            oModel.setProperty("/page/content/sections", aGroups);

            this._pageUpdated();
        },

        /**
         * Handles the deletion of a group using and updating the model
         *
         * @param {integer} groupIndex The index of the group, that should be deleted
         *
         * @protected
         */
        deleteGroup: function (groupIndex) {
            if (!groupIndex && groupIndex !== 0) {
                return;
            }

            var aGroups = oModel.getProperty("/page/content/sections");
            aGroups.splice(groupIndex, 1);
            oModel.setProperty("/page/content/sections", aGroups);

            this._pageUpdated();
        },

        /* Content - Model API */

        /**
         * Handles the moving of a group using and updating the model
         *
         * @param {integer} originalGroupIndex The old index of the group, that should be moved
         * @param {integer} newGroupIndex The new index of the group, that should be moved
         *
         * @protected
         */
        moveGroup: function (originalGroupIndex, newGroupIndex) {
            if (!originalGroupIndex && originalGroupIndex !== 0
                || !newGroupIndex && newGroupIndex !== 0) {
                return;
            }

            var aGroups = oModel.getProperty("/page/content/sections"),
                oGroupToBeMoved = aGroups.splice(originalGroupIndex, 1)[0];

            aGroups.splice(newGroupIndex, 0, oGroupToBeMoved);
            oModel.setProperty("/page/content/sections", aGroups);

            this._pageUpdated();
        },

        /**
         * Handles the addition of content to a group using and updating the model
         *
         * @param {object} content The content, that should be added
         * @param {number[]} groupIndices The indices of groups, the content should be added to
         * @param {integer} contentIndex The index, the content should be added at
         *
         * @private
         */
        _addContentToGroup: function (content, groupIndices, contentIndex) {
            if (!content || !groupIndices.length) {
                return;
            }

            groupIndices.forEach(function (iGroupIndex) {
                var aContent = oModel.getProperty("/page/content/sections/" + iGroupIndex + "/visualizations");

                if (!contentIndex && contentIndex !== 0) {
                    contentIndex = aContent.length;
                }

                aContent.splice(contentIndex, 0, content);

                oModel.setProperty("/page/content/sections/" + iGroupIndex + "/visualizations", aContent);

                this._pageUpdated();
            }.bind(this));
        },

        /**
         * Handles the deletion of content inside a group using and updating the model
         *
         * @param {integer} contentIndex The index of the content, that should be deleted
         * @param {integer} groupIndex The index of the group, the content is in
         *
         * @protected
         */
        deleteContentInGroup: function (contentIndex, groupIndex) {
            if (!contentIndex && contentIndex !== 0
                || !groupIndex && groupIndex !== 0) {
                return;
            }

            var aContent = oModel.getProperty("/page/content/sections/" + groupIndex + "/visualizations");
            aContent.splice(contentIndex, 1);
            oModel.setProperty("/page/content/sections/" + groupIndex + "/visualizations", aContent);

            this._pageUpdated();
        },

        /**
         * Handles the movement of content inside a group and between different groups,
         * using and updating the model
         *
         * @param {integer} originalContentIndex The old index, where the content was from
         * @param {integer} newContentIndex The new index, where the content should go
         * @param {integer} originalGroupIndex The index of the group, the content was in
         * @param {integer} newGroupIndex The index of the group, where the content should be added
         *
         * @protected
         */
        moveContentInGroup: function (originalContentIndex, newContentIndex, originalGroupIndex, newGroupIndex) {
            if (!originalContentIndex && originalContentIndex !== 0
                || !newContentIndex && newContentIndex !== 0
                || !originalGroupIndex && originalGroupIndex !== 0
                || !newGroupIndex && newGroupIndex !== 0) {
                return;
            }

            var sOriginalContentPath = "/page/content/sections/" + originalGroupIndex + "/visualizations",
                sNewContentPath = "/page/content/sections/" + newGroupIndex + "/visualizations",
                aOriginalContent = oModel.getProperty(sOriginalContentPath),
                aNewContent = oModel.getProperty(sNewContentPath),
                oContent = aOriginalContent.splice(originalContentIndex, 1);

            aNewContent.splice(newContentIndex, 0, oContent[0]);

            oModel.setProperty(sOriginalContentPath, aOriginalContent);
            oModel.setProperty(sNewContentPath, aNewContent);

            this._pageUpdated();
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/PageOverview.controller.js":function(){//${copyright}
/**
 * @fileOverview Controller of the PageOverview fragment.
 */
sap.ui.define([
    "sap/ushell/applications/PageComposer/controller/BaseController",
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (
    BaseController,
    Log,
    MessageToast,
    JSONModel,
    Filter,
    FilterOperator
) {
    "use strict";

    /**
     * @typedef {object} ButtonStateModel The model for the button states (e.g. delete button)
     * @property {boolean} isDeleteEnabled Whether the delete button is enabled
     */

    return BaseController.extend("sap.ushell.applications.PageComposer.controller.Main", {

        aPropertiesToFilter: ["id", "title", "description", "createdBy", "modifiedBy", "BusinessRoleId", "BusinessRole"],
        oDialogFactory: null,
        /**
         * Called when controller is initialized.
         *
         * @private
         */
        onInit: function () {
            this.setModel(new JSONModel({busy: false, pages: []}));
            this.getRouter().getRoute("overview").attachPatternMatched(this._onPageOverviewMatched, this);
            this.setModel(this._createInitialButtonStateModel(), "buttonStates");
        },

        /**
         * Called if a list item in the pageOverview table is pressed.
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onItemPress: function (oEvent) {
            var oPage = oEvent.getParameter("listItem").getBindingContext().getObject();
            this._navigateToDetail(oPage.content.id);
        },

        /**
         * Called if the route is entered. Refreshes the model.
         *
         * @private
         */
        _onPageOverviewMatched: function () {
            this._refreshModel();
        },

        /**
         * Navigates to the page edit page.
         *
         * @param {string} pageId The pageId to navigate to
         *
         * @private
         */
        _navigateToEdit: function (pageId) {
            this.getRouter().navTo("edit", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Navigates to the page detail page
         *
         * @param {string} pageId The page ID to navigate to
         *
         * @private
         */
        _navigateToDetail: function (pageId) {
            this.getRouter().navTo("detail", {
                pageId: encodeURIComponent(pageId)
            });
        },

        /**
         * Called if a list item in the pageOverview table is selected
         * Sets the state of the Delete button to enabled.
         *
         * @param {sap.ui.base.Event} oEvent The select event
         *
         * @private
         */
        onSelectionChange: function (oEvent) {
            this._setDeleteButtonEnabled(true);
        },

        /**
         * Called if the edit button in the pageOverview table is pressed
         * Sets the config values and navigates to the dashboard
         *
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onEdit: function (oEvent) {
            var oPage = oEvent.getSource().getBindingContext().getObject();
            this._navigateToEdit(oPage.content.id);
        },

        /**
         * Called if the add button is clicked
         * Creates and saves (!) a new page, then sets the config values and navigates to the dashboard
         *
         * @private
         */
        onAdd: function () {
            this.showCreateDialog(function (pageInfo) {
                sap.ushell.Container.getServiceAsync("PageReferencing")
                    .then(function (PageReferencing) {
                        return PageReferencing.createReferencePage(pageInfo, []);
                    })
                    .then(function (oReferencePage) {
                        return this.getPageRepository().createPage(oReferencePage);
                    }.bind(this))
                    .then(function () {
                        this._navigateToEdit(pageInfo.content.id);
                        MessageToast.show(this.getResourceBundle().getText("Message.PageCreated"), {
                            closeOnBrowserNavigation: false
                        });
                    }.bind(this))
                    .catch(this.handleBackendError.bind(this));
            }.bind(this));
        },

        /**
         * Called if the delete dialog is confirmed
         * Deletes the selected page and refreshes the model to display the change in the pageOverview table
         *
         * @param {sap.ui.base.Event} oEvent The press event
         * @returns {Promise<void>} The delete promise
         *
         * @private
         */
        _deletePage: function (oEvent) {
            var oDialog = oEvent.getSource().getParent();
            var sTransportId = oEvent.metadata && oEvent.metadata.transportId || "";
            var oTable = this.byId("table");
            var aItemsToDelete = oTable.getSelectedItems().map(function (item) {
                return item.getBindingContext().getObject();
            });
            var sSuccessMsg = this.getResourceBundle().getText("Message.SuccessDeletePage");

            var aDeletePromises = aItemsToDelete.map(function (oItemToDelete) {
                return this.getPageRepository().deletePage(oItemToDelete.content.id, sTransportId);
            }.bind(this));

            return Promise.all(aDeletePromises)
                .then(function () {
                    return this._refreshModel();
                }.bind(this))
                .then(function () {
                    oTable.fireSelectionChange();
                    MessageToast.show(sSuccessMsg, {
                        closeOnBrowserNavigation: false
                    });
                    oDialog.close();
                })
                .catch(this.handleBackendError.bind(this));
        },

        /**
         * Called if the delete button is clicked
         * Displays the delete dialog with the pages to delete
         * on confirmation deletes the pages
         * on cancel closes the dialog
         *
         * @private
         */
        onDelete: function () {
            var oTable = this.byId("table");
            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {
                return;
            }

            this.checkShowDeleteDialog(
                oSelectedItem.getBindingContext().getObject(),
                this._deletePage.bind(this)
            );
        },

        /**
         * Filters the Table
         * @param {sap.ui.base.Event} oEvent The press event
         *
         * @private
         */
        onSearch: function (oEvent) {
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            var sSearchValue = oEvent.getSource().getValue();

            var aFilters = this.aPropertiesToFilter.map(
                function (sPropertyToFilter) {
                    return new Filter({
                        path: "content/" + sPropertyToFilter,
                        operator: FilterOperator.Contains,
                        value1: sSearchValue
                    });
                }
            );

            var oFilter = new Filter({
                filters: aFilters,
                and: false
            });

            oBinding.filter([oFilter]);
        },

        /**
         * Loads available pages and sets the model
         *
         * @returns {Promise<void>} Promise that resolves when the pages have been loaded
         *
         * @private
         */
        _refreshModel: function () {
            this.getModel().setProperty("/busy", true);
            return this._loadAvailablePages().then(function (pages) {
                this.getModel().setSizeLimit(pages.pages.length);
                this.getModel().setProperty("/pages", pages.pages);
                this.getModel().setProperty("/busy", false);
            }.bind(this), function (sErrorMsg) {
                this.getModel().setProperty("/busy", false);
                this.showMessageBoxError(sErrorMsg);
            }.bind(this));
        },

        /**
         * Called when table was updated, for example, filter items via search
         *
         * @private
         */
        onTableUpdate: function () {
            var oTable = this.byId("table"),
                oModel = this.getView().getModel("buttonStates");
            //if filter hides selected item, we need to reset delete button and selected item
            if (oTable.getSelectedItems().length === 0 && oModel.getProperty("/isDeleteEnabled")) {
                //true -> remove all seceltions (also hidden by filter)
                oTable.removeSelections(true);
                this._setDeleteButtonEnabled(false);
            }
        },

        /**
         * Load available pages from the page persistence
         *
         * @returns {Promise<{pages: array}>} A promise which contains an object with the pages
         *
         * @private
         */
        _loadAvailablePages: function () {
            return this.getPageRepository().getPages().then(function (aPages) {
                return {
                    pages: aPages
                };
            });
        },

        /**
         * Creates the model for the state of the delete button
         * @returns {ButtonStateModel} The Model for storing the button
         *
         * @private
         */
        _createInitialButtonStateModel: function () {
            return new JSONModel({
                isDeleteEnabled: false
            });
        },

        /**
         * Changes the state model of the delete button.
         * @param {boolean} bEnabled Whether the delete button should be enabled.
         *
         * @private
         */
        _setDeleteButtonEnabled: function (bEnabled) {
            this.getView().getModel("buttonStates").setProperty("/isDeleteEnabled", bEnabled);
        }
    });
});
},
	"sap/ushell/applications/PageComposer/controller/TileSelector.js":function(){// ${copyright}

/**
 * @fileoverview Provides functionality for "sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml"
 */
sap.ui.define([
    "sap/m/library",
    "sap/m/Button",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/ResponsivePopover",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ushell/applications/PageComposer/i18n/resources",
    "sap/ushell/services/Container" // required for "sap.ushell.Container.getServiceAsync()"
], function (
    mobileLibrary,
    Button,
    List,
    StandardListItem,
    ResponsivePopover,
    JSONModel,
    Filter,
    FilterOperator,
    Sorter,
    resources
    // Container
) {
    "use strict";

    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;

    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;

    // shortcut for sap.m.ListMode
    var ListMode = mobileLibrary.ListMode;

    // shortcut for sap.m.ListSeparators
    var ListSeparators = mobileLibrary.ListSeparators;

    /**
     * TileSelector constructor
     *
     * @constructor
     *
     * @protected
     */
    return function () {
        var oParentView,
            oTree,
            oToolbar,
            oAddSelectedTilesButton,
            oAddSingleTileData,
            oGroupList,
            oGroupSelectionPopover,
            fnAddTileHandler,
            bSortAscending,
            oTargetResults = {},
            mCatalogTiles = {};

        /**
         * Initializes the TileSelector, must be called before usage.
         *
         * @param {sap.ui.core.mvc.Controller} oController A reference to the controller it is going to be used on.
         *
         * @private
         */
        this.init = function (oController) {
            oParentView = oController.getView();
            oTree = oParentView.byId("tileSelectorList");
            oToolbar = oParentView.byId("tileSelectorToolbar");
            oAddSelectedTilesButton = oParentView.byId("tileSelectorAddButton");

            oTree.setBusy(true);

            oGroupList = new List({
                mode: ListMode.MultiSelect,
                showSeparators: ListSeparators.None,
                includeItemInSelection: true,
                selectionChange: function () { oGroupSelectionPopover.getBeginButton().setEnabled(!!oGroupList.getSelectedItem()); },
                items: {
                    path: "/page/content/sections",
                    template: new StandardListItem({ title: "{title}" })
                },
                noDataText: resources.i18n.getText("Message.NoGroups")
            }).setModel(oParentView.getModel());

            oAddSelectedTilesButton.setEnabled(false);
            oTree.attachSelectionChange(this._onSelectionChange);
        };

        /**
         * Consumes catalog data and builds the catalog tree, replacing the model with it.
         *
         * @param {object} oCatalogData The catalog object
         * @param {object[]} [oCatalogData.aTreeOverride] If present, other properties are ignored and this property is used as the catalog tree
         * instead of building one using the other properties.
         * @param {string[]} oCatalogData.catalogTitles An array of catalog titles
         * @param {string[][]} oCatalogData.catalogTiles An array of arrays of tiles (one array of tiles for each catalog)
         * @param {string[]} oCatalogData.mCatalogTiles A map of "vizId"s to tiles
         *
         * @private
         */
        this.initTiles = function (oCatalogData) {
            if (oCatalogData.aTreeOverride) {
                _setCatalogTree(oCatalogData.aTreeOverride);
                return;
            }
            sap.ushell.Container.getServiceAsync("LaunchPage").then(function (oLaunchPageService) {
                mCatalogTiles = oCatalogData.mCatalogTiles;
                var aCatalogTree = oCatalogData.catalogTiles.reduce(function (tree, tiles, i) {
                    if (tiles.length) {
                        tree.push({
                            catalogTitle: oCatalogData.catalogTitles[i],
                            tiles: tiles.map(function (tile) {
                                return {
                                    vizId: oLaunchPageService.getCatalogTileId(tile),
                                    title: oLaunchPageService.getCatalogTilePreviewTitle(tile) || oLaunchPageService.getCatalogTileTitle(tile),
                                    subtitle: oLaunchPageService.getCatalogTilePreviewSubtitle(tile),
                                    icon: oLaunchPageService.getCatalogTilePreviewIcon(tile)
                                };
                            }).sort(function (a, b) { // sorts tiles by title in ascending lexicographical order
                                if (a.title > b.title) { return 1; }
                                if (a.title < b.title) { return -1; }
                                return 0;
                            })
                        });
                    }
                    return tree;
                }, []);
                _setCatalogTree(aCatalogTree);
            });
        };

        /**
         * Intended to be called by the view (e.g. a SearchField) for handling tile search events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onSearchTiles = function (/*oEvent*/) {
            searchForTiles();
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling add tile events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onAddTiles = function (oEvent) {
            var aGroupListItems = oGroupList.getItems(),
                oBindingContext = oEvent.getSource().getBindingContext("catalogs");
            oAddSingleTileData = oBindingContext ? oBindingContext.getProperty() : null;
            if (aGroupListItems.length === 1) { // skip asking to which group(s) if there is only one group
                aGroupListItems[0].setSelected(true);
                _addTiles();
            } else {
                _openGroupSelectionPopover(oEvent);
            }
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling sort catalogs toggle events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onSortCatalogsToggle = function (/*oEvent*/) {
            sortCatalogsToggle();
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling collapse all catalogs events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onCollapseAllCatalogs = function (/*oEvent*/) {
            collapseAllCatalogs(true);
        };

        /**
         * Intended to be called by the view (e.g. a Button) for handling expand all catalogs events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onExpandAllCatalogs = function (/*oEvent*/) {
            collapseAllCatalogs(false);
        };

        /**
         * Intended to be called by the view (e.g. a Tree) for handling catalog item press events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onCatalogItemPress = function (oEvent) {
            _toggleCollapseTreeItem(oEvent.getParameters().listItem);
        };

        /**
         * Intended to be called by the view (e.g. a Tree) for handling selection change events.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this._onSelectionChange = function (oEvent) {
            if (oGroupSelectionPopover && oGroupSelectionPopover.isOpen()) {
                oGroupSelectionPopover.getBeginButton().setEnabled(false);
                oGroupSelectionPopover.close();
            }
            oEvent.getParameters().listItems.forEach(function (item) {
                if (item.getBindingContext("catalogs").getProperty().tiles) { // catalog (root item)
                    item.setSelected(false); // currently, catalogs should not be selectable
                    _toggleCollapseTreeItem(item); // instead, allow toggling collapse with space bar
                }
            });
            oAddSelectedTilesButton.setEnabled(!!_getSelectedTreeItemsData().length);
        };

        /**
         * Sets a callback function for the add tiles event.
         *
         * @param {function} newAddTileHandler The callback function to be called when adding tiles.
         *   This function receives two arguments in the following order:
         *     1. A tile object.
         *     2. An array of group indices.
         *
         * @private
         */
        this.setAddTileHandler = function (newAddTileHandler) {
            fnAddTileHandler = newAddTileHandler;
        };

        /**
         * Called when starting to drag a tile.
         *
         * @param {sap.ui.base.Event} oEvent The event object.
         *
         * @private
         */
        this.onDragStart = function (oEvent) {
            var oItemData = oEvent.getParameter("target").getBindingContext("catalogs").getProperty();
            if (!oItemData.vizId) { // prevent dragging of items without vizId
                oEvent.preventDefault();
                return;
            }
            oEvent.getParameter("dragSession").setComplexData("callback", function callback (tileIndex, groupIndex) {
                Promise.all([
                    sap.ushell.Container.getServiceAsync("LaunchPage"),
                    sap.ushell.Container.getServiceAsync("NavTargetResolution")
                ]).then(function (aServices) {
                    _getInboundPermanentKey(oItemData.vizId, aServices[0], aServices[1]).then(function (oEnrichedTileData) {
                        fnAddTileHandler(oEnrichedTileData, [groupIndex], tileIndex);
                    }, function (oEnrichedTileData) {
                        fnAddTileHandler(oEnrichedTileData, [groupIndex], tileIndex);
                    });
                });
            });
        };

        /**
         * Sets (overwrites) the "catalogs" model with the provided tree.
         *
         * @param {object[]} aCatalogTree The catalog tree to set (overwrite) the "catalogs" model.
         *
         * @private
         */
        function _setCatalogTree (aCatalogTree) {
            var oModel = new JSONModel({ catalogs: aCatalogTree });
            oModel.setSizeLimit(Infinity); // allow more list bindings than the model default limit of 100 entries
            oParentView.setModel(oModel, "catalogs");
            bSortAscending = true;
            sortCatalogsToggle();
            oTree.expandToLevel(1);
            oTree.setBusy(false);
        }

        /**
         * Handler for searching tiles using the SearchField input.
         *
         * @private
         */
        function searchForTiles () {
            var sSearchText = oParentView.getModel().getProperty("/searchText") || "";
            oTree.getBinding("items").filter([
                new Filter([
                    new Filter("title", FilterOperator.Contains, sSearchText),
                    new Filter("subtitle", FilterOperator.Contains, sSearchText)
                ], false)
            ]);
        }

        /**
         * Toggles the sort order (ascending/descending) of the catalog tree, restricted to the first tree level (i.e. the catalog level).
         *
         * @private
         */
        function sortCatalogsToggle () {
            bSortAscending = !bSortAscending;
            var oItems = oTree.getBinding("items"),
                oSorterCatalog = new Sorter("catalogTitle", bSortAscending);
            oItems.sort(oSorterCatalog);
        }

        /**
         * Controls collapsing and expanding all catalogs.
         *
         * @param {boolean} bCollapse Whether it should collapse all catalogs instead of expanding all catalogs.
         *
         * @private
         */
        function collapseAllCatalogs (bCollapse) {
            if (bCollapse) {
                oTree.collapseAll();
            } else {
                oTree.expandToLevel(1);
            }
        }

        /**
         * Toggles the collapse state of a tree item between collapsed and expanded.
         *
         * @param {sap.m.TreeItemBase} oTreeItem The tree item to have its collapse state toggled.
         *
         * @private
         */
        function _toggleCollapseTreeItem (oTreeItem) {
            var iTreeItemIndex = oTree.indexOfItem(oTreeItem);
            if (oTreeItem.getExpanded()) {
                oTree.collapse(iTreeItemIndex);
            } else {
                oTree.expand(iTreeItemIndex);
            }
        }

        /**
         * Get the item data of every selected tree item.
         * This is needed because "getSelectedItems()" do not return selected items within collapsed parents.
         *
         * @returns {object[]} An array of selected tree item data.
         *
         * @private
         */
        function _getSelectedTreeItemsData () {
            return oTree.getSelectedContextPaths().map(function (sSelectedItemContextPath) {
                return oParentView.getModel("catalogs").getContext(sSelectedItemContextPath).getProperty();
            });
        }

        /**
         * Opens the add tiles popover, containing the group list for selection of the tiles target groups.
         *
         * @param {sap.ui.base.Event} oEvent The event that raised the operation (e.g. a click on the "Add" button).
         *
         * @private
         */
        function _openGroupSelectionPopover (oEvent) {
            if (!oGroupSelectionPopover || oGroupSelectionPopover.bIsDestroyed) {
                _createGroupSelectionPopover();
            }
            oGroupList.removeSelections(true);
            oGroupSelectionPopover.getBeginButton().setEnabled(false);
            oGroupSelectionPopover.getEndButton().setEnabled(true);
            if (!oAddSingleTileData && _isOverflownInOverflowToolbar(oAddSelectedTilesButton)) {
                oGroupSelectionPopover.openBy(oToolbar.getAggregation("_overflowButton"));
            } else {
                oGroupSelectionPopover.openBy(oEvent.getSource());
            }
        }

        /**
         * Checks if a control is currently overflown inside of an OverflowToolbar.
         *
         * @param {sap.ui.core.Control} oControl The control to check.
         * @returns {boolean} Whether the control is or is not overflown inside of an OverflowToolbar.
         *
         * @private
         */
        function _isOverflownInOverflowToolbar (oControl) {
            return (oControl.hasStyleClass("sapMOTAPButtonNoIcon") || oControl.hasStyleClass("sapMOTAPButtonWithIcon"));
        }

        /**
         * Creates the group selection popover, used to select to which group(s) the tile(s) should go to.
         *
         * @private
         */
        function _createGroupSelectionPopover () {
            oGroupSelectionPopover = new ResponsivePopover({
                placement: PlacementType.Auto,
                title: resources.i18n.getText("Tooltip.AddToGroups"),
                beginButton: new Button({
                    type: ButtonType.Emphasized,
                    text: resources.i18n.getText("Button.Add"),
                    press: function () { this.setEnabled(false); oGroupSelectionPopover.close(); _addTiles(); }
                }),
                endButton: new Button({
                    text: resources.i18n.getText("Button.Cancel"),
                    press: function () { this.setEnabled(false); oGroupSelectionPopover.close(); }
                }),
                content: oGroupList,
                initialFocus: oGroupList
            });
            oParentView.addDependent(oGroupSelectionPopover);
        }

        /**
         * Calculates the inboundPermanentKey for the given visualization id
         *
         * @param {string} sVizId the visualization id of a tile
         * @param {object} launchPageService the LaunchPage service
         * @param {object} navTargetResolutionService the NavTargetResolution service
         *
         * @returns {Promise<object>} the visualization id and the inboundPermanentKey
         *
         * @private
         */
        function _getInboundPermanentKey (sVizId, launchPageService, navTargetResolutionService) {
            var sTarget = launchPageService.getCatalogTileTargetURL(mCatalogTiles[sVizId]);
            if (sTarget && sTarget[0] === "#") {
                if (!oTargetResults[sTarget]) {
                    oTargetResults[sTarget] = navTargetResolutionService.resolveHashFragment(sTarget);
                }
                return Promise.resolve(oTargetResults[sTarget].then(
                    function (oResolutionResult) {
                        return {
                            vizId: sVizId,
                            inboundPermanentKey: oResolutionResult.inboundPermanentKey
                        };
                    }, function () {
                        return {
                            vizId: sVizId,
                            inboundPermanentKey: "",
                            error: "Resolving the hash fragment " + sTarget + " failed."
                        };
                    }));
            }
            return Promise.resolve({
                vizId: sVizId,
                inboundPermanentKey: ""
            });
        }

        /**
         * Calls the handler for adding tiles. Does nothing if no function is set for the add tiles handler.
         *
         * @see setAddTileHandler
         *
         * @private
         */
        function _addTiles () {
            if (typeof fnAddTileHandler !== "function") {
                return;
            }
            var aSelectedGroupsIndexes = oGroupList.getSelectedItems().map(function (oSelectedGroup) {
                return oGroupList.indexOfItem(oSelectedGroup);
            });
            var aTileData;
            if (oAddSingleTileData) {
                aTileData = [oAddSingleTileData]; // adds a single tile (from its own "Add" button)
            } else {
                aTileData = _getSelectedTreeItemsData(); // adds all selected tiles (from header "Add" button)
            }
            Promise.all([
                sap.ushell.Container.getServiceAsync("LaunchPage"),
                sap.ushell.Container.getServiceAsync("NavTargetResolution")
            ]).then(function (aServices) {
                aTileData.forEach(function (oTileData) {
                    _getInboundPermanentKey(oTileData.vizId, aServices[0], aServices[1]).then(function (oEnrichedTileData) {
                        fnAddTileHandler(oEnrichedTileData, aSelectedGroupsIndexes);
                    }, function (oEnrichedTileData) {
                        fnAddTileHandler(oEnrichedTileData, aSelectedGroupsIndexes);
                    });
                });
                if (!oAddSingleTileData) { // unselect all tiles only when adding through the header "Add" button
                    oAddSelectedTilesButton.setEnabled(false);
                    oTree.removeSelections(true);
                }
            });
        }
    };
});
},
	"sap/ushell/applications/PageComposer/i18n/i18n.properties":'# Translatable texts for the Fiori Launchpad Page Composer application\n# __ldi.translation.uuid=ba56f460-d533-11e9-aaef-0800200c9a66\n\n\n# XTIT: Title for the Maintain Pages Application\nPageComposer.AppTitle=Maintain Pages\n\n\n#XBUT\nButton.Add=Add\n#XBUT\nButton.Cancel=Cancel\n#XBUT\nButton.Copy=Copy\n#XBUT\nButton.Create=Create\n#XBUT\nButton.Delete=Delete\n#XBUT\nButton.Edit=Edit\n#XBUT\nButton.Save=Save\n#XBUT\nButton.Ok=OK\n#XBUT\nButton.ShowCatalogs=Toggle Catalogs\n#XBUT\nButton.SortCatalogs=Toggle Catalog Sort Order\n#XBUT\nButton.CollapseCatalogs=Collapse All Catalogs\n#XBUT\nButton.ExpandCatalogs=Expand All Catalogs\n#XBUT\nButton.ShowDetails=Show Details\n#XBUT\nButton.PagePreview=Page Preview\n\n\n#XTOL\nTooltip.AddToGroups=Add to Groups\n#XTOL Tooltip for the search button\nTooltip.Search=Search\n#XTOL\nTooltip.SearchForTiles=Search for Tiles\n\n\n#XFLD\nLabel.PageID=Page ID\n#XFLD\nLabel.PageTitle=Title\n#XFLD\nLabel.WorkbenchRequest=Workbench Request\n#XFLD\nLabel.Package=Package\n#XFLD\nLabel.TransportInformation=Transport Information\n#XFLD\nLabel.Details=Details:\n#XFLD\nLabel.ResponseCode=Response Code:\n#XFLD\nLabel.Description=Description\n#XFLD\nLabel.CreatedBy=Created By\n#XFLD\nLabel.CreatedOn=Created On\n#XFLD\nLabel.ChangedBy=Changed By\n#XFLD\nLabel.ChangedOn=Changed On\n#XFLD\nLabel.PageTitle=Page Title\n#XFLD\nLabel.AssignedRole=Assigned Role\n\n\n#XCOL\nColumn.PageID=ID\n#XCOL\nColumn.PageTitle=Title\n#XCOL\nColumn.PageDescription=Description\n#XCOL\nColumn.PageCreatedBy=Created By\n#XCOL\nColumn.PageCreatedOn=Created On\n#XCOL\nColumn.PageChangedBy=Changed By\n#XCOL\nColumn.PageChangedOn=Changed On\n\n\n#XTOL\nPlaceholder.GroupName=Enter group name\n#XTOL\nPlaceholder.SearchForTiles=Search for tiles\n\n#MSG\nMessage.NoGroupTitle=Group {0} has no title. For a consistent user experience, we recommend you enter a group name for each group.\n#XMSG\nMessage.InvalidGroupTitle=Ideally, you should enter a group name.\n#XMSG\nMessage.NoInternetConnection=Please check your internet connection.\n#XMSG\nMessage.SavedChanges=Your changes have been saved.\n#XMSG\nMessage.InvalidPageID=Please only use the following characters: A-Z a-z 0-9 _ /\n#XMSG\nMessage.EmptyPageID=Please provide the Page ID.\n#XMSG\nMessage.EmptyTitle=Please provide the title.\n#XMSG\nMessage.SuccessDeletePage=The selected page has been deleted.\n#XMSG\nMessage.ClipboardCopySuccess=Details were copied successfully.\n#YMSE\nMessage.ClipboardCopyFail=An error occurred while copying details.\n#XMSG\nMessage.DeletePageConfirmation=Do you really want to delete \\n {0} {1}?\n#XMSG\nMessage.PageCreated=The page has been created.\n#XMSG: Message displayed inside of the TileSelector when there are no tiles available or when the search found no results\nMessage.NoTiles=No Tiles\n#XMSG: Message displayed inside of the TileSelector GroupSelectionPopover when there are no groups\nMessage.NoGroups=No Groups\n#YMSG: First parameter {0} is numbers "1.", "2.", "3."; second parameter {1} is the group/section name\nMessage.LoadTileError=Failed to load the {0} tile in the "{1}" group.\\n\\n This is most likely caused by an incorrect SAP Fiori launchpad content configuration or by a missing role assignment.\\n\\n The content will be invisible to the user.\\n\\n To resolve this issue, please check the catalogs and target mappings assigned to this role.\n#XMSG\nMessage.NavigationTargetError=Navigation target could not be resolved.\n#XMSG\nMessage.TilesHaveErrors=Some of the tiles or groups have errors or warnings. Are you sure you want to continue saving?\n#YMSG: First parameter {0} is the the title of the application launch tile\nMessage.NavTargetResolutionError=Failed to resolve the navigation target of tile: "{0}".\\n\\n This is most likely caused by an incorrect SAP Fiori launchpad content configuration or by a missing role assignment.\\n\\n The tile "{0}" will be shown to the user, but the user will not be able to navigate using this tile.\n#XMSG\nMessage.DeleteGroup=Are you sure you want to delete the group "{0}"?\n#XMSG\nMessage.PageIsOutdated=A newer version of this page has already been saved.\n#XMSG\nMessage.SaveChanges=Please save your changes.\n\n\n##############\n# Dialogs\n##############\n\n#XTIT: Dialog Title\nCreatePageDialog.Title=New Page\n#XTIT\nTitle.TilesHaveErrors=Tiles Have Errors\n#XTIT\nDeleteDialog.Title=Delete\n#XMSG\nDeleteDialog.Text=Are you sure you want to delete the selected page?\n#XBUT\nDeleteDialog.ConfirmButton=Delete\n#XTIT\nDeleteDialog.LockedTitle=Page Locked\n#XMSG\nDeleteDialog.LockedText=The selected page is locked by user {0}.\n#XMSG\nDeleteDialog.TransportRequired=Please select a transport to delete the selected page.\n\n#XMSG\nEditDialog.LockedText=The selected page is locked by user {0}.\n#XMSG\nEditDialog.TransportRequired=Please select a transport to edit the selected page.\n#XTIT\nEditDialog.Title=Edit Page\n\n#XTIT\nErrorDialog.Title=Error\n\n#XTIT\nPageOverview.Title=Maintain Pages\n\n\n#XTIT\nCopyDialog.Title=Copy\n#XMSG: Paremeter {0} is the title of the page being copied\nCopyDialog.Message=Do you want to copy {0}?\n#XFLD\nCopyDialog.NewID=Copy of {0}\n\n\n#XMSG\nTitle.NoGroupTitle=Group title of group {0} is empty.\n#XMSG\nTitle.UnsufficientRoles=Insufficent role assignment to show content.\n#XMSG\nTitle.ContentIsNotVisible=Content will be invisible to the user.\n#XMSG\nTitle.ContentNotNavigateable=Content will not be navigateable.\n',
	"sap/ushell/applications/PageComposer/i18n/resources.js":function(){// ${copyright}
/**
 * @fileOverview This file handles the resource bundles.
 */

sap.ui.define(['sap/ui/model/resource/ResourceModel'],
	function(ResourceModel) {
	"use strict";

    // ensure that sap.ushell exists
    var resources = { };

    resources.getTranslationModel = function (sLocale) {
     // create translation resource model
        var oTranslationModel = new ResourceModel({
            bundleUrl : jQuery.sap.getModulePath(
                "sap.ushell.applications.PageComposer.i18n.i18n",
                ".properties"
            ),
            bundleLocale : sLocale
        });
        return oTranslationModel;
    };

    resources.i18nModel = resources.getTranslationModel(sap.ui.getCore().getConfiguration().getLanguage());
    resources.i18n = resources.i18nModel.getResourceBundle();


	return resources;

}, /* bExport= */ true);
},
	"sap/ushell/applications/PageComposer/manifest.json":'{\n    "_version": "1.1.0",\n\n    "sap.app": {\n        "_version": "1.1.0",\n        "i18n": "i18n/i18n.properties",\n        "id": "sap.ushell.applications.PageComposer",\n        "type": "component",\n        "embeddedBy": "",\n        "title": "{{PageComposer.AppTitle}}",\n        "ach": "CA-FLP-COR",\n        "dataSources": {\n            "PageRepositoryService": {\n                "uri": "/sap/opu/odata/UI2/FDM_PAGE_REPOSITORY_SRV/",\n                "type": "OData",\n                "settings": {\n                    "odataVersion": "2.0",\n                    "localUri": "localService/metadata.xml"\n                }\n            }\n        },\n        "cdsViews": [],\n        "offline": false\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n\n        "technology": "UI5",\n        "icons": {\n            "icon" : "sap-icon://Fiori2/F0003",\n            "favIcon" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0003_Manage_Tasks.ico",\n            "phone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/57_iPhone_Desktop_Launch.png",\n            "phone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/114_iPhone-Retina_Web_Clip.png",\n            "tablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png",\n            "tablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/144_iPad_Retina_Web_Clip.png",\n            "homeScreenIconPhone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/57_iPhone_Desktop_Launch.png",\n            "homeScreenIconPhone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/114_iPhone-Retina_Web_Clip.png",\n            "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/72_iPad_Desktop_Launch.png",\n            "homeScreenIconTablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0003_Manage_Tasks/144_iPad_Retina_Web_Clip.png",\n            "startupImage320x460" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",\n            "startupImage640x920" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",\n            "startupImage640x1096" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",\n            "startupImage768x1004" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",\n            "startupImage748x1024" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1024_x_748.png",\n            "startupImage1536x2008" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",\n            "startupImage1496x2048" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/2048_x_1496.png"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": false,\n            "phone": false\n        },\n        "fullWidth": true\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "resources": {\n            "js": [],\n            "css": [\n                {\n                    "uri": "css/style.css"\n                }\n            ]\n        },\n        "componentUsages":{\n            "transportInformation": {\n                "name": "sap.ushell_abap.transport",\n                "settings": {},\n                "componentData": {},\n                "manifest" : true\n            }\n        },\n        "dependencies": {\n            "libs": {\n                "sap.f": {\n                    "minVersion": "1.68"\n                },\n                "sap.m": {\n                    "minVersion": "1.68"\n                },\n                "sap.ui.layout": {\n                    "minVersion": "1.68"\n                },\n                "sap.ushell": {\n                    "minVersion": "1.68"\n                }\n            }\n        },\n        "models": {\n            "PageRepository": {\n                "dataSource": "PageRepositoryService",\n                "settings": {\n                    "defaultCountMode": "None",\n                    "skipMetadataAnnotationParsing": true,\n                    "useBatch": true\n                }\n            },\n            "i18n": {\n                "type": "sap.ui.model.resource.ResourceModel",\n                "uri": "i18n/i18n.properties"\n            }\n        },\n        "rootView": {\n            "viewName": "sap.ushell.applications.PageComposer.view.App",\n            "type": "XML",\n            "async": true,\n            "id": "pageComposer"\n        },\n        "handleValidation": false,\n        "config": {\n            "fullWidth": true\n        },\n        "routing": {\n            "config": {\n                "routerClass": "sap.m.routing.Router",\n                "viewType": "XML",\n                "viewPath": "sap.ushell.applications.PageComposer.view",\n                "controlId": "pageComposer",\n                "controlAggregation": "pages",\n                "async": true,\n                "fullWidth" : true\n            },\n            "routes": [\n                {\n                    "pattern": "",\n                    "name": "overview",\n                    "target": "overview"\n                },\n                {\n                    "pattern": "view/{pageId}",\n                    "name": "detail",\n                    "target": "detail"\n                },\n                {\n                    "pattern": "edit/{pageId}",\n                    "name": "edit",\n                    "target": "edit"\n                }\n            ],\n            "targets": {\n                "overview": {\n                    "viewId": "pageOverview",\n                    "viewName": "PageOverview"\n                },\n                "detail": {\n                    "viewId": "detail",\n                    "viewName": "PageDetail"\n                },\n                "edit": {\n                    "viewId": "edit",\n                    "viewName": "PageDetailEdit"\n                }\n            }\n        },\n        "contentDensities": { "compact": true, "cozy": true }\n    }\n}\n',
	"sap/ushell/applications/PageComposer/util/PagePersistence.js":function(){// ${copyright}
/**
 * @fileOverview PagePersistence utility to interact with the /UI2/FDM_PAGE_REPOSITORY_SRV service on ABAP
 * @version ${version}
 */
sap.ui.define([
    "sap/ushell/applications/PageComposer/i18n/resources"
], function (
    resources
) {
    "use strict";

    /**
    * Constructs a new instance of the PagePersistence utility.
    *
    * @param {sap.ui.model.odata.v2.ODataModel} oDataModel The ODataModel for the PageRepositoryService
    * @constructor
    *
    * @since 1.70.0
    *
    * @private
    */
    var PagePersistence = function (oDataModel) {
        this._oODataModel = oDataModel;
        this._oEtags = {};
    };

    /**
    * Returns a promise which resolves to an array of page headers of all available pages.
    *
    * @returns {Promise<object[]>} Resolves to an array of page headers
    *
    * @since 1.70.0
    *
    * @protected
    */
    PagePersistence.prototype.getPages = function () {
        return this._readPages()
            .then(function (pages) {
                for (var i = 0; i < pages.results.length; i++) {
                    this._storeETag(pages.results[i]);
                }
                return pages;
            }.bind(this))
            .then(this._convertODataToPageList)
            .catch(this._rejectWithErrorMessage);
    };

    /**
    * Returns a page
    *
    * @param {string} sPageId The page ID
    * @returns {Promise<object>} Resolves to a page
    *
    * @since 1.70.0
    *
    * @protected
    */
    PagePersistence.prototype.getPage = function (sPageId) {
        return this._readPage(sPageId)
            .then(function (page) {
                this._storeETag(page);
                return page;
            }.bind(this))
            .then(this._convertODataToReferencePage)
            .catch(this._rejectWithErrorMessage);
    };

    /**
    * Creates a new page
    *
    * @param {object} oPageToCreate The new page
    * @returns {Promise} Resolves when the page has been created successfully
    *
    * @since 1.70.0
    *
    * @protected
    */
    PagePersistence.prototype.createPage = function (oPageToCreate) {
        var pageToCreate = this._convertReferencePageToOData(oPageToCreate);

        return this._createPage(pageToCreate).then(this._storeETag.bind(this));
    };

    /**
    * Updates a page. This method expects to get the complete page. Sections and tiles
    * that are left out will be deleted.
    *
    * @param {object} oUpdatedPage The updated page data
    * @returns {Promise} Resolves when the page has been updated successfully
    *
    * @since 1.70.0
    *
    * @protected
    */
    PagePersistence.prototype.updatePage = function (oUpdatedPage) {
        var oUpdatedODataPage = this._convertReferencePageToOData(oUpdatedPage);

        oUpdatedODataPage.modifiedOn = this._oEtags[oUpdatedPage.content.id].modifiedOn;

        return this._createPage(oUpdatedODataPage).then(this._storeETag.bind(this)).catch(this._rejectWithErrorMessage);
    };

    /**
    * Deletes a  page
    *
    * @param {string} sPageId The ID of the page to be deleted
    * @param {string} sTransportId The transport workbench
    * @returns {Promise} Resolves when the page has been deleted successfully
    *
    * @since 1.70.0
    *
    * @protected
    */
    PagePersistence.prototype.deletePage = function (sPageId, sTransportId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.callFunction("/deletePage", {
                method: "POST",
                urlParameters: {
                    pageId: sPageId,
                    transportId: sTransportId,
                    modifiedOn: this._oEtags[sPageId].modifiedOn
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
    * Reads the headers of the available pages from the server
    *
    * @returns {Promise<object>} Resolves to the page headers in the OData format
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._readPages = function () {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet", {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
    * Reads a page from the server
    *
    * @param {string} sPageId The page ID
    * @returns {Promise<object>} Resolves to a page in the OData format
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._readPage = function (sPageId) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.read("/pageSet('" + encodeURIComponent(sPageId) + "')", {
                urlParameters: {
                    "$expand": "sections/tiles"
                },
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
    * Creates a page on the server
    *
    * @param {object} oNewPage The page data
    * @returns {Promise} Page the OData format
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._createPage = function (oNewPage) {
        return new Promise(function (resolve, reject) {
            this._oODataModel.create("/pageSet", oNewPage, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
    * Converts a list of page headers from the OData format into the FLP internal format
    *
    * @param {object[]} aPages The page headers in the OData format
    * @returns {object[]} The page headers in the FLP-internal format
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._convertODataToPageList = function (aPages) {
        return aPages.results.map(function (oPage) {
            return {
                content: {
                    id: oPage.id,
                    title: oPage.title,
                    description: oPage.description,
                    createdBy: oPage.createdBy,
                    createdOn: oPage.createdOn,
                    modifiedBy: oPage.modifiedBy,
                    modifiedOn: oPage.modifiedOn
                },
                metadata: {
                    devclass: oPage.devclass,
                    transportId: oPage.transportId
                }
            };
        });
    };

    /**
    * Converts a reference page from the OData format to the FLP internal format
    *
    * @param {object} oPage The page in the OData format
    * @returns {object} The page in the FLP format
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._convertODataToReferencePage = function (oPage) {
        return {
            content: {
                id: oPage.id,
                title: oPage.title,
                description: oPage.description,
                createdBy: oPage.createdBy,
                createdOn: oPage.createdOn,
                modifiedBy: oPage.modifiedBy,
                modifiedOn: oPage.modifiedOn,
                sections: oPage.sections.results.map(function (section) {
                    return {
                        id: section.id,
                        title: section.title,
                        visualizations: section.tiles.results.map(function (tile) {
                            return {
                                id: tile.id,
                                vizId: tile.catalogTile,
                                inboundPermanentKey: tile.targetMapping
                            };
                        })
                    };
                })
            },
            metadata: {
                transportId: oPage.transportId,
                devclass: oPage.devclass
            }
        };
    };

    /**
    * Converts the reference page from the FLP internal format to the OData format
    *
    * @param {object} oPage The page in the FLP format
    * @returns {object} The page in the OData format
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._convertReferencePageToOData = function (oPage) {
        var oReferencePage = oPage.content,
            oMetadata = oPage.metadata;

        var oODataPage = {
            id: oReferencePage.id,
            title: oReferencePage.title,
            description: oReferencePage.description,
            devclass: oMetadata.devclass,
            transportId: oMetadata.transportId,
            sections: (oReferencePage.sections || []).map(function (section) {
                return {
                    id: section.id,
                    title: section.title,
                    tiles: (section.visualizations || []).map(function (tile) {
                        return {
                            id: tile.id,
                            catalogTile: tile.vizId,
                            targetMapping: tile.inboundPermanentKey
                        };
                    })
                };
            })
        };

        return oODataPage;
    };

    /**
    * Stores the etag for a newly retrieved
    *
    * @param {object} oPage The newly retrieved
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._storeETag = function (oPage) {
        this._oEtags[oPage.id] = {
            // this is used as an etag for the deep update
            modifiedOn: oPage.modifiedOn,
            // this etag is used for deletion
            etag: oPage.__metadata.etag
        };
    };

    /**
    * Extracts the error message from an error object
    *
    * @param {object} oError The error object
    * @returns {Promise} A rejected promise containing the error message
    *
    * @since 1.70.0
    *
    * @private
    */
    PagePersistence.prototype._rejectWithErrorMessage = function (oError) {
        var sErrorMessage;

        if (oError.statusCode === 412) {
            sErrorMessage = resources.i18n.getText("Message.PageIsOutdated");
        } else {
            try {
                sErrorMessage = JSON.parse(oError.responseText).error.message.value || oError.message;
            } catch (error) {
                sErrorMessage = oError.message;
            }
        }
        return Promise.reject(sErrorMessage);
    };

    return PagePersistence;
}, true /* bExport */);
},
	"sap/ushell/applications/PageComposer/util/Transport.js":function(){// ${copyright}

sap.ui.define([
    "sap/ushell/Config",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/core/Component",
    "sap/ushell/applications/PageComposer/i18n/resources"
], function (Config, ODataModel, Component, resources) {
    "use strict";

    var TransportHelper = function () {};

    /**
     * Creates the oData model
     *
     * @returns {sap.ui.model.odata.v2.ODataModel} The created model
     *
     * @private
     */
    TransportHelper.prototype._getODataModel = function () {
        if (!this._oODataModel) {
            var sTransportServiceUrl = Config.last("/core/pageComposition/transport/serviceUrl");
            this._oODataModel = new ODataModel({
                serviceUrl: sTransportServiceUrl,
                headers: {
                    "sap-language": sap.ushell.Container.getUser().getLanguage()
                },
                defaultCountMode: "None",
                skipMetadataAnnotationParsing: true,
                useBatch: false
            });
        }

        return this._oODataModel;
    };

    /**
     * Returns a promise which resolves to
     * - the transport information if there are results
     * - true if there are no results
     *
     * @param {string} sPageId The pageId to check
     * @returns {Promise<boolean|object>} A promise resolving to the object or true
     *
     * @private
     */
    TransportHelper.prototype._getTransportLockedInformation = function (sPageId) {
        return this._readTransportInformation(sPageId)
            .then(function (oTransport) {
                return oTransport.results.length ? oTransport.results[0] : true;
            });
    };

    /**
     * Reads the transport information for the given pageId
     *
     * @param {string} sPageId The pageId to check
     * @returns {Promise<object>} A promise resolving to a result object
     *
     * @private
     */
    TransportHelper.prototype._readTransportInformation = function (sPageId) {
        var sUrl = "/transportSet";
        var filter = new sap.ui.model.Filter("pageId", sap.ui.model.FilterOperator.EQ, sPageId);
        return new Promise(function (resolve, reject) {
            this._getODataModel().read(sUrl, {
                filters: [filter],
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Checks if a transport is required for the given package name
     *
     * @param {string} sPackageName The package name
     * @returns {Promise<boolean>} A promise resolving to boolean
     *
     * @private
     */
    TransportHelper.prototype._isPackageTransportRequired = function (sPackageName) {
        return this._readPackageInformation(sPackageName)
            .then(function (result) {
                return result.transportRequired;
            });
    };

    /**
     * Reads information for a given package
     *
     * @param {string} sPackageName The package name
     * @returns {Promise<object>} A promise resolving to the result object
     *
     * @private
     */
    TransportHelper.prototype._readPackageInformation = function (sPackageName) {
        var sUrl = "/packageSet('" + encodeURIComponent(sPackageName) + "')";
        return new Promise(function (resolve, reject) {
            this._getODataModel().read(sUrl, {
                success: resolve,
                error: reject
            });
        }.bind(this));
    };

    /**
     * Checks if the transport information should be displayed
     *
     * True if the transportId is NOT set but transport is required for the package
     *
     * @param {object} oPage The page object to delete
     * @returns {Promise<boolean>} A promise resolving to the boolean result
     *
     * @private
     */
    TransportHelper.prototype._showTransport = function (oPage) {
        var sPackageName = oPage.metadata.devclass;

        if (oPage && oPage.metadata && !oPage.metadata.transportId) {
            return this._isPackageTransportRequired(sPackageName);
        }

        return Promise.resolve(false);
    };

    /**
     * Returns a function to call when the transport information is changed
     * The returned function adds the transport validation to the given dialog's model
     *
     * @param {sap.ushell.applications.PageComposer.controller.CreatePageDialog} oDialog The dialog controller
     * @returns {function} The change handler function
     *
     * @private
     */
    TransportHelper.prototype._changeHandler = function (oDialog) {
        return function (value) {
            var oModel = oDialog.getModel();
            var oValidation = jQuery.extend({}, oModel.getProperty("/validation"), {
                transport: value
            });
            oModel.setProperty("/validation", oValidation);
        };
    };

    /**
     * Checks if the config value for transport is set to true
     *
     * @returns {boolean} The result
     *
     * @protected
     */
    TransportHelper.prototype.isTransportSupported = function () {
        return Config.last("/core/pageComposition/transport/support");
    };

    /**
     * Adds the transportComponent to the extension point and adds the relevant handlers.
     *
     * @param {sap.ushell.applications.PageComposer.controller.CreatePageDialog} dialog The dialog controller
     * @param {object} transportComponent The component with the transport fields
     * @param {function} onConfirm The confirm function
     * @returns {sap.ushell.applications.PageComposer.controller.CreatePageDialog} The enhanced dialog
     *
     * @protected
     */
    TransportHelper.prototype.enhanceDialogWithTransport = function (dialog, transportComponent, onConfirm) {
        var fnChangeHandler = this._changeHandler(dialog);
        fnChangeHandler(false);
        var fnConfirmHandler = function (pageInfo) {
            var oPageInfo = transportComponent.decorateResultWithTransportInformation(pageInfo);
            onConfirm(oPageInfo);
        };
        transportComponent.attachChangeEventHandler(fnChangeHandler);
        dialog.attachConfirm(fnConfirmHandler);
        dialog.transportExtensionPoint(transportComponent);

        return dialog;
    };

    /**
     * Checks if the EditPage dialog needs to be shown
     *
     * @param {object} page The page to delete
     * @returns {Promise<boolean>} A promise resolving to the boolean result
     *
     * @protected
     */
    TransportHelper.prototype.checkShowTransport = function (page) {
        if (!this.isTransportSupported()) {
            return Promise.resolve(false);
        }

        return this._showTransport(page).then(function (showTransport) {
            return showTransport;
        });
    };

    /**
     * Checks if the EditPage0 dialog should show a locked message
     *
     * @param {object} page The page to edit
     * @returns {Promise<boolean|object>} A promise with the transport information or false if the page is not locked
     *
     * @protected
     */
    TransportHelper.prototype.checkShowLocked = function (page) {
        if (!this.isTransportSupported()) {
            return Promise.resolve(false);
        }

        return this._getTransportLockedInformation(page.content.id).then(function (transportLockedInformation) {
            if (transportLockedInformation.foreignOwner) {
                return transportLockedInformation;
            }
            return false;
        });
    };

    if (!this.transportHelper) {
        this.transportHelper = new TransportHelper();
    }

    return this.transportHelper;
});
},
	"sap/ushell/applications/PageComposer/view/App.view.xml":'<mvc:View\n        controllerName="sap.ushell.applications.PageComposer.controller.App"\n        xmlns="sap.m"\n        xmlns:mvc="sap.ui.core.mvc"\n        height="100%"\n        class="sapUiGlobalBackgroundColor"\n        displayBlock="true">\n    <NavContainer id="pageComposer" />\n</mvc:View>',
	"sap/ushell/applications/PageComposer/view/CopyDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n        title="{i18n>CopyDialog.Title}"\n        id="copyDialog"\n        afterClose="onAfterClose"\n        type="Message">\n        <content>\n            <VBox>\n                <Text text="{parts: [\'i18n>CopyDialog.Message\', \'/page/content/id\'], formatter: \'.formatMessage\'}" />\n                <Label text="{i18n>Label.PageID}" labelFor="copyId" />\n                <Input value="{parts: [\'i18n>CopyDialog.NewID\', \'/page/content/id\'], formatter: \'.formatMessage\'}"\n                       required="true"\n                       id="copyId"/>\n            </VBox>\n        </content>\n\n        <beginButton>\n            <Button text="{i18n>Button.Copy}" press="onConfirm" type="Emphasized"/>\n        </beginButton>\n\n        <endButton>\n            <Button text="{i18n>Button.Cancel}" press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/CreatePageDialog.fragment.xml":'<Dialog\n    xmlns="sap.m"\n    id="createPageDialog"\n    title="{i18n>CreatePageDialog.Title}"\n    beforeOpen=".onBeforeOpen"\n    afterClose=".destroy"\n    xmlns:f="sap.ui.layout.form"\n    xmlns:core="sap.ui.core">\n    <content>\n        <f:SimpleForm editable="true">\n            <Label text="{i18n>Label.PageID}" />\n            <Input\n                maxLength="35"\n                required="true"\n                id="createPageIdInput"\n                change=".onIdChange"\n                liveChange=".onIdLiveChange"\n                valueLiveUpdate="true"\n                value="{ path: \'/id\', type: \'sap.ui.model.type.String\' }" />\n            <Label text="{i18n>Label.PageTitle}" />\n            <Input\n                maxLength="100"\n                required="true"\n                id="createPageTitleInput"\n                liveChange=".onTitleLiveChange"\n                valueLiveUpdate="true"\n                valueStateText="{i18n>Message.EmptyTitle}"\n                value="{ path: \'/title\', type: \'sap.ui.model.type.String\' }" />\n        </f:SimpleForm>\n\n        <core:ComponentContainer id="transportContainer"/>\n    </content>\n    <beginButton>\n        <Button\n            id="createPageSaveButton"\n            type="Emphasized"\n            text="{i18n>Button.Create}"\n            press=".onConfirm"\n            enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n    </beginButton>\n    <endButton>\n        <Button id="createPageCancelButton" text="{i18n>Button.Cancel}" press=".onCancel" />\n    </endButton>\n</Dialog>\n',
	"sap/ushell/applications/PageComposer/view/DeleteDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n            id="deleteDialog"\n            title="{i18n>DeleteDialog.Title}"\n            type="Message"\n            afterClose=".destroy"\n            state="Warning">\n        <content>\n            <Text text="{/message}" />\n\n            <core:ComponentContainer id="transportContainer"/>\n        </content>\n\n        <beginButton>\n            <Button text="{i18n>DeleteDialog.ConfirmButton}"\n                    press=".onConfirm"\n                    type="Emphasized"\n                    enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n        </beginButton>\n\n        <endButton>\n            <Button text="{i18n>Button.Cancel}" press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/EditDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n            id="editDialog"\n            title="{i18n>EditDialog.Title}"\n            type="Message"\n            afterClose=".destroy"\n            state="Warning">\n        <content>\n            <Text text="{/message}" />\n\n            <core:ComponentContainer id="transportContainer"/>\n        </content>\n\n        <beginButton>\n            <Button text="{i18n>Button.Save}"\n                    press=".onConfirm"\n                    type="Emphasized"\n                    enabled="{ path: \'/validation\', formatter: \'.validate\' }" />\n        </beginButton>\n\n        <endButton>\n            <Button text="{i18n>Button.Cancel}" press="onCancel" />\n        </endButton>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/ErrorDialog.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core" >\n    <Dialog\n        id="sapUshellPagesErrorDialog"\n        title="{i18n>ErrorDialog.Title}"\n        type="Message"\n        afterClose=".onAfterClose"\n        contentWidth="30rem"\n        state="Error">\n        <content>\n            <VBox>\n                <Text\n                    text="{/message}"\n                    class="sapUiSmallMarginBottom" />\n                <Link\n                    text="{i18n>Button.ShowDetails}"\n                    visible="{=!${/showDetails}}"\n                    press=".onShowDetails" />\n            </VBox>\n            <VBox visible="{/showDetails}">\n                <Text text="{i18n>Label.ResponseCode} {/statusCode} - {/statusText}" class="sapUiSmallMarginBottom" />\n                <Text text="{i18n>Label.Details}" />\n                <Text text="{/description}" renderWhitespace="true" />\n            </VBox>\n        </content>\n\n        <buttons>\n            <Button text="{i18n>Button.Ok}" press=".onConfirm" />\n            <Button text="{i18n>Button.Copy}" press=".onCopy" />\n        </buttons>\n    </Dialog>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/Page.fragment.xml":'<core:FragmentDefinition\n    xmlns:core="sap.ui.core"\n    xmlns:dnd="sap.ui.core.dnd"\n    xmlns="sap.ushell.ui.launchpad">\n    <Page\n        id="page"\n        edit="{/edit}"\n        enableGroupReordering="{/edit}"\n        groups="{/page/content/sections}"\n        groupDrop=".Page.moveGroup"\n        addGroupButtonPressed=".Page.addGroup">\n        <groups>\n            <Section\n                editable="{/edit}"\n                enableAddButton="false"\n                enableGridBreakpoints="{= !${/edit}}"\n                enableResetButton="false"\n                enableShowHideButton="false"\n                enableWidgetReordering="{/edit}"\n                title="{title}"\n                showNoWidgetsText="true"\n                sizeBehavior="{viewSettings>/sizeBehavior}"\n                widgets="{\n                    path: \'visualizations\',\n                    factory: \'.Page.itemFactory\',\n                    key: \'vizId\'\n                }"\n                delete=".Page.deleteGroup"\n                titleChange="._pageUpdated"\n                widgetDrop=".Page.moveContent" />\n        </groups>\n        <dragDropConfig>\n            <dnd:DropInfo\n                groupName="Section"\n                targetAggregation="groups"\n                drop=".Page.addContent" />\n        </dragDropConfig>\n    </Page>\n</core:FragmentDefinition>\n',
	"sap/ushell/applications/PageComposer/view/PageDetail.view.xml":'<mvc:View\n        controllerName="sap.ushell.applications.PageComposer.controller.PageDetail"\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        xmlns:f="sap.f"\n        xmlns:mvc="sap.ui.core.mvc">\n    <f:DynamicPage id="pageDetail" fitContent="true" class="sapUshellPageLayout" backgroundDesign="Transparent">\n        <f:title>\n            <f:DynamicPageTitle>\n                <f:heading>\n                    <Title text="{/page/content/title}"/>\n                </f:heading>\n                <f:expandedContent>\n                    <HBox displayInline="true">\n                        <ObjectAttribute title="{i18n>Label.PageID}" text="{/page/content/id}"/>\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text=""\n                            class="sapUiLargeMarginBegin"/>\n                    </HBox>\n                </f:expandedContent>\n                <f:snappedContent>\n                    <HBox displayInline="true">\n                        <ObjectAttribute title="{i18n>Label.PageID}" text="{/page/content/id}"/>\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text="assigned role"\n                            class="sapUiLargeMarginBegin"/>\n                    </HBox>\n                </f:snappedContent>\n                <f:actions>\n                    <Button\n                            text="{i18n>Button.Edit}"\n                            type="Emphasized"\n                            press="onEdit"/>\n                    <!-- Do not show the Copy button until the functionality is implemented -->\n                    <Button\n                            visible="false"\n                            text="{i18n>Button.Copy}"\n                            type="Transparent"\n                            press="onCopy"/>\n                    <Button\n                            text="{i18n>Button.Delete}"\n                            type="Transparent"\n                            press="onDelete"/>\n                    <Button\n                            text="{i18n>Button.PagePreview}"\n                            type="Transparent"\n                            press="preview(${/page/content/id})"/>\n                </f:actions>\n            </f:DynamicPageTitle>\n        </f:title>\n        <f:header>\n            <f:DynamicPageHeader pinnable="false">\n                <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.PageInfo" type="XML"/>\n            </f:DynamicPageHeader>\n        </f:header>\n        <f:content>\n            <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.Page" type="XML" />\n        </f:content>\n    </f:DynamicPage>\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/PageDetailEdit.view.xml":'<mvc:View\n    controllerName="sap.ushell.applications.PageComposer.controller.PageDetailEdit"\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:l="sap.ui.layout"\n    xmlns:f="sap.f"\n    xmlns:mvc="sap.ui.core.mvc">\n    <f:DynamicPage\n        id="pageDetailEdit"\n        fitContent="true"\n        headerExpanded="{/headerExpanded}"\n        backgroundDesign="Transparent"\n        class="sapUiNoContentPadding">\n        <f:title>\n            <f:DynamicPageTitle>\n                <f:heading>\n                    <Title text="{/page/content/title}" wrapping="true" />\n                </f:heading>\n                <f:expandedContent>\n                    <HBox displayInline="true">\n                        <ObjectAttribute title="{i18n>Label.PageID}" text="{/page/content/id}" />\n                        <!-- TBD: make visible when the role ID is available -->\n                        <ObjectAttribute\n                            visible="false"\n                            title="{i18n>Label.AssignedRole}"\n                            text=""\n                            class="sapUiLargeMarginBegin" />\n                    </HBox>\n                </f:expandedContent>\n                <f:snappedContent>\n                    <!-- Maximize working area when the header is snapped -->\n                </f:snappedContent>\n                <f:actions>\n                    <Button text="{i18n>Button.ShowCatalogs}" type="Transparent" press=".onUpdateSideContentVisibility" />\n                    <Button text="{i18n>Button.PagePreview}" type="Transparent" press=".preview(${/page/content/id})" />\n                </f:actions>\n            </f:DynamicPageTitle>\n        </f:title>\n        <f:header>\n            <f:DynamicPageHeader pinnable="false">\n                <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.PageInfoEdit" type="XML" />\n            </f:DynamicPageHeader>\n        </f:header>\n        <f:content>\n            <Page showHeader="false">\n                <content>\n                    <l:DynamicSideContent\n                        id="layoutContent"\n                        sideContentFallDown="BelowM"\n                        sideContentPosition="End"\n                        containerQuery="true">\n                        <l:mainContent>\n                            <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.Page" type="XML" />\n                        </l:mainContent>\n                        <l:sideContent>\n                            <core:Fragment fragmentName="sap.ushell.applications.PageComposer.view.TileSelector" type="XML" />\n                        </l:sideContent>\n                    </l:DynamicSideContent>\n                </content>\n                <footer>\n                    <OverflowToolbar id="footer">\n                        <Button icon="sap-icon://message-popup" text="{/errorslength}" type="Emphasized" press=".handleMessagePopoverPress" visible="{= !!${/errorslength} }"/>\n                        <ToolbarSpacer />\n                        <Button text="{i18n>Button.Save}" type="Emphasized" press=".onSave" />\n                        <Button text="{i18n>Button.Cancel}" type="Transparent" press=".onCancel" />\n                    </OverflowToolbar>\n                </footer>\n            </Page>\n        </f:content>\n    </f:DynamicPage>\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/PageInfo.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        xmlns:form="sap.ui.layout.form" >\n    <form:Form id="pageInfoForm" editable="false">\n        <form:layout>\n            <form:ResponsiveGridLayout\n                labelSpanXL="4"\n                labelSpanL= "4"\n                labelSpanM="4"\n                labelSpanS="12"\n                adjusLabelSpan="true"\n                emptySpanXL="0"\n                emptySpanL="0"\n                emptySpanM="0"\n                emptySpanS="0"\n                columnsXL="3"\n                columnsL="3"\n                columnsM="1"/>\n        </form:layout>\n        <form:formContainers>\n            <form:FormContainer class="sapUiNoContentPadding">\n                <form:formElements>\n                    <form:FormElement label="{i18n>Label.Description}">\n                        <Text text="{/page/content/description}" maxLines="2" id="pageInfoDescription"/>\n                    </form:FormElement>\n                </form:formElements>\n            </form:FormContainer>\n\n            <form:FormContainer>\n                <form:formElements>\n                    <form:FormElement label="{i18n>Label.CreatedBy}" >\n                        <Text text="{/page/content/createdBy}" id="pageInfoCreatedBy"/>\n                    </form:FormElement>\n                    <form:FormElement label="{i18n>Label.CreatedOn}" >\n                        <Text\n                            text="{\n                                path: \'/page/content/createdOn\',\n                                type: \'sap.ui.model.type.Date\',\n                                formatOptions: {style: \'medium\'}\n                            }"\n                            id="pageDetailCreatedOn"/>\n                    </form:FormElement>\n                </form:formElements>\n            </form:FormContainer>\n\n            <form:FormContainer>\n                <form:formElements>\n                    <form:FormElement label="{i18n>Label.ChangedBy}">\n                        <Text text="{/page/content/modifiedBy}" id="pageInfoModifiedBy"/>\n                    </form:FormElement>\n                    <form:FormElement label="{i18n>Label.ChangedOn}">\n                        <Text\n                            text="{\n                                path: \'/page/content/modifiedOn\',\n                                type: \'sap.ui.model.type.Date\',\n                                formatOptions: {style: \'medium\'}\n                            }"\n                            id="pageDetailModifiedOn"/>\n                    </form:FormElement>\n                </form:formElements>\n            </form:FormContainer>\n        </form:formContainers>\n    </form:Form>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/PageInfoEdit.fragment.xml":'<core:FragmentDefinition\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        xmlns:form="sap.ui.layout.form" >\n    <form:Form id="pageInfoEditForm" editable="true">\n        <form:layout>\n            <form:ResponsiveGridLayout\n                labelSpanXL="3"\n                labelSpanL="3"\n                labelSpanM="3"\n                labelSpanS="12"\n                emptySpanXL="0"\n                emptySpanL="0"\n                emptySpanM="0"\n                emptySpanS="0"\n                columnsXL="3"\n                columnsL="3"\n                columnsM="1"/>\n        </form:layout>\n        <form:formContainers>\n            <form:FormContainer class="sapUiNoContentPadding">\n                <form:formElements>\n\n                    <form:FormElement label="{i18n>Label.PageTitle}">\n                        <Input\n                            value="{/page/content/title}"\n                            required="true"\n                            id="pageInfoEditTitle"\n                            valueStateText="{i18n>Message.EmptyTitle}"\n                            liveChange="onTitleChange"\n                            valueLiveUpdate="true"/>\n                    </form:FormElement>\n\n                    <form:FormElement label="{i18n>Label.Description}">\n                        <TextArea\n                            value="{/page/content/description}"\n                            rows="2"\n                            maxLength="100"\n                            id="pageInfoEditDescription"\n                            valueLiveUpdate="true"/>\n                    </form:FormElement>\n                </form:formElements>\n            </form:FormContainer>\n\n            <form:FormContainer>\n                <form:formElements>\n                    <form:FormElement label="{i18n>Label.CreatedBy}" >\n                        <Text text="{/page/content/createdBy}" id="pageInfoEditCreatedBy"/>\n                    </form:FormElement>\n                    <form:FormElement label="{i18n>Label.CreatedOn}" >\n                        <Text\n                            text="{\n                                path: \'/page/content/createdOn\',\n                                type: \'sap.ui.model.type.Date\',\n                                formatOptions: {style: \'medium\'}\n                            }"\n                            id="pageDetailEditCreatedOn"/>\n                    </form:FormElement>\n                </form:formElements>\n            </form:FormContainer>\n\n            <form:FormContainer>\n                <form:formElements>\n                    <form:FormElement label="{i18n>Label.ChangedBy}">\n                        <Text text="{/page/content/modifiedBy}" id="pageInfoEditModifiedBy"/>\n                    </form:FormElement>\n                    <form:FormElement label="{i18n>Label.ChangedOn}">\n                        <Text\n                            text="{\n                                path: \'/page/content/modifiedOn\',\n                                type: \'sap.ui.model.type.Date\',\n                                formatOptions: {style: \'medium\'}\n                            }"\n                            id="pageDetailCreatedOn"/>\n                    </form:FormElement>\n                </form:formElements>\n            </form:FormContainer>\n        </form:formContainers>\n    </form:Form>\n</core:FragmentDefinition>',
	"sap/ushell/applications/PageComposer/view/PageOverview.view.xml":'<mvc:View xmlns:mvc="sap.ui.core.mvc"\n          xmlns="sap.m"\n          height="100%"\n          controllerName="sap.ushell.applications.PageComposer.controller.PageOverview">\n\n    <Page id="pageOverview">\n        <customHeader>\n            <Bar>\n                <contentLeft>\n                    <Title text="{i18n>PageOverview.Title}" class="sapUiMediumMarginBegin" />\n                </contentLeft>\n            </Bar>\n        </customHeader>\n        <content>\n            <Table\n                class="sapUiMediumMarginBeginEnd sapUiTinyMarginTopBottom sapUiForceWidthAuto"\n                id="table"\n                busy="{/busy}"\n                items="{\n                    path: \'/pages\',\n                    key: \'id\',\n                    sorter : {\n                        path : \'content/modifiedOn\',\n                        descending: \'true\'\n                    }\n                }"\n                itemPress=".onItemPress"\n                selectionChange=".onSelectionChange"\n                updateFinished=".onTableUpdate"\n                mode="SingleSelectLeft"\n                sticky="ColumnHeaders">\n                <headerToolbar>\n                    <OverflowToolbar design="Solid">\n                        <ToolbarSpacer/>\n                        <SearchField\n                            showRefreshButton="false"\n                            tooltip="{i18n>Tooltip.Search}"\n                            search=".onSearch"\n                            width="auto">\n                        </SearchField>\n                        <Button\n                            id="addButton"\n                            text="{i18n>Button.Create}"\n                            type="Transparent"\n                            press=".onAdd"/>\n                        <Button\n                            id="deleteButton"\n                            text="{i18n>Button.Delete}"\n                            type="Transparent"\n                            enabled="{buttonStates>/isDeleteEnabled}"\n                            press=".onDelete"/>\n                    </OverflowToolbar>\n                </headerToolbar>\n                <columns>\n                    <Column>\n                        <Text text="{i18n>Column.PageID} / {i18n>Column.PageTitle}"/>\n                    </Column>\n                    <Column>\n                        <Text text="{i18n>Column.PageDescription}"/>\n                    </Column>\n                    <Column width="10%">\n                        <Text text="{i18n>Column.PageCreatedBy}" class="sapUiSmallMarginBegin"/>\n                    </Column>\n                    <Column hAlign="End" width="10%">\n                        <Text text="{i18n>Column.PageCreatedOn}" class="sapUiSmallMarginEnd"/>\n                    </Column>\n                    <Column width="10%">\n                        <Text text="{i18n>Column.PageChangedBy}" class="sapUiSmallMarginBegin"/>\n                    </Column>\n                    <Column hAlign="End" width="10%">\n                        <Text text="{i18n>Column.PageChangedOn}" class="sapUiSmallMarginEnd"/>\n                    </Column>\n                    <Column hAlign="End" width="5%">\n                    </Column>\n                </columns>\n                <items>\n                    <ColumnListItem  type="Navigation">\n                        <cells>\n                            <ObjectIdentifier title="{content/id}" text="{content/title}"/>\n                        </cells>\n                        <cells>\n                            <Text text="{content/description}"/>\n                        </cells>\n                        <cells>\n                            <Text text="{content/createdBy}" class="sapUiSmallMarginBegin"/>\n                        </cells>\n                        <cells>\n                            <Text\n                                text="{\n                                    path: \'content/createdOn\',\n                                    type: \'sap.ui.model.type.Date\',\n                                    formatOptions: {style: \'medium\'}\n                                }"\n                                class="sapUiSmallMarginEnd"/>\n                        </cells>\n                        <cells>\n                            <Text text="{content/modifiedBy}" class="sapUiSmallMarginBegin"/>\n                        </cells>\n                        <cells>\n                            <Text\n                                text="{\n                                    path: \'content/modifiedOn\',\n                                    type: \'sap.ui.model.type.Date\',\n                                    formatOptions: {style: \'medium\'}\n                                }"\n                                class="sapUiSmallMarginEnd"/>\n                        </cells>\n                        <cells>\n                            <Button press=".onEdit" icon="sap-icon://edit" type="Transparent"/>\n                        </cells>\n                    </ColumnListItem>\n                </items>\n            </Table>\n        </content>\n\n    </Page>\n\n</mvc:View>\n',
	"sap/ushell/applications/PageComposer/view/TileSelector.fragment.xml":'<Page\n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:dnd="sap.ui.core.dnd"\n    id="tileSelector">\n    <layoutData><FlexItemData growFactor="1" /></layoutData> <!-- workaround for fragment used inside of a flex container -->\n    <customHeader>\n        <OverflowToolbar id="tileSelectorToolbar">\n            <SearchField\n                showRefreshButton="false"\n                width="auto"\n                liveChange=".TileSelector.onSearchTiles"\n                search=".TileSelector.onSearchTiles"\n                value="{/searchText}"\n                tooltip="{i18n>Tooltip.SearchForTiles}"\n                placeholder="{i18n>Placeholder.SearchForTiles}" />\n            <ToolbarSpacer />\n            <Button\n                id="tileSelectorAddButton"\n                type="Transparent"\n                press=".TileSelector.onAddTiles"\n                text="{i18n>Button.Add}" />\n            <OverflowToolbarButton\n                icon="sap-icon://sort"\n                press=".TileSelector.onSortCatalogsToggle"\n                text="{i18n>Button.SortCatalogs}"\n                tooltip="{i18n>Button.SortCatalogs}" />\n            <OverflowToolbarButton\n                icon="sap-icon://collapse-all"\n                press=".TileSelector.onCollapseAllCatalogs"\n                text="{i18n>Button.CollapseCatalogs}"\n                tooltip="{i18n>Button.CollapseCatalogs}" />\n            <OverflowToolbarButton\n                icon="sap-icon://expand-all"\n                press=".TileSelector.onExpandAllCatalogs"\n                text="{i18n>Button.ExpandCatalogs}"\n                tooltip="{i18n>Button.ExpandCatalogs}" />\n        </OverflowToolbar>\n    </customHeader>\n    <content>\n        <Tree\n            id="tileSelectorList"\n            mode="MultiSelect"\n            modeAnimationOn="false"\n            itemPress=".TileSelector.onCatalogItemPress"\n            items="{ path: \'catalogs>/catalogs\', key: \'vizId\' }"\n            noDataText="{i18n>Message.NoTiles}">\n            <items>\n                <CustomTreeItem\n                    class="sapUshellTileSelectorListItem"\n                    type="{=!!${catalogs>catalogTitle} ? \'Active\' : \'Inactive\'}"> <!-- only catalogs should fire "onCatalogItemPress" -->\n                    <FlexBox class="sapUiTinyMargin" width="100%">\n                        <items>\n                            <HBox justifyContent="SpaceBetween" alignItems="Center" width="100%">\n                                <!-- TODO: do not display tile icon until specification is ready -->\n                                <!-- <core:Icon visible="{=!${catalogs>catalogTitle}}" src="{catalogs>icon}" size="1.5rem" width="1.5rem" class="sapUiSmallMarginEnd" /> -->\n                                <VBox width="0">\n                                    <layoutData><FlexItemData growFactor="1" /></layoutData>\n                                    <Title visible="{=!!${catalogs>catalogTitle}}" text="{catalogs>catalogTitle}" />\n                                    <Title visible="{=!!${catalogs>title}}" text="{catalogs>title}" />\n                                    <Text visible="{=!!${catalogs>subtitle}}" text="{catalogs>subtitle}" />\n                                </VBox>\n                                <Button\n                                    visible="{=!${catalogs>catalogTitle}}"\n                                    type="Transparent"\n                                    press=".TileSelector.onAddTiles"\n                                    text="{i18n>Button.Add}">\n                                </Button>\n                            </HBox>\n                        </items>\n                    </FlexBox>\n                </CustomTreeItem>\n            </items>\n            <dragDropConfig>\n                <dnd:DragInfo\n                    groupName="Section"\n                    sourceAggregation="items"\n                    dragStart=".TileSelector.onDragStart" />\n            </dragDropConfig>\n        </Tree>\n    </content>\n</Page>\n'
},"Component-preload"
);
