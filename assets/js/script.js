const API_BASE_URL = "http://localhost:3334/";

function updateCheckData(e) {
  e.parentElement.parentElement.querySelector("input[type=checkbox]").setAttribute("data-name", e.value);
}

function electedChecked(e) {
  let electedCheckbox = document.querySelectorAll(".elected");
  for (let i = 0; i < electedCheckbox.length; i++) {
    if (e.getAttribute("data-name") !== electedCheckbox[i].getAttribute("data-name")) {
      electedCheckbox[i].checked = false;
      electedCheckbox[i].parentElement.querySelector("input[type=hidden]").value = "no";
    }
  }
  if (e.parentElement.querySelector("input[type=hidden]").value === "yes") {
    e.checked = false;
    e.parentElement.querySelector("input[type=hidden]").value = "no";
  } else {
    e.checked = true;
    e.parentElement.querySelector("input[type=hidden]").value = "yes";
  }
}

let close = document.querySelectorAll(".result .closebtn");

for (let i = 0; i < close.length; i++) {
  close[i].onclick = () => {
    let div = this.parentElement;
    div.style.display = "0";
    setTimeout(() => {
      div.style.display = "none";
    }, 600);
    setTimeout(() => {
      div.style.display = "1";
    }, 600);
  };
}

function notify(type) {
  let notif = document.querySelector(".result ." + type);
  notif.style.display = "block";
  setTimeout(() => {
    notif.style.display = "none";
  }, 2000);
}

function populateDistricts(provinceId) {
  let districtDropDown = `<option value="">जिल्ला छान्नुहोस्</option>`;

  let districts = [];
  if (provinceId) {
    districts = allRegions.data.provinces.find((province) => {
      return province.id == parseInt(provinceId);
    }).districts;
  } else {
    allRegions.data.provinces.forEach((province) => {
      districts = districts.concat(province.districts);
    });
  }
  districts.forEach((district) => {
    districtDropDown += `<option value='${district.id}'> ${district.name_np}</option>`;
  });

  jQuery("#district-dropdown").html(districtDropDown);
}

function populateRegions(provinceId, districtId) {
  let typeId = jQuery("#type-dropdown").val();

  let regionDropDown = `<option value="">क्षेत्र छान्नुहोस्</option>`;

  if (provinceId && districtId) {
    const district = allRegions.data.provinces.find((province) => province.id == provinceId).districts.find((district) => district.id == districtId);
    let regions = district.regions;
    regions = regions.filter((r) => r.rtype === typeId);

    regions.forEach(function (region) {
      regionDropDown += `<option value='${region.id}'> ${district.name_np}-${region.name_np}</option>`;
    });
  }

  jQuery("#region-dropdown").html(regionDropDown);
}

