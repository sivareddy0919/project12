<?php
// Database configuration
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mobile";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to fetch doctor details
$sql = "SELECT `doctorname`, `contactNumber`, `email`, `qualification`, `imagepath` FROM `doctor`";
$result = $conn->query($sql);

// Check if the query was successful
if ($result === false) {
    die("Error: " . $conn->error);
}

// Check if there are results
if ($result->num_rows > 0) {
    // Fetch data and store it in an array
    $doctors = array();
    while($row = $result->fetch_assoc()) {
        $doctors[] = $row;
    }
    
    // Output data in JSON format
    echo json_encode($doctors);
} else {
    echo json_encode(array());
}

// Close the connection
$conn->close();
?>
