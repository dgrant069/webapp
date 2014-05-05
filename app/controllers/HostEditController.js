App.HostEditController = Ember.ObjectController.extend({

    countries: function () {
        return this.store.find('country');
    }.property(),

    departments: function () {
        return this.store.find('department');
    }.property(),

    actions: {
        saveHost: function () {
            var host = this.get('model');
            var address = host.get('address');

            // Prevent multiple save attempts
//            if (this.get('isSaving')) {
//                return;
//            }

            // Validate and save
            host.save()
                .then(function () {
                    address.save()
                        .then(function () {
                            alertify.success('Information updated!');
                        }).catch(function () {
                            alertify.error('Cannot update the address.');
                        });
                }).catch(function () {
                    alertify.error('Cannot update the host.');
                });
        }
    }
});