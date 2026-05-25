document.addEventListener('DOMContentLoaded', () => {
  const queryURL = 'https://isaimel.github.io/Current-Website-Project/lists.json';
  
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
    var tabList = {};
    var pathDictionary = {};
    var currentTabName = Object.keys(tab_data)[0];
    
    let showDelay = 20;
    let menuEnterTimer;
  
    initializeGallery();

    async function initializeGallery(){
      await loadTabs();
      addTabFunctionality();
      pathDictionary[currentTabName] = await loadImages(currentTabName, 0, 3);
      selectTab(currentTabName);
      for (const tabName in tab_data) {
        if (tabName == currentTabName) continue;
        pathDictionary[tabName] = await loadImages(tabName, 0, 3);
      } 
      await addButtonFunctionality();
      loadRemainingImages();
    }

    async function loadRemainingImages() {
      for (const tabName in tab_data) {
        const remaining = await loadImages(tabName, 3, tab_data[tabName].length);
        pathDictionary[tabName] = pathDictionary[tabName].concat(remaining);
      }
    }

    function loadImages(tabName, startIndex, endIndex){
      var tabList = [];
      for (let i = startIndex; i < endIndex; i++) {
        tabList.push(loadImage(tabName, i));
      }
      return tabList;
    }

    function loadImage(tabName, imageIndex, parentPath = 'https://isaimel.github.io/Current-Website-Project/assets/') {
      var imageName = tab_data[tabName][imageIndex];
      var imagePath = `${parentPath}${tabName}/${imageName}`;
      var img = new Image();
      img.src = imagePath;
      return imagePath;
    }

    function loadTabs(){
      for (const key in tab_data) {
        var newDiv = document.createElement("div");
        tabList[key] = newDiv;
        newDiv.textContent = key.replace(/^./, char => char.toUpperCase());
        newDiv.style.backgroundColor = "white";
        newDiv.style.color = "black";
        tab_container.appendChild(newDiv);
      }
    }

    function addTabFunctionality(){
      for (const key in tabList) {
        tabList[key].addEventListener("mouseover", () => swapTab(key));
        tabList[key].addEventListener('mouseleave', function() {
          clearTimeout(menuEnterTimer);
        });
      }
    }

    function addButtonFunctionality(){
      leftButton.addEventListener("click", () => plusDivs(-1));
      rightButton.addEventListener("click", () => plusDivs(1));       
    }
    
    function selectTab(tabName){
      tabList[currentTabName].style.backgroundColor = "white";
      tabList[currentTabName].style.color = "black";

      currentTabName = tabName;
      tabList[currentTabName].style.backgroundColor = "black";
      tabList[currentTabName].style.color = "white";
      showDivs();
    }

    function swapTab(tabName) {
      if (tabName == currentTabName) {
        return;
      }
      centralImageIndex = 1;

      menuEnterTimer = setTimeout(function() {
        selectTab(tabName);
			}, showDelay);
    }

    function createPathList(tabName, startIndex, endIndex){
        var pathList = [];
        for (let i = startIndex; i < endIndex; i++) {
          const imageName = tab_data[tabName][i];
          const imagePath = `./assets/${tabName}/${imageName}`;
          const img = new Image();
          img.src = imagePath;
          pathList.push(imagePath);
        }
        return pathList;
    }

    function showDivs() {
      leftImage.src = pathDictionary[currentTabName][modLoop(centralImageIndex - 1, pathDictionary[currentTabName].length)];
      centerImage.src = pathDictionary[currentTabName][centralImageIndex];
      rightImage.src = pathDictionary[currentTabName][modLoop(centralImageIndex + 1, pathDictionary[currentTabName].length)];
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