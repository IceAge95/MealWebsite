let url = String(document.URL);
let id = url.substring(url.length - 5);

//  variables

let navMealArray = [];
let navSearchinput = document.querySelector(".search-input");
let navSearchList = document.querySelector(".nav-search-list");
let favMealArray = JSON.parse(localStorage.getItem("favItems")) || [];
let relatedArray = [];
let mealItemTitle = document.querySelector(".meal-item-title");
let mealCategory = document.querySelector(".meal-category");
let mealMainImage = document.querySelector(".meal-main-image");
let mealInstruction = document.querySelector(".meal-instruction");
let mealVideo = document.querySelector("iframe");
let mealMainIngredients = document.querySelector(".meal-main-ingredients");
let title = document.querySelector("title");
let relatedContainer = document.querySelector(".related-container");
let related = document.querySelector(".related");
let favButton = document.querySelector(".fav-button");
let heartIcon = document.querySelector(".heart-icon");

// title

title.innerHTML = `${title} `;

// meal Detail

async function mealDetail() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await response.json();
  mealItemTitle.innerHTML = data.meals[0].strMeal;
  mealCategory.innerHTML = data.meals[0].strCategory;
  mealMainImage.setAttribute("src", data.meals[0].strMealThumb);
  mealInstruction.innerHTML = data.meals[0].strInstructions;
  title.innerHTML = `${data.meals[0].strMeal} | Food Recipes`;
  let youtubeLink = data.meals[0].strYoutube.replace("watch?v=", "embed/");
  console.log(youtubeLink);
  mealVideo.setAttribute("src", youtubeLink);
  for (let i = 1; i < 20; i++) {
    inc = data.meals[0][`strIngredient${i}`];
    qua = data.meals[0][`strMeasure${i}`];
    if (inc !== null && inc !== "") {
      // console.log("inc :>> ", inc);
      mealMainIngredients.innerHTML += `<div class="ingredients-card">
      <img class="ingredients-image" src="https://www.themealdb.com/images/ingredients/${inc}.png" alt="">
      <div class="ingredients-name">${inc}</div>
      <div class="ingredients-measure">${qua} </div>
    </div>`;
    }
  }
  const meal = favMealArray.find((meal) => id === meal.id);
  if (meal) {
    heartIcon.classList.add("clicked");
  }

  // related recipes

  related.innerHTML = ` Other ${data.meals[0].strCategory} Recipies `;
  relatedRecipes(data.meals[0].strCategory);
}
mealDetail();

async function relatedRecipes(category) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();
  for (i = 0; i < data.meals.length; i++) {
    relatedArray.push({
      id: data.meals[i].idMeal,
      title: data.meals[i].strMeal,
      category: category,
      image: data.meals[i].strMealThumb,
    });
  }
  let newRelatedArray = relatedArray.slice(0, 4);
  relatedArray = newRelatedArray;
  for (let i = 0; i < relatedArray.length; i++) {
    relatedContainer.innerHTML += ` <div class="related-card">
    <a href="./meal-page.html?id=${relatedArray[i].id}"><div class="related-title">${relatedArray[i].title}</div></a>
    <div class="related-category">${relatedArray[i].category}</div>
    <img src=${relatedArray[i].image} class="related-card-image"
        alt="">
        `;
  }
}

// getting meal details from API

async function favMeal() {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await response.json();

  // favButton click

  favButton.addEventListener("click", () => {
    heartIcon.classList.toggle("clicked");
    if (heartIcon.classList.contains("clicked")) {
      favMealArray.push({
        id: data.meals[0].idMeal,
        title: data.meals[0].strMeal,
        category: data.meals[0].strCategory,
        image: data.meals[0].strMealThumb,
        status: true,
      });
    } else {
      let tempFavMeal = favMealArray.filter((meal) => id !== meal.id);
      favMealArray = tempFavMeal;
    }
    localStorage.setItem("favItems", JSON.stringify(favMealArray));
  });
}
favMeal();

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

// navbar search

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
