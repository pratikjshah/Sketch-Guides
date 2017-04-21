/*----------------------------------------------------------

author: Pratik Shah
Homepage: https://github.com/pratikjshah/PS-Guides
license: MIT

----------------------------------------------------------*/

// Needed globally
var globalContext;
var doc;
var page;
var artboard;
var plugin;
var selection;
var updateTime;
var localDataPath;
var configData;
var remoteManifestUrl;

// Initialise
function initPlugin(context) {
  globalContext = context;
  doc = globalContext.document;
  page = doc.currentPage();
  artboard = page.currentArtboard();
  plugin = globalContext.plugin;
  selection = globalContext.selection;
  pluginRoot = globalContext.scriptPath.stringByDeletingLastPathComponent().stringByDeletingLastPathComponent().stringByDeletingLastPathComponent();
  localDataPath = pluginRoot + "/Contents/Resources/user.config";
  var currentVersion = globalContext.plugin.version() + "";
  remoteManifestUrl = "https://raw.githubusercontent.com/pratikjshah/PS-Guides/master/PS%20Guides.sketchplugin/Contents/Sketch/manifest.json";
  configData = readData();
  //globalContext.document.showMessage(JSON.stringify(configData) + " | typeof: " + typeof(configData));

  var newTime = new Date();
  if (configData.localUpdateTime < newTime.getTime()) {
    //globalContext.document.showMessage("check for update:");
    trackEvent("checkForUpdate", "dailyCheckForUpdate", 1);
    var remoteManifest = getRemoteJson(remoteManifestUrl);
    //globalContext.document.showMessage("remoteManifest: " + remoteManifest.version + " configData.localVersion: " + configData.localVersion);
    if (configData.localVersion != remoteManifest.version) {
          globalContext.document.showMessage("📐 Guides:"+ configData.localVersion + " is out of date! Please check for updates.");
          //showAvailableUpdateDialog(context);
    }
    setUpdateCheckDayOnTomorrow();
  }
}

// Utilities
var utils = {
  "createLabel": function(frame, text) {
    var label = NSTextField.alloc().initWithFrame(frame);
    label.setStringValue(text);
    label.setSelectable(false);
    label.setEditable(false);
    label.setBezeled(false);
    label.setDrawsBackground(false);
    return label
  },
  "getLayerProps": function() {
    var layer = selection.firstObject();

    if (layer) {
      var x = layer.frame().x();
      var y = layer.frame().y();
      return [x, y];
    } else {
      return [0, 0];
    }
  }
};

function createDownloadWindow() {
  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("PS-Guides.png").path()));
  alert.setMessageText("New version available");
  alert.setInformativeText("Your current PS: Guides "+ configData.localVersion + " is out of date!");
  alert.addButtonWithTitle("Download");
  alert.addButtonWithTitle("Remind me tomorrow");
  return [alert];
}

function notAbletoCheckUpdateWindow() {
  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("PS-Guides.png").path()));
  alert.setMessageText("🙀Can not check for updates.🙀 Please visit the web site and download newest version.\n" + context.plugin.homepageURL());
  alert.addButtonWithTitle("Download");
  return [alert];
}

function createErrorWindow(message,confirmButtonText,cancelButtonText) {
  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("PS-Guides.png").path()));
  alert.setMessageText(message)
  alert.addButtonWithTitle(confirmButtonText);
  alert.addButtonWithTitle(cancelButtonText);
  return [alert];
}

