<?php 
//--------------------------------------------------------------------------------------------------------------------------------------------
//Checks for Error in Connection
//--------------------------------------------------------------------------------------------------------------------------------------------

	require_once(__DIR__ . "/../model/config.php");

		$query = $_SESSION["connection"]->query("CREATE TABLE users (" 
			. "id int(11) NOT NULL AUTO_INCREMENT," 
			. "username varchar(30) NOT NULL,"
			. "email varchar(50) NOT NULL,"
			. "password char(128) NOT NULL,"
			. "salt char(128) NOT NULL," 
			. "exp int(4),"
			. "exp1 int(4),"
			. "exp2 int(4),"
			. "exp3 int(4),"
			. "exp4 int(4),"
			. "PRIMARY KEY (id))");

 ?>