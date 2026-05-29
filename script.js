const jsonFileURL = 'https://isaimel.github.io/Current-Website-Project/lists.json';

function onYouTubeIframeAPIReady() {
  fetch(jsonFileURL)
    .then(response => response.json())
    .then(jsonData => addAllProjects(document.getElementById("projects"), jsonData));
}

function addAllProjects(projects_container, jsonData){
  for (const projectInfo of Object.values(jsonData.projects)){
    var projectDiv = document.createElement("div");
    projectDiv.classList.add("project");

    var mediaContainer = document.createElement("div");

    if (projectInfo["type"] === "video") {
      for (const videoID of projectInfo["video_IDs"]) {
        var videoToReplace = document.createElement("div");
        videoToReplace.id = videoID;
        mediaContainer.appendChild(videoToReplace);
        createYTFrame(videoID);
      }
    }

    var projecTextDiv = document.createElement("div");
    projecTextDiv.classList.add("project_text");
    var projectTitle = document.createElement("span");
    var projectDescription = document.createElement("p");

    projectTitle.innerText = projectInfo["headline"];
    projectDescription.innerText = projectInfo["description"];

    projecTextDiv.appendChild(projectTitle);
    projecTextDiv.appendChild(projectDescription);
    projectDiv.appendChild(mediaContainer);
    projectDiv.appendChild(projecTextDiv);
    projects_container.appendChild(projectDiv);
  }
}

function createYTFrame(videoID) {
  return new YT.Player(videoID, {
    height: '200',
    width: '200',
    videoId: videoID
  });
}

const Display = Object.freeze({
  SCROLL:   Symbol("scroll"),
  ALL:  Symbol("all")
});

const Orientation = Object.freeze({
  PORTRAIT:   Symbol("portrait"),
  LANDSCAPE:  Symbol("landscape")
});


fetch(jsonFileURL)
  .then(response => response.json())
  .then(jsonData => {
    const first_page_gallery = document.getElementById("first_page_gallery");
    galleryFunctionality(first_page_gallery, jsonData);
  })
  .catch(error => console.log('Error during fetch: ' + error.message));

