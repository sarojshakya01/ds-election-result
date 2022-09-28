const API_BASE_URL = "http://localhost:3334/";

jQuery("#formDiv").hide();
jQuery("#elected-candidate-section").hide();

function electedChecked(e) {
  let electedCheckbox = document.querySelectorAll(".elected");
  for (let i = 0; i < electedCheckbox.length; i++) {
    electedCheckbox[i].checked = false;
  }
  e.checked = true;
}

let close = document.querySelectorAll(".result .closebtn");

for (let i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    let div = this.parentElement;
    div.style.opacity = "0";
    setTimeout(function () {
      div.style.display = "none";
    }, 600);
  };
}

function notify(type) {
  let notif = document.querySelector(".result ." + type);
  notif.style.display = "block";
  setTimeout(function () {
    notif.style.display = "none";
  }, 2000);
}

function populateDistricts(provinceId) {
  let districtDropDown = `<option value="">Select District</option>`;

  let districts_list = [];
  if (provinceId) {
    districts_list = regionData.data.provinces.find(function (province, index) {
      return province.id == parseInt(provinceId);
    }).districts;
  } else {
    regionData.data.provinces.forEach(function (province, index) {
      districts_list = districts_list.concat(province.districts);
    });
  }
  districts_list.forEach(function (district) {
    districtDropDown += `<option value='${district.id}'> ${district.name_np}</option>`;
  });

  jQuery("#district-dropdown").html(districtDropDown);
}

function populateRegions(provinceId, districtId) {
  let typeId = jQuery("#type-dropdown").val();
  let regionDropDown = `<option value="">Select Region</option>`;

  if (provinceId || districtId) {
    let regions_list = regionData.data.provinces.find((province) => province.id == provinceId).districts.find((district) => district.id == districtId).regions;
    regions_list = regions_list.filter((r) => r.rtype === typeId);

    regions_list.forEach(function (region) {
      regionDropDown += `<option value='${region.id}'> ${region.rtype}-${region.name_np}</option>`;
    });
  }

  jQuery("#region-dropdown").html(regionDropDown);
}

