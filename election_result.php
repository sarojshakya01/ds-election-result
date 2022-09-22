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

function election_result_include_asset_files()
{

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

function election_result_menu_view_list()
{

    include (ELECTION_RESULT_DIR_PATH . '/templates/candidate-list.php');
}

function election_result_sub_menu_add()
{

    include (ELECTION_RESULT_DIR_PATH . '/templates/candidate-add.php');
}

function election_result_add_candidate()
{

    include (ELECTION_RESULT_DIR_PATH . '/templates/candidate-edit.php');
}

function election_result_menu()
{
    add_menu_page("electionresultmenu", "Election Result 2079", "manage_options", "electionresult-menu", "election_result_menu_view_list", '', 9);

    add_submenu_page("electionresult-menu", "List Candidate", "List Candidate", "manage_options", "electionresult-menu", "election_result_menu_view_list");

    add_submenu_page("electionresult-menu", "Add Candidate", "Add Candidate", "manage_options", "add-candidate", "election_result_sub_menu_add");

    add_submenu_page("electionresult-menu", "", "", "manage_options", "edit-candidate", "election_result_add_candidate");
}

add_action("admin_menu", "election_result_menu");

add_action("wp_ajax_candidateslist", "candidates_ajax_handler");

function tableNameToUpdate($type)
{
    if ($type == 'federal')
    {
        return 'ds_election_fresults';
    }
    else
    {
        return 'ds_election_presults';
    }

}

function candidates_ajax_handler()
{
    global $wpdb;

    $elected_candidate = array(
        "name_en" => isset($_REQUEST["elected-name"]) ? $_REQUEST["elected-name"] : null,
        "name_np" => isset($_REQUEST["elected-name-np"]) ? $_REQUEST["elected-name-np"] : null,
        "party" => isset($_REQUEST["elected-party"]) ? $_REQUEST["elected-party"] : null,
        "vote" => isset($_REQUEST["elected-vote"]) ? intval($_REQUEST["elected-vote"]) : null,

    );

    if ($_REQUEST["elected-name"] == '' or $_REQUEST["elected-name"] == null)
    {
        $elected_candidate = (object)array();
    }

    $region_candidates = array();

    $names = isset($_REQUEST['name']) ? $_REQUEST['name'] : null;
    $names_np = isset($_REQUEST['name_np']) ? $_REQUEST['name_np'] : null;
    $party = isset($_REQUEST['party']) ? $_REQUEST['party'] : null;
    $vote = isset($_REQUEST['vote']) ? $_REQUEST['vote'] : null;

    $province = isset($_REQUEST['province']) ? $_REQUEST['province'] : null;
    $district = isset($_REQUEST['district']) ? $_REQUEST['district'] : null;
    $region = (isset($_REQUEST['region']) ? $_REQUEST['region'] : null);

    
    $type = isset($_REQUEST['type']) ? $_REQUEST['type'] : null;
    $declared = $_REQUEST['elected'] == 'on' ? 1 : 0;

    foreach ($names as $key => $value)
    {
        $region_candidates[$key] = array(
            "name_en" => $value,
            "name_np" => $names_np[$key],
            "party" => $party[$key],
            "vote" => intval($vote[$key])
        );
    }

    $region_candidates_encoded = json_encode($region_candidates, JSON_UNESCAPED_UNICODE);
    $elected_candidate_encoded = json_encode($elected_candidate, JSON_UNESCAPED_UNICODE);


    $tableNameToUpdate = tableNameToUpdate($type);

    if ($_REQUEST['dbaction'] == 'update')
    {

        $sql_query = "UPDATE $tableNameToUpdate SET result = ' $region_candidates_encoded ', 
            elected = ' $elected_candidate_encoded ' , declared = $declared
            WHERE province_id =  $province  AND district_id =  '$district'  AND
            round(region_id, 1) = $region ";
        $response = $wpdb->query($sql_query);
        
        if ($response)
        {
            echo json_encode(array(
                "status" => 200,
                "message" => "Candidate created successfully",
                "result" => $region_candidates,
                "elected_candidate" => $elected_candidate
            ));
        } else {
            echo json_encode(array(
                "status" => 400,
                "message" => "Candidate can not be updated!")
            ); 
        }

    } else {
        echo json_encode(array(
            "status" => 400,
            "message" => "Candidate can not be updated!")
        );
    }
    wp_die();
}