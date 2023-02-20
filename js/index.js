//Variables

let categoryArray = [];
let mealArray = [];
let navMealArray = [];
let mainSection = document.querySelector(".main-section");
let mainSearchInput = document.querySelector(".main-search-input");
let searchResult = document.querySelector(".search-result");
let navSearchinput = document.querySelector(".search-input");
let navSearchList = document.querySelector(".nav-search-list");

//Category function

async function mealCategory() {
  let response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/categories.php"
  );
  let data = await response.json();
  for (i = 0; i < data.categories.length; i++) {
    let categoryTitle = data.categories[i].strCategory;
    let categoryImage = data.categories[i].strCategoryThumb;
    let categoryName = data.categories[i].strCategory;
    let categoryObj = {
      title: categoryTitle,
      image: categoryImage,
      category: categoryName,
    };
    categoryArray.push(categoryObj);
  }
  renderCategory(categoryArray);
}

//Rendering Category Data

function renderCategory(categoryArray) {
  for (i = 0; i < 10; i++) {
    mainSection.innerHTML += `

    <div class="main-card">
    <a href="/category-page.html?c=${categoryArray[i].category}"><div class="category-title">${categoryArray[i].title}</div></a>
       <img src=${categoryArray[i].image} alt="Beef" class="category-image">
       <a href="/category-page.html?c=${categoryArray[i].category}"><button class="main-button">Explore</button></a>
    </div>
    `;
  }
}

//Meal search result

mainSearchInput.addEventListener("input", (e) => {
  let query = e.target.value;
  console.log(query);
  if (mainSearchInput.value !== "") {
    mealArray = [];
    mealSearch(query);
  } else {
    searchResult.innerHTML = "";
    mealArray = [];
    toggleSuggestion();
  }
});
function toggleSuggestion() {
  if (mealArray.length != 0) {
    searchResult.classList.add("display");
  } else {
    searchResult.classList.remove("display");
    mealArray = [];
  }
}

async function mealSearch(query) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`
  );
  let text = await response.text();
  let data = text === "" ? [] : JSON.parse(text);
  for (let i = 0; i < data.meals?.length; i++) {
    mealArray.push({
      mealName: data.meals[i].strMeal,
      mealId: data.meals[i].idMeal,
    });
  }
  toggleSuggestion();
  let newMealArray = mealArray.slice(0, 5);
  mealArray = newMealArray.sort();
  for (i = 0; i < mealArray.length; i++) {
    let a = document.createElement("a");
    a.href = `meal-page.html?id=${mealArray[i].mealId}`;
    a.classList.add("link");
    let li = document.createElement("li");
    li.setAttribute("data-id", mealArray[i].mealId);
    li.classList.add("search-list");
    li.innerHTML = mealArray[i].mealName;
    a.append(li);
    searchResult.append(a);
  }
}

// nav searchBar

function toggleNavSuggestion() {
  if (navMealArray.length != 0) {
    navSearchList.classList.add("display");
  } else {
    navSearchList.classList.remove("display");
    mealArray = [];
  }
}

navSearchinput.addEventListener("input", (e) => {
  let query = e.target.value;
  console.log(query);
  if (navSearchinput.value != "") {
    navMealArray = [];
    mealNavSearch(query);
  } else {
    navSearchList.innerHTML = "";
    navMealArray = [];
    toggleNavSuggestion();
  }
});

async function mealNavSearch(query) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`
  );
  let text = await response.text();
  let data = text === "" ? [] : JSON.parse(text);
  for (let i = 0; i < data.meals?.length; i++) {
    navMealArray.push({
      mealName: data.meals[i].strMeal,
      mealId: data.meals[i].idMeal,
    });
  }
  if (navMealArray.length != 0) {
    navSearchList.classList.add("display");
  } else {
    console.log("navMealArray.length :>> ", navMealArray.length);
    navSearchList.classList.remove("display");
    mealArray = [];
  }
  let newNavMealArray = navMealArray.slice(0, 15);
  navMealArray = newNavMealArray.sort();
  for (i = 0; i < navMealArray.length; i++) {
    let link = document.createElement("a");
    link.href = `./meal-page.html?id=${navMealArray[i].mealId}`;
    link.classList.add("link");
    let li = document.createElement("li");
    li.setAttribute("data-id", navMealArray[i].mealId);
    li.classList.add("search-list");
    li.innerHTML = navMealArray[i].mealName;
    link.append(li);
    navSearchList.append(link);
  }
}

console.log(document.URL);
mealCategory();
