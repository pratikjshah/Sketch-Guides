// Needed globally
var doc;
var page;
var artboard;
var plugin;
var selection;
var updateTime;
var localDataPath;

// Initialise
function initPlugin(context) {
  doc = context.document;
  page = doc.currentPage();
  artboard = page.currentArtboard();
  plugin = context.plugin;
  selection = context.selection;
  pluginRoot = context.scriptPath.stringByDeletingLastPathComponent().stringByDeletingLastPathComponent().stringByDeletingLastPathComponent();
  localDataPath = pluginRoot + "/Contents/Resources/user.config";
  //checkUpdate(context);
  //context.document.showMessage("localDataPath: " + localDataPath);
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
  alert.setMessageText("New version of PS: Guides is available!")
  alert.addButtonWithTitle("Download");
  alert.addButtonWithTitle("Remind me tomorrow");
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

function saveData(data) {
	    var string = [NSString stringWithFormat: "%@", data];
			[string writeToFile: localDataPath atomically: true encoding: NSUTF8StringEncoding error: nil];
}

function readData() {
  if(NSFileManager.defaultManager().fileExistsAtPath(localDataPath)){
    data = NSString.stringWithContentsOfFile_encoding_error(localDataPath,4, nil);
    return data;
  }
}
