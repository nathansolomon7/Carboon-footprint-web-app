const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var datapoints = [65000, 59000, 80000, 81000, 56000, 55000, 40000]
var data = {
  labels: months,
  datasets: [{
    data: datapoints,
    borderColor: "rgb(0, 0, 0)",
  }],
}
window.onload = function() {
    // Adds click functionality to the "add data" button
    
    var region;
    var state;
    var householdNum;
    var heatingSource;
    var heatingCost;
    var electricityCost;
    var numVehicles;
    var carFuelcost;
    var milesDrivenweekly;
    var yourCarbonfootPrint;
    
    if (sessionStorage.length != 0){
        getSessionStorage();
        yourCarbonfootPrint = calculateCarbonfootprintFinal();
        generateFootprintonPage(yourCarbonfootPrint);
        generateInsight(yourCarbonfootPrint);
    }
    var add_data_button = document.getElementById("add_data_button");
    add_data_button.addEventListener("click", goto_form_page);

    // Sets up the chart
    // Note: needs chartjs installed from npm
    var emission_chart = document.getElementById('emission_chart');  
    const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let massPopChart = new Chart(emission_chart, 
        {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'My Carbon Emissions',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            },
        });

        
}

function goto_form_page() {
    window.location.href = "formPage.html";
}




function getSessionStorage(){
    regionTemp = sessionStorage.getItem('region');
    console.log("regionTemp is: " + regionTemp);
    region = regionTemp;
    console.log("value of region (global): " + region);
    stateTemp = sessionStorage.getItem('state');
    state = stateTemp;
    householdNumTemp = parseInt(sessionStorage.getItem('householdNum'));
    householdNum = householdNumTemp;
    heatingSourceTemp = sessionStorage.getItem('heatingSource');
    heatingSource = heatingSourceTemp;
    heatingCostTemp = sessionStorage.getItem('heatingCost');
    heatingCost = heatingCostTemp
    electrictyCostTemp = parseInt(sessionStorage.getItem('electrictyCost'));
    electricityCost = electrictyCostTemp
    numVehiclesTemp = parseInt(sessionStorage.getItem('numVehicles'));
    numVehicles = numVehiclesTemp;
    carFuelcostTemp = parseInt(sessionStorage.getItem('carFuelcost'));
    carFuelcost = carFuelcostTemp
    milesDrivenweeklyTemp = parseInt(sessionStorage.getItem('milesDrivenweekly'));
    milesDrivenweekly = milesDrivenweeklyTemp
};



function calculateCarbonfootPrintConsumption(){
    var footPrintCO2;
    var footPrintCH4;
    var footPrintN2O;
    var carbonFootprintcompsumtion;
    //calculating energy emissions due to energy consumption (not travel);
    
    
    if (heatingSource == "Natural Gas"){
         footPrintCO2 = (heatingCost * naturalGasrates[state] * householdNum) * emissionFactor_CO2[heatingSource];
         console.log("footprintCO2: " + footPrintCO2);
         footPrintCH4 = (heatingCost * naturalGasrates[state] * householdNum)* emissionFactor_CH4[heatingSource]*conversionRate_GWP["CH4"];
         console.log("footPrintCH4: " + footPrintCH4);
         footPrintN2O = (heatingCost * naturalGasrates[state]* householdNum)* emissionFactor_N2O[heatingSource]* conversionRate_GWP["N2O"];
         console.log("footPrintN2O: " + footPrintN2O);
         carbonFootprintcompsumtion = footPrintCO2 + footPrintCH4 + footPrintN2O;
         carbonFootprintcompsumtion = carbonFootprintcompsumtion/10;
    }
    else if (heatingSource == "Electricity"){
        footPrintCO2 = (heatingCost * electrictyRatesperState[state] * householdNum) * emissionFactorelectricity_CO2[region];
        
        footPrintCH4 = (heatingCost * electrictyRatesperState[state] * householdNum)* emissionFactorelectricity_CH4[region]*conversionRate_GWP["CH4"];
        
        footPrintN2O = (heatingCost * electrictyRatesperState[state]* householdNum)* emissionFactorelectricity_N20[region]* conversionRate_GWP["N2O"];
        
       carbonFootprintcompsumtion = footPrintCO2 + footPrintCH4 + footPrintN2O;
    }
    else if (heatingSource == "I don't heat my home"){
        carbonFootprintcompsumtion = 0
    }
    else{
        carbonFootprintcompsumtion = 0;
    }
    return carbonFootprintcompsumtion;    
};

