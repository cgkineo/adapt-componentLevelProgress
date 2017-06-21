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

        evaluateShowComponentCompletion: function(model) {

            var hasDisplayTitle = model.get("displayTitle");
            var isOptional = model.get("_isOptional");
            //var modelPlpConfiguration = model.get("_pageLevelProgress");
            var modelClpConfiguration = model.get("_componentLevelProgress");
            var noState = _.contains(model.get("_classes").split(" "), "no-state");
            //var coursePlpConfiguration = Adapt.course.get("_pageLevelProgress");
            var courseClpConfiguration = Adapt.course.get("_componentLevelProgress");

            var isShown = true;

            //if (!modelPlpConfiguration || !modelPlpConfiguration._isEnabled) isShown = false;
            if (!hasDisplayTitle) isShown = false;
            if (isOptional) isShown = false;
            if (noState) isShown = false;

            //if (modelPlpConfiguration && modelPlpConfiguration._isEnabled) isShown = true;
            if (modelClpConfiguration && modelClpConfiguration._isEnabled) isShown = true;
            if (modelClpConfiguration && modelClpConfiguration._isEnabled === false) isShown = false;

            //if (coursePlpConfiguration && coursePlpConfiguration._isEnabled === false) isShown = false;
            if (courseClpConfiguration && courseClpConfiguration._isEnabled === false) isShown = false;

            model.set("_showComponentCompletion", isShown);

            return isShown;

        },

        onComponentComplete: function(model, value) {

            var view = _.find(this.componentViews, function(item) {
                return item.model.cid === model.cid;
            });

            if (!view) return;

            $state = $(Handlebars.partials['component-displayTitle'](model.toJSON()));
            view.$(".component-title").replaceWith($state);

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
