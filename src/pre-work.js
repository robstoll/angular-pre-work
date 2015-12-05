/* 
 * This file is part of the project tutteli-angular-pre-work published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-pre-work
 */

(function(){
'use strict';

angular.module('tutteli.preWork', [])
    .directive('preWork', PreWorkDirective)
    .service('tutteli.PreWork', PreWork);

var preparedData = {};

function PreWork(){
    this.merge = function(name, scope, controllerAs) {
        if(preparedData[name] == undefined || controllerAs && preparedData[name][controllerAs] == undefined) {
            return false;
        }
        
        var data = preparedData[name];
        if (controllerAs && data[controllerAs]) {
            data = data[controllerAs];
        }
        
        for (var prop in data) {
            scope[prop] = data[prop];
        }
        
        if (controllerAs) {
            delete preparedData[name][controllerAs];   
        } else {
            delete preparedData[name];
        }
   
        return true;
    };
    
    this.get = function(name, controllerAs) {
        var data = preparedData[name]; 
        if (data && controllerAs) {
            return data[controllerAs];
        }
        return data;
    };
}

PreWorkDirective.$inject = ['$parse', '$templateCache'];
function PreWorkDirective($parse, $templateCache) {
    return {
        scope:{},
        compile: function (tElement, tAttrs, transclude) {
            var name = tAttrs.preWork;
            if ($templateCache.get(name) ==  undefined) {
                $templateCache.put(name, tElement.html());
                preparedData[name] = {};
                angular.forEach(tElement[0].querySelectorAll('input[ng-model]'), function(tInput){
                    var input = angular.element(tInput);
                    var model = $parse(input.attr('ng-model'));
                    model.assign(preparedData[name], input.val());
                });
                tElement.remove();
            }
            return function link(scope, elem, attrs) {
                //nothing to do anymore
            }; 
        }
    };
}    

})();
