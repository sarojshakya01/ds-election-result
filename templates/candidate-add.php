<?php
// Read the JSON file
$districts = file_get_contents(ELECTION_RESULT_DIR_PATH . 'distnew.json');

// Decode the JSON file
$districts_data = json_decode($districts, true);

// Display data
print_r($districts_data);

// Read the JSON file
$provinces = file_get_contents(ELECTION_RESULT_DIR_PATH . 'templates/provinces.json');

// Decode the JSON file
$provinces_data = json_decode($provinces, true);

// Read the JSON file
$regions = file_get_contents(ELECTION_RESULT_DIR_PATH . 'templates/regions.json');

// Decode the JSON file
$regions_data = json_decode($regions, true);


?>

<div class="container">
    <div class="row">
        <div class="alert alert-info">
            <h4>Add Candidates</h4>
        </div>
        <div class="panel panel-primary">
            <div class="panel-body">
                <form class="form-horizontal" action="javascript:void(0)" id="candidatesAdd">
                    <div class="row">
                        <div class=" col-md-3 form-group">
                            <label class="control-label col-sm-2" for="province">Province:</label>
                            <div class="col-sm-10">
                                <select name="province" class="form-select" required aria-label="Default select example">
                                    <option selected>Select Province</option>
                                    <?php foreach ($provinces_data as $key => $province_data)?>
                                    <option value="<?php echo $province_data['Lcode']; ?>"><?php echo $province_data['pradesh_name']; ?></option>
                                </select>
                            </div>
                        </div>

                        <div class="col-md-3 form-group">
                            <label class="control-label col-sm-2" for="district">District:</label>
                            <div class="col-sm-10">
                                <select name="district" required class="form-select" aria-label="Default select example">
                                    <option selected>Select District</option>
                                    <?php foreach ($districts_data as $key => $district_data)?>
                                    <option value="<?php echo $district_data['Lcode']; ?>"><?php echo $district_data['D_np']; ?></option>
                                </select>
                            </div>
                        </div>
                        <div class=" col-md-3 form-group">
                            <label class="control-label col-sm-2" for="region">Region:</label>
                            <div class="col-sm-10">
                                <select name="region" required class="form-select" aria-label="Default select example">
                                    <option selected>Select Region</option>
                                    <?php foreach ($regions_data as $key => $region_data)?>
                                    <option value="<?php echo $region_data['Lcode']; ?>"><?php echo $region_data['region_name']; ?></option>
                                </select>
                            </div>
                        </div>
                        <div class=" col-md-3 form-group">
                            <label class="control-label col-sm-2" for="region">Type:</label>
                            <div class="">
                                <div class="form-check d-flex align-items-center">
                                    <!-- <input class="form-check-input " type="radio" name="fed-prov" value="" id="federal"> -->
                                    <input type="radio" id="federal" name="fed-prov">
                                    <label class="form-check-label" for="federal">
                                        Federal
                                    </label>
                                </div>
                                <div class="form-check d-flex align-items-center">
                                    <!-- <input class="form-check-input" type="radio" name="fed-prov" value="" id="provincal" checked> -->
                                    <input type="radio" id="provincal" name="fed-prov">

                                    <label class="form-check-label" for="provincal">
                                        Provincal
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row my-3 " id="">

                        <div class=" col-md-3 form-group">
                            <label class="control-label col-sm-2" for="elected">Elected?</label>
                            <div class="">
                                <input type="checkbox" class="form-control" autocomplete="off" id="elected" name="elected">
                                <span>(Elected candidate's detail)</span>
                            </div>
                        </div>

                        <div class="col-md-9 elected-candidate-form">
                            <div class="row">
                                <div class="col-md-4 form-group">
                                    <label class="control-label col-sm-2" for="elected-name">Name:</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" required id="elected-name" name="elected-name" placeholder="Enter candidate name">
                                    </div>
                                </div>

                                <div class=" col-md-4 form-group">
                                    <label class="control-label col-sm-2" for="elected-party">Party:</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" required id="elected-party" name="elected-party" placeholder="Enter party">
                                    </div>
                                </div>
                                <div class=" col-md-4 form-group">
                                    <label class="control-label col-sm-2" for="elected-party">Vote:</label>
                                    <div class="col-sm-10">
                                        <input type="text" class="form-control" id="elected-vote" name="elected-vote" placeholder="Enter vote">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="formDiv">
                        <div class="row my-3 " id="result-form">
                            <div class="col-md-3 form-group">
                                <label class="control-label col-sm-2" for="name">Name:</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" required id="name" name="name[]" placeholder="Enter candidate name">
                                </div>
                            </div>

                            <div class=" col-md-3 form-group">
                                <label class="control-label col-sm-2" for="party">Party:</label>
                                <div class="col-sm-10">
                                    <!-- <input type="text" class="form-control" required id="party" name="party[]" placeholder="Enter party"> -->
                                </div>
                            </div>
                            <div class=" col-md-3 form-group">
                                <label class="control-label col-sm-2" for="party">Vote:</label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" id="vote" name="vote[]" placeholder="Enter vote">
                                </div>
                            </div>

                            <div class=" col-md-3 form-group">
                                <div class="">
                                    <button class="btn btn-info" id="addFormBtn" name="elected-vote">Add </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button type="submit" id="candidateSubmitBtn" class="btn btn-primary SubmitBtn">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>