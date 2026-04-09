const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".menu");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("active");
});

const API_URL = "https://raw.githubusercontent.com/ironhack-jc/mid-term-api/main/projects";

async function loadProjects() {
  const res = await fetch(API_URL);
  const projects = await res.json();

  const projectSection = document.getElementById("projects");

  if (projectSection) {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid") || "1";
    const project = projects.find((p) => p.uuid === uuid);

    if (project) {
      projectSection.querySelector(".project-title").textContent = project.name;
      projectSection.querySelector(".UI").textContent = project.description;
      projectSection.querySelector(".project-image").src = project.image;
      projectSection.querySelector(".project-image").alt = project.name;

      const articleP = projectSection.querySelectorAll(".article-project p");
      const parts = project.content.split("<br><br>");
      if (articleP[0]) articleP[0].textContent = parts[0] || project.content;
      if (articleP[1]) articleP[1].textContent = parts[1] || "";

      const dateSpan = projectSection.querySelector(".date span");
      if (dateSpan) dateSpan.textContent = project.completed_on;
    }

    const otherProjects = projects.filter((p) => p.uuid !== uuid);
    const grid = document.querySelector("#RecentProjects .projects-grid");
    if (grid) {
      grid.innerHTML = otherProjects.map((p) => `
        <article class="project-card">
          <a class="project-wrapper" href="1.html?uuid=${p.uuid}">
            <img src="${p.image}" alt="${p.name}" />
            <div>
              <h4>${p.name}</h4>
              <p>${p.description}</p>
              <span>Learn more</span>
            </div>
          </a>
        </article>
      `).join("");
    }
  } else {
    const homeGrid = document.querySelector(".recent-projects .projects-grid");
    if (homeGrid) {
      homeGrid.innerHTML = projects.slice(0, 3).map((p) => `
        <article class="project-card">
          <a class="project-wrapper" href="projects/1.html?uuid=${p.uuid}">
            <img src="${p.image}" alt="${p.name}" />
            <div>
              <h4>${p.name}</h4>
              <p>${p.description}</p>
              <span>Learn more</span>
            </div>
          </a>
        </article>
      `).join("");
    }
  }
}

loadProjects();

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  function showError(input, msg) {
    input.classList.add("error");
    input.classList.remove("success");
    let err = input.parentElement.querySelector(".error-msg");
    if (!err) {
      err = document.createElement("span");
      err.classList.add("error-msg");
      input.parentElement.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(input) {
    input.classList.add("success");
    input.classList.remove("error");
    const err = input.parentElement.querySelector(".error-msg");
    if (err) err.textContent = "";
  }

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const messageInput = document.getElementById("message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const message = messageInput.value.trim();

    if (name.toLowerCase() === "ironhack") {
      alert("Ironhack is the best!");
      return;
    }

    if (!name) { showError(nameInput, "Name is required."); valid = false; } else clearError(nameInput);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) { showError(emailInput, "Enter a valid email."); valid = false; } else clearError(emailInput);

    if (!phone) { showError(phoneInput, "Phone is required."); valid = false; } else clearError(phoneInput);

    if (!message) { showError(messageInput, "Message is required."); valid = false; } else clearError(messageInput);

    if (valid) {
      alert("Message sent successfully!");
      contactForm.reset();
      [nameInput, emailInput, phoneInput, messageInput].forEach(i => {
        i.classList.remove("error", "success");
      });
    }
  });
}

document.querySelectorAll(".contact-bar form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isInProjects = window.location.pathname.includes("/projects/");
    window.location.href = isInProjects ? "../contact.html" : "contact.html";
  });
});