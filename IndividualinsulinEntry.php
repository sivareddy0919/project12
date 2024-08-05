<?php
header('Content-Type: application/json');

// Decode the JSON data sent from the client
$data = json_decode(file_get_contents('php://input'), true);

// Check if all required parameters are set
if (isset($data['username']) && isset($data['datetime']) && isset($data['sugar_concentration']) && isset($data['note']) && isset($data['unit']) && isset($data['session']) && isset($data['insulinintake'])) {
    $username = $data['username'];
    $datetime = $data['datetime'];
    $sugar_concentration = $data['sugar_concentration'];
    $note = $data['note'];
    $unit = $data['unit'];
    $session = $data['session'];
    $insulinintake = $data['insulinintake'];
    $status = 'completed';  // Set the status to 'completed'

    // Database connection settings
    $servername = 'localhost';  // Use 'localhost' for local server
    $db_username = 'root';  // Default XAMPP username
    $db_password = '';  // Default XAMPP password (empty)
    $dbname = 'mobile';  // Your database name

    // Create connection
    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
    }

    // Prepare and bind
    $stmt = $conn->prepare("UPDATE glucoseentry SET sugar_concentration = ?, note = ?, unit = ?, session = ?, insulinintake = ?, status = ? WHERE username = ? AND datetime = ?");
    if ($stmt === false) {
        die(json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . htmlspecialchars($conn->error)]));
    }
    
    $bind = $stmt->bind_param("ssssssss", $sugar_concentration, $note, $unit, $session, $insulinintake, $status, $username, $datetime);
    if ($bind === false) {
        die(json_encode(['status' => 'error', 'message' => 'Bind failed: ' . htmlspecialchars($stmt->error)]));
    }

    // Execute the statement
    if ($stmt->execute()) {
        // Check if any row was updated
        if ($stmt->affected_rows > 0) {
            echo json_encode(['status' => 'success', 'message' => 'Insulin intake updated successfully and status changed to completed']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No record found to update']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update insulin intake: ' . htmlspecialchars($stmt->error)]);
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Missing required POST parameters']);
}
?>
