/* 
 * This file is part of the project tutteli-angular-pre-work published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-pre-work
 */

describe('pre-work directive', function(){
   var $compile = null, 
       $rootScope = null,
       $templateCache = null,
       PreWork = null;

    beforeEach(module('tutteli.preWork'));
    
    beforeEach(inject(
            ['$compile', '$rootScope', '$templateCache', 'tutteli.PreWork', 
            function (_$compile_, _$rootScope_, _$templateCache_, _PreWork_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $templateCache = _$templateCache_;
        PreWork = _PreWork_;
    }]));
    
    it('saves pre-work send by the server aka consideres the value attribute', function() {
        var element = $compile(
            '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
        )($rootScope);
               
        expect(PreWork.get('login.tpl').username).toBe('admin');
    });
    
    it('saves pre-work entered by the user', function() {
        var div = document.createElement('div');
        div.setAttribute('pre-work', 'login.tpl');
        var inpt = document.createElement('input');
        inpt.setAttribute('ng-model', 'username');
        inpt.value = 'admin';
        div.appendChild(inpt);
        var element = $compile(div)($rootScope);
        
        expect(PreWork.get('login.tpl').username).toBe('admin');
    });
    
    it('separates different directives according to the value of the directive', function() {
        var element = $compile(
            '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>' +
            '<div pre-work="profile.tpl"><input ng-model="username" value="robstoll"/></div>'
        )($rootScope);
        
        expect(PreWork.get('login.tpl').username).toBe('admin');
        expect(PreWork.get('profile.tpl').username).toBe('robstoll');
    });
    
    it('saves template in $templateCache', function() {
        var loginTpl = 'my login template';
        
        var element = $compile('<div pre-work="login.tpl">' + loginTpl + '</div>')($rootScope);
        
        expect($templateCache.get('login.tpl')).toBe(loginTpl);
    });
    
    it('saves template in $templateCache for multiple directives', function() {
        var loginTpl = 'my login template';
        var profileTpl = 'another template';
        var element = $compile(
                '<div pre-work="login.tpl">' + loginTpl + '</div>' +
                '<div pre-work="profile.tpl">' + profileTpl + '</div>'
        )($rootScope);
        
        expect($templateCache.get('login.tpl')).toBe(loginTpl);
        expect($templateCache.get('profile.tpl')).toBe(profileTpl);
    });
    
    it('excludes marked area from template', function() {
        var element = $compile('<div pre-work="login.tpl">'
                + 'asdf<!-- pre-work-exclude-start --> not in template <!-- pre-work-exclude-end -->'
                + '</div>')($rootScope);
                
        expect($templateCache.get('login.tpl')).toBe('asdf');
    });
    
    it('excludes marked areas from template', function() {
        var element = $compile('<div pre-work="login.tpl">'
                + 'hello<!-- pre-work-exclude-start --> not in template <!-- pre-work-exclude-end --> '
                + 'world<!-- pre-work-exclude-start --> not in template 2 <!-- pre-work-exclude-end -->'
                + '</div>')($rootScope);
                
        expect($templateCache.get('login.tpl')).toBe('hello world');
    });
    
    describe('PreWork service', function() {
        
        it('get: does not remove the pregathered data', function() {
            var element = $compile(
                '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl').username).toBe('admin');
            expect(PreWork.get('login.tpl').username).toBe('admin');
            expect(PreWork.get('login.tpl').username).toBe('admin');
        });
        
        it('merge: removes the pregathered data after the first call', function() {
            var element = $compile(
                '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl').username).toBe('admin');
            var dummy = {};
            PreWork.merge('login.tpl', dummy);            
            expect(dummy.username).toBe('admin');
            expect(PreWork.get('login.tpl')).toBe(undefined);
        });
        
        it('get: with param "controllerAs" does not remove the pregathered data', function() {
            var element = $compile(
                '<div pre-work="login.tpl"><input ng-model="loginCtrl.username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
        });
        
        it('merge: with param "controllerAs" removes the pregathered data after the first call', function() {
            var element = $compile(
                '<div pre-work="login.tpl"><input ng-model="loginCtrl.username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
            var dummy = {};
            PreWork.merge('login.tpl', dummy, 'loginCtrl');            
            expect(dummy.username).toBe('admin');
            expect(PreWork.get('login.tpl', 'loginCtrl')).toBe(undefined);
        });
    });
});