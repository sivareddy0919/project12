<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mobile";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
}

// Check if username and date parameters are set
if (isset($_GET['username']) && isset($_GET['date'])) {
    $username = $_GET['username'];
    $date = $_GET['date'];

    // SQL query
    $sql = "SELECT id, datetime, sugar_concentration, unit, username, session, insulinintake, status 
            FROM glucoseentry 
            WHERE username = ? AND DATE(datetime) = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $date);
    $stmt->execute();
    $result = $stmt->get_result();

    $data = array();
    if ($result->num_rows > 0) {
        // Output data of each row
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode($data);
    } else {
        echo json_encode(array("message" => "No results found for username $username on date $date"));
    }
    $stmt->close();
} else {
    echo json_encode(array("error" => "Username and date parameters are required"));
}

$conn->close();
?>
