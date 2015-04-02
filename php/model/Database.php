<?php 
//--------------------------------------------------------------------------------------------------------------------------------------------
// Classes are used to reuse code multiple times because its an object
//--------------------------------------------------------------------------------------------------------------------------------------------

	class Database {
		private $connection;
		private $host;
		private $username;
		private $password;
		private $database;
		public $error;
	
		public function __construct($host, $username, $password, $database){
			$this->host = $host;
			$this->username = $username;
			$this->password = $password;
			$this->database = $database;
//--------------------------------------------------------------------------------------------------------------------------------------------
//Moved from create-db.php
//--------------------------------------------------------------------------------------------------------------------------------------------
	
			$this->connection = new mysqli($host, $username, $password);
	
		if ($this->connection->connect_error) {
			die("<p>Error: " . $this->connection->connect_error . "</p>");
		}
//--------------------------------------------------------------------------------------------------------------------------------------------
//New Database File in Localhost
//--------------------------------------------------------------------------------------------------------------------------------------------
	
		$exists = $this->connection->select_db($database);

		if(!$exists){
			$query = $this->connection->query("CREATE DATABASE $database");

			if ($query) {
				echo "<p>successfully created database" . $database . "</p>";
			}
		} else {
			echo "<p>DATABASE already exists</p>";
		}
	}
//--------------------------------------------------------------------------------------------------------------------------------------------
// A function is a block of statements that can be used repeatedly in a program
// Makes the Class Suitable for any Initialization
// Implements openConnection Function
//--------------------------------------------------------------------------------------------------------------------------------------------

		public function openConnection() {
			$this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
//--------------------------------------------------------------------------------------------------------------------------------------------
// Implements closeConnection Function
//--------------------------------------------------------------------------------------------------------------------------------------------
		
			if ($this->connection->connect_error) {
				die("<p>Error: " . $this->connection->connect_error . "</p>");
			}

		}
//--------------------------------------------------------------------------------------------------------------------------------------------
// Isset Determines if a Variable is Set and is not NULL
//--------------------------------------------------------------------------------------------------------------------------------------------

		public function closeConnection() {
			if(isset($this->connection)) {
				$this->connection->close();
			}
		}
//--------------------------------------------------------------------------------------------------------------------------------------------
// Implements the query function
//--------------------------------------------------------------------------------------------------------------------------------------------

		public function query($string) {
			$this->openConnection();

			$query = $this->connection->query($string);

			if(!$query){
				$this->error = $this->connection->error;
			}

			$this->closeConnection();

			return $query;
		}
	}
 ?>