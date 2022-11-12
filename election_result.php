<?php
/*
Plugin Name: DS Election Result 2079
Description: Data Entry Plugin for Election Result 2079
Author: SH Group of Company
Version: 1.0
*/

if (!defined("ABSPATH")) exit;

if (!defined("ELECTION_RESULT_DIR_PATH")) define("ELECTION_RESULT_DIR_PATH", plugin_dir_path(__FILE__));

if (!defined("ELECTION_RESULT_PLUGIN_URL")) define("ELECTION_RESULT_PLUGIN_URL", plugins_url() . "/ds-election-result");

// $css_timestamp = filemtime(ELECTION_RESULT_PLUGIN_URL . '/assets/css/style.css' );
// define( 'CSS_VERSION', $css_timestamp );
// $js_timestamp = filemtime(ELECTION_RESULT_PLUGIN_URL . '/assets/js/script.js' );
// define( 'JS_VERSION', $js_timestamp );

function election_result_include_asset_files() {

    wp_enqueue_style('bootstrap', ELECTION_RESULT_PLUGIN_URL . '/assets/css/lib/bootstrap.min.css', array(), '');
    wp_enqueue_style('fontawesome', ELECTION_RESULT_PLUGIN_URL . '/assets/css/lib/fontawesome.min.css', array(), '');
    // wp_enqueue_style('custom-css', ELECTION_RESULT_PLUGIN_URL . '/assets/css/style.css', array(), CSS_VERSION);
    wp_enqueue_style('custom-css', ELECTION_RESULT_PLUGIN_URL . '/assets/css/style.css', array(), "");

    wp_enqueue_script('jQuery');
    wp_enqueue_script('bootstrapjs', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/bootstrap.bundle.min.js', '', true);
    wp_enqueue_script('fontawesome', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/fontawesome.js', '', true);
    wp_enqueue_script('custom-data-js', ELECTION_RESULT_PLUGIN_URL . '/assets/js/data.js', array() , '', true);
    // wp_enqueue_script('custom-js', ELECTION_RESULT_PLUGIN_URL . '/assets/js/script.js', array() , JS_VERSION, true);
    wp_enqueue_script('custom-js', ELECTION_RESULT_PLUGIN_URL . '/assets/js/script.js', array() , "", true);
    wp_localize_script('custom-js', 'electionresultajaxurl', admin_url('admin-ajax.php'));
    
}

add_action('init', 'election_result_include_asset_files');

function election_result_menu_result() {
    include (ELECTION_RESULT_DIR_PATH . '/templates/directly-elected-result.php');
}

function election_result_menu_proportional_result() {
    include (ELECTION_RESULT_DIR_PATH . '/templates/proportional_result.php');
}



function election_result_menu() {
    add_menu_page("directly-elected-result", "Election Result 2079", "manage_options", "directly-elected-result", "election_result_menu_result", '', 9);

    add_submenu_page("directly-elected-result", "Directly Elected Result", "Directly Elected Result", "manage_options", "directly-elected-result", "election_result_menu_result");

    add_submenu_page("directly-elected-result", "Proportional Result", "Proportional Result", "manage_options", "proportional-result", "election_result_menu_proportional_result");
}

add_action("admin_menu", "election_result_menu");

add_action("wp_ajax_update_result", "ajax_handler_update_result");

add_action("wp_ajax_update_pr_result", "ajax_handler_update_pr_result");

function ajax_handler_update_result() {
    global $wpdb;

    $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : null;
    $province = isset($_REQUEST['province']) ? $_REQUEST['province'] : null;
    $district = isset($_REQUEST['district']) ? $_REQUEST['district'] : null;
    $region = isset($_REQUEST['region']) ? $_REQUEST['region'] : null;

    $names = isset($_REQUEST['name']) ? $_REQUEST['name'] : null;
    $names_np = isset($_REQUEST['name_np']) ? $_REQUEST['name_np'] : null;
    $party = isset($_REQUEST['party']) ? $_REQUEST['party'] : null;
    $vote = isset($_REQUEST['vote']) ? $_REQUEST['vote'] : null;
    $elected = isset($_REQUEST['elected']) ? $_REQUEST['elected'] : null;
    $descriptions = isset($_REQUEST['descriptions']) ? $_REQUEST['descriptions'] : null;

    $declared = 0;

    $elected_candidate = (object)array();
    $checked = array("yes", "on",);
    
    $candidate_rows = array();
    $count = 0;
    foreach ($names as $key => $value) {
        
        if (in_array($elected[$key], $checked)) {
            $declared = 1;
            $elected_candidate = array(
                "name_np" => $names_np[$key],
                "name_en" => $value,
                "party" => $party[$key],
                "vote" => intval($vote[$key]),
                "descriptions" => $descriptions[$key]
            );
        }

        $candidate_rows[$count] = array(
            $type,
            $province,
            $district,
            $region,
            $names_np[$key],
            $value,
            $party[$key],
            intval($vote[$key]),
            in_array($elected[$key], $checked) ? 'true' : 'false',
            $descriptions[$key] ? $descriptions[$key] : ""
        );
        $count = $count + 1;
    }

    if ($_REQUEST['dbaction'] == 'insert_update') {
        try {
            $wpdb->query('START TRANSACTION');

            $values = "";
            for ($i = 0; $i < count($candidate_rows); $i++) {
                $values .= "(";
                $temp_values = "";
                for ($j = 0; $j < count($candidate_rows[$i]); $j++) {
                    if ($j == 0 || $j == 2 || $j == 4 || $j == 5 || $j == 6 || $j == 9) {
                        $temp_values .= "'" . $candidate_rows[$i][$j] . "',";
                    } else {
                        $temp_values .= $candidate_rows[$i][$j] . ",";
                    }
                }
                
                if ($i === count($candidate_rows) - 1) {
                    $values .= rtrim($temp_values, ',') . ")";
                } else {
                    $values .= rtrim($temp_values, ',') . "),\n";
                }
            }
            // $sql_query_delete = "DELETE FROM ds_election_candidates where rtype = '$type' and province_id = $province and district_id = '$district' and region_id = $region";

            // $query_result = $wpdb->query($sql_query_delete);

            $sql_query = "INSERT INTO ds_election_candidates 
            (rtype, province_id, district_id, region_id, name_np, name_en, party_code, vote, elected, descriptions) 
            VALUES $values
            ON DUPLICATE KEY UPDATE
            name_np = VALUES(name_np),
            name_en = VALUES(name_en),
            vote = VALUES(vote),
            elected = VALUES(elected),
            descriptions = VALUES(descriptions);";

            $query_result = $wpdb->query($sql_query);
            
            if ($query_result) {
                $updated_data = $wpdb->get_results("SELECT * FROM ds_election_candidates WHERE province_id =  $province  AND district_id =  '$district'  AND
                round(region_id, 1) = $region ;", OBJECT);
                $responseData = [];
                for ($i = 0; $i < count($updated_data); $i++) {
                    array_push($responseData, $updated_data[$i]);
                }
                echo json_encode(array(
                    "status" => 200,
                    "message" => "Result data updated successfully",
                    "data" => $responseData
                ));
            } else {
                $wpdb->query('ROLLBACK');
                echo json_encode(array(
                    "status" => 100,
                    "message" => "Result data not updated!",
                    )
                ); 
            }
            
            $wpdb->query('COMMIT');
        } catch (Throwable $e) {
            $wpdb->query('ROLLBACK');
            echo json_encode(array(
                "status" => 100,
                "message" => "Result data not updated!"),
            );
        }
    } else {
        echo json_encode(array(
            "status" => 400,
            "message" => "Bad Request!")
        );
    }
    wp_die();
}

function ajax_handler_update_pr_result() {
    global $wpdb;

    $party = isset($_REQUEST['party']) ? $_REQUEST['party'] : null;
    $vote = isset($_REQUEST['vote']) ? $_REQUEST['vote'] : null;

    if ($_REQUEST['dbaction'] == 'update') {

        try {
            $wpdb->query('START TRANSACTION');

            $values = "";
            $responseData = [];
            for ($i = 0; $i < count($party); $i++) {
                $values .= "('" . $party[$i] . "'," . $vote[$i] . ")";
                if ($i !== count($party) - 1) {
                    $values .= ",\n";
                }
                array_push($responseData, array("party" => $party[$i], "vote" => $vote[$i]));
            }
            $sql_query = "INSERT INTO ds_election_pr_results 
            (party_code, vote) 
            VALUES $values
            ON DUPLICATE KEY UPDATE
            vote = VALUES(vote)";

            $query_result = $wpdb->query($sql_query);
            
            if ($query_result) {
                $updated_data = $wpdb->get_results("SELECT party_code as party, vote FROM ds_election_pr_results WHERE 1;", OBJECT);
                
                $responseData = [];
                for ($i = 0; $i < count($updated_data); $i++) {
                    array_push($responseData, $updated_data[$i]);
                }
                echo json_encode(array(
                    "status" => 200,
                    "message" => "Result data updated successfully",
                    "data" => $responseData
                ));
            } else {
                $wpdb->query('ROLLBACK');
                echo json_encode(array(
                    "status" => 100,
                    "message" => "Result data not updated!"
                    )
                ); 
            }
            
            $wpdb->query('COMMIT');
        } catch (Throwable $e) {
            $wpdb->query('ROLLBACK');
            echo json_encode(array(
                "status" => 100,
                "message" => "Result data not updated!"),
                // "verbose" => $e
            );
        }
    } else {
        echo json_encode(array(
            "status" => 400,
            "message" => "Bad Request!")
        );
    }
    wp_die();
}