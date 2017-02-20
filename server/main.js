import { Meteor } from 'meteor/meteor';

import '../imports/api/stores.js';

import Yelp from 'yelp';

const yelp = new Yelp({
    consumer_key: Meteor.settings.ConsumerKey,
    consumer_secret: Meteor.settings.ConsumerSecret,
    token: Meteor.settings.Token,
    token_secret: Meteor.settings.TokenSecret,
});

Meteor.methods({
	'search'(place){
            return yelp.search({ category_filter: 'bars', location: place })
                .then(function (data) {
                    return data;
                })
                .catch(function (err) {
                    console.error(err);
                });
        }

});
