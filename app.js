const countriesStorage = () => {
    let countries = [];
    return {
        setCountriesBackup : newCountries => countries = newCountries,
        getCountriesBackup : () => countries
    }
};

const storage = countriesStorage();

let createTable = document.createElement("table")
createTable.innerHTML = `<thead class="text-center">
<tr>
    <th data-sort="name" class="w-25">Country name</th>
    <th data-sort="area">Country area</th>
    <th data-sort="region">Country region</th>
    <th data-sort="population">Country population</th>
</tr>
</thead>
<tbody></tbody>`
createTable.className = "table table-bordered table-striped";
document.querySelector(".content").append(createTable);


const createDiv = document.createElement("div");
createDiv.className = "my-btns";
const inputWithButtons =`<div class="input-group mb-3">
    <div class="input-group-prepend" id="button-addon3">
        <button class="btn btn-success search-btn" type="button">Search</button>
        <button class="btn btn-danger clear-btn" type="button">Clear</button>
    </div>
        <input type="text" class="form-control search" placeholder="Search country" aria-label="Example text with two button addons" aria-describedby="button-addon3">
</div>`
createDiv.innerHTML = inputWithButtons;
document.querySelector(".content h3").after(createDiv);


function renderCountries(storage) {
    htmlStr = storage.reduce((acc, country) => {
        return acc + `<tr class="text-center">
            <td>${country.name}</td>
            <td>${country.area}</td>
            <td>${country.region}</td>
            <td>${country.population}</td>
        </tr>` 
    }, '');
    document.querySelector("tbody").innerHTML = htmlStr;
    
}

function getCountries() {
    fetch('https://restcountries.com/v2/all')
    .then(res => res.json())
    .then(data => {
        const filteredData = data.map((el) => {
            return {
                name: el.name,
                population: el.population,
                area : el.area,
                region: el.region
            }
        });
        storage.setCountriesBackup(filteredData);
        renderCountries(filteredData);
        
        document.querySelector("table thead").onclick = e => {
        const numberFieldList = ["population"]
        let field = e.target.getAttribute("data-sort")
        const countriesBackup = storage.getCountriesBackup()
        countriesBackup.sort((countryA, countryB) => {
            if(numberFieldList.includes(field)) {
                return countryB[field] - countryA[field];
            }
            return countryA[field] > countryB[field] ? 1 : -1
        });
        renderCountries(countriesBackup);
        document.querySelector(`table thead [data-sort="${field}"]`).classList.add("bg-success")
        }
    });
}

function getCountryByName(countryName) {
    fetch(`https://restcountries.com/v2/name/${countryName}`).
    then(res => res.json()).
    then(data => {
        const filteredData = data.map((el) => {
            return {
                name: el.name,
                population: el.population,
                area : el.area,
                region: el.region
            }
        });
        storage.setCountriesBackup(filteredData);
        renderCountries(filteredData);
    })
        .catch((err) => {
            //console.warn(err)
            renderError();
        });
};

function renderError() {
    let htmlStr = "";
    htmlStr =
        `<tr>
            <td colspan="4" class="text-center">No such country found</td> 
        </tr>`;
    document.querySelector("tbody").innerHTML = htmlStr;
    return
}

document.querySelector(".search").addEventListener("change", inputSearch());
document.querySelector(".search-btn").addEventListener("click", searchTrigger());       
document.querySelector(".clear-btn").addEventListener("click", clearInput());

function inputSearch() {
    const inpField = document.querySelector(".search");
    inpField.onkeyup = e => {
        const searchVal = e.currentTarget.value.trim().toLowerCase();
        searchTrigger(searchVal);
    }
}

function searchTrigger(searchVal) {
    const btnSearch = document.querySelector(".search-btn");
    btnSearch.onclick = () => {
        getCountryByName(searchVal);
    }
}

function clearInput() {
    const btnClear = document.querySelector(".clear-btn")
    btnClear.onclick = () => {
        const inpField = document.querySelector(".search")
        inpField.value = ""
        getCountries();
    }
}
getCountries();
