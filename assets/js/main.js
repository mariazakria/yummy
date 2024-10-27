"use strict";
let nameSearch = document.querySelector("#nameSearch");
let search = document.querySelector('#searchContainer');
let rowData = document.querySelector('#rowData');

$("#Ingredients").on("click", getIngredients);
$("#Area").on("click", getArea);
$("#search").on("click", showSearchInputs);
$("#Categories").on("click", getCategories);
$("#contact").on("click", showContacts);


$(".open-close-icon").on("click", function() {
    if ($(".side-nav").css("left") === "0px") {
        $(".side-nav").animate({
            left: "-243px"
        }, 500);
        $(this).toggleClass("fa-x fa-bars");
    } else {
        $(".side-nav").animate({
            left: "0px"
        }, 500);
        $(this).toggleClass("fa-bars fa-x");
        $(".nav-links ul li").css("left", "-150px");
        $(".nav-links ul li").each(function(index) {
            $(this).delay(index * 150).animate({
                left: 0
            }, 400);
        });
    }
});


function wait() {
    $(document).ready(function() {
        $(".loading-screen").removeClass("d-none").css("display", "flex");
        $(".container").hide();
        setTimeout(function() {
            $(".loading-screen").fadeOut(300, function() {
                $(".container").fadeIn(300);
            });
        }, 400);
    });

}

async function getMealHome() {
    wait()
    var result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=`);
    var data = await result.json();
    console.log(data);
    displayMealsHome(data.meals);
    wait()
}
getMealHome();

function displayMealsHome(arr) {
    let meals = "";
    for (let i = 0; i < arr.length; i++) {
        meals += `
        <div class="col-md-3">
            <div onclick="getMealDetails('${arr[i].idMeal}')"  class="imagHome rounded-3 position-relative overflow-hidden" id="imagHome" class="imagHome">
                <img src="${arr[i].strMealThumb}" alt="" class="w-100" onclick="getMealDetails('${arr[i].idMeal}')">
                <div class="layer d-flex align-items-center position-absolute" id="${arr[i].idMeal}">
                    <h3 class="meal-layer ps-2 text-black" id="${arr[i].idMeal}">${arr[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = meals;

}

function closeSideNav() {
    $(".side-nav").animate({
        left: "-243px"
    }, 1000);
    $(".open-close-icon").toggleClass("fa-x fa-bars");
}

function showSearchInputs() {
    search.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 text-center ">

            <input id="nameSearch" class="form-control" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6 text-center">
                    <input  maxlength="1" id="searchByLetter" class="form-control" type="text" placeholder="Search By First Letter">

        </div>
    </div>`;

    rowData.innerHTML = "";
    wait()


    nameSearch = document.querySelector("#nameSearch");
    nameSearch.addEventListener("keyup", function() {
        let nameSearchMeal = nameSearch.value.toUpperCase();
        searchByName(nameSearchMeal);
    });
    let searchInputByLetter = document.querySelector("#searchByLetter");
    searchInputByLetter.addEventListener("keyup", function() {
        let letterSearchMeal = searchInputByLetter.value;
        searchByLetter(letterSearchMeal);
    });
    wait()
}

async function searchByName(nameSearchMeal) {
    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${nameSearchMeal}`);
    let response = await result.json();

    console.log(response);
    if (response.meals) {
        displayMealsHome(response.meals);
    } else {
        rowData.innerHTML = "<p>No meals found.</p>";
    }
}

async function searchByLetter(LetterSearchMeal) {

    let result = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${LetterSearchMeal}`);
    let response = await result.json();

    console.log(response);
    if (response.meals) {
        displayMealsHome(response.meals);
    } else {
        rowData.innerHTML = "<p>No meals found.</p>";
    }
}

// categories

async function getCategories() {
    rowData.innerHTML = "";
    search.innerHTML = "";
    wait()

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    response = await response.json();
    displayMealCategories(response.categories);
    wait()
}

function displayMealCategories(arr) {
    let categories = "";

    for (let i = 0; i < arr.length; i++) {
        categories += `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="imagHome rounded-3 position-relative overflow-hidden">
                <img src="${arr[i].strCategoryThumb}" alt="" class="w-100">
                <div class="layer d-block text-center position-absolute text-black">
                    <h3 class="meal-layer ps-2 text-black">${arr[i].strCategory}</h3>
                    <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = categories;

}


async function getCategoryMeals(category) {
    rowData.innerHTML = "";
    search.innerHTML = "";
    wait()
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
    response = await response.json();

    displayMeals(response.meals.slice(0, 20));
    wait()
}

function displayMeals(meals) {

    let mealData = "";
    wait()
    for (let i = 0; i < meals.length; i++) {
        mealData += `
        <div class="col-md-3">
            <div onclick="getMealDetails('${meals[i].idMeal}')" class="imagHome rounded-3 position-relative overflow-hidden">
                <img src="${meals[i].strMealThumb}" alt="" class="w-100">
                <div class="layer position-absolute d-flex align-items-center text-black p-2">
                    <h3 class="ps-2 text-black">${meals[i].strMeal}</h3>
                </div>
            </div>
        </div>
        `;
    }
    rowData.innerHTML = mealData;
    wait()

}

// area
async function getArea() {
    search.innerHTML = "";
    wait()
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
    response = await response.json();
    console.log(response.meals);
    displayArea(response.meals);
    wait()
}

function displayArea(arr) {
    let area = "";

    for (let i = 0; i < arr.length; i++) {
        area += `
        <div class="col-md-3">
            <div class="rounded-2 text-center cursor-pointer" onclick="getAreaMeals('${arr[i].strArea}')">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${arr[i].strArea}</h3>
            </div>
        </div>
        `;
    }

    rowData.innerHTML = area;

}

async function getAreaMeals(area) {
    rowData.innerHTML = ""
    wait()

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayMealsHome(response.meals.slice(0, 20))
    wait()
}
async function getCategoryMeals(category) {
    rowData.innerHTML = ""
    wait()
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    wait()

}

async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    wait()
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    wait()

}

