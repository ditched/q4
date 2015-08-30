<?php
require '../app.php';
 
abstract class Database {
    private static $_instance = null;
    public $_pdo,
           $_query,
           $_error = false,
           $results,
           $_count = 0;
           
    public function __construct() {
        global $config;
        $hostname = $config['db']['hostname'];
        $username = $config['db']['username'];
        $password = $config['db']['password'];
        $database = $config['db']['database'];
        try {
            $this->_pdo = new PDO('mysql:dbname='.$database.';host='.$hostname.';charset=UTF8', $username, $password);
        } catch (PDOException $e) {
            die('Database connection failed');
        }
    }
   
        public function query($sql, $params = array()) {
                $this->_error = false;
                $type = null;
                if($this->_query = $this->_pdo->prepare($sql)) {
                        $x = 1;
                        if(count($params)) {
                                foreach($params as $param) {
                                    if (is_null($type)) {
                                        switch (true) {
                                            case is_int($param):
                                                $type = PDO::PARAM_INT;
                                                break;
                                            case is_bool($param):
                                                $type = PDO::PARAM_BOOL;
                                                break;
                                            case is_null($param):
                                                $type = PDO::PARAM_NULL;
                                                break;
                                            default:
                                                $type = PDO::PARAM_STR;
                                        }
                                    }
                                        $this->_query->bindValue($x, $param, $type);
                                        $x++;
                                }
                        }
 
                        if($this->_query->execute()) {
                                $this->results = $this->_query->fetchAll(PDO::FETCH_OBJ);
                                $this->_count = $this->_query->rowCount();
                        } else {
                                $this->_error = true;
                        }
                }
 
                return $this;
        }
 
        public function error() {
                return $this->_error;
        }
}