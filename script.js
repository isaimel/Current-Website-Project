document.addEventListener('DOMContentLoaded', () => {
  const json = loadJSON('./lists.json');
  var saulList = json.saulList;

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

  async function loadJSON(filepath) {
    fetch(filepath)
    .then(res => res.json())
    .then(data => {
        console.log(data);
        return data;
    })
  }
});