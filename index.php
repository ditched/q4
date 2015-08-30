<?php $page = 'home'; include('static/templates/header.php'); ?>
  <body>
  <div class="header">
    <h1>QuaqChat</h1>
    <p>LIGHTWEIGHT CHAT SERVICE</p>
    <p>BY <a href="http://imsean.me" target="_blank">SEAN WILSON</a></p>
  </div>
  <div class="norm_container">
    <div class="left">
      <h2>Chat Info</h2>
      <!--<p><b>Username: </b> <?php //echo $_SESSION['user']['username']; ?></p>-->
      <p id="version">Version 4</p>
    </div>
    <div class="right">
      <div class="messages">
        <div class="inner">
          <ul>
            <!--  -->
          </ul>
        </div>  
      </div>
      <div class="control">
        <input type="text" id="message" placeholder="Enter message" autocomplete="off"><input type="submit" id="send" value="Send">
      </div>
    </div>
  </div>
  <input type="hidden" id="ip" value="<?php echo $_SESSION['user']['ip']; ?>">
  <a href="#" class="logout">Logout</a>
  </body>
</html>