// *************** Fetch Request: Works + Filters ************************
const fetchFilters = fetch("http://localhost:5678/api/categories");
const fetchWorks = fetch("http://localhost:5678/api/works");

Promise.all([fetchFilters, fetchWorks])
  .then((responses) => {
    const [responseFilters, responseWorks] = responses;
    if (!responseFilters.ok || !responseWorks.ok) {
      return Promise.all([responseFilters.json(), responseWorks.json()]).then(
        ([dataFilters, dataWorks]) => {
          throw new Error(
            "Erreur HTTP - Filters: " +
              dataFilters.message +
              ", Works: " +
              dataWorks.message
          );
        }
      );
    }
    return Promise.all([responseFilters.json(), responseWorks.json()]);
  })

  .then(([filters, works]) => {
    addFiltersToHTML(gettingJSONFilters(filters));
    addWorksToHTML(gettingJSONworks(works));

    filtersProcess();
  })

  .catch((error) => {
    console.error("Error - request filters & works :", error);
  });

// (async function requestWorks() {
//     try {
//      const response = await fetch("http://localhost:5678/api/works");
//     const works = await response.json();
// }
//     catch (error) {
//     console.error("Error requestWorks:", error);
//     }
//   })();

// *************** Functions: Builds & Add HTML ***************************
//Filters
function gettingJSONFilters(JSONName) {
  let allFiltersHTML =
    '<button class="filters-button filterCat-0">Tous</button>';
  for (const object of JSONName) {
    const filterHTML = buildFiltersHTML(object.name, object.id);
    allFiltersHTML += filterHTML;
  }
  return allFiltersHTML;
}

function buildFiltersHTML(filterName, filterCat) {
  const filterHTML =
    '<button class="filters-button filterCat-' +
    filterCat +
    '">' +
    filterName +
    "</button>";
  return filterHTML;
}
function addFiltersToHTML(contentHTML) {
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";
  filters.insertAdjacentHTML("afterbegin", contentHTML);
}

// Works
function gettingJSONworks(JSONName) {
  let allWorksHTML = "";
  for (const object of JSONName) {
    const workHTML = buildWorksHTML(
      object.title,
      object.imageUrl,
      object.categoryId
    );
    allWorksHTML += workHTML;
  }
  return allWorksHTML;
}

function buildWorksHTML(titleWorks, srcImg, categoryId) {
  const workHTML =
    '<figure class="workCat-' +
    categoryId +
    '">' +
    '<img src="' +
    srcImg +
    '">' +
    "<figcaption>" +
    titleWorks +
    "</figcaption>" +
    "</figure>";
  return workHTML;
}

function addWorksToHTML(contentHTML) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  gallery.insertAdjacentHTML("afterbegin", contentHTML);
}

// *************** Functions: Filters ***************************
function filtersProcess() {
  const filtersButtons = document.querySelectorAll(".filters-button");

  // Build - List of Works Category
  const totalNumberFilters = filtersButtons.length;
  const arrayOfEachWorksCat = [];
  for (let index = 0; index < totalNumberFilters; index++) {
    const eachWorksCat = document.querySelectorAll(`.workCat-${index}`);
    if (eachWorksCat.length === 0) {
      arrayOfEachWorksCat.push([]);
    } else {
      arrayOfEachWorksCat.push(eachWorksCat);
    }
  }

  // Filter EventListener + Active Filter Button Class
  filtersButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filtersButtons.forEach((fltBtn) => {
        fltBtn.classList.remove("activeButtonFilter");
      });
      button.classList.add("activeButtonFilter");

      // Get Category Number of Activated Filter
      let activeNumberCat = 0;
      const activeFilterClasses = button.className.split(" ");
      activeFilterClasses.forEach((eachClass) => {
        if (eachClass.startsWith("filterCat-")) {
          activeNumberCat = parseInt(eachClass.split("filterCat-")[1]);
        }
      });

      // Display Filtered Works Corresponding to Cat.
      arrayOfEachWorksCat.forEach((worksOfACat) => {
        worksOfACat.forEach((work) => {
          work.classList.add("hideClass");
        });
      });

      if (activeNumberCat === 0) {
        arrayOfEachWorksCat.forEach((worksOfACat) => {
          worksOfACat.forEach((work) => {
            work.classList.remove("hideClass");
          });
        });
      } else {
        arrayOfEachWorksCat[activeNumberCat].forEach((work) => {
          work.classList.remove("hideClass");
        });
      }
    });
  });
}
