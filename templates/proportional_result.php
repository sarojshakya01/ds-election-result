<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">


<div class="result-container">
    <div class="row">
        <div class="form-heading">
            <h4 class="text-center">General Election 2079 (Proportional Result)</h4>
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
        <form class="form-horizontal" action="javascript:void(0)" id="proportional-result-form">
            <div id="party-form">
                <div class="row">
                    <div class="col-md-6">
                        <input type="text" id="search-party" placeholder="Search Party" class="form-control" onKeyup="handleFilterParty(this)">
                    </div>
                    <div class="col-md-6 form-group">
                        <div class="pull-right">
                            <button type="submit" id="pr-result-submit-btn" class="btn btn-primary submit-btn">Submit</button>
                        </div>
                    </div>
                </div>
                <div class="row sh-table-heading">
                    <div class="col-md-1">S.N.</div>
                    <div class="col-md-3">Party</div>
                    <div class="col-md-1">Vote - All</div>
                    <div class="col-md-1">Vote - Province 1</div>
                    <div class="col-md-1">Vote - Madhesh Pradesh</div>
                    <div class="col-md-1">Vote - Bagmati Pradesh</div>
                    <div class="col-md-1">Vote - Gandaki Pradesh</div>
                    <div class="col-md-1">Vote - Lumbini Pradesh</div>
                    <div class="col-md-1">Vote - Karnali Pradesh</div>
                    <div class="col-md-1">Vote - SuPa Pradesh</div>
                </div>
                <div class="my-3" id="pr-form">
                </div>
            </div>
        </form>
    </div>
</div>