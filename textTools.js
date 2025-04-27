// // ====== Fancy Toolbar Text Tools (Corrected, Hybrid Method) ====== //

// // Toolbar Elements
// const selectionFontSelect = document.getElementById("selectionFontSelect");
// const selectionFontSize = document.getElementById("selectionFontSize");
// const selectionTextColor = document.getElementById("selectionTextColor");
// const selectionBgColor = document.getElementById("selectionBgColor");
// const boldSelectionBtn = document.getElementById("boldSelectionBtn");
// const italicSelectionBtn = document.getElementById("italicSelectionBtn");
// const resetSelectionBtn = document.getElementById("resetSelectionBtn");

// // Populate Font Select Dropdown
// fonts.forEach((font) => {
//   const option = document.createElement("option");
//   option.value = font;
//   option.textContent = font;
//   option.style.fontFamily = font;
//   selectionFontSelect.appendChild(option);
// });

// // ====== Helper Functions ====== //

// // Save the updated page content
// function saveContent() {
//   const pageContent = document.querySelector(".page-content");
//   if (pageContent) {
//     pages[currentPageIndex].textContent = pageContent.innerHTML;
//     saveAllPages(pages);
//   }
// }

// // Apply manual style to selected text (for font size, font family)
// function applyManualStyle(styleCallback) {
//   const selection = window.getSelection();
//   if (!selection.rangeCount) return;

//   const range = selection.getRangeAt(0);
//   const span = document.createElement("span");
//   span.style.display = "inline";

//   styleCallback(span);

//   try {
//     const contents = range.extractContents();
//     span.appendChild(contents);
//     range.deleteContents();
//     range.insertNode(span);

//     // Reselect after styling to keep flow smooth
//     const newRange = document.createRange();
//     newRange.setStartAfter(span);
//     newRange.collapse(true);

//     selection.removeAllRanges();
//     selection.addRange(newRange);
//   } catch (error) {
//     console.error("Error applying manual style:", error);
//   }
// }

// // ====== Toolbar Actions ====== //

// // Bold
// boldSelectionBtn.addEventListener("click", () => {
//   document.execCommand("bold", false, null);
//   saveContent();
// });

// // Italic
// italicSelectionBtn.addEventListener("click", () => {
//   document.execCommand("italic", false, null);
//   saveContent();
// });

// // Font Family
// selectionFontSelect.addEventListener("change", () => {
//   const selectedFont = selectionFontSelect.value;
//   if (selectedFont) {
//     applyManualStyle((span) => {
//       span.style.fontFamily = selectedFont;
//     });
//     saveContent();
//   }
// });

// // Font Size (real px size)
// selectionFontSize.addEventListener("change", () => {
//   const size = selectionFontSize.value;
//   if (size) {
//     const selection = window.getSelection();
//     if (selection.rangeCount > 0) {
//       const span = `<span style="font-size:${size}px;">${selection.toString()}</span>`;
//       document.execCommand("insertHTML", false, span);
//       saveContent();
//     }
//   }
// });

// // Text Color
// selectionTextColor.addEventListener("input", () => {
//   const color = selectionTextColor.value;
//   document.execCommand("foreColor", false, color);
//   saveContent();
// });

// // Background Color
// selectionBgColor.addEventListener("input", () => {
//   const bgColor = selectionBgColor.value;
//   document.execCommand("hiliteColor", false, bgColor);
//   saveContent();
// });

// // Reset Formatting
// resetSelectionBtn.addEventListener("click", () => {
//   document.execCommand("removeFormat", false, null);
//   saveContent();
// });

// ====== Fancy Toolbar Text Tools ====== //

// Toolbar Elements
const selectionFontSelect = document.getElementById("selectionFontSelect");
const selectionFontSize = document.getElementById("selectionFontSize");
const selectionTextColor = document.getElementById("selectionTextColor");
const selectionBgColor = document.getElementById("selectionBgColor");
const boldSelectionBtn = document.getElementById("boldSelectionBtn");
const italicSelectionBtn = document.getElementById("italicSelectionBtn");
const resetSelectionBtn = document.getElementById("resetSelectionBtn");

// Populate Font Select from fonts array
fonts.forEach((font) => {
  const option = document.createElement("option");
  option.value = font;
  option.textContent = font;
  option.style.fontFamily = font;
  selectionFontSelect.appendChild(option);
});

// ====== Save Selection ====== //

let savedRange = null;

document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const node = selection.anchorNode;
    if (node && document.querySelector(".page-content")?.contains(node)) {
      savedRange = selection.getRangeAt(0).cloneRange();
    }
  }
});

// ====== Helpers ====== //

// Wrap selected text inside a <span> with custom styles
function styleSelection(styleCallback) {
  if (!savedRange) return;

  const span = document.createElement("span");
  span.style.display = "inline"; // Always inline

  styleCallback(span); // Apply custom style

  try {
    const contents = savedRange.extractContents();
    span.appendChild(contents);
    savedRange.deleteContents();
    savedRange.insertNode(span);

    const pageContent = document.querySelector(".page-content");
    if (pageContent) {
      pages[currentPageIndex].textContent = pageContent.innerHTML;
      saveAllPages(pages);
    }
  } catch (error) {
    console.error("Error styling selection:", error);
  }
}

// Remove all inline styles from a node
function removeInlineStyles(node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    node.removeAttribute("style");
    node.removeAttribute("class");
    Array.from(node.children).forEach(removeInlineStyles);
  }
}

// ====== Event Listeners ====== //

// Font Family
selectionFontSelect.addEventListener("change", () => {
  const selectedFont = selectionFontSelect.value;
  if (selectedFont) {
    styleSelection((span) => {
      span.style.fontFamily = selectedFont;
    });
  }
});

// Font Size
selectionFontSize.addEventListener("change", () => {
  const size = selectionFontSize.value;
  if (size) {
    styleSelection((span) => {
      span.style.fontSize = `${size}px`;
    });
  }
});

// Text Color
selectionTextColor.addEventListener("input", () => {
  const color = selectionTextColor.value;
  if (color) {
    styleSelection((span) => {
      span.style.color = color;
    });
  }
});

// Background Color
selectionBgColor.addEventListener("input", () => {
  const bgColor = selectionBgColor.value;
  if (bgColor) {
    styleSelection((span) => {
      span.style.backgroundColor = bgColor;
    });
  }
});

// Bold
boldSelectionBtn.addEventListener("click", () => {
  styleSelection((span) => {
    span.style.fontWeight = "bold";
  });
});

// Italic
italicSelectionBtn.addEventListener("click", () => {
  styleSelection((span) => {
    span.style.fontStyle = "italic";
  });
});

// Reset Styles
resetSelectionBtn.addEventListener("click", () => {
  if (!savedRange) return;

  const container = document.createElement("div");
  container.appendChild(savedRange.cloneContents());

  removeInlineStyles(container);

  savedRange.deleteContents();
  savedRange.insertNode(container.firstChild);

  const pageContent = document.querySelector(".page-content");
  if (pageContent) {
    pages[currentPageIndex].textContent = pageContent.innerHTML;
    saveAllPages(pages);
  }
});
