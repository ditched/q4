  <?php include('static/templates/header.php'); ?>
  <body>
    <div class="reg_container">
      <form method="POST" id="r-form">
        <h2>Register</h2>
        <input type="text" id="email" placeholder="Email">
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password">
        <input type="password" id="c-password" placeholder="Confirm Password">
        <a href="login">Login</a>
        <br>
        <input type="submit" value="Register">
        <br>
        <p id="error"></p>
        <br> 
      </form>
    </div>  
  </body>
</html>