function calculateCarbonfootPrintElectricity(){
    var carbonFootprintElectricity;
    var footPrintCO2;
    var footPrintCH4;
    var footPrintN2O;
    footPrintCO2 = (heatingCost * electrictyRatesperState[state] * householdNum) * emissionFactorelectricity_CO2[region];
    
    footPrintCH4 = (heatingCost * electrictyRatesperState[state] * householdNum)* emissionFactorelectricity_CH4[region]*conversionRate_GWP["CH4"];
    
    footPrintN2O = (heatingCost * electrictyRatesperState[state]* householdNum)* emissionFactorelectricity_N20[region]* conversionRate_GWP["N2O"];
    
   carbonFootprintElectricity = footPrintCO2 + footPrintCH4 + footPrintN2O;
   return carbonFootprintElectricity;
};

function calculateCarbonfootprintTravel(){
    var carbonFootprintTravel;
    var footPrintCO2;
    var footPrintCH4;
    var footPrintN2O;
    
    footPrintCO2 = (milesDrivenweekly * 4.354 + (carFuelcost/regularCargasRates[state])) 
    * (emissionFactor_CO2["Car Gasoline"] * heatingValue["Car Gasoline"] * density["Car Gasoline"]);
    console.log("footPrintCO2: " + footPrintCO2);
    footPrintCH4 = (milesDrivenweekly * 4.354 + (carFuelcost/regularCargasRates[state])) 
    * (emissionFactor_CH4["Car Gasoline"] * heatingValue["Car Gasoline"] * density["Car Gasoline"]) * conversionRate_GWP["CH4"];
    console.log("footPrintCH4: " + footPrintCH4);
    footPrintN2O = (milesDrivenweekly * 4.354 + (carFuelcost/regularCargasRates[state])) 
    * (emissionFactor_N2O["Car Gasoline"] * heatingValue["Car Gasoline"] * density["Car Gasoline"]) * conversionRate_GWP["N2O"];
    console.log("footprintN2O: " + footPrintN2O);
    carbonFootprintTravel = footPrintCO2 + footPrintCH4 + footPrintN2O;
    
    console.log("carbonFootprintTravel: " + carbonFootprintTravel);
    return carbonFootprintTravel;
};

function calculateCarbonfootprintFinal(){
    var footPrintconsumptionFinal = calculateCarbonfootPrintConsumption();
    console.log("footPrintconsumptionFinal: " + footPrintconsumptionFinal);
    var footPrintelectrictyFinal = calculateCarbonfootPrintElectricity();
        console.log("footPrintelectrictyFinal: " + footPrintelectrictyFinal);
    var footPrinttravelFinal = calculateCarbonfootprintTravel();
    console.log("footPrinttravelFinal: " + footPrinttravelFinal);
    var yourCarbonfootPrint = footPrintconsumptionFinal + footPrintelectrictyFinal + footPrinttravelFinal;
    console.log("final carbon consumption value: " + yourCarbonfootPrint/10);
    yourCarbonfootPrint = yourCarbonfootPrint/10;
    return yourCarbonfootPrint;
};
    

function generateFootprintonPage(yourCarbonfootPrint) {
    yourCarbonfootPrint = Math.round(yourCarbonfootPrint);
    let htmlStringdetails = 
    `
<p id= "footprintTitle">${yourCarbonfootPrint} lbs</p>
    <br>`;
        footprintValueholder.innerHTML = htmlStringdetails;
};

