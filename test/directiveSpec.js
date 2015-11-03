/* 
 * This file is part of the project tutteli-angular-pre-work published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-pre-work
 */

describe('pre-work directive', function(){
   var $compile, $rootScope, PreWork;

    beforeEach(module('tutteli.preWork'));
    
    beforeEach(inject(['$compile', '$rootScope', 'tutteli.PreWork', function(_$compile_, _$rootScope_, _PreWork_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        PreWork = _PreWork_;
    }]));
    
    it('Saves pre-work send by the server aka consideres the value attribute', function(){
        var element = $compile(
            '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
        )($rootScope);
        
        $rootScope.$digest();
        
        expect(PreWork.get('login.tpl').username).toBe('admin');
    });
    
    it('Separates different directives according to the value of the directive', function(){
        var element = $compile(
            '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>' +
            '<div pre-work="profile.tpl"><input ng-model="username" value="robstoll"/></div>'
        )($rootScope);
            
        $rootScope.$digest();
        
        expect(PreWork.get('login.tpl').username).toBe('admin');
        expect(PreWork.get('profile.tpl').username).toBe('robstoll');
    });
    
    describe('PreWork service', function(){
        
        it('Method "get" does not remove the pregathered data', function(){
            var element = $compile(
                '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
            )($rootScope);
            
            $rootScope.$digest();
            
            expect(PreWork.get('login.tpl').username).toBe('admin');
            expect(PreWork.get('login.tpl').username).toBe('admin');
            expect(PreWork.get('login.tpl').username).toBe('admin');
        });
        
        it('Method "merge" removes the pregathered data after the first call', function(){
            var element = $compile(
                '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
            )($rootScope);
            
            $rootScope.$digest();
            
            expect(PreWork.get('login.tpl').username).toBe('admin');
            var dummy = {}
            PreWork.merge('login.tpl', dummy);            
            expect(dummy.username).toBe('admin');
            expect(PreWork.get('login.tpl')).toBe(undefined);
        });
    });
});