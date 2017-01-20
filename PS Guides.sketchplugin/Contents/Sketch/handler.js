@import 'main.js'
@import 'functions.js'

var commandInit = function(context) {
  context.document.showMessage("Check updates");
  //checkUpdate(context);
}

var checkForUpdate = function(context) {
  doUpdate(context);
}

var checkUpdate = function(context) {
  var now = new Date();
  var lastTime = readData();
  now = now.getTime();
  var str = " now: "+ now + " lastTime: " + lastTime;
  //context.document.showMessage(str);

  if (lastTime >= now) {
    //context.document.showMessage("Plug-in is upto date!");
  } else {
    //context.document.showMessage("update needed");
    doUpdate(context);
  }

}

function doUpdate(context) {
  //context.document.showMessage("inside doUpdate");
  var currentVersion = context.plugin.version() + "";
  var request = [[NSMutableURLRequest alloc] init];
   [request setHTTPMethod:@"GET"];
   var queryString = "http://guides.pratikshah.website/check-update.php";
   [request setURL:[NSURL URLWithString:queryString]];

   var error = [[NSError alloc] init];
   var responseCode = null;

   var oResponseData = [NSURLConnection sendSynchronousRequest:request returningResponse:responseCode error:error];

   var dataString = [[NSString alloc] initWithData:oResponseData
   encoding:NSUTF8StringEncoding];

   var pattern = new RegExp("\\\\'", "g");
   var validJSONString = dataString.replace(pattern, "'");

   var data = JSON.parse(validJSONString);
   var serverVersion = data.version;
   var updatedOn = data.updated_on;
   var now = new Date();
   //context.document.showMessage("serverVersion: "+serverVersion + " currentVersion: "+currentVersion);

   var isVersionOld = ((currentVersion < serverVersion) &&  (updatedOn < now.getTime())) ? true : false;
   if (isVersionOld) {
     //context.document.showMessage("show update alert");
     var window = createDownloadWindow();
     var alert = window[0];

     // When “Ok” is clicked
     var response = alert.runModal();
     if (response == "1000") {
       NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("http://guides.pratikshah.website/download.php"));
     } else {
       var newTime = new Date();
       newTime.setDate(newTime.getDate() + 1);
       //context.document.showMessage("newTime: "+newTime);
       saveData(newTime.getTime());
     }
   } else {
     context.document.showMessage("Hurray! You have latest version of PS: Guides");
   }
  //context.document.showMessage("currentVersion: "+currentVersion + " serverVersion: "+ serverVersion+ " isVersionOld: "+isVersionOld);
}

var addGuides = function(context) {
  var selectedLayers = context.selection;
  var selectedCount = selectedLayers.count();

  if (selectedCount <= 0) {
    context.document.showMessage("Please select at least one element.");
    return;
  }

  var layer = selectedLayers.firstObject();
  var layerType = layer.className();
  var hasArtboard = hasParentArtboard(context,layer);

  //document.showMessage("layoutSettings: "+context.document.layoutSettings());
  //context.document.showMessage("hasArtboard: "+hasArtboard);

  if (hasArtboard < 0) {
    context.document.showMessage("Soemthing is wrong");
    return;
  } else if (hasArtboard == 2) {
    context.document.showMessage("Please select an element inside an Artboard.");
    return;
  } else if (isSelectionAllowed(layerType) < 0) {
    context.document.showMessage("Currently "+layerType+" selection is not allowed.");
    return;
  } else if (selectedCount >= 2) {
    context.document.showMessage("Please select single layer.");
    return;
  } else {
    setGuides(context, layer);
  }
}

var clearGuides = function(context) {
  removeVerticalGuides(context);
  removeHorizontalGuides(context);
  checkUpdate(context);
}

var aboutPratikShah = function(context) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("http://pratikshah.website"));
}
