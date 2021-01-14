let currentMin = 1;
let currentMax = 6;
let currentPage = 1;
let currentCharacter = 1;
let charsPerPage = 6
let maxPage = 0;
let charValues = ["height", "mass", "hair_color", "skin_color", "birth_year", "gender"]
let planetValues = ["rotation_period", "orbital_period", "diameter", "climate", "gravity", "terrain"]
    
async function getData(url) {
    const response = await fetch(url, {
        method: 'GET',
    });
    return response.json();
}

// Fill character details
function fillDetails(url) {
    getData(url).then(data => {
        console.log(data)

        document.querySelector(".top > h2").innerText = data["name"]
    
        for(let v in charValues) {
            document.querySelector(`.${charValues[v]}`).innerText = data[`${charValues[v]}`]
        }

        getData(data["homeworld"]).then(planet => {
            document.querySelector(".bottom > h2").innerText = planet["name"]
    
            for(let v in planetValues) {
                document.querySelector(`.${planetValues[v]}`).innerText = planet[`${planetValues[v]}`]
            }
        })
    })
}

// Get number of characters
let charCount;
fetch("https://swapi.dev/api/people/")
   .then(p => p.json())
   .then(d => charCount = d["count"])
   .then(() => console.log(charCount))


// Get all characters
function getCharacters(min, max) {

    let existingItems = document.querySelectorAll(".character-list li")

    for(let i = min; i <= max; i++) {
        for (let item of existingItems) {
            item.remove();
        }

        let li = document.createElement("li")
        
        getData(`https://swapi.dev/api/people/${i}/`).then(p => {
                
                li.innerText = p["name"]

                if(li.innerText == "undefined") {
                    li.remove();
                }
        })

        // Add lick event to character
        li.addEventListener("click", () => {
            fillDetails(`https://swapi.dev/api/people/${i}/`)
        })


        const ul = document.querySelector(".character-list ul")
        ul.append(li)
    }

    getData("https://swapi.dev/api/people/").then(c => {
        maxPage = Math.round(c["count"] / charsPerPage)

        updatePagination(currentPage, maxPage)
    })
}

function updatePagination(currentPage, maxPage) {
    document.querySelector(".side-num").innerText = `${currentPage} / ${maxPage}`
}


let leftArr = document.querySelector(".nav-left")
let rightArr = document.querySelector(".nav-right")

leftArr.addEventListener("click", () => {
    if (currentPage == 1) {
        return;
    }
    else {
        currentMin -= 6
        currentMax -= 6
        currentPage -= 1
        getCharacters(currentMin, currentMax)
    }
})

rightArr.addEventListener("click", () => {
    if(currentPage == maxPage) {
        return;
    }
    else {
        currentMin += 6
        currentMax += 6
        currentPage += 1;
    
        getCharacters(currentMin, currentMax)
    }
})

getCharacters(currentMin, currentMax);