function generateInsight(yourCarbonfootPrint) {
    
    yourCarbonfootPrint = Math.round(yourCarbonfootPrint);
    if (2600 - yourCarbonfootPrint >= 0){
        var tempCarbonfootprintdisplay = Math.abs(2600-yourCarbonfootPrint)
        let htmlStringdetails = 
        
        `<summary> How Do I Compare? </summary>
        <p> The average American has a carbon footprint of about 1.3 tons a month. </p>
        <p> Your current footprint is ${2600 - yourCarbonfootPrint} lbs less than that. Keep up the good work! </p>
        <br>`;
        comparison.innerHTML = htmlStringdetails;
    }
    else{
        var tempCarbonfootprintdisplay = Math.abs(2600-yourCarbonfootPrint)
        var htmlStringdetails = 
        
        `<summary> How Do I Compare? </summary>
        <p> The average American has a carbon footprint of about 1.3 tons a month. </p>
        <p> Your current footprint is ${tempCarbonfootprintdisplay} lbs greater than that. Work on keeping your emmisions lower! </p>
        <br>`;
        comparison.innerHTML = htmlStringdetails;
    }
};


var heatingValue = {
    "Natural Gas": 0.001026,
    "Wood":17.48,
    "Propane": .002516,
    "I don't heat my home":0,
    "Car Gasoline" : 0.125,
};

var density = {
    "Natural Gas": 0.7,
    "Wood":650,
    "Propane": 493,
    "I don't heat my home":0,
    "Car Gasoline": 0.755,
};



var conversionRate_GWP = {
    "CO2": 1,
    "CH4":84,
    "N2O":298,
};

var emissionFactor_CO2 = {
    "Natural Gas": 53.06,
    "Wood":93.80,
    "Propane": 61.46,
    "I don't heat my home":0,
    "Car Gasoline": 8.78,
};


var emissionFactor_CH4 = {
    "Natural Gas": 1.0,
    "Wood":7.2,
    "Propane": .022,
    "I don't heat my home":0,
    "Car Gasoline": 0.0173,
};

var emissionFactor_N2O = {
    "Natural Gas": .10,
    "Wood":3.6,
    "Propane": .10,
    "I don't heat my home":0,
    "Car Gasoline": 0.0036,
    
};

var emissionFactorelectricity_CO2 = {
    "AKGD (ASCC Alaska Grid)":1256.87,
    "AKMS (ASCC Miscellaneous)":448.57,
    "AZNM (WECC Southwest)":1177.61,
    "CAMX (WECC California)":610.82,
    "ERCT (ERCOT All)":1218.17,
    "FRCC (FRCC All)":1196.71,
    "HIMS (HICC Miscellaneous)":1330.16,
    "HIOA (HICC Oahu)":1621.86,
    "MROE (MRO East)":1610.8,
    "MROW (MRO West)":1536.36,
    "NEWE (NPCC New England)":722.07,
    "NWPP (WECC Northwest)":842.58,
    "NYCW (NPCC NYC/Westchester)":622.42,
    "NYLI (NPCC Long Island)":1336.11,
    "NYUP (NPCC Upstate NY)":545.79,
    "RFCE (RFC East)":1001.72,
    "RFCM (RFC Michigan)":1629.38,
    "RFCW (RFC West)":1503.47,
    "RMPA (WECC Rockies)":1896.74,
    "SPNO (SPP North)":1799.45,
    "SPSO (SPP South)":1580.6,
    "SRMV (SERC Mississippi Valley)":1029.82,
    "SRMW (SERC Midwest)":1810.83,
    "SRSO (SERC South)":1354.09,
    "SRTV (SERC Tennessee Valley)":1389.2,
    "SRVC (SERC Virginia/Carolina)":1073.65,
};

