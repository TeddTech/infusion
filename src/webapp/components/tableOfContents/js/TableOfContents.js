/*
Copyright 2009 University of Cambridge
Copyright 2009 University of Toronto
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_4:true, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_4 = fluid_1_4 || {};

(function ($, fluid) {
    
    /******
    * ToC *
    *******/
    fluid.registerNamespace("fluid.tableOfContents");
    
    fluid.tableOfContents.insertAnchor = function (name, element) {
        $("<a></a>", {
            name: name,
            id: name
        }).insertBefore(element);
    };
    
    fluid.tableOfContents.generateGUID = function (baseName) {
        return "toc_" + baseName + "_" + fluid.allocateGuid();
    };
    
    fluid.tableOfContents.sanitizeID = function (id) {
        return id.replace(/\W/g, "-");
    };
    
    /**
     * Invoker function to filter headings.  Default is to filter out the visible headings.
     * @param   Object  Contains a list of headings, usually generated by that.locate("headings")
     * @return  filtered headings
     */
    fluid.tableOfContents.filterHeadings = function (headings) {
        return headings.filter(":visible");
    };
    
    fluid.tableOfContents.finalInit = function (that) {
        var headings = that.filterHeadings(that.locate("headings"));
        
        that.headingTextToAnchor = function (heading) {
            var baseName = $(heading).text();
            var guid = that.sanitizeID(that.generateGUID(baseName));
            
            var anchorInfo = {
                id: guid,
                url: "#" + guid
            };
            
            that.insertAnchor(anchorInfo.id, heading);
            return anchorInfo;
        };
        
        that.anchorInfo = fluid.transform(headings, function (heading) {
            return that.headingTextToAnchor(heading);
        });
        
        // TODO: is it weird to have hide and show on a component?
        that.hide = function () {
            that.locate("tocContainer").hide();
        };
        
        that.show = function () {
            that.locate("tocContainer").show();
        };
        
        that.model = that.modelBuilder.assembleModel(headings, that.anchorInfo);
        that.events.onReady.fire();
    };
    
    
    fluid.defaults("fluid.tableOfContents", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        finalInitFunction: "fluid.tableOfContents.finalInit",
        components: {
            levels: {
                type: "fluid.tableOfContents.levels",
                container: "{tableOfContents}.dom.tocContainer",
                createOnEvent: "onReady",
                options: {
                    model: {
                        headings: "{tableOfContents}.model"
                    }, 
                    events: {
                        afterRender: "{tableOfContents}.events.afterRender"
                    }
                }
            },
            modelBuilder: {
                type: "fluid.tableOfContents.modelBuilder"
            }
        },
        invokers: {
            insertAnchor: "fluid.tableOfContents.insertAnchor",
            generateGUID: "fluid.tableOfContents.generateGUID",
            sanitizeID: "fluid.tableOfContents.sanitizeID",
            filterHeadings: "fluid.tableOfContents.filterHeadings"
        },
        selectors: {
            headings: ":header",
            tocContainer: ".flc-toc-tocContainer"
        },
        events: {
            onReady: null,
            afterRender: null
        }
    });
    
    
    /*******************
    * ToC ModelBuilder *
    ********************/
    fluid.registerNamespace("fluid.tableOfContents.modelBuilder");
    
    fluid.tableOfContents.modelBuilder.toModel = function (headingInfo, modelLevelFn) {
        var headings = fluid.copy(headingInfo);
        var buildModelLevel = function (headings, level) {
            var modelLevel = [];
            while (headings.length > 0) {
                var heading = headings[0];
                if (heading.level < level) {
                    break;
                }
                if (heading.level > level) {
                    var subHeadings = buildModelLevel(headings, level + 1);
                    if (modelLevel.length > 0) {
                        modelLevel[modelLevel.length - 1].headings = subHeadings;
                    } else {
                        modelLevel = modelLevelFn(modelLevel, subHeadings);
                    }
                }
                if (heading.level === level) {
                    modelLevel.push(heading); 
                    headings.shift();
                }
            }
            return modelLevel;
        };
        return buildModelLevel(headings, 1);
    };
       
    fluid.tableOfContents.modelBuilder.gradualModelLevelFn = function (modelLevel, subHeadings) {
        // Clone the subHeadings because we don't want to modify the reference of the subHeadings.  
        // the reference will affect the equality condition in generateTree(), resulting an unwanted tree.
        subHeadingsClone = fluid.copy(subHeadings);
        subHeadingsClone[0].level--;
        return subHeadingsClone;
    };

    fluid.tableOfContents.modelBuilder.skippedModelLevelFn = function (modelLevel, subHeadings) {
        modelLevel.push({headings: subHeadings});
        return modelLevel;
    };
    
    fluid.tableOfContents.modelBuilder.finalInit = function (that) {
        
        that.convertToHeadingObjects = function (headings, anchorInfo) {
            headings = $(headings);
            return fluid.transform(headings, function (heading, index) {
                return {
                    level: that.headingCalculator.getHeadingLevel(heading),
                    text: $(heading).text(),
                    url: anchorInfo[index].url
                };
            });
        };
        
        that.assembleModel = function (headings, anchorInfo) {
            var headingInfo = that.convertToHeadingObjects(headings, anchorInfo);
            return that.toModel(headingInfo);
        };
    };
    
    fluid.defaults("fluid.tableOfContents.modelBuilder", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        finalInitFunction: "fluid.tableOfContents.modelBuilder.finalInit",
        components: {
            headingCalculator: {
                type: "fluid.tableOfContents.modelBuilder.headingCalculator"
            }
        },
        invokers: {
            toModel: {
                funcName: "fluid.tableOfContents.modelBuilder.toModel",
                args: ["{arguments}.0", "{modelBuilder}.modelLevelFn"]
            },
            modelLevelFn: "fluid.tableOfContents.modelBuilder.skippedModelLevelFn"
        }
    });
    
    /*************************************
    * ToC ModelBuilder headingCalculator *
    **************************************/
    fluid.registerNamespace("fluid.tableOfContents.modelBuilder.headingCalculator");
    
    fluid.tableOfContents.modelBuilder.headingCalculator.finalInit = function (that) {
        that.getHeadingLevel = function (heading) {
            return $.inArray(heading.tagName, that.options.levels) + 1;
        };
    };
    
    fluid.defaults("fluid.tableOfContents.modelBuilder.headingCalculator", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        finalInitFunction: "fluid.tableOfContents.modelBuilder.headingCalculator.finalInit",
        levels: ["H1", "H2", "H3", "H4", "H5", "H6"]
    });
    
    /*************
    * ToC Levels *
    **************/
    fluid.registerNamespace("fluid.tableOfContents.levels");
    
    fluid.tableOfContents.levels.finalInit = function (that) {
        fluid.fetchResources(that.options.resources, function () {
            that.container.append(that.options.resources.template.resourceText);
            that.refreshView();
        });        
    };

    
    /**
     * @param   Object  that.model, the model with all the headings, it should be in the format of {headings: [...]}
     * @param   int     the current level we want to generate the tree for.  default to 1 if not defined.
     * @return  Object  A tree that looks like {children: [{ID: x, subTree:[...]}, ...]}
     */
    fluid.tableOfContents.levels.generateTree = function (headingsModel, currentLevel) {
        var levelObj = {};
        var levelChildren = [];
        currentLevel = currentLevel || 1;
        
        //base case = no more sub headings, then return link object
        if (!headingsModel.headings) {
            return fluid.tableOfContents.levels.modelToLinkObject(headingsModel);
        }
                
        // loop through all headings; model is {headings:[...], level, text, url}
        $.each (headingsModel.headings, function (index, model) {
            var itemObj = {
                ID : "items" + currentLevel + ":",
                children: []
            };
            // if model.level is not set, then this is the skipped node, add decorator to it
            if (!model.level) {
                fluid.tableOfContents.levels.handleEmptyItemObj(itemObj);
            }            
            if (model.headings && model.level) {
                // if this has subheadings and not the skipped node, 
                // then create a link object, and add this to the item's children
                itemObj.children.push(fluid.tableOfContents.levels.modelToLinkObject(model));
            } 
            // add subHeadings recursively
            itemObj.children.push(fluid.tableOfContents.levels.generateTree(model, currentLevel + 1));
            levelChildren.push(itemObj);
        });

        levelObj = {
            ID: "level" + currentLevel + ":",
            children: levelChildren
        };

        if (currentLevel === 1) {
            // final result should be wrapped inside a children.
            return {children: [levelObj]};
        }
        return levelObj;
    };
    
    /**
     * Take the model {level, text, url}, and convert it to a link object.  This function is used 
     * by generateTree().
     *
     * @param      Object  The model generated by toModel(), in the format of {level, text, url}
     * @return     Object  A link object with the following properties, {ID, target, linktext}
     */
    fluid.tableOfContents.levels.modelToLinkObject = function (model) {
        return ({ID: "link" + model.level, target: model.url, linktext: model.text});
    };
    
    /** 
     * Configure item object when item object has no text, uri, level in it.
     * defaults to add a decorator to hide the bullets.
     */
    fluid.tableOfContents.levels.handleEmptyItemObj = function (itemObj) {
        itemObj.decorators = [{
            type: "addClass",
            classes: "fl-tableOfContents-hide-bullet"
        }];
    };
 
    /** 
     * @return  Object  Returned produceTree must be in {headings: [trees]}
     */
    fluid.tableOfContents.levels.produceTree = function (that) {
        return fluid.tableOfContents.levels.generateTree(that.model);
    };
     
    fluid.defaults("fluid.tableOfContents.levels", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        finalInitFunction: "fluid.tableOfContents.levels.finalInit",
        produceTree: "fluid.tableOfContents.levels.produceTree",
        selectors: {
            level1: ".flc-toc-levels-level1",
            level2: ".flc-toc-levels-level2",
            level3: ".flc-toc-levels-level3",
            level4: ".flc-toc-levels-level4",
            level5: ".flc-toc-levels-level5",
            level6: ".flc-toc-levels-level6",
            items1: ".flc-toc-levels-items1",
            items2: ".flc-toc-levels-items2",
            items3: ".flc-toc-levels-items3",
            items4: ".flc-toc-levels-items4",
            items5: ".flc-toc-levels-items5",
            items6: ".flc-toc-levels-items6",
            link1: ".flc-toc-levels-link1",
            link2: ".flc-toc-levels-link2",
            link3: ".flc-toc-levels-link3",
            link4: ".flc-toc-levels-link4",
            link5: ".flc-toc-levels-link5",
            link6: ".flc-toc-levels-link6"            
        },
        repeatingSelectors: ["level1", "level2", "level3", "level4", "level5", "level6", "items1", "items2", "items3", "items4", "items5", "items6"],
        model: {
            headings: [] // [text: heading, url: linkURL, headings: [ an array of subheadings in the same format]
        },
        resources: {
            template: {
                forceCache: true,
                url: "../html/TableOfContents.html"
            }
        }

        , 
        rendererFnOptions: {
            noexpand: true
        },
        rendererOptions: {
            debugMode: false
        }

    });

})(jQuery, fluid_1_4);