const projects = document.getElementById("projects");
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0]
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function galleryFunctionality(gallery, jsonData){
  const lightboxContainer = document.getElementById('lightboxContainer');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxDescription = lightboxContainer.querySelector("span");

  var tabData = jsonData.tabs;
  var descriptionsData = jsonData.descriptions;

  var leftImage = gallery.querySelector(".left_image");
  var centerImage = gallery.querySelector(".center_image");
  var rightImage = gallery.querySelector(".right_image");

  var leftButton = gallery.querySelector(".slideshow_left");
  var rightButton = gallery.querySelector(".slideshow_right");
  var tabContainer = gallery.querySelector(".tab_container");
  var itemDescription = gallery.querySelector(".item_description");

  var slideshowContainer = gallery.querySelector(".slideshow_container");
  var tabGalleriesContainer = gallery.querySelector(".all_container");
  tabGalleriesContainer.style.display = 'none';

  var galleryHeader = gallery.querySelector(".swap_layout");

  var currentGallery = Display.SCROLL;

  var middleImgInd = 1;
  var tabDivList = {};
  var imageDict = {};
  var tabGalleries = {};

  var currentTab = Object.keys(tabData)[0];

  initializeGallery();    

  async function initializeGallery(){
    await loadTabs();
    imageDict[currentTab] = await loadImages(currentTab, 0, 3);

    selectTab(currentTab);
    centerImage.addEventListener('click', () => {
      rewriteLightbox('flex', centerImage.src, centerImage.alt);
      applyImageStyle(lightboxImg, centerImage.ratio , 'max(40vw, 18rem + 18vw)');
    });
    await loadFirstThrees();
    addTabFunctionality();
    await loadRemainingImages();
    addButtonFunctionality();
    galleryHeader.addEventListener("click", () => swapGallery())
    lightboxContainer.addEventListener('click', () => rewriteLightbox('none', '', ""));
  }
  function swapGallery(){
    if (currentGallery == Display.SCROLL){
      currentGallery = Display.ALL;
      slideshowContainer.style.display = 'none';
      tabGalleriesContainer.style.display = '';
      selectTab(currentTab);
    }
    else{
      currentGallery = Display.SCROLL;
      slideshowContainer.style.display = '';
      tabGalleriesContainer.style.display = 'none';
    }
  }
  function loadFirstThrees() {
    var promises = [];
    for (const tabName in tabData) {
      if (tabName == currentTab) continue;
      promises.push(loadImages(tabName, 0, 3).then(imgs => imageDict[tabName] = imgs));
    }
    return Promise.all(promises);
  }

  async function loadRemainingImages() {
    var promises = [];
    for (const tabName in tabData) {
      promises.push(loadImages(tabName, 3, tabData[tabName].length)
        .then(imgs => imageDict[tabName] = imageDict[tabName].concat(imgs)));
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
        img.ratio = img.naturalWidth > img.naturalHeight ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
        img.addEventListener('click', () => {
          rewriteLightbox('flex', img.src, img.alt);
          applyImageStyle(lightboxImg, img.ratio , 'max(40vw, 18rem + 18vw)')
        });
        tabGalleries[tabName].appendChild(img);
        resolve(img);
      }
      img.onerror = () => resolve(img);
    });
  }
  function rewriteLightbox(displayStyle, imageSource, imageAlt){
    lightboxContainer.style.display = displayStyle;
    lightboxImg.src = imageSource;
    lightboxDescription.innerHTML = imageAlt;
  }

  function loadTabs(){
    return new Promise ((resolve) => {
      for (const key in tabData) {
        var tabDiv = document.createElement("div");
        var galleryDiv = document.createElement("div");

        tabDivList[key] = tabDiv;
        tabGalleries[key] = galleryDiv;
        tabDiv.textContent = key.replace(/^./, char => char.toUpperCase());
        
        tabContainer.appendChild(tabDiv);
        tabGalleriesContainer.appendChild(galleryDiv);
      }
      resolve();
    });
  }

  function addTabFunctionality(){
    for (const key in tabDivList) {
      tabDivList[key].addEventListener("mouseover", () => swapTab(key));
    }
  }

  function addButtonFunctionality(){
    leftButton.addEventListener("click", () => plusDivs(-1));
    rightButton.addEventListener("click", () => plusDivs(1));       
  }
  
  function selectTab(newTabName){
    var oldTabName = currentTab;
    tabDivList[currentTab].style.backgroundColor = '';
    tabDivList[currentTab].style.color = '';
    
    currentTab = newTabName;

    tabDivList[currentTab].style.backgroundColor = "var(--color-1)";
    tabDivList[currentTab].style.color = "white";

    if (currentGallery == Display.SCROLL) showDivs();
    else showGallery(oldTabName);
  }

  function swapTab(tabName) {
    if (tabName == currentTab) {
      return;
    }
    middleImgInd = 1;
    selectTab(tabName);
  }

  function showDivs() {
    var pathList = imageDict[currentTab];

    var leftImg   = pathList[modLoop(middleImgInd - 1, pathList.length)];
    var centerImg = pathList[middleImgInd];
    var rightImg  = pathList[modLoop(middleImgInd + 1, pathList.length)];

    leftImage.src   = leftImg.src;
    centerImage.src = centerImg.src;
    rightImage.src  = rightImg.src;

    centerImage.alt = centerImg.alt;
    centerImage.ratio = centerImg.ratio;
    itemDescription.innerHTML = centerImg.alt;

    applyImageStyle(leftImage,   leftImg.ratio);
    applyImageStyle(centerImage, centerImg.ratio);
    applyImageStyle(rightImage,  rightImg.ratio);
  }
  function showGallery(oldTab){
    tabGalleries[oldTab].style.display = '';
    tabGalleries[currentTab].style.display = 'flex';
  }
  function plusDivs(n) {
    middleImgInd = modLoop(middleImgInd + n, imageDict[currentTab].length);
    showDivs();
  }
}

function applyImageStyle(imgElement, ratio, percent = '100%') {
  if (ratio === undefined) ratio = Orientation.PORTRAIT; 
  if (ratio == Orientation.LANDSCAPE) {
    imgElement.style.width = percent;
    imgElement.style.height = 'auto';
  } else {
    imgElement.style.height = percent;
    imgElement.style.width = 'auto';
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