async function getIngredients() {
    search.innerHTML = "";
    wait()
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    response = await response.json();
    console.log(response.meals);
    displayIngredients(response.meals.slice(0, 20));
    wait()
}

function displayIngredients(arr) {
    let ingredients = "";

    for (let m = 0; m < arr.length; m++) {
        ingredients += `
       <div class="col-md-3">
            <div onclick="getIngredientsMeals('${arr[m].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                <h3>${arr[m].strIngredient}</h3>
                <p>${arr[m].strDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
        `;
    }

    rowData.innerHTML = ingredients;

}


// show contacts
function showContacts() {
    wait()
    rowData.innerHTML = `
        <div class="col-md-6">
            <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
            <div id="alertName" class="alert alert-danger mt-2 d-none">Special characters and numbers not allowed
        </div>
        </div>
        <div class="col-md-6">
            <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
            <div id="alertEmail" class="alert alert-danger mt-2 d-none">Email not valid *exemple@yyy.zzz
        </div>
        </div>
        <div class="col-md-6">
            <input id="phoneInput" type="tel" class="form-control" placeholder="Enter Your Phone">
            <div id="alertPhone" class="alert alert-danger mt-2 d-none">Enter valid Phone Number</div>
        </div>
        <div class="col-md-6">
            <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
            <div id="alertAge" class="alert alert-danger mt-2 d-none">Enter valid Age</div>
        </div>
        <div class="col-md-6">
            <input id="passInput" type="password" class="form-control" placeholder="Enter Your Password">
            <div id="alertPass" class="alert alert-danger mt-2 d-none">Enter valid password *Minimum eight characters, at least one letter and one number:*
        </div>
        </div>
        <div class="col-md-6">
            <input id="repassInput" type="password" class="form-control" placeholder="Re-enter Your Password">
            <div id="alertRePass" class="alert alert-danger mt-2 d-none">Passwords do not match</div>
        </div>
        
    </div>
    </div>

    </div>
</div>
        <div style=" margin: 0 auto; display:flex">
            <button id="submitBtn" disabled="true" class="btn btn-outline-danger m-auto px-2 mt-2" style="    width: 35%;
    margin-top: 25px !important;">Submit</button>
</div>
    
`;

    let nameTouched = false,
        emailTouched = false,
        phoneTouched = false,
        ageTouched = false,
        passwordTouched = false,
        repasswordTouched = false;

    document.getElementById("nameInput").addEventListener("focus", () => {
        nameTouched = true;
    });
    document.getElementById("emailInput").addEventListener("focus", () => {
        emailTouched = true;
    });
    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneTouched = true;
    });
    document.getElementById("ageInput").addEventListener("focus", () => {
        ageTouched = true;
    });
    document.getElementById("passInput").addEventListener("focus", () => {
        passwordTouched = true;
    });
    document.getElementById("repassInput").addEventListener("focus", () => {
        repasswordTouched = true;
    });


    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener("keyup", validation);
        wait()
    });

    function validation() {
        const userName = document.getElementById("nameInput");
        const userEmail = document.getElementById("emailInput");
        const userPhone = document.getElementById("phoneInput");
        const userAge = document.getElementById("ageInput");
        const userPassword = document.getElementById("passInput");
        const userRePassword = document.getElementById("repassInput");

        if (nameTouched) {
            if (userNameValid()) {
                userName.classList.remove("is-invalid");
                userName.classList.add("is-valid");
                document.getElementById("alertName").classList.replace("d-block", "d-none");
            } else {
                userName.classList.add("is-invalid");
                document.getElementById("alertName").classList.replace("d-none", "d-block");
            }
        }

        if (emailTouched) {
            if (userEmailValid()) {
                userEmail.classList.remove("is-invalid");
                userEmail.classList.add("is-valid");
                document.getElementById("alertEmail").classList.replace("d-block", "d-none");
            } else {
                userEmail.classList.add("is-invalid");
                document.getElementById("alertEmail").classList.replace("d-none", "d-block");
            }
        }

        if (phoneTouched) {
            if (userPhoneValid()) {
                userPhone.classList.remove("is-invalid");
                userPhone.classList.add("is-valid");
                document.getElementById("alertPhone").classList.replace("d-block", "d-none");
            } else {
                userPhone.classList.add("is-invalid");
                document.getElementById("alertPhone").classList.replace("d-none", "d-block");
            }
        }

        if (ageTouched) {
            if (userAgeValid()) {
                userAge.classList.remove("is-invalid");
                userAge.classList.add("is-valid");
                document.getElementById("alertAge").classList.replace("d-block", "d-none");
            } else {
                userAge.classList.add("is-invalid");
                document.getElementById("alertAge").classList.replace("d-none", "d-block");
            }
        }

        if (passwordTouched) {
            if (userPasswordValid()) {
                userPassword.classList.remove("is-invalid");
                userPassword.classList.add("is-valid");
                document.getElementById("alertPass").classList.replace("d-block", "d-none");
            } else {
                userPassword.classList.add("is-invalid");
                document.getElementById("alertPass").classList.replace("d-none", "d-block");
            }
        }

        if (repasswordTouched) {
            if (userRePasswordValid()) {
                userRePassword.classList.remove("is-invalid");
                userRePassword.classList.add("is-valid");
                document.getElementById("alertRePass").classList.replace("d-block", "d-none");
            } else {
                userRePassword.classList.add("is-invalid");
                document.getElementById("alertRePass").classList.replace("d-none", "d-block");
            }
        }

        const submitBtn = document.getElementById("submitBtn");
        if (userNameValid() && userEmailValid() && userPhoneValid() && userAgeValid() && userPasswordValid() && userRePasswordValid()) {
            submitBtn.removeAttribute("disabled");
        } else {
            submitBtn.setAttribute("disabled", true);
        }
    }

    function userNameValid() {
        const userName = document.getElementById("nameInput").value;
        return /^[A-Z][a-zA-Z ]*$/.test(userName) && userName.trim() !== "";
    }

    function userEmailValid() {
        const userEmail = document.getElementById("emailInput").value;
        return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(userEmail);
    }

    function userPhoneValid() {
        const userPhone = document.getElementById("phoneInput").value;
        return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(userPhone);
    }

    function userAgeValid() {
        const userAge = document.getElementById("ageInput").value;
        return /^(0?[1-9]|[1-9][0-9]|1[0-9][0-9]|200)$/.test(userAge);
    }

    function userPasswordValid() {
        const userPassword = document.getElementById("passInput").value;
        return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(userPassword);
    }

    function userRePasswordValid() {
        const userPassword = document.getElementById("passInput").value;
        const userRePassword = document.getElementById("repassInput").value;
        return userPassword === userRePassword;
    }
}


// display meals details by id
async function getMealDetails(mealID) {
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
    respone = await respone.json();

    displayMealDetails(respone.meals[0])
    $(".loading-screen").fadeOut(300)


}


function displayMealDetails(meal) {

    searchContainer.innerHTML = "";
    wait()


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let content = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap" >
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = content;
    wait()
}