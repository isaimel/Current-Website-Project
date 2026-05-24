document.addEventListener('DOMContentLoaded', () => {
  const queryURL = 'https://raw.githubusercontent.com/isaimel/Current-Website-Project/refs/heads/main/lists.json';
  
  fetch(queryURL)
    .then(response => response.json())
    .then(listsData => {
      const first_page_gallery = document.getElementById("first_page_gallery");
      galleryFunctionality(first_page_gallery, listsData.tabs);
    })
    .catch(error => console.log('Error during fetch: ' + error.message));
  
  function galleryFunctionality(gallery, tab_data){
    var leftImage = gallery.querySelector(".left_image").querySelector(".slides");
    var centerImage = gallery.querySelector(".center_image").querySelector(".slides");
    var rightImage = gallery.querySelector(".right_image").querySelector(".slides");
    var leftButton = gallery.querySelector(".slideshow_left");
    var rightButton = gallery.querySelector(".slideshow_right");
    var tab_container = gallery.querySelector(".tab_container");

    var centralImageIndex = 1;
    var pathDictionary = createPathDictionary(tab_data);
    var dictionaryKeys = Object.keys(tab_data);
    var tabList = {};
    
    for (const key in tab_data) {
      var newDiv = document.createElement("div");
      tabList[key] = newDiv;
      newDiv.innerHTML = key.replace(/^./, char => char.toUpperCase());
      newDiv.style.backgroundColor = "white";
      newDiv.style.color = "black";
      tab_container.appendChild(newDiv);
      newDiv.addEventListener("mouseover", () => selectTab(key));
    }
    var currentTabName = dictionaryKeys[0];
    selectTab(currentTabName);
    leftButton.addEventListener("click", () => plusDivs(-1));
    rightButton.addEventListener("click", () => plusDivs(1)); 

    function selectTab(index) {
      tabList[currentTabName].style.backgroundColor = "white";
      tabList[currentTabName].style.color = "black";
      currentTabName = index;
      if (index != currentTabName) {
        centralImageIndex = 0;
      }
      tabList[currentTabName].style.backgroundColor = "black";
      tabList[currentTabName].style.color = "white";
      showDivs();
    }
    
    function createPathDictionary(tab_data){
      var pathDictionary = {};
      for (const key in tab_data) {
        pathDictionary[key] = tab_data[key].map(item => "./assets/" + key + "/" + item);
      }
      return pathDictionary;
    }
    
    function showDivs() {
      leftImage.src = pathDictionary[currentTabName][modLoop(centralImageIndex - 1, pathDictionary[currentTabName].length)];
      centerImage.src = pathDictionary[currentTabName][centralImageIndex];
      rightImage.src = pathDictionary[currentTabName][modLoop(centralImageIndex + 1, pathDictionary[currentTabName].length)];
    }
    
    function plusDivs(n) {
      console.log(centralImageIndex);
      centralImageIndex = modLoop(centralImageIndex + n, pathDictionary[currentTabName].length);
      showDivs();
    }





    // function loadSelectedList(){
    //   loadImages(entry, 0, 3).then(imageList => {
    //     selectedImages = imageList;
    //     showDivs(centralIndex);
    //     loadImages(entry, 3, pathDictionary[currentTabName].length).then(moreImages => {
    //       selectedImages = selectedImages.concat(moreImages);
    //     });
    //   }).then(() => {

    //   });
      



    // }

  }

  // function loadImages(givenList, index, endIndex){
  //   return new Promise(function(resolve) {
  //     var imageList = [];
  //     for (let i = index; i < Math.min(endIndex, givenList.length); i++) {
  //       var imagePath = folderPath + givenList[i];
  //       const img = new Image();
  //       img.src = imagePath;
  //       imageList.push(imagePath);
  //     }
  //     resolve(imageList);
  //   });
  // }
 
  

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