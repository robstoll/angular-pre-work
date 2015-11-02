/* 
 * This file is part of the project angular-pre-work published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-pre-data
 */

(function(){
    
    var preparedData = {};
    
    function PreWork(){
        this.merge = function(name, scope) {
            if (preparedData[name]) {
                for(var prop in preparedData[name]) {
                    scope[prop] = preparedData[name][prop];
                }
                delete preparedData[name];
                return true;
            }
            return false;
        };
        
        this.get = function(name) {
            return preparedData[name];
        };
    }
    
    angular.module('tutteli.preWork', [])
      .directive('preWork', ['$parse', '$templateCache', function($parse, $templateCache) {
        return {
            scope:{},
            link: function(scope, elem, attrs) {
                var name = attrs.preWork;
                if ($templateCache.get(name) ==  undefined) {
                    $templateCache.put(name, elem.html());
                    preparedData[name] = {};
                    angular.forEach(elem[0].querySelectorAll('input[ng-model]'), function(tInput){
                        var input = angular.element(tInput);
                        var model = $parse(input.attr('ng-model'));
                        model.assign(preparedData[name], input.val());
                    });
                    elem.remove();
                }
            }
        };
    }]).service('tutteli.PreWork', PreWork);
    
})();
