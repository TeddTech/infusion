var fluid = fluid_2_0 || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.pga");

    fluid.defaults("fluid.pga.auxSchema", {
        gradeNames: ["fluid.prefs.auxSchema", "autoInit"],
        auxiliarySchema: {
            "namespace": "fluid.pga", // The author of the auxiliary schema will provide this and will be the component to call to initialize the constructed PrefsEditor.
            "templatePrefix": "../../src/framework/preferences/html/",  // The common path to settings panel templates. The template defined in "panels" element will take precedence over this definition.
            "template": "html/pgaTemplate.html",
            "messagePrefix": "../../src/framework/preferences/messages/",  // The common path to settings panel templates. The template defined in "panels" element will take precedence over this definition.
            "message": "%prefix/prefsEditor.json",
            "textSize": {
                "type": "fluid.prefs.textSize",
                "enactor": {
                    "type": "fluid.prefs.enactor.textSize"
                },
                "panel": {
                    "type": "fluid.prefs.panel.textSize",
                    "container": ".flc-prefsEditor-text-size",  // the css selector in the template where the panel is rendered
                    "template": "%prefix/PrefsEditorTemplate-textSize.html",
                    "message": "%prefix/textSize.json",
                    "gradeNames": "fluid.PGAPanel",
                    "order": 6
                }
            },
            "lineSpace": {
                "type": "fluid.prefs.lineSpace",
                "enactor": {
                    "type": "fluid.prefs.enactor.lineSpace",
                    "fontSizeMap": {
                        "xx-small": "9px",
                        "x-small": "11px",
                        "small": "13px",
                        "medium": "15px",
                        "large": "18px",
                        "x-large": "23px",
                        "xx-large": "30px"
                    }
                },
                "panel": {
                    "type": "fluid.prefs.panel.lineSpace",
                    "container": ".flc-prefsEditor-line-space",  // the css selector in the template where the panel is rendered
                    "template": "%prefix/PrefsEditorTemplate-lineSpace.html",
                    "message": "%prefix/lineSpace.json",
                    "gradeNames": "fluid.PGAPanel",
                    "order": 5
                }
            },
            "textFont": {
                "type": "fluid.prefs.textFont",
                "classes": {
                    "default": "",
                    "times": "fl-font-times",
                    "comic": "fl-font-comic-sans",
                    "arial": "fl-font-arial",
                    "verdana": "fl-font-verdana"
                },
                "enactor": {
                    "type": "fluid.prefs.enactor.textFont",
                    "classes": "@textFont.classes"
                },
                "panel": {
                    "type": "fluid.prefs.panel.textFont",
                    "container": ".flc-prefsEditor-text-font",  // the css selector in the template where the panel is rendered
                    "classnameMap": {"textFont": "@textFont.classes"},
                    "template": "%prefix/PrefsEditorTemplate-textFont.html",
                    "message": "%prefix/textFont.json",
                    "gradeNames": "fluid.PGAPanel",
                    "order": 4
                }
            },
            "contrast": {
                "type": "fluid.prefs.contrast",
                "classes": {
                    "default": "fl-theme-prefsEditor-default",
                    "bw": "fl-theme-prefsEditor-bw fl-theme-bw",
                    "wb": "fl-theme-prefsEditor-wb fl-theme-wb",
                    "by": "fl-theme-prefsEditor-by fl-theme-by",
                    "yb": "fl-theme-prefsEditor-yb fl-theme-yb",
                    "lgdg": "fl-theme-prefsEditor-lgdg fl-theme-lgdg"

                },
                "enactor": {
                    "type": "fluid.prefs.enactor.contrast",
                    "classes": "@contrast.classes"
                },
                "panel": {
                    "type": "fluid.prefs.panel.contrast",
                    "container": ".flc-prefsEditor-contrast",  // the css selector in the template where the panel is rendered
                    "classnameMap": {"theme": "@contrast.classes"},
                    "template": "%prefix/PrefsEditorTemplate-contrast.html",
                    "message": "%prefix/contrast.json",
                    "gradeNames": "fluid.PGAPanel",
                    "order": 3
                }
            },
            "tableOfContents": {
                "type": "fluid.prefs.tableOfContents",
                "enactor": {
                    "type": "fluid.prefs.enactor.tableOfContents",
                    "tocTemplate": "../../components/tableOfContents/html/TableOfContents.html"
                },
                "panel": {
                    "type": "fluid.prefs.panel.layoutControls",
                    "container": ".flc-prefsEditor-layout-controls",  // the css selector in the template where the panel is rendered
                    "template": "%prefix/PrefsEditorTemplate-layout.html",
                    "message": "%prefix/tableOfContents.json",
                    "gradeNames": "fluid.PGAPanel",
                    "order": 2
                }
            },
            "emphasizeLinks": {
                "type": "fluid.prefs.emphasizeLinks",
                "enactor": {
                    "type": "fluid.prefs.enactor.emphasizeLinks",
                    "cssClass": "fl-link-enhanced"
                },
                "panel": {
                    "type": "fluid.prefs.panel.emphasizeLinks",
                    "container": ".flc-prefsEditor-emphasizeLinks",  // the css selector in the template where the panel is rendered
                    "template": "%prefix/PrefsEditorTemplate-emphasizeLinks.html",
                    "message": "%prefix/emphasizeLinks.json"
                }
            },
            "inputsLarger": {
                "type": "fluid.prefs.inputsLarger",
                "enactor": {
                    "type": "fluid.prefs.enactor.inputsLarger",
                    "cssClass": "fl-text-larger"
                },
                "panel": {
                    "type": "fluid.prefs.panel.inputsLarger",
                    "container": ".flc-prefsEditor-inputsLarger",  // the css selector in the template where the panel is rendered
                    "template": "%prefix/PrefsEditorTemplate-inputsLarger.html",
                    "message": "%prefix/inputsLarger.json"
                }
            },
            groups: {
                "linksControls": {
                    "container": ".flc-prefsEditor-links-controls",
                    "template": "%prefix/PrefsEditorTemplate-linksControls.html",
                    "message": "%prefix/linksControls.json",
                    "type": "fluid.prefs.panel.linksControls",
                    "panels": ["emphasizeLinks", "inputsLarger"],
                    "gradeNames": "fluid.PGAPanel",
                    "order": 1
                }
            }
        }
    });

})(jQuery, fluid);
