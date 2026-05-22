document.addEventListener('DOMContentLoaded', () => {
  const queryURL = 'https://raw.githubusercontent.com/isaimel/Current-Website-Project/refs/heads/main/lists.json';
  
  fetch(queryURL)
    .then(response => response.json())
    .then(listsData => {
      const scrollContainer = document.getElementById("portfolio_scroll");
      addScrollFunctionality(scrollContainer, listsData.saulList);
    })
    .catch(error => console.log('Error during fetch: ' + error.message));
  
  function loadImages(givenList){
    return new Promise(function(resolve) {
      var imageList = [];
      givenList.forEach(item => {
        var imagePath = './' + item + '.jpg';
        const img = new Image();
        img.src = imagePath;
        imageList.push(imagePath);
      });
      resolve(imageList);
    });

  }
  //  return new Promise(function(resolve, reject) {
  //   let script = document.createElement('script');
  //   script.src = src;

  //   script.onload = () => resolve(script);
  //   script.onerror = () => reject(new Error(`Script load error for ${src}`));

  //   document.head.append(script);
  // });
  
  function addScrollFunctionality(scrollContainer, entry){
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

    loadImages(entry.slice(0, 3)).then(imageList => {
      selectedImages = imageList;
      showDivs(centralIndex);
      loadImages(entry.slice(3, entry.length)).then(moreImages => {
        selectedImages = selectedImages.concat(moreImages);
      });
    });
    
    function plusDivs(n) {
      centralIndex = modLoop(centralIndex + n, selectedImages.length);
      showDivs(centralIndex);
    }

    function showDivs(n) {
      leftImage.src = selectedImages[modLoop(n - 1, selectedImages.length)];
      centerImage.src = selectedImages[centralIndex];
      rightImage.src = selectedImages[modLoop(n + 1, selectedImages.length)];
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