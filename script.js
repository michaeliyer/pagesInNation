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

const fontSelect = document.getElementById("fontSelect");
const fontSizeInput = document.getElementById("fontSizeInput");
const textColorInput = document.getElementById("textColorInput");
const bgColorInput = document.getElementById("bgColorInput");

const pageContainer = document.getElementById("pageContainer");

// Import/Export functionality
const exportCurrentPageBtn = document.getElementById("exportCurrentPageBtn");
const exportAllPagesBtn = document.getElementById("exportAllPagesBtn");
const importPageBtn = document.getElementById("importPageBtn");
const importAllPagesBtn = document.getElementById("importAllPagesBtn");
const importFileInput = document.getElementById("importFileInput");

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  populateFontDropdown();
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

  // Handle paste events
  contentEditableDiv.addEventListener("paste", (e) => {
    e.preventDefault();

    // Get the pasted content
    const pastedContent = e.clipboardData.getData("text/plain");

    // Get the current selection
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    // Delete the selected content if any
    range.deleteContents();

    // Check if the pasted content is a URL
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = pastedContent.split(urlRegex);

    // Process each part
    parts.forEach((part) => {
      if (urlRegex.test(part)) {
        // It's a URL, create a link
        const link = document.createElement("a");
        link.href = part;
        link.textContent = part;
        link.target = "_blank"; // Open in new tab
        link.style.color = "#0066cc";
        link.style.textDecoration = "underline";
        link.style.cursor = "pointer";
        range.insertNode(link);
      } else {
        // It's regular text
        const textNode = document.createTextNode(part);
        range.insertNode(textNode);
      }
    });

    // Update the selection to be after the pasted content
    range.setStartAfter(range.endContainer);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    // Save the changes
    page.textContent = contentEditableDiv.innerHTML;
    saveAllPages(pages);
  });

  // Handle link clicks
  contentEditableDiv.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      e.preventDefault();
      window.open(e.target.href, "_blank");
    }
  });

  // Update on typing or content change
  contentEditableDiv.addEventListener("input", () => {
    page.textContent = contentEditableDiv.innerHTML;
    saveAllPages(pages);
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

// Export current page
exportCurrentPageBtn.addEventListener("click", () => {
  if (!pages.length) return;

  const defaultName = `pageInNation_export_page${currentPageIndex + 1}_${
    new Date().toISOString().split("T")[0]
  }`;
  const customName = prompt(
    "Enter a name for the exported file (without extension):",
    defaultName
  );

  if (customName === null) return; // User cancelled

  const pageData = {
    page: pages[currentPageIndex],
    pageIndex: currentPageIndex,
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(pageData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${customName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Export all pages
exportAllPagesBtn.addEventListener("click", () => {
  const defaultName = `pagesInNation_export_all_${
    new Date().toISOString().split("T")[0]
  }`;
  const customName = prompt(
    "Enter a name for the exported file (without extension):",
    defaultName
  );

  if (customName === null) return; // User cancelled

  const pagesData = {
    pages: pages,
    currentPageIndex: currentPageIndex,
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(pagesData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${customName}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// Import single page
importPageBtn.addEventListener("click", () => {
  importFileInput.click();
  importFileInput.dataset.importType = "single";
});

// Import all pages
importAllPagesBtn.addEventListener("click", () => {
  importFileInput.click();
  importFileInput.dataset.importType = "all";
});

importFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      const importType = event.target.dataset.importType;

      if (importType === "all") {
        if (!importedData.pages || !Array.isArray(importedData.pages)) {
          throw new Error("Invalid file format for all pages");
        }

        if (confirm("Importing will replace all current pages. Continue?")) {
          pages = importedData.pages;
          currentPageIndex = importedData.currentPageIndex || 0;
          saveAllPages(pages);
          updatePageSelectDropdown();
          renderPage();
          alert("All pages imported successfully!");
        }
      } else {
        // Single page import
        if (!importedData.page) {
          throw new Error("Invalid file format for single page");
        }

        if (
          confirm("Import this page? It will be added after the current page.")
        ) {
          const newPageIndex = currentPageIndex + 1;
          pages.splice(newPageIndex, 0, importedData.page);
          currentPageIndex = newPageIndex;
          saveAllPages(pages);
          updatePageSelectDropdown();
          renderPage();
          alert("Page imported successfully!");
        }
      }
    } catch (error) {
      console.error("Error importing:", error);
      alert("Error importing: " + error.message);
    }
  };
  reader.readAsText(file);

  // Reset the file input
  event.target.value = "";
});
