// Core Variables
let pages = [];
let currentPageIndex = 0;

// DOM Elements
const addPageBtn = document.getElementById("addPageBtn");
const deletePageBtn = document.getElementById("deletePageBtn");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageSelectDropdown = document.getElementById("pageSelectDropdown");
const pageNumberInput = document.getElementById("pageNumberInput");
const goToPageBtn = document.getElementById("goToPageBtn");
const toggleToolbarBtn = document.getElementById("toggleToolbarBtn");
const fancyToolbar = document.getElementById("fancyToolbar");
const stylingControls = document.getElementById("stylingControls");
// const controls = document.getElementById("controls");
const fontSelect = document.getElementById("fontSelect");
const fontSizeInput = document.getElementById("fontSizeInput");
const textColorInput = document.getElementById("textColorInput");
const bgColorInput = document.getElementById("bgColorInput");

const pageContainer = document.getElementById("pageContainer");

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  populateFontDropdown();
  // Hide toolbars by default
  fancyToolbar.classList.add("hidden");
  stylingControls.classList.add("hidden");
  // Important: Don't create a blank page here!
  // Database will load saved pages or create a blank if needed
});

// Functions
function createNewPage() {
  const page = {
    textContent: "",
    styles: {
      fontFamily: "Arial",
      fontSize: "16px",
      textColor: "#000000",
      backgroundColor: "#ffffff",
    },
  };
  pages.push(page);
  currentPageIndex = pages.length - 1;
  renderPage();
  updatePageSelectDropdown();
  saveAllPages(pages);
}

function renderPage() {
  if (!pages.length) return;

  const page = pages[currentPageIndex];

  pageContainer.innerHTML = "";

  const contentEditableDiv = document.createElement("div");
  contentEditableDiv.className = "page-content";
  contentEditableDiv.contentEditable = true;

  // Preserve HTML content with styles
  if (page.textContent) {
    contentEditableDiv.innerHTML = page.textContent;
  } else {
    contentEditableDiv.innerHTML = "";
  }

  // Apply base styles
  contentEditableDiv.style.fontFamily = page.styles.fontFamily;
  contentEditableDiv.style.fontSize = page.styles.fontSize;
  contentEditableDiv.style.color = page.styles.textColor;
  contentEditableDiv.style.lineHeight = "1.6";
  pageContainer.style.backgroundColor = page.styles.backgroundColor;

  // Update on typing or content change
  contentEditableDiv.addEventListener("input", () => {
    page.textContent = contentEditableDiv.innerHTML;
    saveAllPages(pages);
  });

  // Handle paste events to preserve styles
  contentEditableDiv.addEventListener("paste", (e) => {
    e.preventDefault();
    const text =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const div = document.createElement("div");
      div.innerHTML = text;
      range.insertNode(div.firstChild || document.createTextNode(text));
      page.textContent = contentEditableDiv.innerHTML;
      saveAllPages(pages);
    }
  });

  pageContainer.appendChild(contentEditableDiv);

  // Update styling controls to match current page
  fontSelect.value = page.styles.fontFamily;
  fontSizeInput.value = parseInt(page.styles.fontSize);
  textColorInput.value = page.styles.textColor;
  bgColorInput.value = page.styles.backgroundColor;
}

function updatePageSelectDropdown() {
  pageSelectDropdown.innerHTML = "";
  pages.forEach((_, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `Page ${index + 1}`;
    pageSelectDropdown.appendChild(option);
  });
  pageSelectDropdown.value = currentPageIndex;
}

// Event Listeners
addPageBtn.addEventListener("click", () => {
  createNewPage();
});

deletePageBtn.addEventListener("click", () => {
  if (pages.length > 1) {
    if (
      confirm(
        "Are you sure you want to delete this page? This action cannot be undone."
      )
    ) {
      pages.splice(currentPageIndex, 1);
      if (currentPageIndex >= pages.length) {
        currentPageIndex = pages.length - 1;
      }
      renderPage();
      updatePageSelectDropdown();
      saveAllPages(pages);
    }
  } else {
    alert("Cannot delete the last page");
  }
});

prevPageBtn.addEventListener("click", () => {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderPage();
    pageSelectDropdown.value = currentPageIndex;
  }
});

nextPageBtn.addEventListener("click", () => {
  if (currentPageIndex < pages.length - 1) {
    currentPageIndex++;
    renderPage();
    pageSelectDropdown.value = currentPageIndex;
  }
});

pageSelectDropdown.addEventListener("change", () => {
  currentPageIndex = parseInt(pageSelectDropdown.value);
  renderPage();
});

goToPageBtn.addEventListener("click", () => {
  const targetPage = parseInt(pageNumberInput.value) - 1;
  if (!isNaN(targetPage) && targetPage >= 0 && targetPage < pages.length) {
    currentPageIndex = targetPage;
    renderPage();
    pageSelectDropdown.value = currentPageIndex;
  }
});

// Toggle Toolbar
toggleToolbarBtn.addEventListener("click", () => {
  const isHidden = fancyToolbar.classList.contains("hidden");
  fancyToolbar.classList.toggle("hidden");
  stylingControls.classList.toggle("hidden");
  toggleToolbarBtn.textContent = isHidden ? "🔧 Hide Tools" : "🔧 Show Tools";
});

// toggleToolbarBtn.addEventListener("click", () => {
//   const isHidden = controls.classList.contains("hidden");
//   controls.classList.toggle("hidden");
//   stylingControls.classList.toggle("hidden");
//   toggleToolbarBtn.textContent = isHidden ? "🔧 Hide Tools" : "🔧 Show Tools";
// });

// Styling controls
fontSelect.addEventListener("change", () => {
  pages[currentPageIndex].styles.fontFamily = fontSelect.value;
  renderPage();
  saveAllPages(pages);
});

fontSizeInput.addEventListener("input", () => {
  pages[currentPageIndex].styles.fontSize = `${fontSizeInput.value}px`;
  renderPage();
  saveAllPages(pages);
});

textColorInput.addEventListener("input", () => {
  pages[currentPageIndex].styles.textColor = textColorInput.value;
  renderPage();
  saveAllPages(pages);
});

bgColorInput.addEventListener("input", () => {
  pages[currentPageIndex].styles.backgroundColor = bgColorInput.value;
  renderPage();
  saveAllPages(pages);
});

// Populate Font Dropdown
function populateFontDropdown() {
  fonts.forEach((font) => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    option.style.fontFamily = font;
    fontSelect.appendChild(option);
  });
}
