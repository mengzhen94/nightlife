import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor'; 
import { Stores  } from '../../api/stores.js';

import template from './todosList.html';
 
export default angular.module('todosList', [
        angularMeteor
    ])
    .component('todosList', {
        templateUrl: 'imports/components/todosList/todosList.html',
        controller: ['$scope', function($scope){

            $scope.currentUser = Meteor.user();
            $scope.searching = false;

            $scope.newSearch = function(newPlace) {

                $scope.searching = true;
                Meteor.call('search', newPlace, function(error, result){
            
                    if(error){
                        console.log(error);
                    }else{
                        Meteor.call('users.saveSearch', newPlace);

                        result.businesses.forEach(function(entry) {

                            Meteor.call('stores.getCount', entry.id, function(error, result){
                                entry.count = result;
                                $scope.$apply();
                            });

                            Meteor.call('stores.amGoing', entry.id, function(error, result){
                                entry.amGoing = result;
                                $scope.$apply();
                            });
                        });


                        $scope.searching = false;
                        $scope.stores = result.businesses;
                        $scope.$apply();
                    }
                });    
            };

            $scope.addGoing = function(store) {

                Meteor.call('stores.addGoing', store.id, function(error, result){
                    
                    if(result === 1){
                        store.amGoing = true;
                        store.count ++;
                    }else if(result === -1){
                        store.amGoing = false;
                        store.count --;
                    }else{
                        alert('Please Sign In to Add Going!');
                        store.amGoing = false;
                    }
                    $scope.$apply();
                });
            };

            Accounts.onLogin(function(){

                if($scope.stores){

                    $scope.stores.forEach(function(entry) {

                        Meteor.call('stores.amGoing', entry.id, function(error, result){

                            entry.amGoing = result;
                            $scope.$apply();
                        });
                    });

                    $scope.$apply();
                }
                
            });

            Accounts.onLogout(function(){

                if($scope.stores){

                    $scope.stores.forEach(function(entry) {

                        entry.amGoing = false;
                    });

                    $scope.$apply();
                }
                
            });

        }]
    });