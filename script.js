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

    var slideshowContainer = gallery.querySelector(".slideshow_container");
    var allContainer = gallery.querySelector(".all_container");
    allContainer.style.display = 'none';

    var galleryHeader = gallery.querySelector(".gallery_header");

    var currentGallery = 0;

    var centralImageIndex = 1;
    var tabList = {};
    var pathDictionary = {};
    var currentTabName = Object.keys(tabData)[0];

    var tabFullGalleries = {};

    initializeGallery();

    async function initializeGallery(){
      await loadTabs();
      pathDictionary[currentTabName] = await loadImages(currentTabName, 0, 3);
      selectTab(currentTabName);

      var promises = [];
      for (const tabName in tabData) {
        if (tabName == currentTabName) continue;
        promises.push(loadImages(tabName, 0, 3).then(imgs => pathDictionary[tabName] = imgs));
      }
      await Promise.all(promises);
      addTabFunctionality();
      await loadRemainingImages();
      addButtonFunctionality();
      galleryHeader.addEventListener("click", () => swapGallery())
      
    }
    function swapGallery(){
      if (currentGallery == 0){
        currentGallery = 1;
        slideshowContainer.style.display = 'none';
        allContainer.style.display = '';
        selectTab(currentTabName);
      }
      else{
        currentGallery = 0;
        slideshowContainer.style.display = '';
        allContainer.style.display = 'none';
      }
      console.log(currentGallery);
    }

    async function loadRemainingImages() {
      var promises = [];
      for (const tabName in tabData) {
        promises.push(loadImages(tabName, 3, tabData[tabName].length)
          .then(imgs => pathDictionary[tabName] = pathDictionary[tabName].concat(imgs)));
      }
      return Promise.all(promises);
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
        img.onload = () => {
          img.ratio = img.naturalWidth > img.naturalHeight ? 0 : 1;
          tabFullGalleries[tabName].appendChild(img);
          resolve(img);
        }
        img.onerror = () => resolve(img);
      });
    }

    function loadTabs(){
      return new Promise ((resolve) => {
        for (const key in tabData) {
          var tabDiv = document.createElement("div");
          tabList[key] = tabDiv;
          var galleryDiv = document.createElement("div");
          tabFullGalleries[key] = galleryDiv;
          allContainer.appendChild(galleryDiv);
          tabDiv.textContent = key.replace(/^./, char => char.toUpperCase());
          tabContainer.appendChild(tabDiv);
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
      var oldTabName = currentTabName;
      currentTabName = tabName;

      tabList[currentTabName].style.backgroundColor = "var(--color-1)";
      tabList[currentTabName].style.color = "white";
      if (currentGallery == 0) showDivs();
      else showGallery(oldTabName);
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

      var leftImg   = pathList[modLoop(centralImageIndex - 1, pathList.length)];
      var centerImg = pathList[centralImageIndex];
      var rightImg  = pathList[modLoop(centralImageIndex + 1, pathList.length)];

      leftImage.src   = leftImg.src;
      centerImage.src = centerImg.src;
      rightImage.src  = rightImg.src;
      itemDescription.innerHTML = centerImg.alt;

      applyImageStyle(leftImage,   leftImg.ratio);
      applyImageStyle(centerImage, centerImg.ratio);
      applyImageStyle(rightImage,  rightImg.ratio);
    }
    function showGallery(oldTab){
      tabFullGalleries[oldTab].style.display = '';
      tabFullGalleries[currentTabName].style.display = 'flex';
    }

    function applyImageStyle(imgElement, ratio) {
    if (ratio == 0) {
      imgElement.style.width = '100%';
      imgElement.style.height = 'auto';
    } else {
      imgElement.style.height = '100%';
      imgElement.style.width = 'auto ';
    }
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