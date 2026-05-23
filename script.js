document.addEventListener('DOMContentLoaded', () => {
  const queryURL = 'https://raw.githubusercontent.com/isaimel/Current-Website-Project/refs/heads/main/lists.json';
  
  fetch(queryURL)
    .then(response => response.json())
    .then(listsData => {
      const scrollContainer = document.getElementById("portfolio_scroll");
      addScrollFunctionality(scrollContainer, listsData.merchandiseList, "./assets/merch/");
    })
    .catch(error => console.log('Error during fetch: ' + error.message));
  
  function loadImages(givenList, folderPath, index, endIndex){
    return new Promise(function(resolve) {
      var imageList = [];
      for (let i = index; i < Math.min(endIndex, givenList.length); i++) {
        var imagePath = folderPath + givenList[i];
        const img = new Image();
        img.src = imagePath;
        imageList.push(imagePath);
      }
      resolve(imageList);
    });
  }
 
  function addScrollFunctionality(scrollContainer, entry, folderPath){
    var selectedImages = [];
    var leftDiv = scrollContainer.querySelector(".left_image");
    var leftImage = leftDiv.querySelector(".slides");

    var centerDiv = scrollContainer.querySelector(".center_image");
    var centerImage = centerDiv.querySelector(".slides");

    var rightDiv = scrollContainer.querySelector(".right_image");
    var rightImage = rightDiv.querySelector(".slides");

    var leftButton = scrollContainer.querySelector(".slideshow_left");
    var rightButton = scrollContainer.querySelector(".slideshow_right");

    var centralIndex = 1;

    loadImages(entry, folderPath, 0, 3).then(imageList => {
      selectedImages = imageList;
      showDivs(centralIndex);
      loadImages(entry, folderPath, 3, entry.length).then(moreImages => {
        selectedImages = selectedImages.concat(moreImages);
      });
    }).then(() => {
      leftButton.addEventListener("click", () => plusDivs(-1));
      rightButton.addEventListener("click", () => plusDivs(1)); 
    });
    
    function plusDivs(n) {
      centralIndex = modLoop(centralIndex + n, selectedImages.length);
      showDivs();
    }

    function showDivs() {
      leftImage.src = selectedImages[modLoop(centralIndex - 1, selectedImages.length)];
      centerImage.src = selectedImages[centralIndex];
      rightImage.src = selectedImages[modLoop(centralIndex + 1, selectedImages.length)];
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