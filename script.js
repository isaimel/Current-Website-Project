document.addEventListener('DOMContentLoaded', () => {
  const queryURL = "https://raw.githubusercontent.com/isaimel/Current-Website-Project/refs/heads/main/lists.json?token=GHSAT0AAAAAAD5HAEFHFZJGDVPF2VAUN46E2QPWHYA";
  const listsData = search(queryURL)
  var saulList = listsData.saulList;

  var scrollContainer = document.getElementById("portfolio_scroll");
  addScrollFunctionality(scrollContainer)
  
  function addScrollFunctionality(scrollContainer){
    var leftDiv = scrollContainer.querySelector(".left_image");
    var leftImage = document.createElement("img");
    leftDiv.appendChild(leftImage);

    var centerDiv = scrollContainer.querySelector(".center_image");
    var centerImage = document.createElement("img");
    centerDiv.appendChild(centerImage);

    var rightDiv = scrollContainer.querySelector(".right_image");
    var rightImage = document.createElement("img");
    rightDiv.appendChild(rightImage);

    var leftButton = scrollContainer.querySelector(".slideshow_left");
    var rightButton = scrollContainer.querySelector(".slideshow_right");

    var centralIndex = 1;
    leftButton.addEventListener("click", () => plusDivs(-1));
    rightButton.addEventListener("click", () => plusDivs(1));
    showDivs(1);
    function plusDivs(n) {
      showDivs(centralIndex += n);
    }

    function showDivs(n) {
      leftImage.src = './' + saulList[modLoop(n-1, saulList.length)] + '.jpg';
      centerImage.src = './' + saulList[modLoop(n, saulList.length)] + '.jpg';
      rightImage.src = './' + saulList[modLoop(n+1, saulList.length)] + '.jpg';
    }
  }

  function modLoop(n, cap){
    if (n >= cap) {return 0}
    if (n < 0) {return cap - 1}
    return n;
  } 

  function search(queryURL) {
    fetch(queryURL)
            .then(function (response) {
                // response.json() returns a json string,
                // returning it will convert it 
                // to a pure JavaScript 
                // object for the next then's callback
                return response.json();
            })
            .then(function (users) {
                // users is a JavaScript object here
                displayUsersAsATable(users);
            })
            .catch(function (error) {
                console.log('Error during fetch: ' + error.message);
            });
          }
});