var emissionFactorelectricity_CH4 = {
    "AKGD (ASCC Alaska Grid)":0.02608,
    "AKMS (ASCC Miscellaneous)":0.01874,
    "AZNM (WECC Southwest)":.01921,
    "CAMX (WECC California)":0.01921,
    "ERCT (ERCOT All)":0.02849,
    "FRCC (FRCC All)":0.03891,
    "HIMS (HICC Miscellaneous)":0.01685,
    "HIOA (HICC Oahu)":0.03891,
    "MROE (MRO East)":0.07398,
    "MROW (MRO West)":0.0993,
    "NEWE (NPCC New England)":0.02429,
    "NWPP (WECC Northwest)":0.02853,
    "NYCW (NPCC NYC/Westchester)":0.07176,
    "NYLI (NPCC Long Island)":0.01605,
    "NYUP (NPCC Upstate NY)":0.02381,
    "RFCE (RFC East)":0.08149,
    "RFCM (RFC Michigan)":0.0163,
    "RFCW (RFC West)":0.02707,
    "RMPA (WECC Rockies)":0.03046,
    "SPNO (SPP North)":0.0182,
    "SPSO (SPP South)":0.0232,
    "SRMV (SERC Mississippi Valley)":0.02066,
    "SRMW (SERC Midwest)":0.02048,
    "SRSO (SERC South)":0.02282,
    "SRTV (SERC Tennessee Valley)":0.0177,
    "SRVC (SERC Virginia/Carolina)":0.02169,
};

emissionFactorelectricity_N20 = {
    "AKGD (ASCC Alaska Grid)":0.00718,
    "AKMS (ASCC Miscellaneous)":0.00368,
    "AZNM (WECC Southwest)":0.01572,
    "CAMX (WECC California)":0.00603,
    "ERCT (ERCOT All)":0.01407,
    "FRCC (FRCC All)":0.01375,
    "HIMS (HICC Miscellaneous)":0.01388,
    "HIOA (HICC Oahu)":0.02241,
    "MROE (MRO East)":0.02752,
    "MROW (MRO West)":0.02629,
    "NEWE (NPCC New England)":0.01298,
    "NWPP (WECC Northwest)":0.01307,
    "NYCW (NPCC NYC/Westchester)":0.0028,
    "NYLI (NPCC Long Island)":0.01028,
    "NYUP (NPCC Upstate NY)":0.00724,
    "RFCE (RFC East)":0.01533,
    "RFCM (RFC Michigan)":0.02684,
    "RFCW (RFC West)":0.02475,
    "RMPA (WECC Rockies)":0.02921,
    "SPNO (SPP North)":0.02862,
    "SPSO (SPP South)":0.02085,
    "SRMV (SERC Mississippi Valley)":0.01076,
    "SRMW (SERC Midwest)":0.02957,
    "SRSO (SERC South)":0.02089,
    "SRTV (SERC Tennessee Valley)":0.02241,
    "SRVC (SERC Virginia/Carolina)":0.01764,
};

// dollar per thousand cubic feet
var naturalGasrates = {
    "Alabama":12.23,
    "Alaska":10.24,
    "Arizona":9.29,
    "Arkansas":7.96,
    "California":12.03,
    "Colorado":8.99,
    "Connecticut":10.86,
    "Delaware":11.7,
    "Florida":14.16,
    "Georgia":11.77,
    "Hawaii":8.51,
    "Idaho":34.85,
    "Illinois":5.98,
    "Indiana":9.76,
    "Iowa":8.72,
    "Kansas":9.72,
    "Kentucky":11.85,
    "Louisiana":9.25,
    "Maine":9.27,
    "Maryland":12.36,
    "Massachusetts":13.49,
    "Michigan":12.04,
    "Minnesota":8.56,
    "Mississippi":7.03,
    "Missouri":9.55,
    "Montana":7.88,
    "Nebraska":9.33,
    "Nevada":5.95,
    "New Hampshire":6.16,
    "New Jersey":13.17,
    "New Mexico":8.79,
    "New York":7.46,
    "North Carolina":7.38,
    "North Dakota":9.54,
    "Ohio":6.05,
    "Oklahoma":7.2,
    "Oregon":10.07,
    "Pennsylvania":8.96,
    "Rhode Island":10.14,
    "South Carolina":13.48,
    "South Dakota":9.75,
    "Tennessee":8.43,
    "Texas":8.5,
    "Utah":8.71,
    "Vermont":6.49,
    "Virginia":5.87,
    "Washington":9.64,
    "West Virginia":9.29,
    "Wisconsin":8.62,
    "Wyoming":10.55,
    "US":7.42,
};

