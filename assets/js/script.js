const API_BASE_URL = "https://electionapi.deshsanchar.com/";
// const API_BASE_URL = "http://localhost:3334/";

function updateCheckData(e) {
  e.parentElement.parentElement
    .querySelector("input[type=checkbox]")
    .setAttribute("data-name", e.value);

  if (e.value === "I") {
    let inndepentCount = 0;
    for (let i = 0; i < jQuery(".party").length; i++) {
      let p = jQuery(".party")[i];
      if (p.value.match(/I+\d/)) {
        inndepentCount++;
      }
    }
    const iId = "I" + (inndepentCount + 1);
    e.options.forEach((opt) => {
      if (opt.value === "I") {
        opt.value = iId;
      }
    });
    e.value = iId;
  }
}

function checkHighestVotes(e) {
  let candidateVotes = document.getElementsByName("vote[]");
  let vote = e.parentElement.previousElementSibling.firstElementChild.value;
  for (let i = 0; i < candidateVotes.length; i++) {
    if (jQuery(".vote_message")[i]) jQuery(".vote_message")[i].innerHTML = "";
    if (vote < parseInt(candidateVotes[i].value)) {
      e.parentElement.querySelector(".vote_message").innerHTML =
        "Another candidate has greater value of vote.";
    }
  }
}

