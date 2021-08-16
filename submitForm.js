
// saves form data as variables
var region =document.getElementById("region");
var state = document.getElementById("state");
var householdNum = document.getElementById("householdNum");
var heatingSource = document.getElementById("heatingSource");
var heatingCost = document.getElementById("heatingCost");
var electrictyCost = document.getElementById("electrictyCost");
var numVehicles = document.getElementById("numVehicles");
var carFuelcost = document.getElementById("carFuelcost");
var milesDrivenweekly = document.getElementById("milesDrivenweekly");

// sets the document data as session storage to be retreived on dashboard page
function setSessionstorage(){
        console.log("inside setSessionstorage function");
        sessionStorage.setItem('region',region.value);
        sessionStorage.setItem('state',state.value);
        sessionStorage.setItem('householdNum',householdNum.value);
        sessionStorage.setItem('heatingSource', heatingSource.value);
        sessionStorage.setItem('heatingCost', heatingCost.value);
        sessionStorage.setItem('electrictyCost',electrictyCost.value);
        sessionStorage.setItem('numVehicles',numVehicles.value);
        sessionStorage.setItem('carFuelcost',carFuelcost.value);
        sessionStorage.setItem('milesDrivenweekly',milesDrivenweekly.value);
        window.location = 'dashboard.html';

    
};






















