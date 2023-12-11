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
        // Dati JSON di esempio
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
      
        document.getElementById("grafici").innerHTML = "<l> Graph </l> <canvas id='Graph' height='500px' width='600px'></canvas>"
        var ctx = document.getElementById("Graph").getContext("2d");
        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "humidity",
                data: data1,
                backgroundColor: 'rgba(0, 0, 0, 0)', // Rende lo sfondo trasparente
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 3
              },
              {
                label: "water_level",
                data: data2,
                backgroundColor: 'rgba(0, 0, 0, 0)', // Rende lo sfondo trasparente
                borderColor: "rgba(192, 75, 192, 1)",
                borderWidth: 3
              }
            ]
          },
          options: {
            scales: {
              x: {
                ticks: {
                  color: "white" // Colore dei tick dell'asse X
                }
            },
              y: {
                ticks: {
                  color: "white" // Colore dei tick dell'asse Y
                }
              }
            },
            plugins: {
              legend: {
                labels: {
                  color: "white" // Colore del testo della legenda
                }
              },
              annotation: {
                annotations: [{
                  type: "box",
                  drawTime: "beforeDatasetsDraw",
                  yScaleID: "y",
                  backgroundColor: "rgba(255, 255, 255, 1)"
                }]
              }
            }
          }
        });
      }
      
      function init() {
          setInterval(callAPI1, 4000);
          setInterval(callAPI2, 10000);
      }