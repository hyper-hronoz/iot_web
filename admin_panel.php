<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Origin");

session_start();


$users_data_file = 'users.json';

if (!isset($_SESSION["authenticated"]) || $_SESSION["authenticated"] !== true) {
  header("Location: admin_login.php");
  exit;
}

if (isset($_POST["logout"])) {
    $_SESSION = array();

    session_destroy();

    header("Location: admin_login.php");
    exit;
}

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

function write_users_data($users_data)
{
  global $users_data_file;
  $json_data = json_encode($users_data, JSON_PRETTY_PRINT);
  file_put_contents($users_data_file, $json_data);
}

// Check if form data is received
function handle()
{
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "Action: " . $_POST["action"] ;
    if (isset($_POST["action"]) && $_POST["action"] === "register") {
      $email = $_POST["email"];
      $username = $_POST["username"];
      $password = $_POST["password"];

      // Your logic for storing the user in the database goes here
      // For demonstration purposes, let's just echo the received data
      echo "User registered successfully!<br>";
      echo "Email: " . $email . "<br>";
      echo "Username: " . $username . "<br>";
      echo "Password: " . $password . "<br>";

      if (isset($_POST["email"]) && isset($_POST["username"]) && isset($_POST["password"])) {
        $email = $_POST["email"];
        $username = $_POST["username"];
        $password = $_POST["password"];

        // Read existing users data
        $users_data = read_users_data();

        $email_exists = false;
        foreach ($users_data as $user) {
          if ($user['email'] === $email) {
            $email_exists = true;
            break;
          }
        }

        if ($email_exists) {
          echo json_encode(array("success" => false, "message" => "Email already exists"));
          return;
        }

        $new_user = array("email" => $email, "username" => $username, "password" => $password);
        $users_data[] = $new_user;

        write_users_data($users_data);

        $_SESSION["email"] = $email;
        $_SESSION["username"] = $username;
        echo json_encode(array("success" => true, "message" => "Registration successful", "username" => $username, "email" => $email));
      }
    } elseif (isset($_POST["action"]) && isset($_POST["user_index"])) {

      if ($_POST["action"] === "delete") {
        $user_index = $_POST["user_index"];

        // Read existing users data
        $users_data = read_users_data();

        // Remove user at specified index
        if (isset($users_data[$user_index])) {
          unset($users_data[$user_index]);
          write_users_data($users_data);
        }
      } elseif ($_POST["action"] === "update") {
        $user_index = $_POST["user_index"];

        // Read existing users data
        $users_data = read_users_data();

        // Update user details
        if (isset($users_data[$user_index])) {
          $users_data[$user_index]["email"] = $_POST["email"];
          $users_data[$user_index]["username"] = $_POST["username"];
          $users_data[$user_index]["password"] = $_POST["password"];
          write_users_data($users_data);
        }
      }
    }
  }
}

handle();
?>
<?php
$users_json = file_get_contents("users.json");
$users = json_decode($users_json, true);
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel - User Registration</title>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
  <!-- Custom CSS -->
  <style>
    body {
      background-color: #f8f9fa;
    }

    .container {
      margin-top: 50px;
    }
  </style>
</head>

<body>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Admin Panel</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item active">
        <form method="post" class="form-inline">
          <button class="btn btn-outline-danger my-2 my-sm-0" type="submit" name="logout">Logout</button>
        </form>
      </li>
    </ul>
  </div>
</nav>

  <div class="container mb-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Register New User</div>
          <div class="card-body">
            <form method="post">
              <div class="form-group">
                <label for="email">email</label>
                <input type="text" class="form-control" id="email" name="email" required>
              </div>
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" name="username" required>
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password" required>
              </div>
              <div class="form-group">
                <input type="hidden" class="form-control" value="register" id="action" name="action" required>
              </div>
              <button type="submit" class="btn btn-primary">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-4">
    <h2 class="mb-3">Registered Users</h2>
    <div class="row">
      <?php foreach ($users as $index => $user) : ?>
        <div class="col-md-6">
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">User Details</h5>
              <form method="post">
                <input type="hidden" name="action" value="update">
                <input type="hidden" name="user_index" value="<?php echo $index; ?>">
                <div class="form-group">
                  <label for="email<?php echo $index; ?>">Email</label>
                  <input type="text" class="form-control" id="email<?php echo $index; ?>" name="email" value="<?php echo $user['email']; ?>" required>
                </div>
                <div class="form-group">
                  <label for="username<?php echo $index; ?>">Username</label>
                  <input type="text" class="form-control" id="username<?php echo $index; ?>" name="username" value="<?php echo $user['username']; ?>" required>
                </div>
                <div class="form-group">
                  <label for="password<?php echo $index; ?>">Password</label>
                  <input type="password" class="form-control" id="password<?php echo $index; ?>" name="password" value="<?php echo $user['password']; ?>" required>
                </div>
                <button type="submit" class="btn btn-primary">Update</button>
              </form>
              <form>
                <input type="hidden" name="action" value="delete">
                <input type="hidden" name="user_index" value="<?php echo $index; ?>">
                <button type="submit" class="btn btn-danger" formaction="<?php echo $_SERVER['PHP_SELF']; ?>" formmethod="post">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>


  <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>

</html>
