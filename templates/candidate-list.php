<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">


<div class="container" style="margin-top: 20px; padding: 0;max-width: 1080px;">
    <div class="row">
        <div class="alert alert-info" style="background-color: #ecebea;border: none;color: #AF8309;margin-bottom: 30px;">
            <h4 class="text-center">General Election 2079</h4>
        </div>

        <!-- <i class="fa fa-times-circle" aria-hidden="true"></i> -->
        <div id="successMessage" style="text-align:center;">

            <div style="display: flex; justify-content: start;">
                <div style="background: green; width: 80px; display: flex; justify-content: center; align-items: center; border-top-left-radius: 4px; border-bottom-left-radius: 4px;">
                    <i style="font-size: 1.3rem; color: #FFBC00;" class="fa fa-check-circle" aria-hidden="true"></i>
                </div>
                <div style="text-align: left; padding: 5px; padding-left: 15px;">
                    <h3 style="padding: 0; margin: 0; font-size: 1.2rem; font-weight: normal;line-height: 1.1;">
                        Success
                    </h3>
                    <p>
                        Candidate updated successfully
                    </p>
                </div>
            </div>
            <div>
                <p style="padding: 15px; font-size: .9rem;">Close</p>
            </div>
        </div>
        <form class="form-horizontal" action="javascript:void(0)" id="candidatesAdd">
            <div class="row">
                <div class=" col-md-3 form-group">
                    <label class="control-label col-sm-2" for="type">Type:</label>
                    <div class="col-sm-12">
                        <select name="type" id="type-dropdown" class="form-select" value="federal" required aria-label="Default select example">
                            <option value="federal">Federal</option>
                            <option value="provincial">Provincial</option>
                        </select>
                    </div>
                </div>

                <div class=" col-md-3 form-group">
                    <label class="control-label col-sm-2" for="province">Province:</label>
                    <div class="col-sm-12">
                        <select name="province" id="province-dropdown" class="form-select" required aria-label="Default select example">
                        </select>
                    </div>
                </div>

                <div class="col-md-3 form-group">
                    <label class="control-label col-sm-2" for="district">District:</label>
                    <div class="col-sm-12">
                        <select name="district" id="district-dropdown" required class="form-select" aria-label="Default select example">
                        </select>
                    </div>
                </div>

                <div class=" col-md-3 form-group">
                    <label class="control-label col-sm-2" for="region">Region:</label>
                    <div class="col-sm-12">
                        <select name="region" id="region-dropdown" required class="form-select" aria-label="Default select example">

                        </select>
                    </div>
                </div>
            </div>
            <div class="row my-3 " id="elected-candidate-section">

                <div class="col-md-3  form-group">
                    <label class="control-label col-sm-2" for="elected">Elected?</label>
                    <div class="">
                        <input type="checkbox" class="form-control" autocomplete="off" id="elected" name="elected">
                        <span style="font-size:14px;">(Elected candidate's detail)</span>
                    </div>
                </div>
                <div class="col-md-9 " id="elected-candidate-detail">
                </div>
            </div>
            <div id="formDiv">
                <div class="row tableHeading" style="background: #e8e8e8; padding: 10px 0; border-radius: 3px; color: #AF8309;">
                    <div class="col-md-3">Name</div>
                    <div class="col-md-3">Name(Nepali)</div>
                    <div class="col-md-3">Party</div>
                    <div class="col-md-3">Vote</div>
                    <div class="col-md-3">Action</div>
                </div>
                <div class=" my-3 " id="result-form">
                </div>
            </div>
            <div class="form-group submitBtnDiv">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-primary submitBtn">Submit</button>
                </div>
            </div>
        </form>

    </div>
</div>