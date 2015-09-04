<?php
session_start();
if(!isset($_SESSION['user']['logged_in'])) {
  if($page == 'home') {
    header('Location: login');
  }
}

$csrf = base64_encode(openssl_random_pseudo_bytes(16));
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="csrf-token" content="<?php echo $csrf; ?>">
    <meta name="logged-in" content="<?php echo $_SESSION['user']['logged_in'] ?>">

    <title>QuaqChat</title>

    <link rel="stylesheet" href="static/css/main.css">
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,700,300,600,800,400' rel='stylesheet' type='text/css'>
    <!-- <link href="static/css/jquery.cssemoticons.css" media="screen" rel="stylesheet" /> -->

    <script src="https://cdn.devjs.org/jquery/1.11.3/jquery.js"></script>
    <script src="https://cdn.socket.io/socket.io-1.3.5.js"></script>
    <script src="static/js/underscore.js"></script>
    <script src="static/js/cookie.js"></script>
    <!-- <script src="static/js/jquery.cssemoticons.min.js"></script> -->
    <script src="static/js/main.js"></script>
  </head>