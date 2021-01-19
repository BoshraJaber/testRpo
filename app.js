'use strict';
// Global Variables
var arrayOfProduct = [];
var arrayOfImages = ['All-Season-Cake.jpg', 'Avocado-Pies.jpg', 'Cheese-Meatballs-Pasta.jpg', 'Christmas-tree-rolls.jpg', 'Duck-Cake.jpg', 'Eggplant-Stuffed.jpg', 'Italian-Shrimp-Pasta.jpg', 'Mexican-Bowls.jpg', 'Rice-Chicken.jpg', 'Sea-Food-Haven.gif', 'Sesame-Noodle-Bowls.jpg'];
var leftProductImg = document.getElementById('left_product_img');
var centerProductImg = document.getElementById('center_product_img');
var rightProductImg = document.getElementById('right_product_img');
var leftProductText = document.getElementById('left_product_h2');
var centerProductText = document.getElementById('center_product_h2');
var rightProductText = document.getElementById('right_product_h2');
var clicksLeft = 7;

var productCanvas = document.getElementById('productChart').getContext('2d');
var productCanvas2 = document.getElementById('productChart2').getContext('2d');
//variables for the buttons
var clearDataBtn = document.getElementById('clearLocalStorage');
var resultBtn = document.getElementById('result_button');
var displaychart = document.getElementById('show_Chart');
var displaychart2 = document.getElementById('show_Chart2');


var shownImages = []; // this array will be responsible  for keeping track of the shown img at the current loop

//constractor
function Product(name) {
    this.productName = name.split(".")[0];
    this.imgFilePath = 'img/' + name;
    this.timesShown = 0;
    this.timesClicked = 0;
    arrayOfProduct.push(this);
}

// creating the objects
function generateObjects() {
    for (var i = 0; i < arrayOfImages.length; i++) {
        new Product(arrayOfImages[i]);
    }
}
generateObjects();

//functions regarding storing the data
function storeData() {
    localStorage.setItem('buttom_section', JSON.stringify(arrayOfProduct));
    //console.log(localStorage);
}
function clearLocalStorage() {
    localStorage.clear();
}
function checkAndRestore() {
    if (localStorage.length > 0) { // check if the local storage has any values in it
        arrayOfProduct = JSON.parse(localStorage.getItem('buttom_section')); // restore the data from the local storage
    }
}

// adding a listener to reset the storage.
clearDataBtn.addEventListener('click', clearLocalStorage);
checkAndRestore();

// Functions
//function that ensure the images currently displayed are not the same as the next images to be displayed
function checkAvailability(selectProductName) {
    for (let index = 0; index < shownImages.length; index++) {
        if (shownImages[index].productName === selectProductName) {
            return true; // because I want it to keep generating images as long as the previous one = the current one
        }
    }
    return false; // so it breaks out the do-while loop because they are not the same.
}

//function for choosing 3 random images
function pickImage() {
    do {
        var leftImg = Math.round(Math.random() * (arrayOfProduct.length - 1));
        var leftImageName = arrayOfProduct[leftImg].productName;
    } while (checkAvailability(leftImageName));


    do {
        var centerImg = Math.round(Math.random() * (arrayOfProduct.length - 1));
        var centerImageName = arrayOfProduct[centerImg].productName;
    } while (leftImg === centerImg || checkAvailability(centerImageName));

    do {
        var rightImg = Math.round(Math.random() * (arrayOfProduct.length - 1));
        var rightImageName = arrayOfProduct[rightImg].productName;
    } while (rightImg === centerImg || rightImg === leftImg || checkAvailability(rightImageName));

    //here I will be pushing the generated images to the array shownImages.
    //this step is to keep track of al the images shown right now
    shownImages = []; //to clear the array after each display
    shownImages.push(arrayOfProduct[leftImg], arrayOfProduct[centerImg], arrayOfProduct[rightImg]);


    renderImg(leftImg, centerImg, rightImg);
}

