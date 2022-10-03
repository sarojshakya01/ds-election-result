<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">


<div class="result-container">
  <div class="row">
    <div class="form-heading">
      <h4 class="text-center">General Election 2079 (Directly Elected Result)</h4>
    </div>
    <div class="result">
      <div class="error" style="display: none">
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        Error in Data Update!
      </div>
      <div class="info" style="display: none">
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        Data not updated!
      </div>
      <div class="success" style="display: none">
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
        Data Updated Successfully!
      </div>
    </div>
    <form class="form-horizontal" action="javascript:void(0)" id="directly-elected-resultt-form">
      <div class="row">
        <div class=" col-md-3 form-group">
          <label class="control-label col-sm-2" for="type">Type:</label>
          <div class="col-sm-12">
            <select name="type" id="type-dropdown" class="form-select" value="federal" required
              aria-label="Default select example">
              <option value="federal">प्रतिनिधिसभा</option>
              <option value="provincial">प्रदेशसभा</option>
            </select>
          </div>
        </div>

        <div class=" col-md-3 form-group">
          <label class="control-label col-sm-2" for="province">Province:</label>
          <div class="col-sm-12">
            <select name="province" id="province-dropdown" class="form-select" required
              aria-label="Default select example">
            </select>
          </div>
        </div>

        <div class="col-md-3 form-group">
          <label class="control-label col-sm-2" for="district">District:</label>
          <div class="col-sm-12">
            <select name="district" id="district-dropdown" required class="form-select"
              aria-label="Default select example">
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
      <div id="candidate-form" style="display: none">
        <div class="row table-heading">
          <div class="col-md-2">Name</div>
          <div class="col-md-2">Name(Nepali)</div>
          <div class="col-md-3">Party</div>
          <div class="col-md-vote">Vote</div>
          <div class="col-md-check">Elected</div>
          <div class="col-md-3">Description</div>
          <div class="col-md-1">Action</div>
        </div>
        <div class="my-3" id="result-form">
        </div>
      </div>
      <div class="form-group submit-btn-container">
        <div class="pull-right">
          <button type="submit" id="result-submit-btn" class="btn btn-primary submit-btn" disabled>Submit</button>
        </div>
      </div>
    </form>

  </div>
</div>