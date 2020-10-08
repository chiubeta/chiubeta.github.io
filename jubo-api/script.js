fetch('https://smc.jubo.health/api/vitalLink/vitalsign', {
    headers: {
        'apikey': 'RRVMRC3-ZKGMGYA-NK59NSC-EE1A1AJ',
        'content-type': 'application/json'
    },
    mode: 'cors'
})
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data);
    });