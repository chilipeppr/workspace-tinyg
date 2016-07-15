# com-chilipeppr-workspace-pyroavr-tinyg
This is a workspace for ChiliPeppr's Hardware Fiddle. It is geared towards CNC machines using TinyG.

![alt text](screenshot.png "Screenshot")

## ChiliPeppr Workspace / TinyG

All ChiliPeppr workspaces/widgets/elements are defined using cpdefine() which is a method
that mimics require.js. Each defined object must have a unique ID so it does
not conflict with other ChiliPeppr objects.

| Item                  | Value           |
| -------------         | ------------- | 
| ID                    | com-chilipeppr-workspace-pyroavr-tinyg |
| Name                  | Workspace / TinyG |
| Description           | This is a workspace for ChiliPeppr's Hardware Fiddle. It is geared towards CNC machines using TinyG. |
| chilipeppr.load() URL | http://raw.githubusercontent.com/PyroAVR/pyroavr-tinyg/master/auto-generated-workspace.html |
| Edit URL              | http://ide.c9.io/pyroavr/pyroavr-tinyg |
| Github URL            | http://github.com/PyroAVR/pyroavr-tinyg |
| Test URL              | https://preview.c9users.io/pyroavr/pyroavr-tinyg/workspace.html |

## Example Code for chilipeppr.load() Statement

You can use the code below as a starting point for instantiating this workspace 
from ChiliPeppr's Edit Boot Script dialog box. The key is that you need to load 
your workspace inlined into the standard #pnlWorkspace div so the DOM can parse your HTML, CSS, and 
Javascript. Then you use cprequire() to find your workspace's Javascript and get 
back the instance of it to init() it.

```javascript
// This code should be pasted into the ChiliPeppr Edit Boot Javascript dialog box
// located in the upper right corner of any chilipeppr.com page.
// The ChiliPeppr environment has a standard div called #pnlWorkspace that
// this workspace should be loaded into.
chilipeppr.load(
  "#pnlWorkspace",
  "http://raw.githubusercontent.com/PyroAVR/pyroavr-tinyg/master/auto-generated-workspace.html",
  function() {
    // Callback after workspace loaded into #pnlWorkspace
    // Now use require.js to get reference to instantiated workspace
    cprequire(
      ["inline:com-chilipeppr-workspace-pyroavr-tinyg"], // the id you gave your workspace
      function(myWorkspacePyroavrTinyg) {
        // Callback that is passed reference to the newly loaded workspace
        console.log("Workspace / TinyG just got loaded.", myWorkspacePyroavrTinyg);
        myWorkspacePyroavrTinyg.init();
      }
    );
  }
);

```

## Publish

This workspace publishes the following signals. These signals are owned by this workspace and are published to 
all objects inside the ChiliPeppr environment that listen to them via the 
chilipeppr.subscribe(signal, callback) method. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-pub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this workspace)</td></tr>    
      </tbody>
  </table>

## Subscribe

This workspace subscribes to the following signals. These signals are owned by this workspace. 
Other objects inside the ChiliPeppr environment can publish to these signals via the chilipeppr.publish(signal, data) method. 
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-sub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this workspace)</td></tr>    
      </tbody>
  </table>

## Foreign Publish

This workspace publishes to the following signals that are owned by other objects. 
To better understand how ChiliPeppr's subscribe() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignpub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr><td colspan="2">(No signals defined in this workspace)</td></tr>    
      </tbody>
  </table>

## Foreign Subscribe

This workspace publishes to the following signals that are owned by other objects.
To better understand how ChiliPeppr's publish() method works see amplify.js's documentation at http://amplifyjs.com/api/pubsub/

  <table id="com-chilipeppr-elem-pubsubviewer-foreignsub" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Signal</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>/com-chilipeppr-workspace-pyroavr-tinyg/com-chilipeppr-elem-dragdrop/ondragover</td><td>The Chilipeppr drag drop element will publish on channel /com-chilipeppr-elem-dragdrop/ondropped when a file is dropped so we subscribe to it so we can load a Gcode file when the user drags it onto the browser. It also adds a hover class to the bound DOM elem so we can add a CSS to hilite on hover</td></tr><tr valign="top"><td>/com-chilipeppr-workspace-pyroavr-tinyg/com-chilipeppr-elem-dragdrop/ondragleave</td><td>We need to know when the drag is over to remove the CSS hilites.</td></tr><tr valign="top"><td>/com-chilipeppr-workspace-pyroavr-tinyg/com-chilipeppr-widget-gcode/resize</td><td>We watch if the Gcode viewer resizes so that we can reposition or resize other elements in the workspace. Specifically we ask the Serial Port Console to resize. We also redraw the 3D Viewer so it fills the whole screen.</td></tr>    
      </tbody>
  </table>

## Methods / Properties

