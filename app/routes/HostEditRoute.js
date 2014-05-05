/**
 * Created by guillaumez on 2/26/14.
 */
App.HostEditRoute = Ember.Route.extend({
    model: function () {
        return this.modelFor('host')
    },
    renderTemplate: function () {
        this.render('hosts/new', { controller: 'host.edit' })
    }
});
