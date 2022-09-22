<?php

$candidate_id = isset($_GET['edit'])?intval($_GET['edit']):0;
global $wpdb;


$single_candidate = $wpdb->get_row(
    $wpdb->prepare(
        "SELECT * from ".candidates_table()." WHERE id = " .$candidate_id
    ),ARRAY_A
    );
?>


<div class="container">
    <div class="row">
        <div class="alert alert-info">
            <h4>Update Candidates</h4>
        </div>

        <div class="panel panel-primary">
            <div class="panel-body">
                <form class="form-horizontal" action="javascript:void(0)" id="candidatesEdit">

                    <input type="hidden" name="data-id" value="<?php echo $_GET['edit']; ?>">
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="name">Name:</label>
                        <div class="col-sm-10">
                            <input type="text" value="<?php echo $single_candidate['name']; ?>" class="form-control" required id="name" name="name" placeholder="Enter candidate name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="party">Party:</label>
                        <div class="col-sm-10">
                            <!-- <input type="text" value="<?php echo $single_candidate['party']; ?>" class="form-control" required id="party" name="party" placeholder="Enter party"> -->
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="party">Vote:</label>
                        <div class="col-sm-10">
                            <input type="text" value="<?php echo $single_candidate['vote']; ?>" class="form-control" id="vote" name="vote" placeholder="Enter vote">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <div class="checkbox">
                                <label><input type="checkbox" id="elected" name="elected"> Elected</label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" class="btn btn-primary">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>