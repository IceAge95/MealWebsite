// variables

let url = String(document.URL);
let categoryName = url.split("=")[1];
let title = document.querySelector("title");
let heading = document.querySelector(".head-title");
let navMealArray = [];
let navSearchinput = document.querySelector(".search-input");
let navSearchList = document.querySelector(".nav-search-list");
title.innerHTML = `${categoryName} `;
heading.innerHTML = ` ${categoryName} Recipes `;
console.log(categoryName);
let favMealContainer = document.querySelector(".fav-meal-container");

// rendering meals details by category

async function categoryMeal() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`
  );
  let data = await response.json();
  console.log(data.meals[0]);
  favMealContainer.innerHTML = "";
  for (let i = 0; i < data.meals.length; i++) {
    favMealContainer.innerHTML += `    <div class="fav-card">
    <a href="/meal-page.html?id=${data.meals[i].idMeal}"><div class="fav-title">${data.meals[i].strMeal}</div></a>
          <div class="fav-category">${categoryName}</div>
          <img src=${data.meals[i].strMealThumb} class="fav-img" alt="${data.meals[i].strMealThumb}">
    `;
  }
}
categoryMeal();

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
    link.href = `meal-page.html?id=${navMealArray[i].mealId}`;
    link.classList.add("link");
    let li = document.createElement("li");
    li.setAttribute("data-id", navMealArray[i].mealId);
    li.classList.add("search-list");
    li.innerHTML = navMealArray[i].mealName;
    link.append(li);
    navSearchList.append(link);
  }
}
