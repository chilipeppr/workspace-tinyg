/* global cpdefine chilipeppr cprequire */
cprequire_test(["inline:com-chilipeppr-workspace-tinyg"], function(ws) {

    console.log("initting workspace");

    /**
     * The Root workspace (when you see the ChiliPeppr Header) auto Loads the Flash 
     * Widget so we can show the 3 second flash messages. However, in test mode we
     * like to see them as well, so just load it from the cprequire_test() method
     * so we have similar functionality when testing this workspace.
     */
    var loadFlashMsg = function() {
        chilipeppr.load("#com-chilipeppr-widget-flash-instance",
            "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
            function() {
                console.log("mycallback got called after loading flash msg module");
                cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                    //console.log("inside require of " + fm.id);
                    fm.init();
                });
            }
        );
    };
    loadFlashMsg();

    // Init workspace
    ws.init();

    // Do some niceties for testing like margins on widget and title for browser
    $('title').html("Tinyg Workspace");
    $('body').css('padding', '10px');

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:com-chilipeppr-workspace-tinyg", ["chilipeppr_ready"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "com-chilipeppr-workspace-tinyg", // Make the id the same as the cpdefine id
        name: "Workspace / TinyG", // The descriptive name of your widget.
        desc: `This is a workspace for ChiliPeppr's Hardware Fiddle. It is geared towards CNC machines using TinyG.`,
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself

        foreignSubscribe: {
            "/com-chilipeppr-elem-dragdrop/ondragover": "The Chilipeppr drag drop element will publish on channel /com-chilipeppr-elem-dragdrop/ondropped when a file is dropped so we subscribe to it so we can load a Gcode file when the user drags it onto the browser. It also adds a hover class to the bound DOM elem so we can add a CSS to hilite on hover",
            "/com-chilipeppr-elem-dragdrop/ondragleave": "We need to know when the drag is over to remove the CSS hilites.",
            "/com-chilipeppr-widget-gcode/resize": "We watch if the Gcode viewer resizes so that we can reposition or resize other elements in the workspace. Specifically we ask the Serial Port Console to resize. We also redraw the 3D Viewer so it fills the whole screen."
        },

        foreignPublish: {},

        /**
         * Contains reference to the Console widget object. Hang onto the reference
         * so we can resize it when the window resizes because we want it to manually
         * resize to fill the height of the browser so it looks clean.
         */
        widgetConsole: null,
        /**
         * Contains reference to the Serial Port JSON Server object.
         */
        widgetSpjs: null,
        /**
         * The workspace's init method. It loads the all the widgets contained in the workspace
         * and inits them.
         */
        init: function() {

            // Most workspaces will instantiate the Serial Port JSON Server widget
            //this.loadSpjsWidget();
            // Most workspaces will instantiate the Serial Port Console widget
            this.loadConsoleWidget(function() {
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            });
            // Create our workspace upper right corner triangle menu
            this.loadWorkspaceMenu();
            // Add our billboard to the menu (has name, url, picture of workspace)
            this.addBillboardToWorkspaceMenu();

            // Setup an event to react to window resize. This helps since
            // some of our widgets have a manual resize to cleanly fill
            // the height of the browser window. You could turn this off and
            // just set widget min-height in CSS instead
            this.setupResize();
            setTimeout(function() {
                $(window).trigger('resize');
            }, 100);

            this.loadWidgets();

        },
        /**
         * Returns the billboard HTML, CSS, and Javascript for this Workspace. The billboard
         * is used by the home page, the workspace picker, and the fork pulldown to show a
         * consistent name/image/description tag for the workspace throughout the ChiliPeppr ecosystem.
         */
        getBillboard: function() {
            var el = $('#' + this.id + '-billboard').clone();
            el.removeClass("hidden");
            el.find('.billboard-desc').text(this.desc);
            return el;
        },
        /**
         * Inject the billboard into the Workspace upper right corner pulldown which
         * follows the standard template for workspace pulldown menus.
         */
        addBillboardToWorkspaceMenu: function() {
            // get copy of billboard
            var billboardEl = this.getBillboard();
            $('#' + this.id + ' .com-chilipeppr-ws-billboard').append(billboardEl);
        },
        /**
         * Listen to window resize event.
         */
        setupResize: function() {
            $(window).on('resize', this.onResize.bind(this));
        },
        /**
         * When browser window resizes, forcibly resize the Console window
         */
        onResize: function() {
            if (this.widgetConsole) this.widgetConsole.resize();
        },
        /**
         * Load the Serial Port JSON Server widget via chilipeppr.load()
         */
        loadSpjsWidget: function(callback) {

            var that = this;

            chilipeppr.load(
                "#com-chilipeppr-widget-serialport-instance",
                "http://raw.githubusercontent.com/raykholo/widget-autolevel/master/auto-generated-widget.html",
                function() {
                    console.log("mycallback got called after loading spjs module");
                    cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                        //console.log("inside require of " + fm.id);
                        spjs.setSingleSelectMode();
                        spjs.init({
                            isSingleSelectMode: true,
                            defaultBuffer: "default",
                            defaultBaud: 115200,
                            bufferEncouragementMsg: 'For your device please choose the "default" buffer in the pulldown and a 115200 baud rate before connecting.'
                        });
                        //spjs.showBody();
                        //spjs.consoleToggle();

                        that.widgetSpjs - spjs;

                        if (callback) callback(spjs);

                    });
                }
            );
        },
        /**
         * Load the Console widget via chilipeppr.load()
         */
        loadConsoleWidget: function(callback) {
            var that = this;
            chilipeppr.load(
                "#com-chilipeppr-widget-spconsole-instance",
                "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",
                function() {
                    // Callback after widget loaded into #com-chilipeppr-widget-spconsole-instance
                    cprequire(
                        ["inline:com-chilipeppr-widget-spconsole"], // the id you gave your widget
                        function(mywidget) {
                            // Callback that is passed reference to your newly loaded widget
                            console.log("My Console widget just got loaded.", mywidget);
                            that.widgetConsole = mywidget;

                            // init the serial port console
                            // 1st param tells the console to use "single port mode" which
                            // means it will only show data for the green selected serial port
                            // rather than for multiple serial ports
                            // 2nd param is a regexp filter where the console will filter out
                            // annoying messages you don't generally want to see back from your
                            // device, but that the user can toggle on/off with the funnel icon
                            that.widgetConsole.init(true, /myfilter/);
                            if (callback) callback(mywidget);
                        }
                    );
                }
            );
        },
        /**
         * Load the workspace menu and show the pubsubviewer and fork links using
         * our pubsubviewer widget that makes those links for us.
         */
        loadWorkspaceMenu: function(callback) {
            // Workspace Menu with Workspace Billboard
            var that = this;
            chilipeppr.load(
                "http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/",
                function() {
                    require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {

                        var el = $('#' + that.id + ' .com-chilipeppr-ws-menu .dropdown-menu-ws');
                        console.log("got callback for attachto menu for workspace. attaching to el:", el);

                        pubsubviewer.attachTo(
                            el,
                            that,
                            "Workspace"
                        );

                        if (callback) callback();
                    });
                }
            );
        },


        loadWidgets: function(callback) {
            // Zipwhip texting
            // com-chilipeppr-ws-zipwhip
            chilipeppr.load(
                "#com-chilipeppr-ws-zipwhip",
                "http://fiddle.jshell.net/chilipeppr/56X9G/show/light/",
                function() {
                    require(["inline:com-chilipeppr-elem-zipwhip"], function(zipwhip) {
                        zipwhip.init();
                        // setup toggle button
                        var zwBtn = $('#com-chilipeppr-ws-gcode-menu .zipwhip-button');
                        var zwDiv = $('#com-chilipeppr-ws-zipwhip');
                        zwBtn.click(function() {
                            if (zwDiv.hasClass("hidden")) {
                                // unhide
                                zwDiv.removeClass("hidden");
                                zwBtn.addClass("active");
                            }
                            else {
                                zwDiv.addClass("hidden");
                                zwBtn.removeClass("active");
                            }
                            $(window).trigger('resize');
                        });
                    });
                }); //End Zipwhip texting


            // Auto-Leveller
            // com-chilipeppr-ws-autolevel
            chilipeppr.load(
                "#com-chilipeppr-ws-autolevel",
                "http://fiddle.jshell.net/chilipeppr/h3NaZ/show/light/",
                function() {
                    require(["inline:com-chilipeppr-widget-autolevel"], function(autolevel) {
                        autolevel.init();
                        // setup toggle button
                        var alBtn = $('#com-chilipeppr-ws-gcode-menu .autolevel-button');
                        var alDiv = $('#com-chilipeppr-ws-autolevel');
                        alBtn.click(function() {
                            if (alDiv.hasClass("hidden")) {
                                // unhide
                                alDiv.removeClass("hidden");
                                alBtn.addClass("active");
                                autolevel.onDisplay();
                            }
                            else {
                                alDiv.addClass("hidden");
                                alBtn.removeClass("active");
                                autolevel.onUndisplay();
                            }
                            $(window).trigger('resize');

                        });
                    });
                }); //End Auto-Leveller


            // Macro
            // com-chilipeppr-ws-macro
            chilipeppr.load(
                "#com-chilipeppr-ws-macro",
                "http://raw.githubusercontent.com/chilipeppr/widget-macro/master/auto-generated-widget.html",
                function() {
                    //"http://fiddle.jshell.net/chilipeppr/ZJ5vV/show/light/", function () {
                    cprequire(["inline:com-chilipeppr-widget-macro"], function(macro) {
                        macro.init();
                        // setup toggle button
                        var alBtn = $('#com-chilipeppr-ws-gcode-menu .macro-button');
                        var alDiv = $('#com-chilipeppr-ws-macro');
                        alBtn.click(function() {
                            if (alDiv.hasClass("hidden")) {
                                // unhide
                                alDiv.removeClass("hidden");
                                alBtn.addClass("active");
                                //autolevel.onDisplay();
                            }
                            else {
                                alDiv.addClass("hidden");
                                alBtn.removeClass("active");
                                //autolevel.onUndisplay();
                            }
                            $(window).trigger('resize');

                        });
                    });
                }); //End Macro

            //from this point on we pull from js fiddle, not migrated to github yet
            // JScut
            // com-chilipeppr-ws-jscut
            chilipeppr.load(
                "#com-chilipeppr-ws-jscut",
                "http://fiddle.jshell.net/chilipeppr/7ZzSV/show/light/",
                function() {
                    require(["inline:org-jscut-gcode-widget"], function(jscut) {
                        jscut.init();
                        // setup toggle button
                        var alBtn = $('#com-chilipeppr-ws-gcode-menu .jscut-button');
                        var alDiv = $('#com-chilipeppr-ws-jscut');
                        alBtn.click(function() {
                            if (alDiv.hasClass("hidden")) {
                                // unhide
                                alDiv.removeClass("hidden");
                                alBtn.addClass("active");
                            }
                            else {
                                alDiv.addClass("hidden");
                                alBtn.removeClass("active");
                            }
                            $(window).trigger('resize');

                        });
                    });
                }); //End JSCut

            // Laser Solder
            // com-chilipeppr-ws-jscut
            chilipeppr.load(
                "#com-chilipeppr-ws-lasersolder",
                "http://fiddle.jshell.net/chilipeppr/xuu785yz/show/light/",
                function() {
                    require(["inline:com-chilipeppr-widget-lasersolder"], function(ls) {
                        ls.init();
                        ls.unactivateWidget();
                        // setup toggle button
                        var alBtn = $('#com-chilipeppr-ws-gcode-menu .lasersolder-button');
                        var alDiv = $('#com-chilipeppr-ws-lasersolder');
                        alBtn.click(function() {
                            if (alDiv.hasClass("hidden")) {
                                // unhide
                                alDiv.removeClass("hidden");
                                alBtn.addClass("active");
                                ls.activateWidget();
                            }
                            else {
                                alDiv.addClass("hidden");
                                alBtn.removeClass("active");
                                ls.unactivateWidget();
                            }
                            $(window).trigger('resize');

                        });
                    });
                }); //End Laser Solder

            // Eagle BRD Import
            // com-chilipeppr-widget-eagle

            // Setup drag/drop for BRD files on our own because we don't
            // want to instantiate the Eagle BRD codebase (i.e. load its massive
            // javascript files) until the user try requests that we do
            var eagleObj = {
                eagleBtn: null,
                eagleDiv: null,
                eagleInstance: null,
                init: function() {
                    this.eagleBtn = $('#com-chilipeppr-ws-gcode-menu .eagle-button');
                    this.eagleDiv = $('#com-chilipeppr-ws-eagle');
                    this.setupDragDrop();
                    this.setupBtn();
                    console.log("done instantiating micro Eagle BRD plug-in");
                },
                setupBtn: function() {
                    this.eagleBtn.click(this.toggleEagle.bind(this));
                },
                toggleEagle: function() {
                    if (this.eagleDiv.hasClass("hidden")) {
                        // unhide
                        this.showEagle();
                    }
                    else {
                        this.hideEagle();
                    }
                },
                showEagle: function(callback) {
                    this.eagleDiv.removeClass("hidden");
                    this.eagleBtn.addClass("active");

                    // see if instantiated already
                    // if so, just activate
                    if (this.eagleInstance != null) {
                        this.eagleInstance.activateWidget();
                        if (callback) callback();
                    }
                    else {
                        // otherwise, dynamic load
                        var that = this;
                        chilipeppr.load(
                            "#com-chilipeppr-ws-eagle",
                            //"http://fiddle.jshell.net/chilipeppr/3fe23xsr/show/light/", 
                            "http://raw.githubusercontent.com/chilipeppr/widget-eagle/master/auto-generated-widget.html",
                            function() {
                                require(["inline:com-chilipeppr-widget-eagle"], function(eagle) {
                                    that.eagleInstance = eagle;
                                    console.log("Eagle BRD instantiated. eagleInstance:", that.eagleInstance);
                                    that.eagleInstance.init();
                                    //eagleInstance.activateWidget();
                                    if (callback) callback();
                                });
                            }
                        );
                    }
                    $(window).trigger('resize');
                },
                hideEagle: function() {
                    this.eagleDiv.addClass("hidden");
                    this.eagleBtn.removeClass("active");
                    if (this.eagleInstance != null) {
                        this.eagleInstance.unactivateWidget();
                    }
                    $(window).trigger('resize');
                },
                setupDragDrop: function() {
                    // subscribe to events
                    chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", this, this.onDragOver);
                    chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", this, this.onDragLeave);
                    // /com-chilipeppr-elem-dragdrop/ondropped
                    chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondropped", this, this.onDropped, 9); // default is 10, we do 9 to be higher priority
                },
                onDropped: function(data, info) {
                    console.log("onDropped. len of file:", data.length, "info:", info);
                    // we have the data
                    // double check it's a board file, cuz it could be gcode
                    if (data.match(/<!DOCTYPE eagle SYSTEM "eagle.dtd">/i)) {

                        // check that there's a board tag
                        if (data.match(/<board>/i)) {
                            console.log("we have an eagle board file!");
                            this.fileInfo = info;
                            var that = this;
                            this.showEagle(function() {
                                console.log("got callback after showing eagle. now opening file.");
                                that.eagleInstance.open(data, info);
                            });
                            console.log("opened brd file");

                            // do NOT store a lastDropped, rather we should
                            // get told from the workspace what the last file
                            // was and if it was a BRD file we should auto-open
                            /*
                            localStorage.setItem('com-chilipeppr-widget-eagle-lastDropped', data);
                            localStorage.setItem('com-chilipeppr-widget-eagle-lastDropped-info', JSON.stringify(info));
                            console.log("saved brd file to localstorage");
                            */
                        }
                        else {
                            console.log("looks like it is an eagle generated file, but not a board file. sad.");
                            chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "Looks like you dragged in an Eagle CAD file, but it contains no board tag. You may have dragged in a schematic instead. Please retry with a valid board file.");
                        }

                        // now, we need to return false so no other widgets see this
                        // drag/drop event because they won't know how to handle
                        // an Eagle Brd file
                        return false;
                    }
                    else {
                        if (info && 'name' in info && info.name.match(/.brd$/i)) {
                            // this looks like an Eagle brd file, but it's binary
                            chilipeppr.publish('/com-chilipeppr-elem-flashmsg/flashmsg', "Error Loading Eagle BRD File", "Looks like you dragged in an Eagle BRD file, but it seems to be in binary. You can open this file in Eagle and then re-save it to a new file to create a text version of your Eagle BRD file.", 15 * 1000);
                            return false;
                        }
                        else {
                            console.log("we do not have an eagle board file. sad.");
                        }
                    }
                },
                onDragOver: function() {
                    console.log("onDragOver");
                    $('#com-chilipeppr-widget-eagle').addClass("panel-primary");
                    $('#com-chilipeppr-ws-gcode-menu .eagle-button').addClass("btn-primary");
                },
                onDragLeave: function() {
                    console.log("onDragLeave");
                    $('#com-chilipeppr-widget-eagle').removeClass("panel-primary");
                    $('#com-chilipeppr-ws-gcode-menu .eagle-button').removeClass("btn-primary");
                },
            };
            eagleObj.init();
            //End Eagle Brd Import

            // GPIO
            // net-delarre-widget-gpio

            // Dynamically load the GPIO widget, i.e. wait til user clicks on the button
            // first time.
            var gpioObj = {
                gpioBtn: null,
                gpioDiv: null,
                gpioInstance: null,
                init: function() {
                    this.gpioBtn = $('#com-chilipeppr-ws-gcode-menu .gpio-button');
                    this.gpioDiv = $('#com-chilipeppr-ws-gpio');
                    this.setupBtn();
                    console.log("done instantiating GPIO add-on widget");
                },
                setupBtn: function() {
                    this.gpioBtn.click(this.toggleGpio.bind(this));
                },
                toggleGpio: function() {
                    if (this.gpioDiv.hasClass("hidden")) {
                        // unhide
                        this.showGpio();
                    }
                    else {
                        this.hideGpio();
                    }
                },
                showGpio: function(callback) {
                    this.gpioDiv.removeClass("hidden");
                    this.gpioBtn.addClass("active");

                    // see if instantiated already
                    // if so, just activate
                    if (this.gpioInstance != null) {
                        //this.gpioInstance.activateWidget();
                        if (callback) callback();
                    }
                    else {
                        // otherwise, dynamic load
                        var that = this;
                        chilipeppr.load(
                            "#com-chilipeppr-ws-gpio",
                            "http://fiddle.jshell.net/benjamind/L3c7csaw/show/light/",
                            function() {
                                require(["inline:net-delarre-widget-gpio"], function(gpio) {
                                    that.gpioInstance = gpio;
                                    console.log("GPIO instantiated. gpioInstance:", that.gpioInstance);
                                    that.gpioInstance.init();
                                    //eagleInstance.activateWidget();
                                    if (callback) callback();
                                });
                            }
                        );
                    }
                    $(window).trigger('resize');
                },
                hideGpio: function() {
                    this.gpioDiv.addClass("hidden");
                    this.gpioBtn.removeClass("active");
                    if (this.gpioInstance != null) {
                        //this.gpioInstance.unactivateWidget();
                    }
                    $(window).trigger('resize');
                },
            };
            gpioObj.init();

            //End GPIO

            // SuttleXpress
            // Dynamically load the ShuttleXpress Widget. i.e. wait til user clicks on 
            // the button first time.
            // uses generic object so can cut/paste easier for others (or create actual object)
            // lordmundi/btyfqk7w
            var shuttlexpressObj = {
                id: "shuttlexpress",
                //url: "http://fiddle.jshell.net/chilipeppr/27v59xLg/show/light/",
                url: "http://fiddle.jshell.net/lordmundi/btyfqk7w/show/light/",
                requireName: "inline:com-chilipeppr-widget-shuttlexpress",
                btn: null,
                div: null,
                instance: null,
                init: function() {
                    this.btn = $('#com-chilipeppr-ws-gcode-menu .' + this.id + '-button');
                    this.div = $('#com-chilipeppr-ws-' + this.id + '');
                    this.setupBtn();
                    console.log('done instantiating ' + this.id + ' add-on widget');
                },
                setupBtn: function() {
                    this.btn.click(this.toggle.bind(this));
                },
                toggle: function() {
                    if (this.div.hasClass("hidden")) {
                        // unhide
                        this.show();
                    }
                    else {
                        this.hide();
                    }
                },
                show: function(callback) {
                    this.div.removeClass("hidden");
                    this.btn.addClass("active");

                    // see if instantiated already
                    // if so, just activate
                    if (this.instance != null) {
                        this.instance.activateWidget();
                        if (callback) callback();
                    }
                    else {
                        // otherwise, dynamic load
                        var that = this;
                        chilipeppr.load(
                            '#com-chilipeppr-ws-' + this.id + '',
                            this.url,
                            function() {
                                require([that.requireName], function(myinstance) {
                                    that.instance = myinstance;
                                    console.log(that.id + " instantiated. instance:", that.instance);
                                    that.instance.init();
                                    if (callback) callback();
                                });
                            }
                        );
                    }
                    $(window).trigger('resize');
                },
                hide: function() {
                    this.div.addClass("hidden");
                    this.btn.removeClass("active");
                    if (this.instance != null) {
                        this.instance.unactivateWidget();
                    }
                    $(window).trigger('resize');
                },
            };
            shuttlexpressObj.init();
            //End ShuttleXpress

            // Touch Plate
            // Dynamically load the Touch Plate widget, i.e. wait til user clicks on 
            // the button first time.
            var touchPlateObj = {
                touchPlateBtn: null,
                touchPlateDiv: null,
                touchPlateInstance: null,
                init: function() {
                    this.touchPlateBtn = $('#com-chilipeppr-ws-gcode-menu .touchplate-button');
                    this.touchPlateDiv = $('#com-chilipeppr-ws-touchplate');
                    this.setupBtn();
                    console.log("done instantiating touchPlate add-on widget");
                },
                setupBtn: function() {
                    this.touchPlateBtn.click(this.toggletouchPlate.bind(this));
                },
                toggletouchPlate: function() {
                    if (this.touchPlateDiv.hasClass("hidden")) {
                        // unhide
                        this.showtouchPlate();
                    }
                    else {
                        this.hidetouchPlate();
                    }
                },
                showtouchPlate: function(callback) {
                    this.touchPlateDiv.removeClass("hidden");
                    this.touchPlateBtn.addClass("active");

                    // see if instantiated already
                    // if so, just activate
                    if (this.touchPlateInstance != null) {
                        this.touchPlateInstance.activateWidget();
                        if (callback) callback();
                    }
                    else {
                        // otherwise, dynamic load
                        var that = this;
                        chilipeppr.load(
                            "#com-chilipeppr-ws-touchplate",
                            "http://fiddle.jshell.net/chilipeppr/skqyhd1m/show/light/",
                            function() {
                                require(["inline:com-chilipeppr-widget-touchplate"], function(touchPlate) {
                                    that.touchPlateInstance = touchPlate;
                                    console.log("touchPlate instantiated. touchPlateInstance:", that.touchPlateInstance);
                                    that.touchPlateInstance.init();
                                    //eagleInstance.activateWidget();
                                    if (callback) callback();
                                });
                            }
                        );
                    }
                    $(window).trigger('resize');
                },
                hidetouchPlate: function() {
                    this.touchPlateDiv.addClass("hidden");
                    this.touchPlateBtn.removeClass("active");
                    if (this.touchPlateInstance != null) {
                        this.touchPlateInstance.unactivateWidget();
                    }
                    $(window).trigger('resize');
                },
            };
            touchPlateObj.init();
            //End Touch Plate

        // Arduino / Atmel Firmware Programmer
    // FIDDLE http://jsfiddle.net/chilipeppr/qcduvhkh/11/
    
    chilipeppr.load(
        "com-chilipeppr-ws-programmer",
        "http://fiddle.jshell.net/chilipeppr/qcduvhkh/show/light/",
        require(["inline:com-chilipeppr-widget-programmer"], function (programmer) {
            programmer.init();
            // setup toggle button
            var btn = $('#com-chilipeppr-ws-gcode-menu .programmer-button');
            var div = $('#com-chilipeppr-ws-programmer');
            btn.click(programmer.show.bind(programmer));
        })  
    );  //End Arduino / Atmel Firmware Programmer

            // Element / Drag Drop
            // Load the dragdrop element into workspace toolbar
            // http://jsfiddle.net/chilipeppr/Z9F6G/
            chilipeppr.load("#com-chilipeppr-ws-gcode-dragdrop",
                "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",
                function() {
                    require(["inline:com-chilipeppr-elem-dragdrop"], function(dd) {
                        console.log("inside require of dragdrop");
                        $('.com-chilipeppr-elem-dragdrop').removeClass('well');
                        dd.init();
                        // The Chilipeppr drag drop element will publish
                        // on channel /com-chilipeppr-elem-dragdrop/ondropped
                        // when a file is dropped so subscribe to it
                        // It also adds a hover class to the bound DOM elem
                        // so you can add CSS to hilite on hover
                        dd.bind("#com-chilipeppr-ws-gcode-wrapper", null);
                        //$(".com-chilipeppr-elem-dragdrop").popover('show');
                        //dd.bind("#pnlWorkspace", null);
                        var ddoverlay = $('#com-chilipeppr-ws-gcode-dragdropoverlay');
                        chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", function() {
                            //console.log("got dragdrop hover");
                            ddoverlay.removeClass("hidden");
                        });
                        chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", function() {
                            ddoverlay.addClass("hidden");
                            //console.log("got dragdrop leave");
                        });
                        console.log(dd);
                    });
                }); //End Element / Drag Drop

            //do I need billboard?  I think it's already taken care of.
            
            
            // 3D Viewer
            // http://jsfiddle.net/chilipeppr/y3HRF
            chilipeppr.load(
                "#com-chilipeppr-3dviewer",
                //"http://fiddle.jshell.net/chilipeppr/y3HRF/show/light/",
                "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",

                function() {
                    console.log("got callback done loading 3d");

                    cprequire(
                        ['inline:com-chilipeppr-widget-3dviewer'],

                        function(threed) {
                            console.log("Running 3dviewer");
                            threed.init();
                            console.log("3d viewer initted");

                            // Ok, do someting whacky. Try to move the 3D Viewer 
                            // Control Panel to the center column
                            setTimeout(function() {
                                var element = $('#com-chilipeppr-3dviewer .panel-heading').detach();
                                $('#com-chilipeppr-3dviewer').addClass("noheight");
                                $('#com-chilipeppr-widget-3dviewer').addClass("nomargin");
                                $('#com-chilipeppr-3dviewer-controlpanel').append(element);
                            }, 10);

                            // listen to resize events so we can resize our 3d viewer
                            // this was done to solve the scrollbar residue we were seeing
                            // resize this console on a browser resize
                            var mytimeout = null;
                            $(window).on('resize', function(evt) {
                                //console.log("3d view force resize");
                                if (mytimeout !== undefined && mytimeout != null) {
                                    clearTimeout(mytimeout);
                                    //console.log("cancelling timeout resize");
                                }
                                mytimeout = setTimeout(function() {
                                    console.log("3d view force resize. 1 sec later");
                                    threed.resize();
                                }, 1000);

                            });
                        });

                }); //End 3D Viewer

            // Gcode List v3
            // OLD v2 http://jsfiddle.net/chilipeppr/F2Qn3/
            // NEW v3 with onQueue/onWrite/onComplete http://jsfiddle.net/chilipeppr/a4g5ds5n/
            chilipeppr.load("#com-chilipeppr-gcode-list",
                "http://fiddle.jshell.net/chilipeppr/a4g5ds5n/show/light/",

                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-gcode"],

                        function(gcodelist) {
                            gcodelist.init({
                                lineNumbersOnByDefault: true
                            });
                        });
                }); //End Gcode List v3

            // Serial Port Console Log Window
            // http://jsfiddle.net/chilipeppr/JB2X7/
            // NEW VERSION http://jsfiddle.net/chilipeppr/rczajbx0/
            // The new version supports onQueue, onWrite, onComplete

            chilipeppr.load("#com-chilipeppr-serialport-log",
                "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",

                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-spconsole"],

                        function(spc) {
                            // pass in regular expression filter as 2nd parameter
                            // to enable filter button and clean up how much
                            // data is shown
                            spc.init(true, /^{/);

                            // resize this console on a browser resize
                            $(window).on('resize', function(evt) {
                                //console.log("serial-port-console. resize evt:", evt);
                                if ($.isWindow(evt.target)) {
                                    //console.log("resize was window. so resizing");
                                    spc.resize();
                                }
                                else {
                                    //console.log("resize was not window, so ignoring");
                                }
                            });
                            // resize this console if we get a publish
                            // from the gcode viewer widget
                            chilipeppr.subscribe("/com-chilipeppr-widget-gcode/resize", spc, spc.resize);

                        });
                }); //End Serial Port Console Log Window


            //put  XYZ widget here.  It has a missing paren/ brace/ bracket somewhere that breaks everything here
            
                        // TinyG
    // http://jsfiddle.net/chilipeppr/XxEBZ/
    // com-chilipeppr-tinyg
    chilipeppr.load(
        "com-chilipeppr-tinyg",
        // Lauer's v2 (Jul 28th 2015) Fixed to {"sv":1}
        "http://fiddle.jshell.net/chilipeppr/h458y7gt/show/light/",
        // Danal's version
        //"http://fiddle.jshell.net/Danal/6rq2wx3o/show/light/",
        // Lauer's version
        //"http://fiddle.jshell.net/chilipeppr/XxEBZ/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-widget-tinyg"],

        function (tinyg) {
            tinyg.init();
        });
    }); //End TinyG

        // WebRTC Client com-chilipeppr-webrtcclient
    /*
    chilipeppr.load(
        "com-chilipeppr-webrtcclient",
        "http://fiddle.jshell.net/chilipeppr/qWj4f/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-widget-webrtc-client"],

        function (webrtcclient) {
            webrtcclient.init();
        });
    }); //End WebRTC Client
*/


    // Serial Port Selector
    // http://jsfiddle.net/chilipeppr/4RgrS/
    // NEW VERSION for SPJS v1.7 http://jsfiddle.net/chilipeppr/vetj5fvx/
    chilipeppr.load("com-chilipeppr-serialport-spselector",
        "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",

    function () {
        cprequire(
        ["inline:com-chilipeppr-widget-serialport"],

        function (sp) {
            sp.setSingleSelectMode();
            //sp.init("192.168.1.7");
            // We have a new TinyG buffer built into the serial
            // port server. This asks the serial port widget to
            // request the tinyg buffer. Make sure you ARE connected
            // to a tinyg cuz it looks for a {"qr":""} response to release
            // the flow
            sp.init(null, "tinyg", 115200);
            //$('.com-chilipeppr-widget-serialport-console').removeClass("hidden");
            //$('.com-chilipeppr-widget-serialport-consoleinput').removeClass("hidden");
            //$('.com-chilipeppr-widget-serialport-status').removeClass("hidden");
        });
    }); //End Serial Port Selector


        },
        //end loadWidgets



    }
});