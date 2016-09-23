<?php 

echo json_encode(array("err" => $result['error_code'], "ok" => $result['ok'], 'applicationId' => $result["applicationId"], "test" => $result ));

?>