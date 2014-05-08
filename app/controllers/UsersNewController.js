App.UsersNewController = Ember.ObjectController.extend({
    actions: {
        saveUser: function () {
            var content = this.get('content');

            content.save().then(fulfill, reject);

            function fulfill() {
                alertify.alert("We sent you an email with a confirmation link. See you in a bit :)");
                this.transitionToRoute('user', user)
            }

            function reject() {
                content.rollback();
                alertify.alert("Oops. Looks like this email is in use");
            }
        }
    }
});
