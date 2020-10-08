var myHeaders = new Headers();
myHeaders.append("apikey", "RRVMRC3-ZKGMGYA-NK59NSC-EE1A1AJ");
myHeaders.append("Cookie", "__cfduid=da4350f70f39f87b464a4eb12751121ff1600653595");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://smc.jubo.health/api/vitalLink/organization/branch", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));