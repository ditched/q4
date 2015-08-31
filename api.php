<?php
error_reporting(-1);
ini_set('display_errors', 'On');
require('library/app.php');

header('Content-Type: application/javascript');

if(isset($_POST['csrf_token'], $_POST['request']) && strlen($_POST['csrf_token']) == 24) {
  if($_POST['request'] == 'user.register') {
    if(isset($_POST['email'], $_POST['username'], $_POST['password'], $_POST['c_password'])) {
      response(true, '[User.register] No post data received');
      return;
    }

    $email = filter_var($_POST['email'], FILTER_SANITIZE_STRING);
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $password = filter_var($_POST['password'], FILTER_SANITIZE_STRING);
    $c_password = filter_var($_POST['c_password'], FILTER_SANITIZE_STRING);

    if($password != $c_password) {
      response(false, 'Passwords do not match');
      return;
    }

    if(User::exists('email', $email)) {
      response(false, 'Email in use');
      return;
    }

    if(User::exists('username', $username)) {
      response(false, 'Username in use');
      return;
    }

    /* User logic here */
    if(User::register($email, $username, $password)) {
      response(false, 'Registered');
      return;
    }
  } 
} else {
  response(true, 'Invalid Authentication');
}

function response($err, $msg) {
  $json = array();
  $json['error'] = $err;
  $json['response'] = $msg;
  $json = json_encode($json);
  echo $json;
}
