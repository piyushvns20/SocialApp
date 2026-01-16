sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/Fragment",
  "sap/m/MessageToast"
], function (Controller, Fragment, MessageToast) {
  "use strict";

  return Controller.extend("socialui.controller.Feed", {

    onCreatePost: function () {
      var oView = this.getView();  // give cuurent xml instance (xmlview0)

      if (!this._oCreateDialog) {
        Fragment.load({
          id: oView.getId(),          // fragment ke saare controls ko view-prefix de deta hai.
          name: "socialui.fragment.CreatePost",
          controller: this            // Fragment ke button clicks:
        }).then(function (oDialog) {    // oDialog = actual Dialog control
          this._oCreateDialog = oDialog; // Dialog ko memory mein store kar rahe ho
          oView.addDependent(oDialog);
          oDialog.open();
        }.bind(this));
      } else {
        this._oCreateDialog.open();
      }
    },

    onSavePost: function () {
      var oView = this.getView(); //Current Feed.view.xml ka instance , Fragment controls resolve karne ke liye
      var oModel = oView.getModel();
      var sContent = this.byId("postContent").getValue();// why byId? -> Fragment view ka dependent hai
      //UI5 ID auto-prefix karta hai
      // oList.setBusy(true);

      // ✏️ EDIT MODE
      if (this._editContext) {

        // PATCH triggered here
        this._editContext.setProperty("content", sContent);

        // Since PATCH is async & optimistic
        // we directly refresh after short cycle
        setTimeout(function () {
          // oListBinding.refresh();
          // oList.setBusy(false);
          this._editContext = null;
          this._oCreateDialog.close();
          this.byId("postContent").setValue("");

          sap.m.MessageToast.show("Post updated ✏️");
        }.bind(this), 0);

        return;
      }

      if (!sContent) {
        sap.m.MessageToast.show("Post cannot be empty");
        return;
      }
      var oList = this.byId("postList")
      var oListBinding = oList.getBinding("items");
      // var oListBinding = oModel.bindList("/Posts"); // bindList = UI5 ka V4-specific API

      oListBinding.create({
        content: sContent,
        createdAt: new Date().toISOString()
      });

      this._oCreateDialog.close();
      this.byId("postContent").setValue("");
      sap.m.MessageToast.show("Post created 🚀");
    },

    onEditPost: function (oEvent) {
      // 1. Pressed button
      var oButton = oEvent.getSource();

      // 2. List item (CustomListItem)
      var oItem = oButton.getParent().getParent();

      // 3. Binding context (VERY IMPORTANT)
      var oContext = oItem.getBindingContext();

      // 4. Save context for later use
      this._editContext = oContext;

      // 5. Open dialog (reuse create dialog)
      this.onCreatePost();

      // 6. Prefill existing content
      this.byId("postContent").setValue(
        oContext.getProperty("content")
      );
    },

    onDeletePost: function (oEvent) {
      var oList = this.byId("postList");

      // 1. Button → List Item
      var oButton = oEvent.getSource();
      var oItem = oButton.getParent().getParent();

      // 2. Binding Context (MOST IMPORTANT)
      var oContext = oItem.getBindingContext();

      if (!oContext) {
        sap.m.MessageToast.show("No context found");
        return;
      }

      // 3. Busy ON
      oList.setBusy(true);

      // 4. DELETE call
      oContext.delete()
        .then(function () {
          // 5. Refresh list (sorter present)
          oList.getBinding("items").refresh();

          oList.setBusy(false);
          sap.m.MessageToast.show("Post deleted 🗑️");
        })
        .catch(function () {
          oList.setBusy(false);
          sap.m.MessageToast.show("Error deleting post");
        });
    }
    ,

    onCancelPost: function () {
      this._oCreateDialog.close();
      this.byId("postContent").setValue("");
      this._editContext = null;
    },
    onDialogAfterOpen: function () {
      if (this._editContext) {
        this.byId("postContent").setValue(
          this._editContext.getProperty("content")

        );
      }
    }


  });
});
