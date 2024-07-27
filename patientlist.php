<?php
$servername = "localhost"; // Your database server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "mobile"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch all records from patsignup table
$sql = "SELECT * FROM patsignup";
$result = $conn->query($sql);

// Check if there are results
if ($result->num_rows > 0) {
    // Output data of each row
    $patients = array();
    while($row = $result->fetch_assoc()) {
        $patients[] = $row;
    }
    echo json_encode($patients); // Return JSON formatted data
} else {
    echo json_encode(array("message" => "0 results"));
}

$conn->close();
?>
