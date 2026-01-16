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

      if (!sContent) {
        sap.m.MessageToast.show("Post cannot be empty");
        return;
      }
      var oList = this.byId("postList")
      
      var oListBinding = oModel.bindList("/Posts"); // bindList = UI5 ka V4-specific API

      oListBinding.create({
        content: sContent,
        createdAt: new Date().toISOString()
      });

      this._oCreateDialog.close();
      this.byId("postContent").setValue("");
      sap.m.MessageToast.show("Post created 🚀");
    },

    onDeletePost: function(oEvent){
      let oList = this.byId("postList");
      let oItem = oEvent.getSource().getParent()
      let oContext = oItem.getBindingContext()

      console.log("-------")
    },

    onCancelPost: function () {
      this._oCreateDialog.close();
    }

  });
});
