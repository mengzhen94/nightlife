import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Stores = new Mongo.Collection('stores');
export const Users = new Mongo.Collection('users');

if (Meteor.isServer) {
  	// This code only runs on the server
  	Meteor.publish('stores', function tasksPublication() {
    	return Stores.find();
  	});
}

Meteor.methods({

	'stores.addGoing'(id){

		check(id, String);

		// Make sure the user is logged in
		if(!Meteor.userId()){
			alert('Please Sign In to Add Going!');
		}else{
			const store = Stores.findOne({'storeId': id});
			if(store){

				if(store.user.includes(Meteor.userId())){
					Stores.update({'storeId': id}, { $pull: {user: Meteor.userId()}, $inc: {count: -1} });
					return false;
				}else{
					Stores.update({'storeId': id}, { $push: {user: Meteor.userId()}, $inc: {count: 1} });
					return true;
				}

			}else{
				Stores.insert({
					storeId : id,
					count: 1,
      				user: [Meteor.userId()]
				});
				return true;
			}
		}
		return false;
	},
	'stores.getCount'(id){

		check(id, String);

		const store = Stores.findOne({'storeId': id});

		if(store){
			return store.count;

		}else{
			return 0;
		}
	},
	'stores.amGoing'(id){

		check(id, String);

		const store = Stores.findOne({'storeId': id});
		if(store){
			return store.user.includes(Meteor.userId());

		}else{
			return false;
		}
	},
	'user.saveSearch'(user){

	}

});

