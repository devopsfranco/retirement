<?php

// Allow frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-API-KEY");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include secure database configuration
require_once("/home/retimtrc/config.php");

// API Key Validation
$headers = array_change_key_case(getallheaders(), CASE_LOWER);
if (!isset($headers['x-api-key']) || $headers['x-api-key'] !== API_KEY) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized - Invalid API Key."
    ]);
    exit();
}

// Get database connection
$conn = getDBConnection();
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

// Fetch topics with their options and vote counts
$query = "
    SELECT 
        t.id AS topic_id, 
        t.title AS topic_title, 
        t.created_at AS topic_created_at, 
        o.id AS option_id, 
        o.option_text AS option_title, 
        COALESCE(SUM(v.vote_value), 0) AS total_votes
    FROM topics t
    LEFT JOIN options o ON t.id = o.topic_id
    LEFT JOIN votes v ON o.id = v.option_id
    WHERE t.status = 'active'
    GROUP BY t.id, o.id
    ORDER BY t.created_at DESC, o.id ASC;
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(["status" => "error", "message" => "Failed to prepare the database query."]);
    exit();
}

$stmt->execute();
$result = $stmt->get_result();

$topics = [];
while ($row = $result->fetch_assoc()) {
    $topic_id = $row['topic_id'];

    // Initialize topic if not already added
    if (!isset($topics[$topic_id])) {
        $topics[$topic_id] = [
            "topic_id" => $row["topic_id"],
            "title" => $row["topic_title"],
            "created_at" => $row["topic_created_at"],
            "options" => [],
            "total_votes" => 0 // Initialize total votes for the topic
        ];
    }

    // Add option details
    if ($row['option_id'] !== null) {
        $topics[$topic_id]["options"][] = [
            "option_id" => $row["option_id"],
            "option_title" => $row["option_title"],
            "total_votes" => (int)$row["total_votes"]
        ];

        // Increment total votes for the topic
        $topics[$topic_id]["total_votes"] += (int)$row["total_votes"];
    }
}
$stmt->close();

// Compute percentages for each option
foreach ($topics as &$topic) {
    foreach ($topic["options"] as &$option) {
        $option["percentage"] = $topic["total_votes"] > 0 
            ? round(($option["total_votes"] / $topic["total_votes"]) * 100, 2) 
            : 0;
    }
}

$conn->close();

// Return data as JSON
echo json_encode(["status" => "success", "topics" => array_values($topics)]);
exit();

?>