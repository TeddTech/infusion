/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery, window*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    /********************************
     * text to speech draggable menu
     ********************************/

    fluid.defaults("fluid.uiOptions.textToSpeechMenu", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        model: {
            showSettings: false
        },
        selectors: {
            playButton: ".flc-textToSpeech-menu-play",
            settingsButton: ".flc-textToSpeech-menu-settings",
            downloadButton: ".flc-textToSpeech-menu-download",
            settingsMenu: ".flc-textToSpeech-settingsMenu"
        },
        selectorsToIgnore: ["play"],
        floatSpeed: 1000 // millisecond
    });
    
    fluid.uiOptions.textToSpeechMenu.scrollMenu = function (menuContainer, menuPosition, floatSpeed) {
        var scrollAmount = $(document).scrollTop();
        var newPosition = menuPosition + scrollAmount;
        
        menuContainer.stop().animate({top: newPosition}, floatSpeed);
    };

    fluid.uiOptions.textToSpeechMenu.finalInit = function (that) {
        // make a draggable floating menu
        that.container.draggable({
            containment: 'document'
        });
        
        // Scroll the menu to be in view when the page scrolls
        var menuPosition = that.container.position().top;
        
        $(window).scroll(function () {
            fluid.uiOptions.textToSpeechMenu.scrollMenu(that.container, menuPosition, that.options.floatSpeed);
        });

        // show/hide settings menu
        that.locate("settingsButton").click(function (e) {
            e.stopPropagation();
            that.applier.requestChange("showSettings", !that.model.showSettings);
        });
        
        that.locate("settingsMenu").click(function (e) {
            e.stopPropagation();
        });
        
        that.applier.modelChanged.addListener("showSettings", function (newModel, oldModel, changeRequest) {
            var settingsMenu = that.locate("settingsMenu");
            
            if (newModel.showSettings) {
                settingsMenu.show();
            } else {
                settingsMenu.hide();
            }
        });
        
        $(document).click(function (e) {
            that.locate("settingsMenu").hide();
        });
        
        // Attach the button click events here. To be rewritten
        fluid.each(that.options.selectors, function (value, key) {
            that.locate(key).click(function () {
                console.log("clicked on " + key);
            });
        });
    };

})(jQuery, fluid_1_5);