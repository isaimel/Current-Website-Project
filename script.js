document.addEventListener('DOMContentLoaded', () => {
  const queryURL = 'https://isaimel.github.io/Current-Website-Project/lists.json';
  
  fetch(queryURL)
    .then(response => response.json())
    .then(jsonData => {
      const first_page_gallery = document.getElementById("first_page_gallery");
      galleryFunctionality(first_page_gallery, jsonData);
    })
    .catch(error => console.log('Error during fetch: ' + error.message));
  
  function galleryFunctionality(gallery, jsonData){
    var tabData = jsonData.tabs;
    var descriptionsData = jsonData.descriptions;

    var leftImage = gallery.querySelector(".left_image").querySelector(".slides");
    var centerImage = gallery.querySelector(".center_image").querySelector(".slides");
    var rightImage = gallery.querySelector(".right_image").querySelector(".slides");
    var leftButton = gallery.querySelector(".slideshow_left");
    var rightButton = gallery.querySelector(".slideshow_right");
    var tabContainer = gallery.querySelector(".tab_container");
    var itemDescription = gallery.querySelector(".item_description p");

    var centralImageIndex = 1;
    var tabList = {};
    var pathDictionary = {};
    var currentTabName = Object.keys(tabData)[0];

    initializeGallery();

    async function initializeGallery(){
      await loadTabs();
      addTabFunctionality();
      pathDictionary[currentTabName] = await loadImages(currentTabName, 0, 3);
      selectTab(currentTabName);

      var promises = [];
      for (const tabName in tabData) {
        if (tabName == currentTabName) continue;
        promises.push(loadImages(tabName, 0, 3).then(imgs => pathDictionary[tabName] = imgs));
      }
      await Promise.all(promises);

      loadRemainingImages();
      addButtonFunctionality();
    }

    async function loadRemainingImages() {
      var promises = [];
      for (const tabName in tabData) {
        promises.push(loadImages(tabName, 3, tabData[tabName].length)
          .then(imgs => pathDictionary[tabName] = pathDictionary[tabName].concat(imgs)));
      }
      await Promise.all(promises);
    }

    function loadImages(tabName, startIndex, endIndex){
      var tabList = [];
      for (let i = startIndex; i < endIndex; i++) {
        tabList.push(loadImage(tabName, i));
      }
      return Promise.all(tabList);
    }

    function loadImage(tabName, imageIndex, parentPath = 'https://isaimel.github.io/Current-Website-Project/assets/') {
      return new Promise ((resolve) => {
        var img = new Image();
        var imageName = tabData[tabName][imageIndex];
        var imagePath = `${parentPath}${tabName}/${imageName}`;
        img.src = imagePath;
        img.alt = descriptionsData[tabName][imageName];
        img.onload = () => resolve(img);
        img.onerror = () => resolve(img);
      });
    }

    function loadTabs(){
      return new Promise ((resolve) => {
        for (const key in tabData) {
          var newDiv = document.createElement("div");
          tabList[key] = newDiv;
          newDiv.textContent = key.replace(/^./, char => char.toUpperCase());
          tabContainer.appendChild(newDiv);
        }
        resolve();
      });
    }

    function addTabFunctionality(){
      for (const key in tabList) {
        tabList[key].addEventListener("mouseover", () => swapTab(key));
      }
    }

    function addButtonFunctionality(){
      leftButton.addEventListener("click", () => plusDivs(-1));
      rightButton.addEventListener("click", () => plusDivs(1));       
    }
    
    function selectTab(tabName){
      tabList[currentTabName].style.backgroundColor = '';
      tabList[currentTabName].style.color = '';
      currentTabName = tabName;

      tabList[currentTabName].style.backgroundColor = "var(--color-1)";
      tabList[currentTabName].style.color = "white";
      showDivs();
    }

    function swapTab(tabName) {
      if (tabName == currentTabName) {
        return;
      }
      centralImageIndex = 1;
      selectTab(tabName);
    }

    function showDivs() {
      var pathList = pathDictionary[currentTabName];
      
      leftImage.src = pathList[modLoop(centralImageIndex - 1, pathDictionary[currentTabName].length)].src;
      centerImage.src = pathList[centralImageIndex].src;
      rightImage.src = pathList[modLoop(centralImageIndex + 1, pathDictionary[currentTabName].length)].src;
      itemDescription.innerHTML = pathList[centralImageIndex].alt;
    }
    
    function plusDivs(n) {
      centralImageIndex = modLoop(centralImageIndex + n, pathDictionary[currentTabName].length);
      showDivs();
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