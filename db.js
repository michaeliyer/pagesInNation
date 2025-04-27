// Database settings
const dbName = 'pageInNationDB';
const storeName = 'pagesStore';
let db;

// Open (or create) the database
function openDB() {
  const request = indexedDB.open(dbName, 1);

  request.onerror = (event) => {
    console.error('❌ IndexedDB error:', event.target.errorCode);
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    console.log('✅ IndexedDB opened');
    loadAllPages();
  };

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains(storeName)) {
      db.createObjectStore(storeName, { keyPath: 'id' });
      console.log('🆕 Object store created');
    }
  };
}

// Save all pages
function saveAllPages(pagesArray) {
  if (!db) return;

  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);

  const clearRequest = store.clear();

  clearRequest.onsuccess = () => {
    pagesArray.forEach((page, index) => {
      store.add({ id: index, ...page });
    });
    console.log('💾 Pages saved');
  };

  clearRequest.onerror = (event) => {
    console.error('❌ Failed to clear pages:', event.target.error);
  };
}

// Load all pages
function loadAllPages() {
  if (!db) return;

  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const request = store.getAll();

  request.onsuccess = (event) => {
    const savedPages = event.target.result;
    if (savedPages.length > 0) {
      pages = savedPages.map(page => ({
        textContent: page.textContent,
        styles: page.styles
      }));
      currentPageIndex = 0;
      renderPage();
      updatePageSelectDropdown();
      console.log('📚 Pages loaded from DB');
    } else {
      console.log('ℹ️ No saved pages found, creating a blank page');
      createNewPage();
    }
  };

  request.onerror = (event) => {
    console.error('❌ Failed to load pages:', event.target.error);
  };
}

// Open the DB immediately
openDB();