The table below shows, in order, the methods and properties inside the workspace object.

  <table id="com-chilipeppr-elem-methodsprops" class="table table-bordered table-striped">
      <thead>
          <tr>
              <th style="">Method / Property</th>
              <th>Type</th>
              <th style="">Description</th>
          </tr>
      </thead>
      <tbody>
      <tr valign="top"><td>id</td><td>string</td><td>"com-chilipeppr-workspace-pyroavr-tinyg"<br><br>The ID of the widget. You must define this and make it unique.</td></tr><tr valign="top"><td>name</td><td>string</td><td>"Workspace / TinyG"</td></tr><tr valign="top"><td>desc</td><td>string</td><td>"This is a workspace for ChiliPeppr's Hardware Fiddle. It is geared towards CNC machines using TinyG."</td></tr><tr valign="top"><td>url</td><td>string</td><td>"http://raw.githubusercontent.com/PyroAVR/pyroavr-tinyg/master/auto-generated-workspace.html"</td></tr><tr valign="top"><td>fiddleurl</td><td>string</td><td>"http://ide.c9.io/pyroavr/pyroavr-tinyg"</td></tr><tr valign="top"><td>githuburl</td><td>string</td><td>"http://github.com/PyroAVR/pyroavr-tinyg"</td></tr><tr valign="top"><td>testurl</td><td>string</td><td>"http://pyroavr-tinyg-pyroavr.c9users.io/workspace.html"</td></tr><tr valign="top"><td>foreignSubscribe</td><td>object</td><td>Please see docs above.</td></tr><tr valign="top"><td>foreignPublish</td><td>object</td><td>Please see docs above.</td></tr><tr valign="top"><td>widgetConsole</td><td>object</td><td>Contains reference to the Console widget object. Hang onto the reference
so we can resize it when the window resizes because we want it to manually
resize to fill the height of the browser so it looks clean.</td></tr><tr valign="top"><td>widgetSpjs</td><td>object</td><td>Contains reference to the Serial Port JSON Server object.</td></tr><tr valign="top"><td>init</td><td>function</td><td>function () <br><br>The workspace's init method. It loads the all the widgets contained in the workspace
and inits them.</td></tr><tr valign="top"><td>getBillboard</td><td>function</td><td>function () <br><br>Returns the billboard HTML, CSS, and Javascript for this Workspace. The billboard
is used by the home page, the workspace picker, and the fork pulldown to show a
consistent name/image/description tag for the workspace throughout the ChiliPeppr ecosystem.</td></tr><tr valign="top"><td>addBillboardToWorkspaceMenu</td><td>function</td><td>function () <br><br>Inject the billboard into the Workspace upper right corner pulldown which
follows the standard template for workspace pulldown menus.</td></tr><tr valign="top"><td>setupResize</td><td>function</td><td>function () <br><br>Listen to window resize event.</td></tr><tr valign="top"><td>onResize</td><td>function</td><td>function () <br><br>When browser window resizes, forcibly resize the Console window</td></tr><tr valign="top"><td>loadSpjsWidget</td><td>function</td><td>function (callback) <br><br>Load the Serial Port JSON Server widget via chilipeppr.load()</td></tr><tr valign="top"><td>loadConsoleWidget</td><td>function</td><td>function (callback) <br><br>Load the Console widget via chilipeppr.load()</td></tr><tr valign="top"><td>loadWorkspaceMenu</td><td>function</td><td>function (callback) <br><br>Load the workspace menu and show the pubsubviewer and fork links using
our pubsubviewer widget that makes those links for us.</td></tr><tr valign="top"><td>loadWidgets</td><td>function</td><td>function (callback) </td></tr>
      </tbody>
  </table>


## About ChiliPeppr

[ChiliPeppr](http://chilipeppr.com) is a hardware fiddle, meaning it is a 
website that lets you easily
create a workspace to fiddle with your hardware from software. ChiliPeppr provides
a [Serial Port JSON Server](https://github.com/johnlauer/serial-port-json-server) 
that you run locally on your computer, or remotely on another computer, to connect to 
the serial port of your hardware like an Arduino or other microcontroller.

You then create a workspace at ChiliPeppr.com that connects to your hardware 
by starting from scratch or forking somebody else's
workspace that is close to what you are after. Then you write widgets in
Javascript that interact with your hardware by forking the base template 
widget or forking another widget that
is similar to what you are trying to build.

ChiliPeppr is massively capable such that the workspaces for 
[TinyG](http://chilipeppr.com/tinyg) and [Grbl](http://chilipeppr.com/grbl) CNC 
controllers have become full-fledged CNC machine management software used by
tens of thousands.

ChiliPeppr has inspired many people in the hardware/software world to use the
browser and Javascript as the foundation for interacting with hardware. The
Arduino team in Italy caught wind of ChiliPeppr and now
ChiliPeppr's Serial Port JSON Server is the basis for the 
[Arduino's new web IDE](https://create.arduino.cc/). If the Arduino team is excited about building on top
of ChiliPeppr, what
will you build on top of it?

