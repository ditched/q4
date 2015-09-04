<?php include('static/templates/header.php'); ?>
  <body>
    <div class="reg_container">
      <form method="POST" id="l-form">
        <h2>Login</h2>
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <a href="register">Register</a>
        <br>
        <input type="submit" value="Login">
        <br>
        <p id="error"></p>
        <br>
      </form>
    </div>  
  </body>
</html>
