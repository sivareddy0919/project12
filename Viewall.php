<?php
// Database connection details
$servername = "localhost"; // Your database host
$username = "root"; // Your database username
$password = ""; // Your database password
$database = "mobile"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Check if a username search parameter is provided
if (isset($_GET['username'])) {
    $searchUsername = $_GET['username'];

    // SQL query to search for patients based on username
    $sql = "SELECT `pname`, `mob`, `mail`, `gender`, `age`, `bloodgroup`, `username`, `pass`, `cpass`, `image_path` FROM `patsignup` WHERE `username` LIKE ?";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        $searchTerm = "%".$searchUsername."%";
        $stmt->bind_param("s", $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();

        $data = [];
        if ($result->num_rows > 0) {
            // Fetch all rows and store in $data array
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        } else {
            $data = ["message" => "0 results"];
        }
        
        $stmt->close();
    } else {
        $data = ["error" => "Error preparing statement: " . $conn->error];
    }
} else {
    // SQL query to fetch all patients
    $sql = "SELECT `pname`, `mob`, `mail`, `gender`, `age`, `bloodgroup`, `username`, `pass`, `cpass`, `image_path` FROM `patsignup`";
    $result = $conn->query($sql);

    $data = [];
    if ($result) {
        if ($result->num_rows > 0) {
            // Fetch all rows and store in $data array
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        } else {
            $data = ["message" => "0 results"];
        }
    } else {
        $data = ["error" => "Error executing query: " . $conn->error];
    }
}

$conn->close();

// Set Content-Type header to application/json
header('Content-Type: application/json');
echo json_encode($data);
?>
