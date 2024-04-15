// ************* Hide or Show Sections HTML ****************************
const allSections = document.querySelectorAll("section");
const introductionID = document.getElementById("introduction");
let connected = false;

function hideSections() {
  allSections.forEach((section) => {
    section.classList.add("hideClass");
  });
  introductionID.id = "hideIntro";
}

function showSections() {
  allSections.forEach((section) => {
    section.classList.remove("hideClass");
  });
  introductionID.id = "introduction";
}

// ************* Show Login Section / Logout Process ****************************
const loginLi = document.getElementById("login-li");
const loginSection = document.getElementById("login-section");

loginSection.classList.add("hideClass");

loginLi.addEventListener("click", () => {
  if (connected === false) {
    hideSections();
    loginSection.classList.remove("hideClass");
  } else {
    sessionStorage.removeItem("accessToken");
    connected = false;
    adaptativeHomepage();
  }
});

// ************* Home Page / Function Adaptative Home Page ****************************
const modifyWorks = document.querySelector(".modify-works");
const filters = document.querySelector(".filters");
const projectsLi = document.getElementById("projects-li");

//Button ProjectsLi to Home
projectsLi.addEventListener("click", () => {
  adaptativeHomepage();
});

// Function - Adapt Homepage to Connected Version or Not
function adaptativeHomepage() {
  if (connected === true) {
    loginLi.textContent = "logout";
    modifyWorks.classList.remove("hideClass");
    filters.classList.add("hideClass");
    showSections();
    loginSection.classList.add("hideClass");
  } else {
    loginLi.textContent = "login";
    modifyWorks.classList.add("hideClass");
    filters.classList.remove("hideClass");
    showSections();
    loginSection.classList.add("hideClass");
  }
}

// ************* Login / Backend Communication ****************************
const submitLogin = document.getElementById("submit-login");
const incorrectLogin = document.querySelector(".incorrect-login");
incorrectLogin.classList.add("hideClass");

// Submit Button Event
submitLogin.addEventListener("click", (event) => {
  event.preventDefault();

  //Getting Login Input
  const fullLogin = {
    email: document.getElementById("email-login").value,
    password: document.getElementById("password-login").value,
  };

  // Request Login Token
  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fullLogin),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          incorrectLogin.classList.remove("hideClass");
          throw new Error(`Erreur HTTP : ${data.message}`);
        });
      }
      incorrectLogin.classList.add("hideClass");
      return response.json();
    })

    // Storage Token
    .then((data) => {
      sessionStorage.setItem("accessToken", data.token);
      connected = true;
      adaptativeHomepage();
    })

    .catch((error) => {
      console.error("Error - request login :", error);
    });
});

//************************** Check If Access Token **************************/
if (sessionStorage.getItem("accessToken")) {
  connected = true;
  adaptativeHomepage();
}
