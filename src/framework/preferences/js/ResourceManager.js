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

    /********************
     * Resource Manager *
     ********************/

    /**
     * A component that loads templates and message files.
     *
     * @param {Object} options
     */
    fluid.defaults("fluid.prefs.resourceManager", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        components: {
            templateLoader: {
                type: "fluid.resourceLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{resourceManager}.events.onTemplatesLoaded"
                    }
                }
            },
            messageLoader: {
                type: "fluid.resourceLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{resourceManager}.events.onMessagesLoaded"
                    }
                }
            }
        },
        events: {
            onTemplatesLoaded: null,
            onMessagesLoaded: null,
            onMsgResolverReady: null,
            onResourcesReady: {
                events: {
                    templatesLoaded: "onTemplatesLoaded",
                    msgResolverReady: "onMsgResolverReady"
                }
            }
        },
        listeners: {
            "onMessagesLoaded.createMsgResolver": {
                funcName: "fluid.prefs.resourceManager.createMsgResolver",
                args: ["{arguments}.0", "{that}"]
            }
        },
        distributeOptions: [{
            source: "{that}.options.templateLoader",
            removeSource: true,
            target: "{that > templateLoader}.options"
        }, {
            source: "{that}.options.messageLoader",
            removeSource: true,
            target: "{that > messageLoader}.options"
        }, {
            source: "{that}.options.templatePrefix",
            target: "{that > templateLoader > resourcePath}.options.value"
        }, {
            source: "{that}.options.messagePrefix",
            target: "{that > messageLoader > resourcePath}.options.value"
        }]
    });

    fluid.prefs.resourceManager.createMsgResolver = function (messageResources, that) {
        var completeMessage;
        fluid.each(messageResources, function (oneResource) {
            var message = JSON.parse(oneResource.resourceText);
            completeMessage = $.extend({}, completeMessage, message);
        });
        var parentResolver = fluid.messageResolver({messageBase: completeMessage});
        that.msgResolver = fluid.messageResolver({messageBase: {}, parents: [parentResolver]});
        that.events.onMsgResolverReady.fire();
    };

    /*******************
     * Resource Loader *
     *******************/

    /**
     * A configurable component that works in conjunction with or without the resource
     * path component (fluid.prefsResourcePath) to allow users to set either the location
     * of their own resources or the resources that are relative to the path defined in
     * the resource path component.
     *
     * @param {Object} options
     */

    fluid.defaults("fluid.resourceLoader", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        listeners: {
            "onCreate": {
                listener: "fluid.resourceLoader.loadTemplates",
                args: ["{that}", {expander: {func: "{that}.resolveTemplates"}}]
            }
        },
        templates: {},
        // Unsupported, non-API option
        components: {
            resourcePath: {
                type: "fluid.prefs.resourcePath"
            }
        },
        invokers: {
            transformURL: {
                funcName: "fluid.stringTemplate",
                args: [ "{arguments}.0", {"prefix/" : "{that}.resourcePath.options.value"} ]
            },
            resolveTemplates: {
                funcName: "fluid.resourceLoader.resolveTemplates",
                args: "{that}"
            }
        },
        events: {
            onResourcesLoaded: null
        }
    });

    fluid.resourceLoader.resolveTemplates = function (that) {
        var mapped = fluid.transform(that.options.templates, that.transformURL);

        return fluid.transform(mapped, function (url) {
            return {url: url, forceCache: true};
        });
    };

    fluid.resourceLoader.loadTemplates = function (that, resources) {
        delete resources.expander;   // A work-around for FLUID-5117
        fluid.fetchResources(resources, function () {
            that.resources = resources;
            that.events.onResourcesLoaded.fire(resources);
        });
    };

    /***************************
     * Resource Path Specifier *
     ***************************/

    /**
     * A configurable component that defines the relative path from the html to templates.
     *
     * @param {Object} options
     */

    fluid.defaults("fluid.prefs.resourcePath", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        value: "../html/"
    });

})(jQuery, fluid_2_0);
