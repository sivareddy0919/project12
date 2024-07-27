<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
 
// Database connection details
$servername = "localhost";
$username = "root";
$password = "";
$database = "mobile";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// Initialize response array
$response = array();

// Define the base URL for images
$base_image_url = 'http://192.168.40.121/Database';

// Get the raw POST data as a string
$json_data = file_get_contents("php://input");

// Decode the JSON data into an associative array
$request_data = json_decode($json_data, true);

// Check if 'username' key exists in $request_data
if (isset($request_data['username'])) {
    $searchText = $request_data['username'];

    // Query to search for patients based on name and select all columns
    $sql = "SELECT * FROM patsignup WHERE `username` LIKE ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $response['status'] = "error";
        $response['message'] = "Database error: " . $conn->error;
    } else {
        $searchText = '%' . $searchText . '%';
        $stmt->bind_param('s', $searchText);

        if (!$stmt->execute()) {
            $response['status'] = "error";
            $response['message'] = "Execution error: " . $stmt->error;
        } else {
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $patients = $result->fetch_all(MYSQLI_ASSOC);

                foreach ($patients as &$patient) {
                    if (!empty($patient['image_path'])) {
                        $patient['image_path'] = $base_image_url . '/' . $patient['image_path'];
                    }
                }

                $response['status'] = "success";
                $response['message'] = "Search successful";
                $response['patients'] = $patients;
            } else {
                $response['status'] = "error";
                $response['message'] = "No patients found";
            }
        }

        $stmt->close();
    }
} else {
    $response['status'] = "error";
    $response['message'] = "Invalid request data";
}

$conn->close();

echo json_encode($response);
?>
