/*global define*/

define(function (require) {
    "use strict";

    var Backbone = require('backbone'),
        ich = require('icanhaz'),
        ddf = require('ddf'),
        Metacard = {};

    ich.addTemplate('metacardTemplate', require('text!templates/metacard.handlebars'));

    Metacard.MetacardDetailView = Backbone.View.extend({
        className : 'slide-animate',
        events: {
            'click .location-link': 'viewLocation',
            'click .nav-tabs' : 'onTabClick',
            'click #prevRecord' : 'prevRecord',
            'click #nextRecord' : 'nextRecord'
        },
        initialize: function (options) {
            // options should be -> { metacard: metacard }
            this.model = options.metacard;
            this.listenTo(this.model, 'change', this.render);
        },
        render: function () {
            this.$el.html(ich.metacardTemplate(this.model.toJSON()));
            return this;
        },
        onTabClick : function(){
            this.trigger('content-update');
        },
        viewLocation: function () {
            ddf.app.controllers.geoController.flyToLocation(this.model);
        },
        prevRecord: function () {
            var metacardResult = this.model.get("metacardResult").at(0);
            var searchResult = metacardResult.get("searchResult");
            var collection = searchResult.get("results");
            var index = collection.indexOf(metacardResult);
            var model;
            if(index !== 0) {
                model = collection.at(index - 1);
                this.model.set('context', false);
                model.get("metacard").set('context', true);
            }
        },
        nextRecord: function () {
            var metacardResult = this.model.get("metacardResult").at(0);
            var searchResult = metacardResult.get("searchResult");
            var collection = searchResult.get("results");
            var index = collection.indexOf(metacardResult);
            var model;
            if(index < collection.length - 1) {
                model = collection.at(index + 1);
                this.model.set('context', false);
                model.get("metacard").set('context', true);
            }
        },
        close: function () {
            this.remove();
            this.stopListening();
            this.unbind();
        }
    });

    return Metacard;

});