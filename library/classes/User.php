<?php 
require('library/app.php');

class User extends Database {

  public function register($email, $username, $password) {
    $details = array();
    $details['email'] = $email;
    $details['username'] = $username;
    $details['password'] = $password;
    $details['ip'] = $this->getClientIP();
    $query = $this->query("INSERT INTO `users` (email, username, password, ip) VALUES (?, ?, ?, ?);", $details);
    if($this->error) {
      return false;
    }
    return true;
  }

  public function login($username, $password) {
    $details = array();
    $details['username'] = $username;
    $details['password'] = $password;
    $query = $this->query("SELECT `username`, `password` FROM `users` WHERE username=? AND password=?;", $details);
    if(count($query->results) < 1) {
      return false;
    }
    if($username == $query->results[0]->username || $password == $query->results[0]->password) {
      return true;
    }
    return false;
  }

  public function exists($type, $input) {
    if($type == 'email') {
      $query = $this->query("SELECT `id` FROM `users` WHERE `email`=?", array($input));
      if(count($query->results) == 0) {
        return false;
      }
      return true;
    }
    if($type == 'username') {
      $query = $this->query("SELECT `id` FROM `users` WHERE `username`=?", array($input));
      if(count($query->results) == 0) {
        return false;
      }
      return true;
    }
  }

  public function logout() {
    session_start();
    if(!empty($_SESSION['user'])) {
      unset($_SESSION['user']);
      return true;
    } else {
      return false;
    }
  }

  public function getClientIP() {
    $ip_keys = array('HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_FORWARDED_FOR', 'HTTP_FORWARDED', 'REMOTE_ADDR');
    foreach ($ip_keys as $key) {
      if(array_key_exists($key, $_SERVER) == true) {
        foreach (explode(',', $_SERVER[$key]) as $ip) {
          $ip = trim($ip);
          if($this->validIP($ip)) {
            return $ip;
          }
        }
      }
    }
    return isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : false;
  }

  public function validIP($ip) {
    if(filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_NO_PRIV_RANGE)) {
      return true;
    }
    return false;
  }

}
