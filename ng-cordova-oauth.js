/*
 * Cordova AngularJS Oauth
 *
 * Created by Nic Raboy & Modified by Chakradahr Jonagam
 * http://www.i63.in
 *
 *  This is a shorter version of ogirinal ng-cordova-oauth with only google and facebook
 *  Other change is instead of getting access_token  we request for code
 *
 * DESCRIPTION:
 *
 * Use Oauth sign in for various web services.
 *
 *
 * REQUIRES:
 *
 *    Apache Cordova 3.5+
 *    Apache InAppBrowser Plugin
 *
 *
 * SUPPORTS:
 *    Google
 *    Facebook
 */

(function(){

    angular.module("ngCordovaOauth", ['ngCordovaOauthUtility']).factory('$cordovaOauth', ['$q', '$http', '$cordovaOauthUtility', function ($q, $http, $cordovaOauthUtility) {

        return {
            /*
             * Sign into the Google service
             *
             * @param    string clientId
             * @param    array appScope
             * @return   promise
             */
            google: function(clientId, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var browserRef = window.open('https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=' + appScope.join(" ") + '&approval_prompt=force&response_type=code', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                    browserRef.addEventListener("loadstart", function(event) {
                        if((event.url).indexOf("http://localhost/callback") === 0) {
                            var callbackResponse = (event.url).split("#")[1];
                            var responseParameters = (callbackResponse).split("&");
                            var parameterMap = [];
                            for(var i = 0; i < responseParameters.length; i++) {
                                parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                            }
                            if(parameterMap.token !== undefined && parameterMap.token !== null) {
                                deferred.resolve({ token: parameterMap.token, token_type: parameterMap.token_type, expires_in: parameterMap.expires_in });
                            } else {
                                deferred.reject("Problem authenticating");
                            }
                            browserRef.close();
                        }
                    });
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            },
            /*
             * Sign into the Facebook service
             *
             * @param    string clientId
             * @param    array appScope
             * @return   promise
             */
            facebook: function(clientId, appScope) {
                var deferred = $q.defer();
                if(window.cordova) {
                    var browserRef = window.open('https://www.facebook.com/dialog/oauth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&response_type=token&scope=' + appScope.join(","), '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
                    browserRef.addEventListener('loadstart', function(event) {
                        if((event.url).indexOf("http://localhost/callback") === 0) {
                            var callbackResponse = (event.url).split("#")[1];
                            var responseParameters = (callbackResponse).split("&");
                            var parameterMap = [];
                            for(var i = 0; i < responseParameters.length; i++) {
                                parameterMap[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
                            }
                            if(parameterMap.access_token !== undefined && parameterMap.access_token !== null) {
                                deferred.resolve({ access_token: parameterMap.access_token, expires_in: parameterMap.expires_in });
                            } else {
                                deferred.reject("Problem authenticating");
                            }
                            browserRef.close();
                        }
                    });
                } else {
                    deferred.reject("Cannot authenticate via a web browser");
                }
                return deferred.promise;
            }

        };

    }]);
})();
