document.addEventListener("DOMContentLoaded", () => {
  let currentIndex = 0;
  let images = [];

  function addImage() {
    let url = document.getElementById("imgUrl").value.trim();
    if (!url) {
      alert("Enter an image URL!");
      return;
    }
    createGalleryItem(url);
    document.getElementById("imgUrl").value = "";
  }

  function uploadImage() {
    let file = document.getElementById("imgUpload").files[0];
    if (!file) {
      alert("Select an image!");
      return;
    }
    let reader = new FileReader();
    reader.onload = e => createGalleryItem(e.target.result);
    reader.readAsDataURL(file);
    document.getElementById("imgUpload").value = "";
  }

  function createGalleryItem(src) {
    let div = document.createElement("div");
    div.className = "gallery-item";

    let img = document.createElement("img");
    img.src = src;
    img.onclick = () => openModal(src);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.className = "deleteBtn";
    deleteBtn.onclick = () => {
      div.remove();
      images = images.filter(i => i !== src);
    };

    div.appendChild(img);
    div.appendChild(deleteBtn);
    document.getElementById("gallery").appendChild(div);

    images.push(src);
  }

  /* Modal */
  function openModal(src) {
    let modal = document.getElementById("imgModal");
    let modalImg = document.getElementById("modalImg");
    modal.style.display = "block";
    modalImg.src = src;
    currentIndex = images.indexOf(src);
  }

  document.querySelector(".close").onclick = () =>
    document.getElementById("imgModal").style.display = "none";

  document.querySelector(".prev").onclick = () => navigate(-1);
  document.querySelector(".next").onclick = () => navigate(1);

  function navigate(dir) {
    currentIndex = (currentIndex + dir + images.length) % images.length;
    document.getElementById("modalImg").src = images[currentIndex];
  }

  /* Dark Mode */
  document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
    let btn = document.getElementById("themeToggle");
    btn.textContent = document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";
  };

  /* Search Filter */
  document.getElementById("searchBar").addEventListener("input", function() {
    let query = this.value.toLowerCase();
    document.querySelectorAll(".gallery-item").forEach(item => {
      let src = item.querySelector("img").src.toLowerCase();
      item.style.display = src.includes(query) ? "block" : "none";
    });
  });

  /* Drag & Drop */
  let dropZone = document.getElementById("dropZone");
  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.classList.remove("dragover");
    let files = e.dataTransfer.files;
    for (let file of files) {
      if (file.type.startsWith("image/")) {
        let reader = new FileReader();
        reader.onload = ev => createGalleryItem(ev.target.result);
        reader.readAsDataURL(file);
      }
    }
  });
});