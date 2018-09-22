//@ts-check

function makeApiCall(id) {
  let params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: id,
    // The A1 notation of the values to retrieve.
    range: "A1:ZZ"
  };
  let request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(
    function(response) {
      console.log(response);
      console.log(typeof response.result.values[1]);
      let result = response.result.values[0],
        filter = [
          "customer_id",
          "first_name",
          "last_name",
          "group_list",
          "timezone",
          "phone",
          ""
        ],
        output = "";
      if (result.length > 0) {
        for (let i = 0; i < result.length; i++) {
          if (filter.indexOf(result[i]) === -1) {
            output += `
- name: ${result[i].toLocaleLowerCase()} 
  type: String
  default: ''`;
          }
        }
      } else {
        output = "";
      }

      document.querySelector("#output").value = output;
    },
    reason => {
      console.error("error: " + reason.result.error.message);
    }
  );
}

function makeApiCallDataset(id, table_name) {
  let params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: id,
    // The A1 notation of the values to retrieve.
    range: "A1:ZZ"
  };
  let request = gapi.client.sheets.spreadsheets.values.get(params);
  request.then(
    function(response) {
      console.log(response);
      let result = response.result.values,
        output = "";
      for (let i = 1; i < result.length; i++) {
        let pre_output = "";
        for (let j = 1; j < result[0].length; j++) {
          pre_output += `${result[0][j]}: ${result[i][j]}
`;
        }
        output += `${result[i][0]}:
              ${pre_output}`;
      }
      document.querySelector("#output").value = `
datasets: 
  ${table_name}:
    ${output}`;
    },
    reason => {
      console.error("error: " + reason.result.error.message);
    }
  );
}

function initClient() {
  let API_KEY = "AIzaSyA2jeOGeEb6MZP6GCyE7fJroDZ_rwFaG1Y";
  let CLIENT_ID =
    "217086466266-fktsje9i2kr8hogt07b0u4phvuhvtd0d.apps.googleusercontent.com";
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/drive.readonly'
  //   'https://www.googleapis.com/auth/spreadsheets'
  //   'https://www.googleapis.com/auth/spreadsheets.readonly'
  let SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";

  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4"
      ]
    })
    .then(function() {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

document.querySelector("#phones").addEventListener("click", generatePhones);

document.querySelector("#fields").addEventListener("click", generateFields);

document.querySelector("#copy-data").addEventListener("click", copyData);
document.querySelector("#dataset").addEventListener("click", generateDataset);

let outputArea = document.querySelector("#output");

function generatePhones(e) {
  let textarea1 = document.querySelector("#textarea1").value,
    aggregator = document.querySelector("input[name=group1]:checked").value,
    enabled = document.querySelector("input[name=group2]:checked").value,
    output = "";

  textarea1 = textarea1.replace(/\n/g, " ");
  let newField = textarea1.split(" "),
    filter = [""];
  for (let i = 0; i < newField.length; i++) {
    if (newField[i] !== "") {
      output += `
- phone: '${newField[i]}'
  enabled: ${enabled}
  aggregator: ${aggregator}`;
    }
  }
  document.querySelector("#output").value = output;
  e.preventDefault();
}

function generateFields(e) {
  let field = e.target.parentElement;
  let url = field.querySelector("#sheet-url").value,
    id = url.split("/")[5];

  makeApiCall(id);
}

function generateDataset(e) {
  let field = e.target.parentElement;
  let url = field.querySelector("#dataset-url").value,
    table_name = field.querySelector("#table-name").value,
    id = url.split("/")[5];
  makeApiCallDataset(id, table_name);
}

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    makeApiCall();
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function copyData() {
  outputArea.select();
  document.execCommand("copy");
}