function electedChecked(e) {
  checkHighestVotes(e);
  let electedCheckbox = document.querySelectorAll(".elected");
  for (let i = 0; i < electedCheckbox.length; i++) {
    if (
      e.getAttribute("data-name") !==
      electedCheckbox[i].getAttribute("data-name")
    ) {
      electedCheckbox[i].checked = false;
      electedCheckbox[i].parentElement.querySelector(
        "input[type=hidden]"
      ).value = "no";
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
    const district = allRegions.data.provinces
      .find((province) => province.id == provinceId)
      .districts.find((district) => district.id == districtId);
    let regions = district.regions;
    regions = regions.filter((r) => r.rtype === typeId);

    regions.forEach(function (region) {
      regionDropDown += `<option value='${region.id}'> ${district.name_np}-${region.name_np}</option>`;
    });
  }

  jQuery("#region-dropdown").html(regionDropDown);
}

function clearErrors() {
  let nameInput = document.getElementsByName("name[]");
  for (i = 0; i < nameInput.length; i++) {
    if (jQuery(".name_message")[i]) jQuery(".name_message")[i].innerHTML = "";
    if (jQuery(".name_np_message")[i])
      jQuery(".name_np_message")[i].innerHTML = "";
    if (jQuery(".party_message")[i]) jQuery(".party_message")[i].innerHTML = "";
    if (jQuery(".vote_message")[i]) jQuery(".vote_message")[i].innerHTML = "";
  }
}

function validateParties() {
  let partyList = [];
  let isUniqueParty = true;
  let partyInput = document.getElementsByName("party[]");
  let partyCount = 1;

  for (i = 0; i < partyInput.length; i++) {
    if (partyList.includes(partyInput[i].value)) {
      partyCount = partyCount + 1;
      if (partyCount > 1) {
        jQuery(".party_message")[i].innerHTML =
          "Two candidates can't have same party.";
        isUniqueParty = false;
        return false;
      }
    } else {
      partyList.push(partyInput[i].value);
    }
  }

  return isUniqueParty;
}

function validate() {
  clearErrors();
  if (validateParties()) {
    var isValid = true;
    let nameInput = document.getElementsByName("name[]");
    let nameNPInput = document.getElementsByName("name_np[]");
    let partyInput = document.getElementsByName("party[]");
    for (i = 0; i < nameInput.length; i++) {
      if (nameInput[i].value == "" || nameInput[i].value == null) {
        jQuery(".name_message")[i].innerHTML = "This field is required";
        isValid = false;
        return false;
      }
      if (nameNPInput[i].value == "" || nameNPInput[i].value == null) {
        jQuery(".name_np_message")[i].innerHTML = "This field is required";
        isValid = false;
        return false;
      }
      if (partyInput[i].value == "" || partyInput[i].value == null) {
        if (jQuery(".party_message")[i].innerHTML)
          jQuery(".party_message")[i].innerHTML = "This field is required";
        isValid = false;
        return false;
      }
    }
    return isValid;
  }
}

function populateData(result) {
  populateDistricts();
  populateRegions();
  let partyOptions = "<option value=''>पार्टी छान्नुहोस्</option>";
  parties.data
    .sort((a, b) => (a.name_en > b.name_en ? -1 : 1))
    .forEach((party) => {
      partyOptions +=
        "<option value='" + party.code + "' >" + party.name_np + "</option>\n";
    });

  let provinceDropDown = `<option value="">प्रदेश छान्नुहोस्</option>`;

  allRegions.data.provinces.forEach((province) => {
    provinceDropDown += `<option value="${province.id}">${province.name_np}</option>`;
  });
  jQuery("#province-dropdown").html(provinceDropDown);

  jQuery("#result-submit-btn").on("click", function () {
    if (validate()) {
      let typeValue = jQuery("#type-dropdown").val();
      let provinceValue = jQuery("#province-dropdown").val();
      let districtValue = jQuery("#district-dropdown").val();
      let regionValue = jQuery("#region-dropdown").val();
      jQuery("#result-submit-btn").prop("disabled", true);

      let postdata =
        "action=update_result&dbaction=insert_update&" +
        jQuery("#directly-elected-resultt-form").serialize();
      jQuery.post(
        electionresultajaxurl,
        decodeURI(postdata),
        function (response) {
          let res = jQuery.parseJSON(response);
          jQuery("#result-submit-btn").prop("disabled", false);

          if (res.status === 200) {
            notify("success");

            let newData = candidates.data.filter(
              (c) =>
                c.rtype === typeValue &&
                c.province_id === provinceValue &&
                c.district_id === districtValue &&
                c.region_id === regionValue
            );

            newData = [...newData, ...res.data];
          } else if (res.status === 100) {
            notify("info");
            console.warn("Update failed");
          } else {
            notify("error");
            console.error("Update failed");
          }
        }
      );
    }
  });

  let rowTpl = `<div class="row my-3 candidate-row">
                  <div class="col-md-2 form-group">
                    <input type="text"  class="form-control"  id="name" name="name[]" placeholder="e.g. Ram Thapa">
                    <span class="name_message"></span>
                  </div>
                  <div class="col-md-2 form-group">
                    <input type="text" class="form-control"  id="name-np" name="name_np[]" placeholder="e.g. राम थापा">
                    <span class="name_np_message"></span>
                  </div>
                  <div class="col-md-party form-group">
                    <select class="form-control" class="form-control party" name="party[]" onChange="updateCheckData(this)">${partyOptions}</select>
                    <span class="party_message"></span>
                  </div>
                  <div class="col-md-vote form-group">
                    <input type="number" class="form-control" id="vote" name="vote[]">
                    <span class="vote_message"></span>
                  </div>
                  <div class="col-md-check form-group">
                    <input type="hidden" name="elected[]" value="" />
                    <input type="checkbox" autocomplete="off" data-name="" class="form-control elected" name="elected[]" onClick="electedChecked(this)">
                    <span class="vote_message"></span>
                  </div>
                  <div class="col-md-description form-group">
                    <textarea type="text" class="form-control" name="descriptions[]" placeholder="e.g. राम थापा एक नेपाली राजनीतिज्ञ र युवा नेता हुन्, जो नेपाली कांग्रेसका वर्तमान महासचिव छन्।" rows="3" cols="33"></textarea>
                  </div>
                  <!--<div class="col-md-1 form-group">
                    <div class="actionBtnGroup col-sm-12">
                      <i id="removeFormBtn" class="fas fa-trash"></i>
                      <i id ="addFormBtn" class="fas fa-plus"></i>
                    </div>-->
                  </div>
                </div>`;

  jQuery("#directly-elected-resultt-form").on(
    "click",
    "#addFormBtn",
    function (e) {
      e.preventDefault();
      if (validate()) {
        jQuery(this).attr("class", "fas fa-trash");
        jQuery(this).attr("id", "removeFormBtn");
        jQuery(this)
          .parent()
          .append('<i id ="editFormBtn" class="fas fa-pencil"></i>');
        jQuery("#result-form").append(rowTpl);
        jQuery(this).remove();
      }
    }
  );

  jQuery("#directly-elected-resultt-form").on(
    "click",
    "#removeFormBtn",
    function (e) {
      e.preventDefault();
      if (confirm("Are you sure?")) {
        let party = jQuery(this).parent().parent().parent().find("select")[0];
        if (party.value.match(/I+\d/)) {
          let inndepentCount = 0;
          for (let i = 0; i < jQuery(".party").length; i++) {
            let p = jQuery(".party")[i];
            if (p.value.match(/I+\d/)) {
              inndepentCount++;
              p.options.forEach((opt) => {
                if (opt.value.match(/I+\d/)) {
                  opt.value = "I" + inndepentCount;
                }
              });

              p.value = "I" + inndepentCount;
              p.setAttribute("value", p.value);
            }
          }
        }

        if (jQuery(this).parent().parent().parent().next(".candidate-row").length) {
          jQuery(this).parent().parent().parent().remove();
        } else {
          jQuery(this).parent().parent().parent().remove();
          jQuery("#result-form")
            .children()
            .last()
            .find("#editFormBtn")
            .remove();
          // jQuery("#result-form")
          //   .children()
          //   .last()
          //   .find(".actionBtnGroup")
          //   .append('<i id ="addFormBtn" class="fas fa-plus"></i>');
        }
      }
      return false;
    }
  );

  jQuery("#type-dropdown").change(function () {
    let typeId = jQuery(this).val();
    let provinceId = jQuery("#province-dropdown").val();
    let districtId = jQuery("#district-dropdown").val();
    let regionDropDown = `<option value="">क्षेत्र छान्नुहोस्</option>`;

    if (provinceId && districtId) {
      const district = allRegions.data.provinces
        .find((province) => province.id == provinceId)
        .districts.find((district) => district.id == districtId);
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

    let regions = candidates.data.filter(
      (c) =>
        c.rtype === typeId &&
        c.province_id == provinceId &&
        c.district_id == districtId &&
        c.region_id == regionId
    );

    if (regions.length) {
      let formDataDiv = "";
      for (let i = 1; i <= regions.length; i++) {
        let obj = regions[i - 1];

        if (i == regions.length) {
          formDataDiv += `<div class="row my-3 candidate-row">
                        <div class="col-md-2 form-group">
                            <input type="text" value="${
                              obj.name_en
                            }" class="form-control" required name="name[]" placeholder="Enter candidate name">
                            <span class="name_message"></span>
                        </div>
                        <div class="col-md-2 form-group">
                            <input type="text" value="${
                              obj.name_np
                            }" class="form-control" required name="name_np[]" placeholder="Enter candidate name in nepali">
                            <span class="name_np_message"></span>
                        </div>
                        <div class="col-md-party form-group">
                            <select value="${
                              obj.party_code
                            }" class="form-control party" required name="party[]" id="party-${i}" onChange="updateCheckData(this)">${partyOptions}</select>
                            <span class="party_message"></span>
                        </div>
                        <div class="col-md-vote form-group">
                            <input type="number" value="${
                              obj.vote
                            }" class="form-control" name="vote[]">
                        </div>
                        <div class="col-md-check form-group">
                            <input type="hidden" name="elected[]" value="${
                              obj.elected ? "yes" : ""
                            }" />
                            <input type="checkbox" autocomplete="off" data-name="${
                              obj.party_code
                            }" class="form-control elected" ${
            obj.elected ? "checked" : ""
          } onClick="electedChecked(this)">
                            <span class="vote_message"></span>
                        </div>
                        <div class="col-md-description form-group">
                            <textarea type="text" class="form-control" name="descriptions[]" rows="3" cols="33">${
                              obj.descriptions ? obj.descriptions : ""
                            }</textarea>
                        </div>
                        <!--<div class="col-md-1 form-group">
                            <div class="actionBtnGroup col-sm-12">
                            <i id="removeFormBtn" class="fas fa-trash"></i>
                            <i id ="addFormBtn" class="fas fa-plus "></i>   
                            </div>-->
                        </div>
                        </div>`;
        } else {
          formDataDiv += `<div class="row my-3 candidate-row">
                            <div class="col-md-2 form-group">
                                <input type="text" value="${
                                  obj.name_en
                                }" class="form-control" required name="name[]" placeholder="Enter candidate name">
                                <span class="name_message"></span>
                            </div>
                            <div class="col-md-2 form-group">
                                <input type="text" value="${
                                  obj.name_np
                                }" class="form-control" required name="name_np[]" placeholder="Enter candidate name in nepali">
                                <span class="name_np_message"></span>
                            </div>
                            <div class="col-md-party form-group">
                              <select value="${
                                obj.party_code
                              }" class="form-control party" required name="party[]" id="party-${i}" onChange="updateCheckData(this)">${partyOptions}</select>
                              <span class="party_message"></span>
                            </div>
                            <div class="col-md-vote form-group">
                                <input type="number" value="${
                                  obj.vote
                                }" class="form-control" name="vote[]">
                            </div>
                            <div class="col-md-check form-group">
                                <input type="hidden" name="elected[]" value="${
                                  obj.elected ? "yes" : ""
                                }" />
                                <input type="checkbox" autocomplete="off" data-name="${
                                  obj.party_code
                                }" class="form-control elected" ${
            obj.elected ? "checked" : ""
          } onClick="electedChecked(this)">
                                <span class="vote_message"></span>
                            </div>
                            <div class="col-md-description form-group">
                                <textarea type="text" class="form-control" name="descriptions[]" rows="3" cols="33">${
                                  obj.descriptions ? obj.descriptions : ""
                                }</textarea>
                            </div>
                            <!--<div class="col-md-1 form-group">
                              <div class="actionBtnGroup col-sm-12">
                                <i id="removeFormBtn" class="fas fa-trash"></i>
                                <i id="editFormBtn" class="fas fa-pencil "></i>
                              </div>-->
                            </div>
                          </div>`;
        }
        jQuery("#result-form").html(formDataDiv);
      }

      let inndepentCount = 0;
      for (let i = 1; i <= regions.length; i++) {
        let obj = regions[i - 1];
        if (obj.party_code.match(/I+\d/)) {
          inndepentCount++;
          jQuery("#party-" + i)[0].options.forEach((opt) => {
            if (opt.value === "I") {
              opt.value = "I" + inndepentCount;
            }
          });
          obj.party_code = "I" + inndepentCount;
        }
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

    let postdata =
      "action=update_pr_result&dbaction=update&" +
      jQuery("#proportional-result-form").serialize();

    jQuery.post(
      electionresultajaxurl,
      decodeURI(postdata),
      function (response) {
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
      }
    );
  });
}

function populateProportionalData(data) {
  let rows = "";
  if (data.length === 0) {
    jQuery("#pr-form").html(
      `<div class="row my-3 party-row">No matching results</div>`
    );
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
                <input type="hidden" value="${
                  p.party
                }" class="form-control" name="party[]">
                <label class="table-label">${
                  partyDetails ? partyDetails.name_np : p.party
                }</label>
              </div>
              <div class="col-md-4 form-group">
                <input type="number" value="${
                  p.vote
                }" class="form-control" name="vote[]">
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
    const filteredParties = parties.data.filter(
      (p) =>
        p.name_en.toLowerCase().includes(value.toLowerCase()) ||
        p.name_np.includes(value)
    );
    const filteredPR = pr_result.data.filter((pr) =>
      filteredParties.find((fp) => fp.code === pr.party)
    );
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
      populateData(candidates.data);
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
