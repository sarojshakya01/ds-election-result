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

function election_result_include_asset_files() {

    wp_enqueue_style('bootstrap', ELECTION_RESULT_PLUGIN_URL . '/assets/css/lib/bootstrap.min.css', '');
    // wp_enqueue_style('datatable', ELECTION_RESULT_PLUGIN_URL . '/assets/css/lib/jquery.dataTables.min.css', '');
    // wp_enqueue_style('notifybar', ELECTION_RESULT_PLUGIN_URL . '/assets/css/lib/jquery.notifyBar.css', '');
    wp_enqueue_style('fontawesome', ELECTION_RESULT_PLUGIN_URL . '/assets/css/lib/fontawesome.min.css', '');
    wp_enqueue_style('custom-css', ELECTION_RESULT_PLUGIN_URL . '/assets/css/style.css', '');

    wp_enqueue_script('jQuery');
    wp_enqueue_script('bootstrapjs', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/bootstrap.bundle.min.js', '', true);
    // wp_enqueue_script('datatablejs', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/jquery.dataTables.min.js', '', true);
    // wp_enqueue_script('notifybarjs', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/jquery.notifyBar.js', '', true);
    // wp_enqueue_script('validatejs', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/jquery.validate.min.js', '', true);
    wp_enqueue_script('fontawesome', ELECTION_RESULT_PLUGIN_URL . '/assets/js/lib/fontawesome.js', '', true);
    wp_enqueue_script('custom1js', ELECTION_RESULT_PLUGIN_URL . '/assets/js/data.js', array() , '', true);
    wp_enqueue_script('custom-js', ELECTION_RESULT_PLUGIN_URL . '/assets/js/script.js', array() , '', true);
    wp_localize_script('custom-js', 'electionresultajaxurl', admin_url('admin-ajax.php'));
    // wp_localize_script('custom-js', 'variables',ELECTION_RESULT_PLUGIN_URL . '/assets/js/data.js');
    
}

add_action('init', 'election_result_include_asset_files');

function election_result_menu_view_list() {
    include (ELECTION_RESULT_DIR_PATH . '/templates/candidate-list.php');
}

function election_result_sub_menu_add() {
    include (ELECTION_RESULT_DIR_PATH . '/templates/candidate-add.php');
}

function election_result_add_candidate() {
    include (ELECTION_RESULT_DIR_PATH . '/templates/candidate-edit.php');
}

function election_result_menu() {
    add_menu_page("electionresultmenu", "Election Result 2079", "manage_options", "electionresult-menu", "election_result_menu_view_list", '', 9);

    add_submenu_page("electionresult-menu", "List Candidate", "List Candidate", "manage_options", "electionresult-menu", "election_result_menu_view_list");

    add_submenu_page("electionresult-menu", "Add Candidate", "Add Candidate", "manage_options", "add-candidate", "election_result_sub_menu_add");

    add_submenu_page("electionresult-menu", "", "", "manage_options", "edit-candidate", "election_result_add_candidate");
}

add_action("admin_menu", "election_result_menu");

add_action("wp_ajax_candidateslist", "candidates_ajax_handler");

function tableNameToUpdate($type) {
    if ($type == 'federal'){
        return 'ds_election_fresults';
    } else {
        return 'ds_election_presults';
    }

}

function candidates_ajax_handler() {
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


    $region_candidates = array();

    $declared = $_REQUEST['elected'] == 'on' ? 1 : 0;

    $elected_candidate = (object)array();
    $checked = array("yes", "on",);
    
    $candidate_rows = array();
    $count = 0;
    foreach ($names as $key => $value) {
        
        if (in_array($elected[$key], $checked)) {
            $elected_candidate = array(
                "name_en" => $value,
                "name_np" => $names_np[$key],
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
            $value,
            $names_np[$key],
            $party[$key],
            intval($vote[$key]),
            in_array($elected[$key], $checked) ? 'true' : 'false',
            $descriptions[$key] ? $descriptions[$key] : ""
        );
        $count = $count + 1;
        
        $region_candidates[$key] = array(
            "name_en" => $value,
            "name_np" => $names_np[$key],
            "party" => $party[$key],
            "vote" => intval($vote[$key]),
            "elected" => $elected[$key],
            "descriptions" => $descriptions[$key]
        );
    }

    $region_candidates_encoded = json_encode($region_candidates, JSON_UNESCAPED_UNICODE);
    $elected_candidate_encoded = json_encode($elected_candidate, JSON_UNESCAPED_UNICODE);


    $tableNameToUpdate = tableNameToUpdate($type);

    if ($_REQUEST['dbaction'] == 'update') {

        try {
            $wpdb->query('START TRANSACTION');
            
            $sql_query = "INSERT INTO $tableNameToUpdate (province_id, district_id, region_id, result) 
            VALUES ($province,'$district',$region, '$region_candidates_encoded')
            ON DUPLICATE KEY UPDATE result = '$region_candidates_encoded';";
            // $sql_query = "UPDATE $tableNameToUpdate SET result = ' $region_candidates_encoded ', 
            // elected = ' $elected_candidate_encoded ' , declared = $declared
            // WHERE province_id =  $province  AND district_id =  '$district'  AND
            // round(region_id, 1) = $region ";
            $query_result = $wpdb->query($sql_query);

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
                ;
                if ($i === count($candidate_rows) - 1) {
                    $values .= rtrim($temp_values, ',') . ")";
                } else {
                    $values .= rtrim($temp_values, ',') . "),\n";
                }
            }
            $sql_query = "INSERT INTO ds_election_candidates (rtype, province_id, district_id, region_id, name_np, name_en, party_code, vote, elected, descriptions) 
            VALUES $values
            ON DUPLICATE KEY UPDATE name_np = VALUES(name_en),
            name_en = VALUES(name_en),
            vote = VALUES(vote),
            elected = VALUES(elected),
            descriptions = VALUES(descriptions);";

            $query_result2 = $wpdb->query($sql_query);
            
            if ($query_result) {
                echo json_encode(array(
                    "status" => 200,
                    "message" => "Candidate created successfully",
                    "result" => $region_candidates,
                    "elected_candidate" => $elected_candidate
                ));
            } else {
                $wpdb->query('ROLLBACK');
                echo json_encode(array(
                    "status" => 100,
                    "message" => "Data not updatedd!"
                    )
                ); 
            }
            
            $wpdb->query('COMMIT');
        } catch (Throwable $e) {
            echo $e;
            $wpdb->query('ROLLBACK');
            echo json_encode(array(
                "status" => 100,
                "message" => "Data not updated!")
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