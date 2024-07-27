<?php
// Database connection settings
$servername = "localhost"; // Change this to your database server address
$username = "root"; // Change this to your database username
$password = ""; // Change this to your database password
$dbname = "mobile"; // Change this to your database name

header('Content-Type: application/json');
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = isset($_GET['username']) ? $_GET['username'] : '';

$response = array();
if ($username != '') {
    // Prepare statement
    $sql = "SELECT * FROM glucoseentry WHERE username = ? AND status = 'completed'";
    $stmt = $conn->prepare($sql);
    
    if ($stmt) {
        // Bind parameters
        $stmt->bind_param('s', $username);
        
        // Execute statement
        $stmt->execute();
        
        // Get result
        $result = $stmt->get_result();
        
        if ($result) {
            if ($result->num_rows > 0) {
                $data = array();
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                $response['status'] = 'success';
                $response['data'] = $data;
            } else {
                $response['status'] = 'error';
                $response['message'] = 'No completed entries found for this username';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Query execution failed: ' . $stmt->error;
        }
        
        // Close statement
        $stmt->close();
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Statement preparation failed: ' . $conn->error;
    }
} else {
    $response['status'] = 'error';
    $response['message'] = 'Invalid username';
}

$conn->close();
echo json_encode($response);
?>
