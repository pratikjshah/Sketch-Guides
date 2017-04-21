/*----------------------------------------------------------

author: Pratik Shah
Homepage: https://github.com/pratikjshah/PS-Guides
license: MIT

----------------------------------------------------------*/

@import 'main.js'

var reportIssue = function(context) {
    openUrlInBrowser("https://github.com/pratikjshah/PS-Guides/issues/");
}

var aboutPratikShah = function(context) {
  openUrlInBrowser("http://pratikshah.website");
}


function checkForUpdate(context) {
  initPlugin(context);

    var remoteManifest = getRemoteJson(remoteManifestUrl);
    //context.document.showMessage("remoteManifest: " + remoteManifest.version);
    trackEvent("checkForUpdate", "manualCheckForUpdate", 1);
    if (remoteManifest.version) {
        if (configData.localVersion == remoteManifest.version) {
          globalContext.document.showMessage("🤘Yo🤘! PS: Guides " + configData.localVersion + " is currently the newest version available.");
        } else {
          //globalContext.document.showMessage("need update:");
          showAvailableUpdateDialog();
        }
    } else {
      //globalContext.document.showMessage("can not check:");
      showAvailableUpdateDialog();
    }
}


var collapseGroupsNArtboard = function (context) {
  initPlugin(context);
  var msg = "Failed to Collapse Groups & Artboards!";

  //var doc = context.document;
  var currentArtboard = doc.findCurrentArtboardGroup();
  doc.currentPage().deselectAllLayers();

  var action = doc.actionsController().actionForID("MSCollapseAllGroupsAction").collapseAllGroups(nil);
  trackEvent("TopUpEvents", "collapseGroupsNArtboard", 1);

  if(action.validate()) {
    action.doPerformAction(nil);
    currentArtboard.select_byExpandingSelection(true, false);
  } else {
    showErrorAlertWithSound(msg);
  }
}