// dollars per killowatt hour
var electrictyRatesperState = {
"Alabama":0.2022,
"Alaska":0.1052,
"Arizona":0.0822,
"Arkansas":0.1689,
"California":0.1017,
"Colorado":0.1866,
"Connecticut":0.1052,
"Delaware":0.1227,
"Florida":0.1044,
"Georgia":0.0986,
"Hawaii":0.2872,
"Idaho":0.0789,
"Illinois":0.0956,
"Indiana":0.0991,
"Iowa":0.0908,
"Kansas":0.1026,
"Kentucky":0.0861,
"Louisiana":0.0771,
"Maine":0.1404,
"Maryland":0.1124,
"Massachusetts":0.184,
"Michigan":0.1156,
"Minnesota":0.1033,
"Mississippi":0.0928,
"Missouri":0.0968,
"Montana":0.0902,
"Nebraska":0.0908,
"Nevada":0.0878,
"New Hampshire":0.1715,
"New Jersey":0.1342,
"New Mexico":0.0899,
"New York":0.1434,
"North Carolina":0.0945,
"North Dakota":0.0885,
"Ohio":0.0958,
"Oklahoma":0.0786,
"Oregon":0.0881,
"Pennsylvania":0.0981,
"Rhode Island":0.1849,
"South Carolina":0.1002,
"South Dakota":0.0996,
"Tennessee":0.0969,
"Texas":0.086,
"Utah":0.0824,
"Vermont":0.1536,
"Virginia":0.0952,
"Washington":0.0804,
"West Virginia":0.0849,
"Wisconsin":0.1066,
"Wyoming":0.081,
};

// state price averages in dollars per gallon
var regularCargasRates = {
    "Alaska":3.687,
    "Alabama":2.849,
    "Arkansas":2.879,
    "Arizona":3.137,
    "California":4.396,
    "Colorado":3.64,
    "Connecticut":3.181,
    "District of Columbia":3.284,
    "Delaware":3.011,
    "Florida":3.016,
    "Georgia":2.965,
    "Hawaii":4.093,
    "Iowa":3.009,
    "Idaho":3.81,
    "Illinois":3.391,
    "Indiana":3.132,
    "Kansas":2.945,
    "Kentucky":2.951,
    "Louisiana":2.833,
    "Massachusetts":3.045,
    "Maryland":3.059,
    "Maine":3.115,
    "Michigan":3.266,
    "Minnesota":3.035,
    "Missouri":2.875,
    "Mississippi":2.794,
    "Montana":3.295,
    "North Carolina":2.93,
    "North Dakota":3.131,
    "Nebraska":3.03,
    "New Hampshire":3.001,
    "New Jersey":3.2,
    "New Mexico":3.09,
    "Nevada":4.051,
    "New York":3.224,
    "Ohio":3.061,
    "Oklahoma":2.889,
    "Oregon":3.772,
    "Pennsylvania":3.283,
    "Rhode Island":3.063,
    "South Carolina":2.88,
    "South Dakota":3.165,
    "Tennessee":2.885,
    "Texas":2.852,
    "Utah":3.866,
    "Virginia":2.978,
    "Vermont":3.096,
    "Washington":3.881,
    "Wisconsin":3.032,
    "West Virginia":3.049,
    "Wyoming":3.587,
};












