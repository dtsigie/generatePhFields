//@ts-check

document.querySelector("#phones").addEventListener('click', generatePhones);

document.querySelector("#fields").addEventListener('click', generateFields);

document.querySelector("#copy-data").addEventListener('click', copyData);

let id = document.querySelector('#sheets-url').value.split('/')[5],
  url = document.querySelector('#sheets-url').value,
  outputArea = document.querySelector("#output");

function generatePhones(e) {
  let textarea1 = document.querySelector("#textarea1").value,
    aggregator = document.querySelector('input[name=group1]:checked').value,
    enabled = document.querySelector('input[name=group2]:checked').value,
    output = '';

  textarea1 = textarea1.replace(/\n/g, " ");
  let newField = textarea1.split(" ");
  for (let i = 0; i < newField.length; i++) {
    output += `
- phone: ${newField[i]}
  enabled: ${enabled}
  aggregator: ${aggregator}`

  }
  outputArea.value = output;
  e.preventDefault();
}

function generateFields(e) {

  // let url = document.querySelector('#sheets-url').value.split("/")[5];

  function makeApiCall() {
    var params = {
      // The ID of the spreadsheet to retrieve data from.
      spreadsheetId: '1KKEflFI8w9VXvEPey--x-ImsQwDSQwg2rm76WxOXLvs',
      // The A1 notation of the values to retrieve.
      range: 'A1:Z1',
    };
    params.spreadsheetId = url;
    console.log(typeof (params.spreadsheetId));
    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function (response) {
        console.log(response);
        let result = response.result.values[0];
        console.log(result);
        let output = '';
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            output += `
- name: ${result[i].toLocaleLowerCase()} 
  type: String
  default: ''`
          };
        } else {
          output = ''
        }

        document.querySelector("#output").value = output;
      },
      function (reason) {
        console.error('error: ' + reason.result.error.message);
      });
  }

  function initClient() {
    var API_KEY = 'AIzaSyA2jeOGeEb6MZP6GCyE7fJroDZ_rwFaG1Y';
    var CLIENT_ID = '217086466266-fktsje9i2kr8hogt07b0u4phvuhvtd0d.apps.googleusercontent.com';
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/drive.readonly'
    //   'https://www.googleapis.com/auth/spreadsheets'
    //   'https://www.googleapis.com/auth/spreadsheets.readonly'
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets.readonly';

    gapi.client.init({
      'apiKey': API_KEY,
      'clientId': CLIENT_ID,
      'scope': SCOPE,
      'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
  }

  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
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


  // <script async defer src = "https://apis.google.com/js/api.js"
  // onload = "this.onload=function(){};handleClientLoad()"
  // onreadystatechange = "if (this.readyState === 'complete') this.onload()" > </script>


  e.preventDefault();


}

function generateDataset() {

}

function copyData() {
  outputArea.select();
  document.execCommand("copy");
}