function createGuidesWindow(column, gutter, lOffset, rOffset) {
  // Setup the window
  var alert = COSAlertWindow.new();
  alert.setIcon(NSImage.alloc().initByReferencingFile(plugin.urlForResourceNamed("PS-Guides.png").path()));
  alert.setMessageText("Setup Guides")
  alert.addButtonWithTitle("Ok");
  alert.addButtonWithTitle("Cancel");

  // Create the main view
  var viewWidth = 300;
  var viewHeight = 100;
  var viewSpacer = 10;
  var view = NSView.alloc().initWithFrame(NSMakeRect(0, 0, viewWidth, viewHeight));
  alert.addAccessoryView(view);

  // Create labels
  var columnLabel = utils.createLabel(NSMakeRect(0, viewHeight - 20, (viewWidth / 2) - viewSpacer, 20), "No. of Columns:");
  var gutterLabel = utils.createLabel(NSMakeRect((viewWidth / 2) + viewSpacer, viewHeight - 20, (viewWidth / 2) - viewSpacer, 20), "Gutter space:");
  var lOffsetLabel = utils.createLabel(NSMakeRect(0, viewHeight - 70, (viewWidth / 2) - viewSpacer, 20), "Left offset:");
  var rOffsetLabel = utils.createLabel(NSMakeRect((viewWidth / 2) + viewSpacer, viewHeight - 70, (viewWidth / 2) - viewSpacer, 20), "Right offset:");
  view.addSubview(columnLabel);
  view.addSubview(gutterLabel);
  view.addSubview(lOffsetLabel);
  view.addSubview(rOffsetLabel);

  // Create inputs
  columnTextfield = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 40, (viewWidth / 2) - viewSpacer, 20));
  gutterTextfield = NSTextField.alloc().initWithFrame(NSMakeRect((viewWidth / 2) + viewSpacer, viewHeight - 40, (viewWidth / 2) - viewSpacer, 20));
  lOffsetTextfield = NSTextField.alloc().initWithFrame(NSMakeRect(0, viewHeight - 90, (viewWidth / 2) - viewSpacer, 20));
  rOffsetTextfield = NSTextField.alloc().initWithFrame(NSMakeRect((viewWidth / 2) + viewSpacer, viewHeight - 90, (viewWidth / 2) - viewSpacer, 20));

  view.addSubview(columnTextfield);
  view.addSubview(gutterTextfield);
  view.addSubview(lOffsetTextfield);
  view.addSubview(rOffsetTextfield);

  // Fill inputs
  var props = utils.getLayerProps();
  columnTextfield.setStringValue(''+column);
  gutterTextfield.setStringValue(''+gutter);
  lOffsetTextfield.setStringValue(''+lOffset);
  rOffsetTextfield.setStringValue(''+rOffset);

  return [alert];
}

function showAvailableUpdateDialog() {
  var window = createDownloadWindow();
  var alert = window[0];
  // When “Ok” is clicked
  var response = alert.runModal();
  if (response == "1000") {
    //globalContext.document.showMessage("Go to download");
    openUrlInBrowser("http://guides.pratikshah.website/download.php");
  } else {
    //globalContext.document.showMessage("Check later");
    setUpdateCheckDayOnTomorrow();
  }
}

function setUpdateCheckDayOnTomorrow() {
  var newTime = new Date();
  newTime.setDate(newTime.getDate() + 1);
  configData.localUpdateTime = newTime.getTime();
  saveData(configData);
}

function openUrlInBrowser(url) {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url));
    trackEvent("openUrlInBrowser", url, 1);
}

function getRemoteJson(url) {
    var request = NSURLRequest.requestWithURL(NSURL.URLWithString(url));
    var response = NSURLConnection.sendSynchronousRequest_returningResponse_error(request, null, null);
    var content = NSString.alloc().initWithData_encoding(response, NSUTF8StringEncoding);
    var result = null;
    if(content) {
      result = JSON.parse(content);
    }
    //log("content:" + content + " |");
    return result;
}

function trackEvent(action, label, value) {
    var baseURL = "http://guides.pratikshah.website/trackEvents.php";
    baseURL = "https://www.google-analytics.com/collect?v=1&t=event&tid=UA-64818389-6&cid=e4567790-98b3-4f6d-85b3-6c5345d9ad00";
    var version = configData.localVersion;

    var trackingURL = baseURL + "&ec=PSGuides-" + version + "&ea=" + action + "&el=" + label + "&ev=" + value;
    //globalContext.document.showMessage("URL: " + trackingURL);
    getRemoteJson(trackingURL);
    //globalContext.document.showMessage("URL: " + trackingURL);

}

function saveData(data) {
	var string = [NSString stringWithFormat: "%@", JSON.stringify(data)];
	[string writeToFile: localDataPath atomically: true encoding: NSUTF8StringEncoding error: nil];
}

function readData() {
  if(NSFileManager.defaultManager().fileExistsAtPath(localDataPath)){
    var string = NSString.stringWithContentsOfFile_encoding_error(localDataPath,4, nil);
    string = string.replace(/(\r\n|\n|\r)/gm,"");
    var data = JSON.parse(string);
    return data;
  }
}
