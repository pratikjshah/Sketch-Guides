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
    if (remoteManifest.version) {
        if (configData.localVersion == remoteManifest.version) {
          context.document.showMessage("🤘Yo🤘! PS: Guides " + configData.localVersion + " is currently the newest version available.");
        } else {
          //context.document.showMessage("need update:");
          showAvailableUpdateDialog(context);
        }
    } else {
      //context.document.showMessage("can not check:");
      showAvailableUpdateDialog(context);
    }
}

function getRemoteJson(url) {
    var request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));
    var response = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);
    var content = NSString.alloc().initWithData_encoding(response, NSUTF8StringEncoding);
    return JSON.parse(content);
}
