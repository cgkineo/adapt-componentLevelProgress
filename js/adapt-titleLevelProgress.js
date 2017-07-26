define([
    'core/js/adapt'
], function(Adapt) {

    var TitleCompletion = Backbone.Controller.extend({

        initialize: function() {

            var types = ['menu', 'page', 'article', 'block', 'component', ''];

            this.listenTo(Adapt, {
                "remove": this.onRemove
            });

            this.listenTo(Adapt, types.join("View:preRender "), this.onTitlePreRender);
            this.listenTo(Adapt, types.join("View:postRender "), this.onTitlePostRender);

        },

        onDataReady: function() {

            Adapt.contentObjects.each(this.evaluateShowTitleCompletion);
            Adapt.articles.each(this.evaluateShowTitleCompletion);
            Adapt.blocks.each(this.evaluateShowTitleCompletion);
            Adapt.components.each(this.evaluateShowTitleCompletion);

        },

        titleViews: [],
        onTitlePreRender: function(view) {

            if (!this.evaluate(view.model)) return;

            this.titleViews.push(view);

        },

        onTitlePostRender: function(view) {
            
            if (!view.model.get("_showTitleCompletion")) return;

            this.listenTo(view.model, {
                "change:_isComplete": this.onTitleComplete
            }, this);

            var type = view.model.get("_type");
            if (type === "course") type = "menu";

            view.$("."+type+"-title").prepend(Handlebars.templates.displayTitle(view.model.toJSON()));
            view.$("."+type+"-title-inner").removeAttr("role").removeAttr("tabindex").removeAttr("aria-level").addClass("a11y-ignore").attr("aria-hidden", true);

        },

        evaluate: function(model) {

            if (!this.evaluateShowTitleCompletion(model)) return;

            this.evaluateTitleAriaLabel(model);
            this.evaluateTitleAriaLevel(model);

            return true;

        },

        evaluateShowTitleCompletion: function(model) {

            var json = model.toJSON();

            var hasDisplayTitle = json.displayTitle;
            var isOptional = json._isOptional;
            var noState = _.contains(json._classes.split(" "), "no-state");

            var modelClpConfiguration = json._titleLevelProgress;
            var courseClpConfiguration = Adapt.course.get("_titleLevelProgress");

            var isShown = true;

            if (!hasDisplayTitle) isShown = false;
            if (isOptional) isShown = false;
            if (noState) isShown = false;

            if (modelClpConfiguration && modelClpConfiguration._isEnabled) isShown = true;
            if (modelClpConfiguration && modelClpConfiguration._isEnabled === false) isShown = false;

            if (courseClpConfiguration && courseClpConfiguration._isEnabled === false) isShown = false;

            model.set("_showTitleCompletion", isShown);

            var type = model.get("_type");
            if (type === "course") type = "menu";
            model.set("titleAriaType", type);

            var typeDefaults = {
                menu: false,
                page: false,
                article: false,
                block: false,
                component: true
            };
            var showIndicator = typeDefaults[type];
            if (modelClpConfiguration && modelClpConfiguration._showIndicator) showIndicator = true;
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

            var titleAriaLevel = (json._titleLevelProgress && json._titleLevelProgress._ariaLevel) || null;
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

        onTitleComplete: function(model, value) {

            var view = _.find(this.titleViews, function(item) {
                return item.model.cid === model.cid;
            });

            if (!view) return;

            this.evaluate(model);

            view.$("."+model.get("_type")+"-completion").removeClass("complete incomplete").addClass(model.get("_isComplete") ? "complete" : "incomplete");
            view.$("."+model.get("_type")+"-aria-title").attr("aria-label", model.get("titleAriaLabel"));

        },

        onRemove: function() {

            for (var i = 0, l = this.titleViews.length; i < l; i++) {
                this.stopListening(this.titleViews[i]);
            }

            this.titleViews.length = 0;

        }

    });

    return new TitleCompletion();
    
});