function populateData(result) {
  populateDistricts();
  populateRegions();
  let partyOptions = "";
  parties.data
    .sort((a, b) => (a.name_en > b.name_en ? -1 : 1))
    .forEach((party) => {
      partyOptions += "<option value='" + party.code + "' >" + party.name_np + "</option>\n";
    });

  let provinceDropDown = `<option value="">प्रदेश छान्नुहोस्</option>`;

  allRegions.data.provinces.forEach((province) => (provinceDropDown += `<option value="${province.id}">${province.name_np}</option>`));
  jQuery("#province-dropdown").html(provinceDropDown);

  jQuery("#result-submit-btn").on("click", function () {
    let typeValue = jQuery("#type-dropdown").val();
    let provinceValue = jQuery("#province-dropdown").val();
    let districtValue = jQuery("#district-dropdown").val();
    let regionValue = jQuery("#region-dropdown").val();
    jQuery("#result-submit-btn").prop("disabled", true);

    let postdata = "action=update_result&dbaction=insert_update&" + jQuery("#directly-elected-resultt-form").serialize();

    jQuery.post(electionresultajaxurl, decodeURI(postdata), function (response) {
      let res = jQuery.parseJSON(response);
      jQuery("#result-submit-btn").prop("disabled", false);

      if (res.status === 200) {
        notify("success");

        let newData = candidates.data.filter((c) => c.rtype === typeValue && c.province_id === provinceValue && c.district_id === districtValue && c.region_id === regionValue);

        newData = [...newData, ...res.data];
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
                      <select class="form-control" id="party" name="party[]" onChange="updateCheckData(this)">${partyOptions}</select>
                  </div>
                  <div class="col-md-vote form-group">
                      <input type="number" class="form-control" id="vote" name="vote[]">
                  </div>
                  <div class="col-md-check form-group">
                      <input type="hidden" name="elected[]" value="" />
                      <input type="checkbox" autocomplete="off" data-name="" class="form-control elected" name="elected[]" onClick="electedChecked(this)">
                  </div>
                  <div class="col-md-3 form-group">
                      <textarea type="text" class="form-control" name="descriptions[]" placeholder="Enter short details of candidate" rows="3" cols="33"></textarea>
                  </div>
                  <div class="col-md-1 form-group">
                    <div class="actionBtnGroup col-sm-12">
                      <i id="removeFormBtn" class="fas fa-trash"></i>
                      <i id ="addFormBtn" class="fas fa-plus"></i>
                    </div>
                  </div>
                </div>`;

  jQuery("#directly-elected-resultt-form").on("click", "#addFormBtn", function (e) {
    e.preventDefault();
    jQuery(this).attr("class", "fas fa-trash");
    jQuery(this).attr("id", "removeFormBtn");
    jQuery(this).parent().append('<i id ="editFormBtn" class="fas fa-pencil"></i>');
    jQuery("#result-form").append(rowTpl);
    jQuery(this).remove();
  });

  jQuery("#directly-elected-resultt-form").on("click", "#removeFormBtn", function (e) {
    e.preventDefault();
    jQuery(this).parent().parent().parent().remove();
    jQuery("#result-form").children().last().find("#editFormBtn").remove();
    jQuery("#result-form").children().last().find(".actionBtnGroup").append('<i id ="addFormBtn" class="fas fa-plus"></i>');
  });

  jQuery("#type-dropdown").change(function () {
    let typeId = jQuery(this).val();
    let provinceId = jQuery("#province-dropdown").val();
    let districtId = jQuery("#district-dropdown").val();
    let regionDropDown = `<option value="">क्षेत्र छान्नुहोस्</option>`;

    if (provinceId && districtId) {
      const district = allRegions.data.provinces.find((province) => province.id == provinceId).districts.find((district) => district.id == districtId);
      let regions = district.regions;
      regions = regions.filter((r) => r.rtype === typeId);

      regions.forEach(function (region) {
        regionDropDown += `<option value='${region.id}'> ${district.name_np}-${region.name_np}</option>`;
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

    for (let i = 0; i < allRegions.data.provinces.length; i++) {
      let districts = allRegions.data.provinces[i].districts;
      for (let j = 0; j < districts.length; j++) {
        if (districts[j].id === districtId) {
          provinceId = allRegions.data.provinces[i].id;
          break;
        }
      }
    }

    jQuery("#province-dropdown").val(provinceId);

    populateRegions(provinceId, districtId);
  });

  jQuery("#region-dropdown").change(function () {
    jQuery("#candidate-form").show();

    let typeId = jQuery("#type-dropdown").val();
    let provinceId = jQuery("#province-dropdown").val();
    let districtId = jQuery("#district-dropdown").val();
    let regionId = jQuery("#region-dropdown").val();
    if (!regionId) {
      return true;
    }

    jQuery("#result-submit-btn").prop("disabled", false);

    let regions = candidates.data.filter((c) => c.rtype === typeId && c.province_id == provinceId && c.district_id == districtId && c.region_id == regionId);

    if (regions.length) {
      let formDataDiv = "";
      for (let i = 1; i <= regions.length; i++) {
        let obj = regions[i - 1];

        if (i == regions.length) {
          formDataDiv += `<div class="row my-3 candidate-row">
                        <div class="col-md-2 form-group">
                            <input type="text" value="${obj.name_en}" class="form-control" required name="name[]" placeholder="Enter candidate name">
                        </div>
                        <div class="col-md-2 form-group">
                            <input type="text" value="${obj.name_np}" class="form-control" required name="name_np[]" placeholder="Enter candidate name in nepali">
                        </div>
                        <div class="col-md-3 form-group">
                            <select value="${obj.party_code}" class="form-control" required name="party[]" id="party-${i}" onChange="updateCheckData(this)">${partyOptions}</select>
                        </div>
                        <div class="col-md-vote form-group">
                            <input type="number" value="${obj.vote}" class="form-control" name="vote[]">
                        </div>
                        <div class="col-md-check form-group">
                            <input type="hidden" name="elected[]" value="${obj.elected ? "yes" : ""}" />
                            <input type="checkbox" autocomplete="off" data-name="${obj.party_code}" class="form-control elected" ${obj.elected ? "checked" : ""} onClick="electedChecked(this)">
                        </div>
                        <div class="col-md-3 form-group">
                            <textarea type="text" class="form-control" name="descriptions[]" rows="3" cols="33">${obj.descriptions ? obj.descriptions : ""}</textarea>
                        </div>
                        <div class="col-md-1 form-group">
                            <div class="actionBtnGroup col-sm-12">
                            <i id="removeFormBtn" class="fas fa-trash"></i>
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
                              <select value="${obj.party_code}" class="form-control" required name="party[]" id="party-${i}" onChange="updateCheckData(this)">${partyOptions}</select>
                            </div>
                            <div class="col-md-vote form-group">
                                <input type="number" value="${obj.vote}" class="form-control" name="vote[]">
                            </div>
                            <div class="col-md-check form-group">
                                <input type="hidden" name="elected[]" value="${obj.elected ? "yes" : ""}" />
                                <input type="checkbox" autocomplete="off" data-name="${obj.party_code}" class="form-control elected" ${obj.elected ? "checked" : ""} onClick="electedChecked(this)">
                            </div>
                            <div class="col-md-3 form-group">
                                <textarea type="text" class="form-control" name="descriptions[]" rows="3" cols="33">${obj.descriptions ? obj.descriptions : ""}</textarea>
                            </div>
                            <div class="col-md-1 form-group">
                              <div class="actionBtnGroup col-sm-12">
                                <i id="removeFormBtn" class="fas fa-trash"></i>
                                <i id="editFormBtn" class="fas fa-pencil "></i>
                              </div>
                            </div>
                          </div>`;
        }
        jQuery("#result-form").html(formDataDiv);
      }

      for (let i = 1; i <= regions.length; i++) {
        let obj = regions[i - 1];
        jQuery("#party-" + i).val(obj.party_code);
      }
    } else {
      jQuery("#result-form").html(rowTpl);
    }
  });
}

function bindProportionalPageEvents() {
  jQuery("#pr-result-submit-btn").on("click", function () {
    jQuery("#pr-result-submit-btn").prop("disabled", true);

    let postdata = "action=update_pr_result&dbaction=update&" + jQuery("#proportional-result-form").serialize();

    jQuery.post(electionresultajaxurl, decodeURI(postdata), function (response) {
      let res = jQuery.parseJSON(response);
      jQuery("#pr-result-submit-btn").prop("disabled", false);

      if (res.status === 200) {
        notify("success");
        pr_result.data = res.data;
        let searchKey = document.getElementById("search-party").value;
        filterParty(searchKey);
      } else if (res.status === 100) {
        notify("info");
        console.warn("Update failed");
      } else {
        notify("error");
        console.error("Update failed");
      }
    });
  });
}

function populateProportionalData(data) {
  let rows = "";
  if (data.length === 0) {
    jQuery("#pr-form").html(`<div class="row my-3 party-row">No matching results</div>`);
  } else {
    const sortedData = data.sort((p, q) => q.vote - p.vote);
    jQuery("#pr-form").html("");
    sortedData.forEach((p, i) => {
      const partyDetails = parties.data.find((pd) => pd.code === p.party);
      rows += `<div class="row my-3 party-row">
              <div class="col-md-2 form-group">
                <label>${i + 1}</label>
              </div>
              <div class="col-md-6 form-group">
                <input type="hidden" value="${p.party}" class="form-control" name="party[]">
                <label class="table-label">${partyDetails ? partyDetails.name_np : p.party}</label>
              </div>
              <div class="col-md-4 form-group">
                <input type="number" value="${p.vote}" class="form-control" name="vote[]">
              </div>
            </div>`;
    });

    jQuery("#pr-form").html(rows);
  }
}

function handleFilterParty(e) {
  filterParty(e.value);
}

function filterParty(value) {
  if (value) {
    const filteredParties = parties.data.filter((p) => p.name_en.toLowerCase().includes(value.toLowerCase()) || p.name_np.includes(value));
    const filteredPR = pr_result.data.filter((pr) => filteredParties.find((fp) => fp.code === pr.party));
    populateProportionalData(filteredPR);
  } else {
    populateProportionalData(pr_result.data);
  }
}

jQuery(document).ready(function () {
  fetch(API_BASE_URL + "api/v1/party/all")
    .then((resp) => resp.json())
    .then((data) => {
      parties = data;
    })
    .catch((e) => {
      console.error(e);
    });

  fetch(API_BASE_URL + "api/v1/candidate/all")
    .then((resp) => resp.json())
    .then((data) => {
      candidates = data;
      populateData(candidates.data);
    })
    .catch((e) => {
      console.error(e);
      populateData(result);
    });

  fetch(API_BASE_URL + "api/v1/result/proportional")
    .then((resp) => resp.json())
    .then((data) => {
      pr_result = data;
      populateProportionalData(pr_result.data);
      bindProportionalPageEvents();
    })
    .catch((e) => {
      console.error(e);
      populateProportionalData(pr_result.data);
      bindProportionalPageEvents();
    });
});
