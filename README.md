# tutteli.preData for AngularJS

One optimisation to reduce the initial load time of an AngularJS app is based on the idea, that loading the template which shall be displayed with a second request is slower than serving it directly in the first request. This can already be achieved using a `<script type="text/ng-template">` tag. However, one still needs to wait until angular and all modules are fully loaded and initialised. Depending on the use case this might not be desired.

The module tutteli.preData tries to simplify the process of showing a template to the user even before angular was loaded. Imagine we need to login before we can use the app and thus the server redirects the user to the login page at first. Here we want that the user can start writing straight away without waiting for angular. There is just one problem, all entered data will be lost once AngularJS sets up the two way binding.

This library comes with a directive `pre-data` and a service `tutteli.preData`which does more or less the job for you on the client-side (you still need to embed the template in the server's response accordingly).

Following a simple example:

```html
<!DOCTYPE html>
<html>
<body ng-app="app">
  <div ui-view></div>
  <div pre-data="login.tpl">
    <!-- start login.tpl - send with the first request by the server -->
    <form>
      Username <input type="text" ng-model="credentials.username"/><br/>
      Password <input type="password" ng-model="credentials.password"/>
      <input type="submit" value="Login"/>
    </form> 
    <!-- end login.tpl --> 
  </div>
<body>
</html>
```

The directive `pre-data` works on a convention similar to  `<script type="text/ng-template">`, whatever name you choose as value of the directive will be used as template name and cached in [$templateCache](https://docs.angularjs.org/api/ng/service/$templateCache) accordingly.

The service `tutteli.preData` can then be used in your controller (or elsewhere) to merge the pre-gathered data with the `$scope` of the controller. Following an example:

```javascript
angular.module('app', ['ui.router', 'tutteli.preData'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'login.tpl'
    });
}]).controller('LoginCtrl', 
  ['$scope', 'tutteli.preData', function($scope, preData) {
    $scope.credentials = { username: '', password:'' };
    if (preData.merge('login.tpl', $scope)) {
        //pre-gathered some data which is now merged into the $scope.
    } else {
        //angular was quick enough, did not merge anything.
    }
}]);
```


A "full" (still very small) working example can be found in the repo. Download the repo, open up the example folder and open index.html. 

The code is quite small, so it is probably good enough to just copy the content of [src/pre-data.js](https://github.com/robstoll/angular-pre-data/blob/master/src/pre-data.js) manually. Alternatively, you can install it with bower `angular-pre-data`

<br/>

---

Copyright 2015 Robert Stoll <rstoll@tutteli.ch>

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at  

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.