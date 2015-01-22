var fluid = fluid_2_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.pga");

    fluid.defaults("fluid.pga", {
        gradeNames: ["fluid.viewRelayComponent", "fluid.prefs.prefsEditorLoader", "autoInit"],
        selectors: {
            prefsEditor: ".flc-panels",
            nextButton: ".flc-next"
        },
        components: {
            prefsEditor: {
                container: "{that}.container",
                options: {
                    listeners: {
                        onReady: {
                            listener: "{pga}.events.onReady",
                            args: "{pga}"
                        }
                    }
                }
            }
        },
        model: {
            currentPanel: 1
        },
        events: {
            onReady: null
        },
        listeners: {
            "onReady.bindNextButton": {
                "this": "{that}.dom.nextButton",
                "method": "click",
                "args": ["{that}.nextPanel"]
            }
        },
        invokers: {
            "nextPanel": {
                funcName: "fluid.pga.nextPanel",
                args: ["{that}"]
            }
        }
    });

    fluid.pga.nextPanel = function (that) {
        var nextPanel = that.model.currentPanel + 1;
        that.applier.change("currentPanel", nextPanel);
    };

    // The grade component for PAG panels
    fluid.defaults("fluid.PGAPanel", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        currentPanel: 5,
        model: {
            currentPanel: "{fluid.pga}.model.currentPanel"
        },
        modelListeners: {
            currentPanel: {
                listener: "fluid.PGAPanel.presentPanel",
                args: ["{change}.value", "{that}.options.order", "{that}.container"]
            }
        }
    });

    fluid.PGAPanel.presentPanel = function (currentPanel, order, container) {
        container[(order === currentPanel) ? "show" : "hide"]();
    };

})(jQuery, fluid);