function populateData(result) {
  populateDistricts();
  populateRegions();
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
    jQuery("#candidateSubmitBtn").prop("disabled", true);

    let postdata = "action=candidateslist&param=savecandidate&dbaction=update&" + jQuery("#candidatesAdd").serialize();

    jQuery.post(electionresultajaxurl, decodeURI(postdata), function (response) {
      let res = jQuery.parseJSON(response);
      jQuery("#candidateSubmitBtn").prop("disabled", false);

      if (res.status === 200) {
        notify("success");
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
      } else if (res.status === 100) {
        notify("info");
        console.warn("Update failed");
      } else {
        notify("error");
        console.error("Update failed");
      }
    });
  });

  let rowTpl = `<div class="row my-3 candidate-row">
                  <div class="col-md-2 form-group">
                      <input type="text"  class="form-control" required id="name" name="name[]" placeholder="Enter candidate name">
                  </div>
                  <div class="col-md-2 form-group">
                      <input type="text" class="form-control" required id="name-np" name="name_np[]" placeholder="Enter candidate name in nepali">
                  </div>
                  <div class="col-md-3 form-group">
                      <select class="form-control" id="party" name="party[]" >${partyOptions}</select>
                  </div>
                  <div class="col-md-1 form-group">
                      <input type="text" class="form-control" id="vote" name="vote[]" placeholder="Enter vote">
                  </div>
                  <div class="col-md-1 form-group">
                      <input type="checkbox" autocomplete="off" class="form-control elected" name="elected[]" onClick="electedChecked(this)">
                  </div>
                  <div class="col-md-3 form-group">
                      <textarea type="text" class="form-control" name="descriptions[]" placeholder="Enter short details of candidate" rows="3" cols="33"></textarea>
                  </div>
                  <div class="col-md-1 form-group">
                    <div class="actionBtnGroup col-sm-12">
                      <i id ="addFormBtn" class="fas fa-plus"></i>   
                    </div>
                  </div>
                </div>`;

  jQuery("#candidatesAdd").on("click", "#addFormBtn", function (e) {
    e.preventDefault();
    jQuery(this).attr("class", "fas fa-trash");
    jQuery(this).attr("id", "removeFormBtn");
    jQuery(this).parent().append('<i id ="editFormBtn" class="fas fa-pencil "></i>   ');
    jQuery("#result-form").append(rowTpl);
  });

  jQuery("#candidatesAdd").on("click", "#removeFormBtn", function (e) {
    e.preventDefault();
    jQuery(this).parent().parent().parent().remove();
  });

  jQuery("#type-dropdown").change(function () {
    let typeId = jQuery(this).val();
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
    let provinceId = jQuery(this).val();
    populateDistricts(provinceId);
  });

  jQuery("#district-dropdown").change(function () {
    let districtId = jQuery(this).val();

    let provinceId = jQuery("#province-dropdown").val();

    for (let i = 0; i < regionData.data.provinces.length; i++) {
      let districts = regionData.data.provinces[i].districts;
      for (let j = 0; j < districts.length; j++) {
        if (districts[j].id === districtId) {
          provinceId = regionData.data.provinces[i].id;
          break;
        }
      }
    }

    jQuery("#province-dropdown").val(provinceId);

    populateRegions(provinceId, districtId);
  });

  jQuery("#region-dropdown").change(function () {
    jQuery("#formDiv").show();
    jQuery("#elected-candidate-section").show();

    let typeId = jQuery("#type-dropdown").val();
    let provinceId = jQuery("#province-dropdown").val();
    let districtId = jQuery("#district-dropdown").val();
    let regionId = jQuery("#region-dropdown").val();
    if (!regionId) {
      return true;
    }

    jQuery("#candidateSubmitBtn").prop("disabled", false);

    let response = result.data[0][typeId].provinces
      .find((province) => province.id == provinceId)
      .districts.find((district) => district.id == districtId)
      .regions.find((region) => region.id == regionId);

    let electedObj = response.elected;

    if (response.result.length) {
      let formDataDiv = "";
      for (let i = 1; i <= response.result.length; i++) {
        let obj = response.result[i - 1];
        let elected = false;
        if (Object.keys(electedObj).length && electedObj.name_en === obj.name_en) {
          elected = true;
        }
        if (i == response.result.length) {
          formDataDiv += `<div class="row my-3 candidate-row">
                        <div class="col-md-2 form-group">
                            <input type="text" value="${obj.name_en}" class="form-control" required name="name[]" placeholder="Enter candidate name">
                        </div>
                        <div class="col-md-2 form-group">
                            <input type="text" value="${obj.name_np}" class="form-control" required name="name_np[]" placeholder="Enter candidate name in nepali">
                        </div>
                        <div class="col-md-3 form-group">
                            <select value="${obj.party}" class="form-control" required name="party[]" id="party-${i}">${partyOptions}</select>
                        </div>
                        <div class="col-md-1 form-group">
                            <input type="text" value="${obj.vote}" class="form-control" name="vote[]" placeholder="Enter vote">
                        </div>
                        <div class="col-md-1 form-group">
                            <input type="checkbox" autocomplete="off" class="form-control elected" name="elected[]" ${elected ? "checked" : ""} onClick="electedChecked(this)">
                        </div>
                        <div class="col-md-3 form-group">
                            <textarea type="text" class="form-control" name="descriptions[]" rows="3" cols="33">${obj.descriptions ? obj.descriptions : ""}</textarea>
                        </div>
                        <div class="col-md-1 form-group">
                            <div class="actionBtnGroup col-sm-12">
                            <i id ="addFormBtn" class="fas fa-plus "></i>   
                            </div>
                        </div>
                        </div>`;
        } else {
          formDataDiv += `<div class="row my-3 candidate-row">
                            <div class="col-md-2 form-group">
                                <input type="text" value="${obj.name_en}" class="form-control" required name="name[]" placeholder="Enter candidate name">
                            </div>
                            <div class="col-md-2 form-group">
                                <input type="text" value="${obj.name_np}" class="form-control" required name="name_np[]" placeholder="Enter candidate name in nepali">
                            </div>
                            <div class="col-md-3 form-group">
                              <select value="${obj.party}" class="form-control" required name="party[]" id="party-${i}">${partyOptions}</select>
                            </div>
                            <div class="col-md-1 form-group">
                                <input type="text" value="${obj.vote}" class="form-control" name="vote[]" placeholder="Enter vote">
                            </div>
                            <div class="col-md-1 form-group">
                                <input type="checkbox" autocomplete="off" class="form-control elected" name="elected[]" ${elected ? "checked" : ""} onClick="electedChecked(this)">
                            </div>
                            <div class="col-md-3 form-group">
                                <textarea type="text" class="form-control" name="descriptions[]" rows="3" cols="33">${obj.descriptions ? obj.descriptions : ""}</textarea>
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
}

jQuery(document).ready(function () {
  fetch(API_BASE_URL + "api/v1/result/all")
    .then((resp) => resp.json())
    .then((data) => {
      result = data;
      populateData(result);
    })
    .catch((e) => {
      console.error(e);
      populateData(result);
    });
});
