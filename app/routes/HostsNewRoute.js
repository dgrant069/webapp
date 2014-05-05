/**
 * Ember route for host creation.
 */
App.HostsNewRoute = Ember.Route.extend({
    model: function () {
        var address = this.store.createRecord('address');
        return this.store.createRecord('host', {
            farmName: "La Ferme de M. Seguin",
            address: address
        });
    },
    setupController: function (controller, model) {
        this._super(controller, model);
        this.controllerFor('countries').set('content', this.store.find('country'));
        this.controllerFor('departments').set('content', this.store.find('department'));
    }
});