// function for rendering the images on the front page
function renderImg(leftImg, centerImg, rightImg) {
    leftProductImg.setAttribute('src', arrayOfProduct[leftImg].imgFilePath);
    centerProductImg.setAttribute('src', arrayOfProduct[centerImg].imgFilePath);
    rightProductImg.setAttribute('src', arrayOfProduct[rightImg].imgFilePath);

    leftProductText.textContent = arrayOfProduct[leftImg].productName;
    centerProductText.textContent = arrayOfProduct[centerImg].productName;
    rightProductText.textContent = arrayOfProduct[rightImg].productName;

    arrayOfProduct[leftImg].timesShown++;
    arrayOfProduct[centerImg].timesShown++;
    arrayOfProduct[rightImg].timesShown++;
    storeData();
}
console.log(arrayOfProduct);
//Calling Funcrions
pickImage();



//adding a listner to show result
var sectionId = document.getElementById('all_products');
sectionId.addEventListener('click', countClicks);

//function that keeps tracks of clicks
function countClicks(event) {
    var targetId = event.target.id;
    if (clicksLeft !== 0) {
        if (targetId === 'left_product_img' || targetId === 'center_product_img' || targetId === 'right_product_img') {
            var objectIndicator = event.target.getAttribute('src');
            checkProduct(objectIndicator);
            pickImage();
        }
    } else {
        sectionId.removeEventListener('click', countClicks);
    }
}


//function that compare the image clicked with the path in the objects
function checkProduct(objectIndicator) {
    for (var index = 0; index < arrayOfProduct.length; index++) {
        if (arrayOfProduct[index].imgFilePath === objectIndicator) {
            arrayOfProduct[index].timesClicked++;
            clicksLeft--;
            storeData();
        }
    }

    console.log("You have " + clicksLeft + " Clicks left");
    if (clicksLeft === 0) {
        //renderChart();
        //renderChart2();
        createButton();
    }
}

// add a listner to show result botton

resultBtn.addEventListener("click", addResultList)

//function for adding the list:
function addResultList() {
    var buttomSection = document.getElementById("buttom_section");
    var ul = document.createElement("ul");
    buttomSection.appendChild(ul);
    for (var i = 0; i < arrayOfProduct.length; i++) {
        var list = document.createElement("li");
        list.textContent = arrayOfProduct[i].productName + " had " + arrayOfProduct[i].timesClicked + " votes, and was seen  " + arrayOfProduct[i].timesShown + " times";
        ul.appendChild(list);
    }
}
// adding a listner to the show chart button
displaychart.addEventListener("click", renderChart)
displaychart2.addEventListener("click", renderChart2)

function renderChart() {
    var arrayOfImagesNames = [];
    var arrayOfImagesClicked = [];
    var arrayOfImagesShown = [];

    for (var index = 0; index < arrayOfProduct.length; index++) {
        arrayOfImagesNames.push(arrayOfProduct[index].productName);
        arrayOfImagesClicked.push(arrayOfProduct[index].timesClicked);
        arrayOfImagesShown.push(arrayOfProduct[index].timesShown);
    }

    var myChart = new Chart(productCanvas, {
        type: 'bar',// define the type of the chart
        data: {
            labels: arrayOfImagesNames, // array of labels (names of the products)
            datasets: [
                {
                    label: '# of Products Clicks',
                    data: arrayOfImagesClicked, // array of values (count for each image when it was clicked)
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(54, 162, 235, 0.2)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)'
                    ],
                    borderWidth: 1
                },
                {
                    label: 'Number of Time Shown',
                    data: arrayOfImagesShown, // array of values (count for each goat when it was clicked)
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderColor: [
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],
                    borderWidth: 1
                }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

//=======================
// onother chart


function renderChart2() {

    var arrayOfImagesNames = [];
    var arrayOfImagesClicked = [];
    var arrayOfImagesShown = [];

    for (var index = 0; index < arrayOfProduct.length; index++) {
        arrayOfImagesNames.push(arrayOfProduct[index].productName);
        arrayOfImagesClicked.push(arrayOfProduct[index].timesClicked);
        arrayOfImagesShown.push(arrayOfProduct[index].timesShown);
    }

    var mixedChart = new Chart(productCanvas2, {
        type: 'bar',
        data: {
            datasets: [{
                label: '# of Shown Images',
                data: arrayOfImagesShown,
            }, {
                label: '# of Selected Images',
                data: arrayOfImagesClicked,
                backgroundColor: [
                    'rgba(75, 192, 192, 1)',
                ],

                // Changes this dataset to become a line
                type: 'line'
            }],
            labels: arrayOfImagesNames,
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
