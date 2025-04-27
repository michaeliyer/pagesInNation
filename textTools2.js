// // Toolbar Elements
// const selectionFontSelect = document.getElementById("selectionFontSelect");
// const selectionFontSize = document.getElementById("selectionFontSize");
// const selectionTextColor = document.getElementById("selectionTextColor");
// const selectionBgColor = document.getElementById("selectionBgColor");
// const boldSelectionBtn = document.getElementById("boldSelectionBtn");
// const italicSelectionBtn = document.getElementById("italicSelectionBtn");
// const resetSelectionBtn = document.getElementById("resetSelectionBtn");

// // Populate font options
// fonts.forEach((font) => {
//   const option = document.createElement("option");
//   option.value = font;
//   option.textContent = font;
//   option.style.fontFamily = font;
//   selectionFontSelect.appendChild(option);
// });

// // Helper: Get the current selection range
// function getSelectionRange() {
//   const selection = window.getSelection();
//   if (selection.rangeCount === 0) return null;
//   return selection.getRangeAt(0);
// }

// // Helper: Apply style to selection with proper nesting
// function applyStyleToSelection(styleCallback) {
//   const range = getSelectionRange();
//   if (!range) return;

//   try {
//     // Create a temporary container
//     const container = document.createElement("div");
//     const span = document.createElement("span");
//     styleCallback(span);

//     // Extract the selection content
//     const contents = range.extractContents();
//     span.appendChild(contents);
//     container.appendChild(span);

//     // Insert the styled content back
//     range.insertNode(container.firstChild);

//     // Update the page content and save
//     const pageContent = document.querySelector(".page-content");
//     if (pageContent) {
//       const currentPage = pages[currentPageIndex];
//       currentPage.textContent = pageContent.innerHTML;
//       saveAllPages(pages);
//     }
//   } catch (e) {
//     console.error("Error applying style:", e);
//   }
// }

// // Helper: Remove all inline styles from a node
// function removeInlineStyles(node) {
//   if (node.nodeType === Node.ELEMENT_NODE) {
//     node.removeAttribute("style");
//     node.removeAttribute("class");
//     Array.from(node.children).forEach(removeInlineStyles);
//   }
// }

// // Font family
// selectionFontSelect.addEventListener("change", () => {
//   const selectedFont = selectionFontSelect.value;
//   if (selectedFont) {
//     applyStyleToSelection((span) => {
//       span.style.fontFamily = selectedFont;
//       span.style.display = "inline";
//     });
//   }
// });

// // // Font size
// // selectionFontSize.addEventListener("input", () => {
// //   const size = selectionFontSize.value;
// //   if (size) {
// //     applyStyleToSelection((span) => {
// //       span.style.fontSize = `${size}px`;
// //       span.style.display = "inline";
// //       span.style.lineHeight = "1.6";
// //     });
// //   }
// // });

// selectionFontSize.addEventListener("change", () => {
//   const size = selectionFontSize.value;
//   if (size) {
//     const selection = window.getSelection();
//     if (selection.rangeCount) {
//       const range = selection.getRangeAt(0);
//       const selectedNode = range.commonAncestorContainer;

//       // Make sure we're applying only inside the editable page
//       if (
//         pageContainer.contains(selectedNode) ||
//         pageContainer.contains(selectedNode.parentNode)
//       ) {
//         applyStyleToSelection((span) => {
//           span.style.fontSize = `${size}px`;
//           span.style.display = "inline";
//           span.style.lineHeight = "1.6"; // Optional for good looks
//         });
//       }
//     }
//   }
// });

// // Text color
// selectionTextColor.addEventListener("input", () => {
//   const color = selectionTextColor.value;
//   applyStyleToSelection((span) => {
//     span.style.color = color;
//   });
// });

// // Background color
// selectionBgColor.addEventListener("input", () => {
//   const bgColor = selectionBgColor.value;
//   applyStyleToSelection((span) => {
//     span.style.backgroundColor = bgColor;
//   });
// });

// // Bold
// boldSelectionBtn.addEventListener("click", () => {
//   const range = getSelectionRange();
//   if (!range) return;

//   const span = document.createElement("span");
//   span.style.fontWeight = "bold";
//   range.surroundContents(span);
//   saveAllPages(pages);
// });

// // Italic
// italicSelectionBtn.addEventListener("click", () => {
//   const range = getSelectionRange();
//   if (!range) return;

//   const span = document.createElement("span");
//   span.style.fontStyle = "italic";
//   range.surroundContents(span);
//   saveAllPages(pages);
// });

// // Reset inline styles
// resetSelectionBtn.addEventListener("click", () => {
//   const range = getSelectionRange();
//   if (!range) return;

//   // Create a temporary container
//   const container = document.createElement("div");
//   container.appendChild(range.cloneContents());

//   // Remove all inline styles from the selected content
//   removeInlineStyles(container);

//   // Replace the selection with the cleaned content
//   range.deleteContents();
//   range.insertNode(container.firstChild);

//   saveAllPages(pages);
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
// function styleSelection(styleCallback) {
//   if (!savedRange) return;

//   const span = document.createElement("span");
//   span.style.display = "inline"; // Always inline

//   styleCallback(span); // Apply custom style

//   try {
//     const contents = savedRange.extractContents();
//     span.appendChild(contents);
//     savedRange.deleteContents();
//     savedRange.insertNode(span);

//     const pageContent = document.querySelector(".page-content");
//     if (pageContent) {
//       pages[currentPageIndex].textContent = pageContent.innerHTML;
//       saveAllPages(pages);
//     }
//   } catch (error) {
//     console.error("Error styling selection:", error);
//   }
// }
function styleSelection(styleCallback) {
  if (!savedRange) return;

  const span = document.createElement("span");
  span.style.display = "inline";

  styleCallback(span); // Apply custom style

  try {
    const contents = savedRange.extractContents();
    span.appendChild(contents);
    savedRange.deleteContents();
    savedRange.insertNode(span);

    // Save page content after styling
    const pageContent = document.querySelector(".page-content");
    if (pageContent) {
      pages[currentPageIndex].textContent = pageContent.innerHTML;
      saveAllPages(pages);
    }

    // ✨ New! Immediately re-save selection
    const newRange = document.createRange();
    newRange.setStartAfter(span); // Cursor after inserted span
    newRange.collapse(true);

    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(newRange);

    // Update savedRange too
    savedRange = newRange.cloneRange();
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
