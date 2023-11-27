document.getElementById("add-instruction").addEventListener("click", addInstruction)
document.getElementById("add-ingredient").addEventListener("click", addIngredient)
document.getElementById("submit").addEventListener("click", submitRecipe)
document.getElementById("search").addEventListener("keyup", searchInput)

let recipe = {
    name: "",
    instructions: [],
    ingredients: [],
    categories: [],
    images: []
}

let categoryIds = []

updateCategories()
getRecipe("burnt cookies")

async function updateCategories() {
    const list = document.getElementById("categories")
    categoryIds = []

    res = await fetch("/categories")
    data = await res.json()

    for (i in data) {
        const item = document.createElement("li")
        const label = document.createElement("label")
        const box = document.createElement("input")
        const span = document.createElement("span")

        box.type = "checkbox"
        box.id = "checkbox" + i
        span.textContent = data[i].name
        categoryIds.push(data[i]._id)

        label.appendChild(box)
        label.appendChild(span)
        item.appendChild(label)
        list.appendChild(item)
    }
}

function searchInput() {
    searchElement = document.getElementById("search")
    if (event.key == "Enter") {
        getRecipe(searchElement.value)
        searchElement.value = ""
    }
}

function submitRecipe() {
    const imgInput = document.getElementById("image-input")
    let imgData = new FormData();
    
    for (img of imgInput.files) {
        imgData.append("images", img)
    }

    fetch("/images", {
        method: "POST",
        body: imgData
    })
    .then(res => res.json())
    .then(data => {
        recipe.images = data.images
    })

    recipe.name = document.getElementById("name-text").value
    const boxes = document.querySelectorAll('input[type="checkbox"]');
    for (i in boxes) {
        if (boxes[i].checked == true) {
            recipe.categories.push(categoryIds[i])
            boxes[i].checked = false
        }
    }
    console.log(recipe)
    fetch("/recipe/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe)
    })
    
    recipe.name = ""
    recipe.instructions = []
    recipe.ingredients = []
    recipe.categories = []
    document.getElementById("name-text").value = ""
}

function addInstruction() {
    const insText = document.getElementById("instructions-text")
    recipe.instructions.push(insText.value)
    insText.value = ""
}

function addIngredient() {
    const ingText = document.getElementById("ingredients-text")
    recipe.ingredients.push(ingText.value)
    ingText.value = ""
}

function getRecipe(recipe) {
    const nameElem = document.getElementById("recipeName")
    const insList = document.getElementById("instructionList")
    const ingList = document.getElementById("ingredientList")

    fetch("/recipe/" + recipe)
    .then(response => response.json())
    .then(data => {
        if (data.length == 0) {
            console.log("no recipe found")
            return
        }

        data = data[0]

        insList.innerHTML = ""
        ingList.innerHTML = ""

        nameElem.textContent = data.name

        for (ins of data.instructions) {
            let item = document.createElement("li")
            item.textContent = ins
            insList.append(item)
        }

        for (ing of data.ingredients) {
            let item = document.createElement("li")
            item.textContent = ing
            ingList.append(item)
        }
    })
}

