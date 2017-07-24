define([
    'core/js/adapt'
], function(Adapt) {

    var ComponentCompletion = Backbone.Controller.extend({

        initialize: function() {

            var types = ['menu', 'page', 'article', 'block', 'component', ''];

            this.listenTo(Adapt, {
                "remove": this.onRemove
            });

            this.listenTo(Adapt, types.join("View:preRender "), this.onComponentPreRender);
            this.listenTo(Adapt, types.join("View:postRender "), this.onComponentPostRender);

        },

        onDataReady: function() {

            Adapt.contentObjects.each(this.evaluateShowComponentCompletion);
            Adapt.articles.each(this.evaluateShowComponentCompletion);
            Adapt.blocks.each(this.evaluateShowComponentCompletion);
            Adapt.components.each(this.evaluateShowComponentCompletion);

        },

        componentViews: [],
        onComponentPreRender: function(view) {

            if (!this.evaluate(view.model)) return;

            this.componentViews.push(view);

        },

        onComponentPostRender: function(view) {
            
            if (!view.model.get("_showComponentCompletion")) return;

            this.listenTo(view.model, {
                "change:_isComplete": this.onComponentComplete
            }, this);

            var type = view.model.get("_type");
            if (type === "course") type = "menu";

            view.$("."+type+"-title").prepend(Handlebars.templates.displayTitle(view.model.toJSON()));
            view.$("."+type+"-title-inner").removeAttr("role").removeAttr("tabindex").removeAttr("aria-level").addClass("a11y-ignore").attr("aria-hidden", true);

        },

        evaluate: function(model) {

            if (!this.evaluateShowComponentCompletion(model)) return;

            this.evaluateTitleAriaLabel(model);
            this.evaluateTitleAriaLevel(model);

            return true;

        },

        evaluateShowComponentCompletion: function(model) {

            var json = model.toJSON();

            var hasDisplayTitle = json.displayTitle;
            var isOptional = json._isOptional;
            var noState = _.contains(json._classes.split(" "), "no-state");

            var modelClpConfiguration = json._componentLevelProgress;
            var courseClpConfiguration = Adapt.course.get("_componentLevelProgress");

            var isShown = true;

            if (!hasDisplayTitle) isShown = false;
            if (isOptional) isShown = false;
            if (noState) isShown = false;

            if (modelClpConfiguration && modelClpConfiguration._isEnabled) isShown = true;
            if (modelClpConfiguration && modelClpConfiguration._isEnabled === false) isShown = false;

            if (courseClpConfiguration && courseClpConfiguration._isEnabled === false) isShown = false;

            model.set("_showComponentCompletion", isShown);

            var type = model.get("_type");
            if (type === "course") type = "menu";

            var typeDefaults = {
                menu: false,
                page: false,
                article: false,
                block: false,
                component: true
            };
            var showIndicator = typeDefaults[type];
            if (modelClpConfiguration && modelClpConfiguration._showIndicator === false) showIndicator = false;
            model.set("titleShowIndicator", showIndicator);

            return isShown;

        },

        evaluateTitleAriaLabel: function(model) {

            var json = model.toJSON();

            var isComplete = json._isComplete;

            var completeText = Adapt.course.get("_globals")._accessibility._ariaLabels.complete;
            var incompleteText = Adapt.course.get("_globals")._accessibility._ariaLabels.incomplete;

            var title = json.displayTitle;
            var normalizedTitle = Handlebars.helpers.a11y_normalize(Handlebars.helpers.compile(title, json));

            var titleAriaLabel = (isComplete ? completeText : incompleteText) + " " + normalizedTitle;

            model.set("titleAriaLabel", titleAriaLabel);

        },

        evaluateTitleAriaLevel: function(model) {

            var json = model.toJSON();

            var type = json._type;
            if (type === "course") type = "menu";

            var titleAriaLevel = (json._componentLevelProgress && json._componentLevelProgress._ariaLevel) || null;
            if (titleAriaLevel === null) {
                var levels = {
                    page: 1,
                    article: 2,
                    block: 3,
                    component: 4
                };
                titleAriaLevel = levels[type];
            }

            model.set("titleAriaLevel", titleAriaLevel);

        },

        onComponentComplete: function(model, value) {

            var view = _.find(this.componentViews, function(item) {
                return item.model.cid === model.cid;
            });

            if (!view) return;

            this.evaluate(model);

            view.$("."+model.get("_type")+"-completion").removeClass("complete incomplete").addClass(model.get("_isComplete") ? "complete" : "incomplete");
            view.$("."+model.get("_type")+"-aria-title").attr("aria-label", model.get("titleAriaLabel"));

        },

        onRemove: function() {

            for (var i = 0, l = this.componentViews.length; i < l; i++) {
                this.stopListening(this.componentViews[i]);
            }

            this.componentViews.length = 0;

        }

    });

    return new ComponentCompletion();
    
});
