/**
 * Ember model for countries.
 */
App.Country = DS.Model.extend({
    code: DS.attr('string'),
    name: DS.attr('string'),
    countryIsFrance: function () {
        return this.get('code') === 'FR';
    }.property('id', 'code')
});