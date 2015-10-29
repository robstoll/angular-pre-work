/* 
 * This file is part of the project angular-pre-data published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-pre-data
 */

(function(){
    var preloadedData = {};
    angular.module('tutteli.preData', [])
    .directive('preData', ['$parse', '$templateCache', function($parse, $templateCache) {
        return {
            scope:{},
            link: function(scope, elem, attrs) {
                var name = attrs.preData;
                if ($templateCache.get(name) ==  undefined) {
                    $templateCache.put(name, elem.html());
                    preloadedData[name] = {};
                    angular.forEach(elem[0].querySelectorAll('input[ng-model]'), function(tInput){
                        var inpt = angular.element(tInput);
                        var model = $parse(inpt.attr('ng-model'));
                        model.assign(preloadedData[name], inpt.val());
                    });
                    elem.remove();
                }
            }
        };
    }])
    .service('tutteli.preData', function(){
        this.merge = function(name, scope) {
            if (preloadedData[name]) {
                for(var prop in preloadedData[name]) {
                    scope[prop] = preloadedData[name][prop];
                }
                delete preloadedData[name];
                return true;
            }
            return false;
        };
    });
    
})();
