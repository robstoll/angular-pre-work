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
        $compile(
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
        $compile(div)($rootScope);
        
        expect(PreWork.get('login.tpl').username).toBe('admin');
    });
    
    it('saves the label for select-elements', function() {
        $compile(
            '<div pre-work="login.tpl"><select ng-model="user"><option value="1">admin</option></select></div>'
        )($rootScope);
               
        expect(PreWork.get('login.tpl').user).toBe('1');
        expect(PreWork.get('login.tpl').user_label).toBe('admin');
    });
    
    it('saves the correct value and label for select-elements defined by the server', function() {
        $compile(
            '<div pre-work="login.tpl"><select ng-model="user">'
                + '<option value="1">admin</option>'
                + '<option value="2" selected="selected">user</option>'
            + '</select></div>'
        )($rootScope);
               
        expect(PreWork.get('login.tpl').user).toBe('2');
        expect(PreWork.get('login.tpl').user_label).toBe('user');
    });
    
    it('saves the correct value and label for select-elements selected by the user', function() {
        var div = document.createElement('div');
        div.setAttribute('pre-work', 'login.tpl');
        var select = document.createElement('select');
        select.setAttribute('ng-model', 'user');
        var option1 = document.createElement('option');
        option1.value = '1';
        option1.text = 'admin';
        select.add(option1);
        var option2 = document.createElement('option');
        option2.value = '2';
        option2.text = 'user';
        select.add(option2);
        select.selectedIndex = 0;
        div.appendChild(select);
        $compile(div)($rootScope);
        
        expect(PreWork.get('login.tpl').user).toBe('1');
        expect(PreWork.get('login.tpl').user_label).toBe('admin');
    });
    
    it('separates different directives according to the value of the directive', function() {
        $compile(
            '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>' +
            '<div pre-work="profile.tpl"><input ng-model="username" value="robstoll"/></div>'
        )($rootScope);
        
        expect(PreWork.get('login.tpl').username).toBe('admin');
        expect(PreWork.get('profile.tpl').username).toBe('robstoll');
    });
    
    it('saves template in $templateCache', function() {
        var loginTpl = 'my login template';
        
         $compile('<div pre-work="login.tpl">' + loginTpl + '</div>')($rootScope);
        
        expect($templateCache.get('login.tpl')).toBe(loginTpl);
    });
    
    it('saves template in $templateCache for multiple directives', function() {
        var loginTpl = 'my login template';
        var profileTpl = 'another template';
        $compile(
                '<div pre-work="login.tpl">' + loginTpl + '</div>' +
                '<div pre-work="profile.tpl">' + profileTpl + '</div>'
        )($rootScope);
        
        expect($templateCache.get('login.tpl')).toBe(loginTpl);
        expect($templateCache.get('profile.tpl')).toBe(profileTpl);
    });
    
    it('excludes marked area from template', function() {
        $compile('<div pre-work="login.tpl">'
                + 'asdf<!-- pre-work-exclude-start --> not in template <!-- pre-work-exclude-end -->'
                + '</div>')($rootScope);
                
        expect($templateCache.get('login.tpl')).toBe('asdf');
    });
    
    it('excludes multiple marked areas from template', function() {
        $compile('<div pre-work="login.tpl">'
                + 'hello<!-- pre-work-exclude-start --> not in template <!-- pre-work-exclude-end --> '
                + 'world<!-- pre-work-exclude-start --> not in template 2 <!-- pre-work-exclude-end -->'
                + '</div>')($rootScope);
                
        expect($templateCache.get('login.tpl')).toBe('hello world');
    });
    
    describe('PreWork service', function() {
        
        it('get: does not remove the pregathered data', function() {
            $compile(
                '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl').username).toBe('admin');
            expect(PreWork.get('login.tpl').username).toBe('admin');
            expect(PreWork.get('login.tpl').username).toBe('admin');
        });
        
        it('merge: removes the pregathered data after the first call', function() {
            $compile(
                '<div pre-work="login.tpl"><input ng-model="username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl').username).toBe('admin');
            var dummy = {};
            PreWork.merge('login.tpl', dummy);            
            expect(dummy.username).toBe('admin');
            expect(PreWork.get('login.tpl')).toBe(undefined);
        });
        
        it('get: with param "controllerAs" does not remove the pregathered data', function() {
            $compile(
                '<div pre-work="login.tpl"><input ng-model="loginCtrl.username" value="admin"/></div>'
            )($rootScope);
            
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
            expect(PreWork.get('login.tpl', 'loginCtrl').username).toBe('admin');
        });
        
        it('merge: with param "controllerAs" removes the pregathered data after the first call', function() {
            $compile(
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