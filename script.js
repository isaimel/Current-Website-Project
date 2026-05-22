document.addEventListener('DOMContentLoaded', () => {
  const queryURL = 'https://raw.githubusercontent.com/isaimel/Current-Website-Project/refs/heads/main/lists.json';
  
  fetch(queryURL)
    .then(response => response.json())
    .then(listsData => {
      const saulList = listsData.saulList;
      const saulImages = loadImages(saulList);
      const scrollContainer = document.getElementById("portfolio_scroll");
      addScrollFunctionality(scrollContainer, saulList);
    })
    .catch(error => console.log('Error during fetch: ' + error.message));
  
  function loadImages(givenList){
    var imageList = [];
    givenList.forEach(item => {
      imageList.push('./' + item + '.jpg');
    });
    return imageList;
  }

  function addScrollFunctionality(scrollContainer, saulImages){
    var leftDiv = scrollContainer.querySelector(".left_image");
    var leftImage = leftDiv.querySelector(".slides");

    var centerDiv = scrollContainer.querySelector(".center_image");
    var centerImage = centerDiv.querySelector(".slides");

    var rightDiv = scrollContainer.querySelector(".right_image");
    var rightImage = rightDiv.querySelector(".slides");

    var leftButton = scrollContainer.querySelector(".slideshow_left");
    var rightButton = scrollContainer.querySelector(".slideshow_right");

    var centralIndex = 1;
    leftButton.addEventListener("click", () => plusDivs(-1));
    rightButton.addEventListener("click", () => plusDivs(1));
    showDivs(centralIndex);

    function plusDivs(n) {
      centralIndex = modLoop(centralIndex + n, saulImages.length);
      showDivs(centralIndex);
    }

    function showDivs(n) {
      leftImage.src = saulImages[modLoop(n - 1, saulImages.length)];
      centerImage.src = saulImages[centralIndex];
      rightImage.src = saulImages[modLoop(n + 1, saulImages.length)];
    }
  }

  function modLoop(n, cap){
    if (n >= cap) {
      return 0
    }
    if (n < 0) {
      return cap - 1
    }
    return n;
  } 
});