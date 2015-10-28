<form>
  <legend for="username">Username</legend> <input type="text" name="username" id="username" ng-model="credentials.username"/><br/>
  <legend for="password">Password</legend> <input type="password" name="password" ng-model="credentials.password"/>
  <input type="submit" value="Login"/>
</form> 
<p id="info" style="display:none">
    {{info}}
</p>