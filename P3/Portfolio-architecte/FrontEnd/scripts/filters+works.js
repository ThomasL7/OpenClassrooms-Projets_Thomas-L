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
            `Erreur HTTP - promise1: ${dataFilters.message}, promise2: ${dataWorks.message}`
          );
        }
      );
    }
    return Promise.all([responseFilters.json(), responseWorks.json()]);
  })

  .then(([filters, works]) => {
    addToHTML(gettingJSONFiltersToHTML(filters), "filters");
    addToHTML(gettingJSONworksToHTML(works, buildWorksHTML), "gallery");
    addToHTML(
      gettingJSONworksToHTML(works, buildModalWorksHTML),
      "modal-works-list"
    );
    filtersProcess();
    modalTrashesReady();
  })

  .catch((error) => {
    console.error("Error - request filters & works :", error);
  });

// *************** Functions: Builds & Add HTML ***************************
function addToHTML(contentHTML, classForInsertion) {
  const filters = document.querySelector(`.${classForInsertion}`);
  filters.innerHTML = "";
  filters.insertAdjacentHTML("afterbegin", contentHTML);
}

//Filters
function buildFiltersHTML(filterName, filterCat) {
  const filterHTML = `<button class="filters-button filterCat-${filterCat}">
  ${filterName}
</button>`;
  return filterHTML;
}

function gettingJSONFiltersToHTML(JSONName) {
  let allFiltersHTML =
    '<button class="filters-button filterCat-0">Tous</button>';
  for (const object of JSONName) {
    const filterHTML = buildFiltersHTML(object.name, object.id);
    allFiltersHTML += filterHTML;
  }
  return allFiltersHTML;
}

// Works
function buildWorksHTML(titleWork, srcImg, categoryId, id) {
  const workHTML = `<figure class="workCat-${categoryId} id-${id}">
      <img src="${srcImg}">
      <figcaption>${titleWork}</figcaption>
    </figure>`;
  return workHTML;
}

function gettingJSONworksToHTML(JSONName, whichBuildWorksHTML) {
  let allWorksHTML = "";
  for (const object of JSONName) {
    const workHTML = whichBuildWorksHTML(
      object.title,
      object.imageUrl,
      object.categoryId,
      object.id
    );
    allWorksHTML += workHTML;
  }
  return allWorksHTML;
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

//************* Modify Modal ****************************
const openModal = document.getElementById("open-modal");
let addWorkDisplay = false;
const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalIconPrevious = document.querySelector(".modal-icon-previous");
const modalIconClose = document.querySelector(".modal-icon-close");
const modalHeaderText = document.querySelector(".modal-header-text");
const modalWorks = document.querySelector(".modal-works-list");
const modalAddWork = document.querySelector(".modal-add-work");
const modalMainButton = document.querySelector(".modal-main-button");

// Open & Close Modal

openModal.addEventListener("click", (event) => {
  event.stopPropagation();
  modal.classList.remove("hideClass");
});
document.addEventListener("click", (event) => {
  if (!modalContent.contains(event.target)) {
    event.stopPropagation();
    modal.classList.add("hideClass");
    addWorkDisplay = false;
  }
});

// Close Icons
modalIconClose.addEventListener("click", () => {
  modal.classList.add("hideClass");
  addWorkDisplay = false;
});

// Previous Icons
function changeModalPreviousIcon() {
  if (addWorkDisplay === true) {
    modalIconPrevious.classList.remove("hideClass");
    modalIconPrevious.addEventListener("click", () => {
      changeMainButton();
    });
  } else {
    modalIconPrevious.classList.add("hideClass");
  }
}

// Adaptative Header Text
function changeModalHeaderText() {
  if (addWorkDisplay === true) {
    modalHeaderText.textContent = "Ajout photo";
  } else {
    modalHeaderText.textContent = "Galerie photo";
  }
}

// Show or Hide Wanting Content Modal
function changeModalContent() {
  if (addWorkDisplay === true) {
    modalWorks.classList.add("hideClass");
    modalAddWork.classList.remove("hideClass");
  } else {
    modalWorks.classList.remove("hideClass");
    modalAddWork.classList.add("hideClass");
  }
}

// Modal Works List
function buildModalWorksHTML(titleWork, srcImg, categoryId, id) {
  const workHTML = `<article class="modal-individual-work workCat-${categoryId} id-${id}">
  <img class="modal-img-work" src="${srcImg}" alt="${titleWork}">
  <div class="modal-trash-block">
    <img src="./assets/icons/trash.png" alt="">
  </div>
</article>`;
  return workHTML;
}
//*** See above gettingJSONworksToHTML & addToHTML functions for second part

// Trash - Delete Work Function
let idWorkForTrash;

function modalTrashesReady() {
  const trashes = document.querySelectorAll(".modal-trash-block");
  trashes.forEach((trash) => {
    trash.addEventListener("click", (event) => {
      const elementForTrash = event.target.parentNode.parentNode;
      elementForTrash.classList.forEach((classFromElementForTrash) => {
        if (classFromElementForTrash.startsWith("id-")) {
          idWorkForTrash = classFromElementForTrash.split("id-")[1];

          // Delete work, modal work & server work
          fetch(`http://localhost:5678/api/works/${idWorkForTrash}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("accessToken"),
            },
          })
            .then((response) => {
              if (!response.ok) {
                return response.json().then((data) => {
                  throw new Error(`Erreur HTTP : ${data.message}`);
                });
              }
              return;
            })

            .then(() => {
              const allWorkForTrash = document.querySelectorAll(
                `.id-${idWorkForTrash}`
              );
              allWorkForTrash.forEach((workForTrash) => {
                workForTrash.remove();
                event.stopPropagation();
              });
            })
            .catch((error) => {
              console.error("Error - request delete :", error);
            });
        }
      });
    });
  });
}

// Add Work Function
const modalButtonAddImgToNewWork = document.querySelector(
  ".modal-button-add-photo"
);
const modalNewWorkTitle = document.getElementById("title-new-work");
const modalNewWorkCat = document.getElementById("cat-new-work");
modalMainButton;

const object = {
  //'image=@abajour-tahina.png;type=image/png' \
  //   -F 'title=Abat-jour Tahina' \
  //   -F 'category=1'
};

fetch("http://localhost:5678/api/works", {
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  body: JSON.stringify(object),
})
  .then((response) => {
    if (!response.ok) {
      return response.json().then((data) => {
        throw new Error(`Erreur HTTP : ${data.message}`);
      });
    }
    return response.json();
  })

  .then((name) => {})

  .catch((error) => {
    console.error("Error - request promise :", error);
  });

// Main Adaptative Button
modalMainButton.addEventListener("click", () => {
  changeMainButton();
});
function changeMainButton() {
  if (addWorkDisplay === true) {
    addWorkDisplay = false;
    changeModalPreviousIcon();
    changeModalHeaderText();
    changeModalContent();
    modalMainButton.textContent = "Ajouter une photo";
  } else {
    addWorkDisplay = true;
    changeModalPreviousIcon();
    changeModalHeaderText();
    changeModalContent();
    modalMainButton.textContent = "Valider";
  }
}
