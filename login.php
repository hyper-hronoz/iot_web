<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Origin");

$users_data_file = 'users.json';

function read_users_data()
{
  global $users_data_file;
  if (file_exists($users_data_file)) {
    $users_data = file_get_contents($users_data_file);
    return json_decode($users_data, true);
  } else {
    return array();
  }
}

$users_data = read_users_data();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (isset($_POST["action"]) && $_POST["action"] == "login") {

    if (isset($_POST["email"]) && isset($_POST["password"])) {
      $email = $_POST["email"];
      $password = $_POST["password"];
      foreach ($users_data as $user) {
        if ($user['email'] === $email && $user["password"] == $_POST["password"]) {
          echo json_encode(array("success" => true, "message" => "Successfully authorized", "username" => $user["username"], "email" => $user["email"]));
          return;
        }
      }
    }
  }
  echo json_encode(array("success" => false, "message" => "Wrong email or password"));
}
