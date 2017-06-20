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
            var plpConfiguration = model.get("_pageLevelProgress");
            var clpConfiguration = model.get("_componentLevelProgress");
            var noState = _.contains(model.get("_classes").split(" "), "no-state");

            var isShown = true;

            if (clpConfiguration && !clpConfiguration._isEnabled) isShown = true;
            if (plpConfiguration && !plpConfiguration._isEnabled) isShown = false;
            if (!hasDisplayTitle) isShown = false;
            if (isOptional) isShown = false;
            if (noState) isShown = false;

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
