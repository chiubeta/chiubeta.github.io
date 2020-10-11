var myHeaders = new Headers();
myHeaders.append("apikey", "RRVMRC3-ZKGMGYA-NK59NSC-EE1A1AJ");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://smc.jubo.health/api/vitalLink/organization/branch", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));