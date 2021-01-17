let currentMin = 1;
let currentMax = 6;
let currentPage = 1;
let currentCharacter = 1;
let charsPerPage = currentMax;
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
        document.querySelector(".top h2").innerText = data["name"]
    
        for(let v in charValues) {
            document.querySelector(`.${charValues[v]}`).innerText = data[`${charValues[v]}`]
        }

        getData(data["homeworld"]).then(planet => {
            document.querySelector(".bottom h2").innerText = planet["name"]
    
            for(let v in planetValues) {
                document.querySelector(`.${planetValues[v]}`).innerText = planet[`${planetValues[v]}`]
            }
        })
    })
}

// Get all characters
function getCharacters(min, max) {

    let existingItems = document.querySelectorAll(".character-list li")

    for(let i = min; i <= max; i++) {
        for (let item of existingItems) {
            item.remove();
        }

        let li = document.createElement("li")
        
        getData(`https://swapi.dev/api/people/${i}/`).then(p => {
                
                li.innerHTML = `<span class='animated-arrow'>
                <span class='the-arrow -left'>
                  <span class='shaft'></span>
                </span>
                <span class='char'>
                  <span class='text'>
                    <p>${p["name"]}</p>
                  </span>
                  <span class='the-arrow -right'>
                    <span class='shaft'></span>
                  </span>
                </span>
              </span>`

                if(li.innerText == "undefined") {
                    li.remove();
                }
        })

        // Add click event to character
        li.addEventListener("click", () => {
            for(let o of document.querySelectorAll("li")){
                o.classList.remove("chosen")
            }

            li.classList.add("chosen")

            showLoader(".top")
            showLoader(".bottom")
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
        currentPage -= 1
        currentMin -= charsPerPage
        currentMax -= charsPerPage

        getCharacters(currentMin, currentMax)
        showLoader(".character-list")
    }
})

rightArr.addEventListener("click", () => {
    if(currentPage == maxPage) {
        return;
    }
    else {
        currentPage += 1;
        currentMin += charsPerPage
        currentMax += charsPerPage

        getCharacters(currentMin, currentMax)
        showLoader(".character-list")
    }
})

function docReady(){
    if(document.readyState === "complete") {
        document.querySelectorAll(".loader").remove()
    }
}


function showLoader(item) {
    document.querySelector(`${item} .loader-wrapper`).classList.remove("hide")
    document.querySelector(`${item} .content-wrapper`).classList.add("hide")

    setTimeout(() => {
        document.querySelector(`${item} .loader-wrapper`).classList.add("hide")
        document.querySelector(`${item} .content-wrapper`).classList.remove("hide")
    }, 300)
}


// On load
getCharacters(currentMin, currentMax);

document.onreadystatechange = function() {
    let loaders = document.querySelectorAll(".loader-wrapper")
    let contents = Array.from(document.querySelectorAll(".content-wrapper"))
    
    for (let l of loaders) { l.classList.remove("hide") }
    for (let c of contents) { c.classList.add("hide") }

    if (document.readyState === "complete") { 
        setTimeout(() => {
            for (let l of loaders) { l.classList.add("hide") }
            for (let c of contents) { c.classList.remove("hide") }
        }, 1000)
    } 
};






