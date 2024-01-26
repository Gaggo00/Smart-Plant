function formatTimestamps(timestamps) {
  return timestamps.map(timestamp => {
      const [data, orario] = timestamp.split("T"); // Dividi data e orario
      const [giorno, mese, anno] = data.split("-");
      const [ora, minuti, secondi] = orario.split(":");
      
      // Costruisci una nuova stringa di data nel formato desiderato
      const formattedTimestamp = `${giorno}-${mese}-${anno.slice(-2)}T${ora}:${minuti}`;

      return formattedTimestamp;
  });
}

function callAPI1() {
    var myHeaders = new Headers();
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
  
    var latestData;
  
    fetch(
      "https://ujx1ojilo3.execute-api.eu-west-3.amazonaws.com/dev",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => storeData1(JSON.parse(result)));
    console.log("call Api called.");
  }
  
    
    function storeData1(data) {
      var date = data[0]["timestamp"].split("T")[0]; // Estrae la data
      var time = data[0]["timestamp"].split("T")[1]; // Estrae l'ora
  
      document.getElementById("humidity").innerText = data[0]["humidity"];
      document.getElementById("water_level").innerText = data[0]["water_level"];
      document.getElementById("ts").innerText = "Measurement taken at: " + date + " " + time;
      var water_level = data[0]["water_level"];
      if (water_level < 632){
        document.getElementById("sensor-footer-Water").innerText = "There is not enough water to irrigate";
      }
      else{
      document.getElementById("sensor-footer-Water").innerText = "The water is enough for " + ((data[0]["water_level"]-632) / 66).toFixed(1) + " days";
      }
  
    }



    function callAPI2() {
        var myHeaders = new Headers();
        var requestOptions = {
          method: "GET",
          headers: myHeaders,
        };
      
        var latestData;
      
        fetch(
          "https://ujx1ojilo3.execute-api.eu-west-3.amazonaws.com/dev",
          requestOptions
        )
          .then((response) => response.text())
          .then((result) => storeData2(JSON.parse(result)));
      
        console.log("call Api 2 called.");
      }
      
      function storeData2(data){
        provaTabella(data);
        creaGrafico(data);
      }
      
      
      function provaTabella(data) {
    
        var datiJSON = data;
      
        data.sort(function(a, b) {
          var nomeA = a["timestamp"];
          var nomeB = b["timestamp"];
          if (nomeA > nomeB) {
            return -1;
          }
          if (nomeA < nomeB) {
            return 1;
          }
          return 0;
        });
      
        
        var tableBody = document.querySelector("#myTable tbody");
        tableBody.innerHTML = "";
      
        for (var i = 0; i < 4; i++) {
          var row = document.createElement("tr");
          var cell1 = document.createElement("td");
          var cell2 = document.createElement("td");
          var cell3 = document.createElement("td");

      
          cell1.textContent = datiJSON[i]["timestamp"];
          cell2.textContent = datiJSON[i]["humidity"];
          cell3.textContent = datiJSON[i]["water_level"];

          
          row.appendChild(cell1);
          row.appendChild(cell2);
          row.appendChild(cell3);

      
          tableBody.appendChild(row);
        }
      }



      function creaGrafico(data) {
        // Dati JSON di esempio
        var datiJSON = data;
      
        data.sort(function(a, b) {
          var nomeA = a["timestamp"];
          var nomeB = b["timestamp"];
          if (nomeA < nomeB) {
            return -1;
          }
          if (nomeA > nomeB) {
            return 1;
          }
          return 0;
        });
      
        var labels = [];
        var data1 = [];
        var data2 = [];
      
        // Estrai le etichette e i dati dal JSON
        for (var i = 0; i < datiJSON.length; i++) {
          labels.push(datiJSON[i]["timestamp"]);
          data1.push(datiJSON[i]["humidity"]);
          data2.push(datiJSON[i]["water_level"]);
        }
      
        document.getElementById("grafici").innerHTML = "<l> Graph </l> <canvas id='myChart' height='300px' width='400px'></canvas>"
        var ctx = document.getElementById("myChart").getContext("2d");
        Chart.defaults.font.size = 16;
        new_labels = formatTimestamps(labels);
        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: new_labels,
            datasets: [
              {
                label: "humidity",
                data: data1,
                backgroundColor: "rgba(75, 192, 192, 1)", // Rende lo sfondo trasparente
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 3
              },
              {
                label: "water_level",
                data: data2,
                backgroundColor: "rgba(192, 75, 192, 1)", // Rende lo sfondo trasparente
                borderColor: "rgba(192, 75, 192, 1)",
                borderWidth: 3
              }
            ]
          },
          options: {

            plugins: {
              legend: {
                display:true,
                labels: {
                  color: "black"

                },
              },
        
            },
            scales: {
              x: {
                ticks: {
                  color: "black" // Colore dei tick dell'asse X
                }
                
            },
              y: {
                ticks: {
                  color: "black", // Colore dei tick dell'asse Y
                  
                }
              },
              
            }

          }
        });
      
      }

      function init() {
          setInterval(callAPI1, 4000);
          setInterval(callAPI2, 10000);
      }