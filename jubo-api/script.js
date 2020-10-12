var myHeaders = new Headers();
myHeaders.append("apikey", "78A7HF2-N2E48GR-JFT7ARY-YB8P893");

var requestOptions = {
  method: 'GET',
  headers: myHeaders
};

fetch("https://develop.jubo.health/api/vitalLink/vitalsign", requestOptions)
  .then(response => response.json())
  .then(result => {
    console.log(result);
    const dataList = result.map(item => `
      <div class="card">
        <div>住民 ID: ${item.patient._id}</div>
        <div>體溫: ${item.TP || ''}</div>
        <div>脈搏: ${item.PR || ''}</div>
        <div>呼吸: ${item.RR || ''}</div>
        <div>血壓: ${item.SYS || ''}/${item.DIA || ''}</div>
        <div>血氧: ${item.SPO2 || ''}</div>
        <div>疼痛: ${item.PAIN || ''}</div>
      </div>
    `).join("");

    document.querySelector(".api-data-container").innerHTML = dataList;
  })
  .catch(error => console.log('error', error));