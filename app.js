//@ts-check

document.querySelector("#phones").addEventListener('click', generatePhones);

document.querySelector("#fields").addEventListener('click', generateFields);

document.querySelector("#copy-data").addEventListener('click', copyData);

function generatePhones(e) {
  let textarea1 = document.querySelector("#textarea1").value;
  let aggregator = document.querySelector('input[name=group1]:checked').value;
  let output = '';

  textarea1 = textarea1.replace(/\n/g, " ");
  let newField = textarea1.split(" ");
  for (let i = 0; i < newField.length; i++) {
    output += `
- phone: ${newField[i]}
  enabled: true
  aggregator: ${aggregator}`

  }
  document.querySelector("#output").innerHTML = output;
  e.preventDefault();
}

function generateFields(e) {

  let textarea1 = document.querySelector("#textarea1").value;
  let output = '';


  textarea1 = textarea1.replace(/\n\t\t+\s\s+/g, " ");
  let newField = textarea1.split(" ");
  newField = Array.from(newField);
  console.log(newField);
  for (let i = 0; i < newField.length; i++) {
    output += `
    - name: ${newField[i].toLocaleLowerCase()} 
      type: String
      default: ''`
  };
  document.querySelector("#output").innerHTML = output;
  e.preventDefault();
}

function copyData() {
  let copyText = document.querySelector("#output");
  copyText.select();
  document.execCommand("copy");
} //