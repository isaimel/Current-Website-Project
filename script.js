document.addEventListener('DOMContentLoaded', () => {
  const queryURL = "https://raw.githubusercontent.com/isaimel/Current-Website-Project/refs/heads/main/lists.json?token=GHSAT0AAAAAAD5HAEFGGLPFEYELXMB6WMKG2QPWWAQ";

  fetch(queryURL)
    .then(response => response.json())
    .then(listsData => {
      const saulList = listsData.saulList;
      const scrollContainer = document.getElementById("portfolio_scroll");
      addScrollFunctionality(scrollContainer, saulList);
    })
    .catch(error => console.log('Error during fetch: ' + error.message));


  var scrollContainer = document.getElementById("portfolio_scroll");
  addScrollFunctionality(scrollContainer, saulList);
  
  function addScrollFunctionality(scrollContainer, givenList){
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
    showDivs(centralIndex);

    function plusDivs(n) {
      showDivs(centralIndex += n);
    }

    function showDivs(n) {
      leftImage.src = './' + givenList[modLoop(n-1, givenList.length)] + '.jpg';
      centerImage.src = './' + givenList[modLoop(n, givenList.length)] + '.jpg';
      rightImage.src = './' + givenList[modLoop(n+1, givenList.length)] + '.jpg';
    }
  }

  function modLoop(n, cap){
    if (n >= cap) {return 0}
    if (n < 0) {return cap - 1}
    return n;
  } 
});