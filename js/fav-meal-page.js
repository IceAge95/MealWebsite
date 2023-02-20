// variables

let favMealArray = JSON.parse(localStorage.getItem("favItems")) || [];
let navMealArray = [];
let navSearchinput = document.querySelector(".search-input");
let navSearchList = document.querySelector(".nav-search-list");
let favMealContainer = document.querySelector(".fav-meal-container");

// rendering fav meals

function renderFavMeal() {
  if (favMealArray.length === 0) {
    console.log("favMealArray.length :>> ", favMealArray.length);
    favMealContainer.innerHTML = `  <div class="empty-fav-container">
    <i class="fa-solid fa-ghost ghost-icon"></i> Sorry there are no favorite meals
</div>`;
    renderFavMeal();
  }
  favMealContainer.innerHTML = "";
  for (let i = 0; i < favMealArray.length; i++) {
    favMealContainer.innerHTML += `    <div class="fav-card">
    <a href="./meal-page.html?id=${favMealArray[i].id}"><div class="fav-title">${favMealArray[i].title}</div></a>
          <div class="fav-category">${favMealArray[i].category}</div>
          <img src=${favMealArray[i].image} class="fav-img" alt="">
          <button class="fav-button" onClick="removeFav(${favMealArray[i].id})"><i class="fa-solid fa-heart heart-icon clicked"></i></button>
          </div>`;
  }
}
renderFavMeal();

//remove from fav meal

function removeFav(id) {
  console.log(id);
  let tempFavMeal = favMealArray.filter((meal) => {
    console.log(meal.id);
    return id != meal.id;
  });
  console.log(tempFavMeal);
  favMealArray = tempFavMeal;
  localStorage.setItem("favItems", JSON.stringify(favMealArray));
  renderFavMeal();
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
