var points = 5000;

window.onload = function() {
    var anchors = document.querySelectorAll("a.clickable");
    var balance = document.getElementById("balance");

    console.log(anchors);

    anchors.forEach((element) => {
        element.addEventListener("click", () => {
            if(confirm("Do you want to redeem this reward?")) {
                points -= 100;
                balance.innerHTML = points + " GP";
            }
        });
    });
}