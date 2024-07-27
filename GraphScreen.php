<?php
// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mobile";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Debugging: Print the contents of $_POST
header('Content-Type: text/plain');
print_r($_POST);

// Get parameters from POST request
$user = isset($_POST['username']) ? $_POST['username'] : null;
$startDate = isset($_POST['start_date']) ? $_POST['start_date'] : null;
$endDate = isset($_POST['end_date']) ? $_POST['end_date'] : null;

// Ensure the variables are not null
if ($user === null || $startDate === null || $endDate === null) {
    die("Missing parameters.");
}

// Adjust end date to include the entire end day
$endDate = date('Y-m-d', strtotime($endDate . ' +1 day'));

// Prepare and bind
$stmt = $conn->prepare("SELECT `datetime`, `sugar_concentration`, `unit`, `username`, `insulinintake`, `status` FROM `glucoseentry` WHERE `username` = ? AND `datetime` BETWEEN ? AND ?");
if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}
$stmt->bind_param("sss", $user, $startDate, $endDate);

// Execute the query
if (!$stmt->execute()) {
    die("Execute failed: " . $stmt->error);
}

// Get the result
$result = $stmt->get_result();

// Check result
if ($result->num_rows > 0) {
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    // Output data as JSON
    header('Content-Type: application/json');
    echo json_encode($data);
} else {
    echo "No results found.";
}

// Close connection
$stmt->close();
$conn->close();
?>
