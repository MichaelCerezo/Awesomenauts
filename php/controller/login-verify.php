<?php  
	require_once(__DIR__ . "/../model/config.php");

	function authenticatedUser(){
		if(!isset($_SESSION["authenticated"])){
			return false;
		}
		else{
			if ($_SESSION["authenticated"] != true) {
				return false;
			}
			else{
				return true;
			}
		}
	}
?>