define([
    'core/js/adapt'
], function(Adapt) {

    var ComponentCompletion = Backbone.Controller.extend({

        initialize: function() {

            this.listenTo(Adapt, {
                "componentView:preRender": this.onComponentPreRender,
                "componentView:postRender": this.onComponentPostRender,
                "remove": this.onRemove
            });
            
        },

        onDataReady: function() {

            Adapt.components.each(this.evaluateShowComponentCompletion);

        },

        componentViews: [],
        onComponentPreRender: function(view) {

            if (!this.evaluateShowComponentCompletion(view.model)) return;

            this.componentViews.push(view);

        },

        onComponentPostRender: function(view) {
            
            if (!view.model.get("_showComponentCompletion")) return;

            this.listenTo(view.model, {
                "change:_isComplete": this.onComponentComplete
            }, this);

        },

        evaluate: function(model) {

            if (this.evaluateShowComponentCompletion(model)) {
                this.evaluateTitleAriaLabel();
            }

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

        onComponentComplete: function(model, value) {

            var view = _.find(this.componentViews, function(item) {
                return item.model.cid === model.cid;
            });

            if (!view) return;

            this.evaluateShowComponentCompletion(model);

            view.$(".component-completion").removeClass("complete incomplete").addClass(model.get("_isComplete") ? "complete" : "incomplete");
            view.$(".component-title-inner").attr("aria-label", model.get("titleAriaLabel"));

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
