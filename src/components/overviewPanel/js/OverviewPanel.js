/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt

*/

var fluid_2_0 = fluid_2_0 || {};

(function ($, fluid) {

    "use strict";

    fluid.registerNamespace("fluid.overviewPanel");

    fluid.overviewPanel.makeBooleanListener = function (that, selector, method, path, value) {
        var elem = that.locate(selector);
        elem[method](function (evt) {
            that.applier.change(path, value === "toggle" ? !that.model[path] : value);
            evt.preventDefault();
        });
    };

    fluid.defaults("fluid.overviewPanel", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        resources: {
            template: {
                href: "../html/overviewPanelTemplate.html"
            }
        },
        listeners: {
            "onCreate.setVisibility": "{that}.setVisibility",
            "onCreate.showTemplate": "fluid.overviewPanel.showTemplate",
            "afterRender.registerToggleListener": {
                "funcName": "fluid.overviewPanel.makeBooleanListener",
                "args": ["{that}", "toggleControl", "click", "showPanel", "toggle"]
            },
            "afterRender.registerCloseListener": {
                "funcName": "fluid.overviewPanel.makeBooleanListener",
                "args": ["{that}", "showDemo", "click", "showPanel", false]
            },
            "afterRender.setLinkHrefs": {
                "funcName": "fluid.overviewPanel.setLinkHrefs",
                "args": ["{that}", "{that}.options.links"]
            },
            "afterRender.setToggleControlAria": {
                "this": "{that}.dom.toggleControl",
                "method": "attr",
                "args": {
                    "role": "button",
                    "aria-controls": "{that}.containerId"
                }
            },
            "afterRender.setshowDemoAria": {
                "this": "{that}.dom.showDemo",
                "method": "attr",
                "args": {
                    "role": "button",
                    "aria-label": "{that}.options.strings.showDemoText",
                    "aria-controls": "{that}.containerId"
                }
            },
            "afterRender.setAriaStates": "{that}.setAriaStates"
        },
        model: {
            showPanel: true
        },
        modelListeners: {
            "showPanel.setVisibility": "{that}.setVisibility",
            "showPanel.setAriaStates": "{that}.setAriaStates"
        },
        members: {
            containerId: {
                expander: {
                    // create an id for that.container, if it does not have one already,
                    // and set that.containerId to the id value
                    funcName: "fluid.allocateSimpleId",
                    args: "{that}.container"
                }
            }
        },
        invokers: {
            setVisibility: {
                funcName: "fluid.overviewPanel.setVisibility",
                args: ["{that}", "{that}.model.showPanel"]
            },
            setAriaStates: {
                funcName: "fluid.overviewPanel.setAriaStates",
                args: ["{that}", "{that}.model.showPanel"]
            }
        },
        selectors: {
            toggleControl: ".flc-overviewPanel-toggleControl",
            titleBegin: ".flc-overviewPanel-title-begin",
            titleLink: ".flc-overviewPanel-titleLink",
            titleLinkText: ".flc-overviewPanel-title-linkText",
            titleEnd: ".flc-overviewPanel-title-end",
            componentName: ".flc-overviewPanel-componentName",
            description: ".flc-overviewPanel-description",
            instructionsHeading: ".flc-overviewPanel-instructionsHeading",
            instructions: ".flc-overviewPanel-instructions",
            demoCodeLink: ".flc-overviewPanel-demoCodeLink",
            demoCodeLinkText: ".flc-overviewPanel-demoCodeLinkText",
            infusionCodeLink: ".flc-overviewPanel-infusionCodeLink",
            apiLink: ".flc-overviewPanel-apiLink",
            apiLinkText: ".flc-overviewPanel-apiLinkText",
            designLink: ".flc-overviewPanel-designLink",
            designLinkText: ".flc-overviewPanel-designLinkText",
            feedbackLink: ".flc-overviewPanel-feedbackLink",
            feedbackLinkText: ".flc-overviewPanel-feedbackLinkText",
            infusionCodeLinkText: ".flc-overviewPanel-infusionCodeLinkText",
            showDemo: ".flc-overviewPanel-showDemo",
            showDemoText: ".flc-overviewPanel-showDemoText"
        },
        selectorsToIgnore: ["toggleControl", "titleLink", "demoCodeLink", "infusionCodeLink", "apiLink", "designLink", "feedbackLink", "showDemo"],
        protoTree: {
            titleBegin: {messagekey: "titleBegin"},
            titleLinkText: {messagekey: "titleLinkText"},
            titleEnd: {messagekey: "titleEnd"},
            componentName: {messagekey: "componentName"},
            description: {markup: "${{that}.options.markup.description}"},
            instructionsHeading: {messagekey: "instructionsHeading"},
            instructions: {markup: "${{that}.options.markup.instructions}"},
            demoCodeLinkText: {messagekey: "demoCodeLinkText"},
            apiLinkText: {messagekey: "apiLinkText"},
            designLinkText: {messagekey: "designLinkText"},
            feedbackLinkText: {messagekey: "feedbackLinkText"},
            infusionCodeLinkText: {messagekey: "infusionCodeLinkText"},
            showDemoText: {messagekey: "showDemoText"}
        },
        styles: {
            hidden: "fl-overviewPanel-hidden",
            closeIcon: "fl-overviewPanel-toggleControl-close"
        },
        strings: {
            titleBegin: "An",
            titleLinkText: "Infusion",
            titleEnd: "component demo",
            componentName: "Component Name",
            instructionsHeading: "Instructions",
            demoCodeLinkText: "demo code",
            apiLinkText: "API",
            designLinkText: "design",
            feedbackLinkText: "Send Feedback",
            infusionCodeLinkText: "get Infusion",
            showDemoText: "Show the demo",
            openPanelLabel: "Open the overview panel",
            closePanelLabel: "Close the overview panel"
        },
        markup: {
            description: "A description of the component should appear here. It should say: <ul><li>What the component does.</li><li>Why it is interesting / useful.</li></ul>",
            instructions: "<p>Do this to do this. Do that to do that.</p>"
        },
        links: {
            titleLink: "http://fluidproject.org/products/infusion/",
            demoCodeLink: "#",
            infusionCodeLink: "https://github.com/fluid-project/infusion/",
            apiLink: "#",
            designLink: "#",
            feedbackLink: "#"
        }
    });

    fluid.overviewPanel.setVisibility = function (that, showPanel) {
        that.container.toggleClass(that.options.styles.hidden, !showPanel);
    };

    fluid.overviewPanel.showTemplate = function (that) {
        fluid.fetchResources(that.options.resources, function () {
            that.refreshView();
        });
    };

    fluid.overviewPanel.setLinkHrefs = function (that, linkMap) {
        fluid.each(linkMap, function (linkHref, selector) {
            that.locate(selector).attr("href", linkHref);
        });
    };

    fluid.overviewPanel.setAriaStates = function (that, showPanel) {
        var toggleControl = that.locate("toggleControl");
        var showDemo = that.locate("showDemo");

        toggleControl.attr("aria-pressed", !showPanel);
        toggleControl.attr("aria-expanded", showPanel);
        showDemo.attr("aria-expanded", showPanel);
        if (showPanel) {
            toggleControl.attr("aria-label", that.options.strings.closePanelLabel);
            toggleControl.removeClass(that.options.styles.closeIcon);
        } else {
            toggleControl.attr("aria-label", that.options.strings.openPanelLabel);
            toggleControl.addClass(that.options.styles.closeIcon);
        }
    };

})(jQuery, fluid_2_0);
