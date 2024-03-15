<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Origin");

session_start();

// Function to read users data from JSON file
function read_users_data() {
    $users_data_file = 'users.json';
    if (file_exists($users_data_file)) {
        $users_data = file_get_contents($users_data_file);
        return json_decode($users_data, true);
    } else {
        return array();
    }
}

// Function to write users data to JSON file
function write_users_data($users_data) {
    $users_data_file = 'users.json';
    $json_data = json_encode($users_data, JSON_PRETTY_PRINT);
    file_put_contents($users_data_file, $json_data);
}

// Dummy user credentials (replace with your actual authentication logic)

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Check if the action is for registration
    if (isset($_POST["action"]) && $_POST["action"] === "register") {
        if (isset($_POST["username"]) && isset($_POST["password"])) {
            $username = $_POST["username"];
            $password = $_POST["password"];

            // Read existing users data
            $users_data = read_users_data();

            // Check if the username already exists
            if (isset($users_data[$username])) {
                echo json_encode(array("success" => false, "message" => "Username already exists"));
                exit;
            }

            // Add new user
            $users_data[$username] = $password;

            // Write updated users data to JSON file
            write_users_data($users_data);

            $_SESSION["username"] = $username;
            echo json_encode(array("success" => true, "message" => "Registration successful", "username" => $username));
            exit;
        } else {
            // Username or password not provided
            echo json_encode(array("success" => false, "message" => "Username or password not provided"));
            exit;
        }
    } elseif (isset($_POST["action"]) && $_POST["action"] === "login") {
        // Check if username and password are provided
        if (isset($_POST["username"]) && isset($_POST["password"])) {
            $username = $_POST["username"];
            $password = $_POST["password"];

            $users_data = read_users_data();

            if (isset($users_data[$username])) {
                // Authentication successful, store username in session
                $_SESSION["username"] = $username;
                echo json_encode(array("success" => true, "message" => "Authentication successful", "username" => $username));
                exit;
            } else {
                // Authentication failed
                echo json_encode(array("success" => false, "message" => "Invalid username or password"));
                exit;
            }
        } else {
            // Username or password not provided
            echo json_encode(array("success" => false, "message" => "Username or password not provided"));
            exit;
        }
    } else {
        // Invalid action
        echo json_encode(array("success" => false, "message" => "Invalid action"));
        exit;
    }
} else {
    // Invalid request method
    http_response_code(405); // Method Not Allowed
    echo json_encode(array("success" => false, "message" => "Invalid request method"));
    exit;
}
?>

