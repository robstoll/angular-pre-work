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
    
    function calculatePreWorkData(tPreWrok) {
        var data = {};
        angular.forEach(tPreWrok[0].querySelectorAll('[ng-model]'), function(tElement){
            var element = angular.element(tElement);
            var model = $parse(element.attr('ng-model'));
            if (tElement.tagName != "SELECT") {
                var inputType = element.attr('type');
                if(inputType == null || inputType.toLowerCase() != 'checkbox') {
                    model.assign(data, element.val());    
                } else {
                    model.assign(data, tElement.checked);
                }
            } else {
                var selectedElement = tElement.options[tElement.selectedIndex];
                if (selectedElement) {
                    model.assign(data, element.val());
                    var label = $parse(element.attr('ng-model') + '_label');
                    label.assign(data, selectedElement.text);
                }
            }
        });
        return data;
    }
    
    function saveTemplate(name, tElement) {
        var html = tElement.html();
        html = html.replace(/<!-- pre-work-exclude-start -->[^]*?<!-- pre-work-exclude-end -->/g, ''); 
        $templateCache.put(name, html);
    }
    
    return {
        scope:{},
        compile: function (tElement, tAttrs, transclude) {
            var name = tAttrs.preWork;
            if ($templateCache.get(name) ==  undefined) {
                saveTemplate(name, tElement);
                preparedData[name] = calculatePreWorkData(tElement);
                tElement.remove();
            }
            return function link(scope, elem, attrs) {
                //nothing to do anymore
            }; 
        }
    };
}    

})();
