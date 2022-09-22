jQuery(".submitBtnDiv").hide();
jQuery("#formDiv").hide();
jQuery("#elected-candidate-section").hide();

const API_BASE_URL = "http://localhost:3334/";
jQuery(document).ready(function () {
  fetch(API_BASE_URL + "api/v1/result/all")
    .then((resp) => resp.json())
    .then((data) => {
      result = data;
    });

  let partyOptions = "";
  partyData.data.forEach((party) => {
    partyOptions += "<option value='" + party.code + "' >" + party.name_np + "</option>\n";
  });
  let provinceDropDown = `<option value="">Select Province</option>`;

  regionData.data.provinces.forEach((province) => (provinceDropDown += `<option value="${province.id}">${province.name_np}</option>`));
  jQuery("#province-dropdown").html(provinceDropDown);

  jQuery("#candidateSubmitBtn").on("click", function () {
    let typeValue = jQuery("#type-dropdown").val();
    let provinceValue = jQuery("#province-dropdown").val();
    let districtValue = jQuery("#district-dropdown").val();
    let regionValue = jQuery("#region-dropdown").val();

    let resultData = result.data[0][typeValue].provinces
      .find((province) => province.id == provinceValue)
      .districts.find((district) => district.id == districtValue)
      .regions.find((region) => region.id == regionValue);

    var postdata = "action=candidateslist&param=savecandidate&dbaction=update&" + jQuery("#candidatesAdd").serialize();

    // fetch(API_BASE_URL + "/")
    jQuery.post(electionresultajaxurl, decodeURI(postdata), function (response) {
      let res = jQuery.parseJSON(response);

      if (res.status == 200) {
        let regionIndex = result.data[0][typeValue].provinces
          .find((province) => province.id == provinceValue)
          .districts.find((district) => district.id == districtValue)
          .regions.findIndex((region) => region.id == regionValue);

        let regionNewVal = {
          id: parseFloat(regionValue),
          declared: Object.keys(res.elected_candidate).length ? true : false,
          result: res.result,
          elected: res.elected_candidate,
        };

        result.data[0][typeValue].provinces.find((province) => province.id == provinceValue).districts.find((district) => district.id == districtValue).regions[regionIndex] = regionNewVal;

        console.log(result, regionNewVal, "newdata");
      } else {
        console.error("Update failed");
      }
    });
  });

  jQuery("#elected").click(function () {
    if (this.checked) {
      jQuery("#elected-candidate-detail").html(` <div class="row">
            <div class="col-md-3 form-group">
              <label class="control-label col-sm-2" for="elected-name">Name(English):</label>
              <div class="col-sm-12">
                <input type="text" class="form-control " required id="elected-name" name="elected-name" placeholder="Enter candidate name">
              </div>
            </div>

            <div class="col-md-3 form-group">
              <label class="control-label col-sm-2" for="elected-name-np">Name(Nepali):</label>
              <div class="col-sm-12">
                <input type="text" class="form-control " required id="elected-name-np" name="elected-name-np" placeholder="Enter candidate name in nepali">
              </div>
            </div>
  
            <div class="col-md-4 form-group">
              <label class="control-label col-sm-2" for="elected-party">Party:</label>
              <div class="col-sm-12">
                <select class="form-control" required id="elected-party" name="elected-party" >
                  ${partyOptions}
                </select>
              </div>
            </div>
            <div class="col-md-2 form-group">
              <label class="control-label col-sm-2" for="elected-party">Vote:</label>
              <div class="col-sm-12">
                <input type="text" class="form-control" id="elected-vote" name="elected-vote" placeholder="Enter vote">
              </div>
            </div>
        </div>`);
    } else {
      jQuery("#elected-candidate-detail").html("");
    }
  });

  var formDataDiv = `<div class="row my-3 " id="candirow">
          <div class="col-md-3 form-group">
            <div class="col-sm-10">
              <input type="text"  class="form-control" required id="name" name="name[]" placeholder="Enter candidate name">
            </div>
          </div>

          <div class="col-md-3 form-group">
              <div class="col-sm-10">
                <input type="text" class="form-control " required id="name-np" name="name_np[]" placeholder="Enter candidate name in nepali">
              </div>
            </div>
        
          <div class="col-md-4 form-group">
            <div class="col-sm-10">
              <select class="form-control" id="party" name="party[]" >
                ${partyOptions}
              </select>
            </div>
          </div>
          <div class="col-md-2 form-group">
            <div class="col-sm-10">
              <input type="text"  class="form-control" id="vote" name="vote[]" placeholder="Enter vote">
            </div>
          </div>
        
          <div class="col-md-1 form-group">
          <div class="actionBtnGroup col-sm-12">
                         
          <i id ="addFormBtn" class="fas fa-plus "></i>   

          </div>
          </div>
          </div>`;

  jQuery("#candidatesAdd").on("click", "#addFormBtn", function (e) {
    e.preventDefault();
    jQuery(this).attr("class", "fas fa-trash");
    jQuery(this).attr("id", "removeFormBtn");
    jQuery(this).parent().append('<i id ="editFormBtn" class="fas fa-pencil "></i>   ');
    jQuery("#result-form").append(formDataDiv);
  });

  jQuery("#candidatesAdd").on("click", "#removeFormBtn", function (e) {
    e.preventDefault();
    jQuery(this).parent().parent().parent().remove();
  });

  jQuery("#type-dropdown").change(function () {
    var typeId = jQuery(this).val();
    let provinceId = jQuery("#province-dropdown").val();
    let districtId = jQuery("#district-dropdown").val();
    let regionDropDown = `<option value="">Select Region</option>`;

    if (provinceId && districtId) {
      let regionsData = regionData.data.provinces.find((province) => province.id == provinceId).districts.find((district) => district.id == districtId).regions;
      regionsData = regionsData.filter((r) => r.rtype === typeId);

      regionsData.forEach(function (region) {
        regionDropDown += `<option value='${region.id}'> ${region.rtype}-${region.name_np}</option>`;
      });
      jQuery("#region-dropdown").html(regionDropDown);
    }
  });

  jQuery("#province-dropdown").change(function () {
    var provinceId = jQuery(this).val();
    let districtDropDown = `<option value="">Select District</option>`;

    var districts_list = regionData.data.provinces.find(function (province, index) {
      return province.id == parseInt(provinceId);
    }).districts;

    districts_list.forEach(function (district) {
      districtDropDown += `<option value='${district.id}'> ${district.name_np}</option>`;
    });

    jQuery("#district-dropdown").html(districtDropDown);
  });

  jQuery("#district-dropdown").change(function () {
    let districtId = jQuery(this).val();
    let provinceId = jQuery("#province-dropdown").val();
    var typeId = jQuery("#type-dropdown").val();
    let regionDropDown = `<option value="">Select Region</option>`;

    let regionsData = regionData.data.provinces.find((province) => province.id == provinceId).districts.find((district) => district.id == districtId).regions;
    regionsData = regionsData.filter((r) => r.rtype === typeId);

    regionsData.forEach(function (region) {
      regionDropDown += `<option value='${region.id}'> ${region.rtype}-${region.name_np}</option>`;
    });
    jQuery("#region-dropdown").html(regionDropDown);
  });

  jQuery("#region-dropdown").change(function () {
    jQuery(".submitBtnDiv").show();
    jQuery("#formDiv").show();
    jQuery("#elected-candidate-section").show();

    let typeId = jQuery("#type-dropdown").val();
    let provinceId = jQuery("#province-dropdown").val();
    let districtId = jQuery("#district-dropdown").val();
    let regionId = jQuery("#region-dropdown").val();
    var optionSelected = jQuery("option:selected", this);

    let response = result.data[0][typeId].provinces
      .find((province) => province.id == provinceId)
      .districts.find((district) => district.id == districtId)
      .regions.find((region) => region.id == regionId);

    let electedObj = response.elected;
    if (Object.keys(electedObj).length) {
      jQuery("#elected").attr("checked", true);
      // jQuery("#elected").attr("disabled", "disabled");
      jQuery("#elected-candidate-detail").html(` <div class="row">
            <div class="col-md-3 form-group">
              <label class="control-label col-sm-2" for="elected-name">Name(English):</label>
              <div class="col-sm-12">
                <input type="text" value="${electedObj.name_np}" class="form-control" required id="elected-name" name="elected-name" placeholder="Enter candidate name">
              </div>
            </div>
            <div class="col-md-3 form-group">
            <label class="control-label col-sm-2" for="elected-name">Name(Nepali):</label>
              <div class="col-sm-12">
                <input type="text" value="${electedObj.name_en}" class="form-control " required id="elected-name-np" name="elected-name-np" placeholder="Enter candidate name in nepali">
              </div>
            </div>
            <div class="col-md-4 form-group">
              <label class="control-label col-sm-2" for="elected-party">Party:</label>
              <div class="col-sm-12">
                <select class="form-control" id="elected-party" name="elected-party" value="${electedObj.party}" required>
                  ${partyOptions}
                </select>
              </div>
            </div>
            <div class="col-md-2 form-group">
              <label class="control-label col-sm-2" for="elected-party">Vote:</label>
              <div class="col-sm-12">
                <input type="text" value="${electedObj.vote}" class="form-control" id="elected-vote" name="elected-vote" placeholder="Enter vote">
              </div>
            </div>
        </div>`);
    } else {
      jQuery("#elected").prop("checked", false);
      jQuery("#elected-candidate-detail").html("");
      jQuery("#elected").attr("disabled", false);
    }

    if (response.result.length) {
      let formDataDiv = "";
      for (let i = 1; i <= response.result.length; i++) {
        let obj = response.result[i - 1];

        if (i == response.result.length) {
          formDataDiv += `<div class="row my-3 " id="candirow">
                        <div class="col-md-3 form-group">
                            <div class="col-sm-10">
                            <input type="text" value="${obj.name_en}" class="form-control" required id="name" name="name[]" placeholder="Enter candidate name">
                            </div>
                        </div>

                        <div class="col-md-3 form-group">
                            <div class="col-sm-10">
                            <input type="text" value="${obj.name_np}" class="form-control" required id="name-np" name="name_np[]" placeholder="Enter candidate name in nepali">
                            </div>
                        </div>
                        
                        <div class="col-md-4 form-group">
                            <div class="col-sm-10">
                            <select value="${obj.party}" class="form-control" required id="party-${i}" name="party[]">
                              ${partyOptions}
                            </select>
                            </div>
                        </div>
                        <div class="col-md-2 form-group">
                            <div class="col-sm-10">
                            <input type="text" value="${obj.vote}" class="form-control" id="vote" name="vote[]" placeholder="Enter vote">
                            </div>
                        </div>
                        
                        <div class="col-md-1 form-group">
                            <div class="actionBtnGroup col-sm-12">
                            <i id ="addFormBtn" class="fas fa-plus "></i>   
                            </div>
                        </div>
                        </div>`;
        } else {
          formDataDiv += `<div class="row my-3 " id="candirow">
                            <div class="col-md-3 form-group">
                            <div class="col-sm-10">
                                <input type="text" value="${obj.name_en}" class="form-control" required id="name" name="name[]" placeholder="Enter candidate name">
                            </div>
                            </div>
                            <div class="col-md-3 form-group">
                            <div class="col-sm-10">
                                <input type="text" value="${obj.name_np}" class="form-control" required id="name-np" name="name_np[]" placeholder="Enter candidate name in nepali">
                            </div>
                            </div>
                            <div class="col-md-4 form-group">
                            <div class="col-sm-10">
                              <select value="${obj.party}" class="form-control" required id="party-${i}" name="party[]" >
                                ${partyOptions}
                              </select>
                            </div>
                            </div>
                            <div class="col-md-2 form-group">
                            <div class="col-sm-10">
                                <input type="text" value="${obj.vote}" class="form-control" id="vote" name="vote[]" placeholder="Enter vote">
                            </div>
                            </div>
                            <div class="col-md-1 form-group">
                            <div class="actionBtnGroup col-sm-12">
                            <i id="removeFormBtn" class="fas fa-trash "></i>   
                            <i id="editFormBtn" class="fas fa-pencil "></i>   
                            </div>
                            </div>
                            </div>`;
        }

        jQuery("#result-form").html(formDataDiv);
      }

      for (let i = 1; i <= response.result.length; i++) {
        let obj = response.result[i - 1];
        jQuery("#party-" + i).val(obj.party);
      }
    } else {
      jQuery("#result-form").html(formDataDiv);
    }
  });
});
