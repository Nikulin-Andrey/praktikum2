function loadJSON(path) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onload = function () {
            resolve(JSON.parse(this.responseText));
        }
        xhr.onerror = (err) => reject(err);
        xhr.send(null);
    });
}

function renderRecipes(recipes, allIngredients) {
    const container = document.getElementById('recipes_container');
    recipes.forEach(function (recipe, index) {
        container.insertAdjacentHTML('beforeend', `
        <div class="recipe">
            <h3>${recipe.name}</h3>
            <img src="${recipe.img}">
            <div id="ingredients_container">
                <h4>Ингредиенты:</h4>
                <ul></ul>
            </div>
            <p>${recipe.description}</p>
        </div>
        `);
        const ingredientsContainer = container.children[index].lastElementChild.previousElementSibling.lastElementChild;
        recipe.ingredients.forEach(recipeIngredient => {
            const rightIngredient = allIngredients.find(ingredient => ingredient.id === recipeIngredient.id);
            ingredientsContainer.insertAdjacentHTML('beforeend', `
                <li>${rightIngredient.name}: ${recipeIngredient.mass}гр</li>
            `);
        });
    });
}

function renderDropDownIngredientList(ingredients) {
    const list = document.getElementById('ingredient_selection');
    ingredients.forEach(ingredient => {
        list.insertAdjacentHTML('beforeend', `
        <option value="${ingredient.name}">
        `);
    });
}

function deleteIngredient(mass, ingredient) {
    mass.value = "";
    ingredient.value = "";
}

function renderSuitableRecipes(selectedIngredients, allIngredients, recipes) {
    const ingredients = allIngredients.filter(ingredient => selectedIngredients.find(selectedIngredient => selectedIngredient.name === ingredient.name));
    console.log(ingredients);
}

function chooseIngredient(ingredients, recipes) {
    renderDropDownIngredientList(ingredients);
    const selectIngredient = document.getElementById('selected_ingredient');
    const selectMass = document.getElementById('mass');
    const buttonAdd = document.getElementById('add');
    const selected = [];
    const buttonFind = document.getElementById('find');
    buttonFind.addEventListener('click', function () {
        renderSuitableRecipes(selected, ingredients, recipes);
    })
    const container = document.getElementById('selected_ingredients');
    buttonAdd.addEventListener('click', function () {
        const ingredient = selectIngredient.value;
        const mass = Number(selectMass.value);
        if (selected.find(selectedItem => selectedItem.name === ingredient)) {
            alert(`ингредиент ${ingredient} уже был выбран`);
            deleteIngredient(selectMass, selectIngredient);
            return;
        }
        selected.push({
            name: ingredient,
            mass: mass
        });
        const length = selected.length;
        console.log(selected)
        container.insertAdjacentHTML('beforeend', `
            <p>${ingredient} ${mass} грамм <button data-delete="${length - 1}">Удалить</button></p>
        `);
        deleteIngredient(selectMass, selectIngredient);
    });
    container.addEventListener('click', function (e) {
        if (e.target.hasAttribute('data-delete')) {
            const index = Number(e.target.getAttribute('data-delete'));
            selected.splice(index, index);
            console.log(selected, index);
            e.target.parentElement.innerHTML = '';
            if (selected.length === 1) {
                selected.pop();
            }
        }
    });
}

function renderDayRecipes(recipe) {
    const container = document.getElementById('day_recipe');
    container.insertAdjacentHTML('beforeend', `
    <h4>${recipe.meals[0].strMeal}</h4>
    <p>${recipe.meals[0].strInstructions}</p>
    <ul>
        <h5>Ингредиенты:</h5>
    </ul>
    `);
    const maxIngredients = 20;
    const ingredientsContainer = container.lastElementChild;
    for(let i = 1; i <= maxIngredients; i++) {
        if(recipe.meals[0]['strIngredient' + i] != ""){
            ingredientsContainer.insertAdjacentHTML('beforeend', `
            <li>${recipe.meals[0]['strIngredient' + i]} ${recipe.meals[0]['strMeasure' + i]} </li>
            `);
        }
    }
}

async function initApp() {
    const recipes = await loadJSON('../recipes.json');
    const allIngredients = await loadJSON('../ingredients.json');
    const dayrecipe = await loadJSON('https://www.themealdb.com/api/json/v1/1/random.php')
    renderRecipes(recipes, allIngredients);
    chooseIngredient(allIngredients, recipes);
    renderDayRecipes(dayrecipe);
}

initApp();