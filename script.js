// Get the elements
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const descriptionInput = document.getElementById('description');
const addBtn = document.getElementById('add-btn');
const addBookBtn = document.getElementById('add-book-btn');
const cancelBtn = document.getElementById('cancel-btn');
const popupContainer = document.getElementById('popup-container');
const viewPopupContainer = document.getElementById('view-popup-container');
const closeViewBtn = document.querySelector('.close-view-btn');
const bookList = document.getElementById('book-list');

// Variables for edit functionality
let isEditMode = false;
let editIndex = -1;

// Load books from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const storedBooks = JSON.parse(localStorage.getItem('books')) || [];
  storedBooks.forEach((book, index) => addBookToList(book, index));
});

// Add event listener to the "Add Book" button in the popup
addBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const title = titleInput.value;
  const author = authorInput.value;
  const description = descriptionInput.value;

  if (title === '' || author === '' || description === '') {
    alert('Please fill in all the input fields');
  } else {
    if (isEditMode) {
      // Update book in localStorage
      let books = JSON.parse(localStorage.getItem('books')) || [];
      books[editIndex] = { title, author, description };
      localStorage.setItem('books', JSON.stringify(books));

      // Update the UI
      updateBookInList(editIndex, books[editIndex]);

      isEditMode = false; // Reset mode
      addBtn.textContent = 'Add Book'; // Switch back to "Add Book" mode
    } else {
      const book = { title, author, description };

      // Save book to localStorage
      let books = JSON.parse(localStorage.getItem('books')) || [];
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));

      // Add the book to the book list in the UI
      addBookToList(book, books.length - 1);
    }

    // Clear the form inputs
    titleInput.value = '';
    authorInput.value = '';
    descriptionInput.value = '';

    // Hide the popup
    popupContainer.style.display = 'none';
  }
});

// Function to add a book to the UI
function addBookToList(book, index) {
  const bookHTML = `
    <div class="book" data-index="${index}">
      <h1>${book.title}</h1>
      <h2>${book.author}</h2>
      <p>${book.description}</p>
      <div class="book-actions">
        <div class="dropdown">
          <button class="menu-btn">⋮</button>
          <div class="dropdown-content">
            <button class="view-btn">View Details</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const bookElement = document.createElement('div');
  bookElement.innerHTML = bookHTML;
  bookList.appendChild(bookElement);

  // Add event listeners for dropdown actions
  const dropdown = bookElement.querySelector('.dropdown');
  const viewBtn = bookElement.querySelector('.view-btn');
  const editBtn = bookElement.querySelector('.edit-btn');
  const deleteBtn = bookElement.querySelector('.delete-btn');

  dropdown.addEventListener('click', () => {
    const dropdownContent = dropdown.querySelector('.dropdown-content');
    dropdownContent.classList.toggle('show');
  });

  viewBtn.addEventListener('click', () => {
    showBookDetails(index);
  });

  editBtn.addEventListener('click', () => {
    editBook(index);
  });

  deleteBtn.addEventListener('click', () => {
    deleteBook(index);
  });
}

// Edit a book
function editBook(index) {
  let books = JSON.parse(localStorage.getItem('books')) || [];
  const book = books[index];

  // Fill the popup inputs with the selected book details
  titleInput.value = book.title;
  authorInput.value = book.author;
  descriptionInput.value = book.description;

  // Show the popup container
  popupContainer.style.display = 'block';

  // Set edit mode and save the index
  isEditMode = true;
  editIndex = index;

  // Change the "Add Book" button to "Update Book"
  addBtn.textContent = 'Update Book';
}

// Update the book in the UI
function updateBookInList(index, updatedBook) {
  const bookElements = document.querySelectorAll('.book');
  const bookElement = bookElements[index];

  bookElement.querySelector('h1').textContent = updatedBook.title;
  bookElement.querySelector('h2').textContent = updatedBook.author;
  bookElement.querySelector('p').textContent = updatedBook.description;
}

// Show book details in a popup
function showBookDetails(index) {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  const book = books[index];

  document.getElementById('view-title').textContent = book.title;
  document.getElementById('view-author').textContent = book.author;
  document.getElementById('view-description').textContent = book.description;

  viewPopupContainer.style.display = 'flex';
}

// Hide the book details popup
closeViewBtn.addEventListener('click', () => {
  viewPopupContainer.style.display = 'none';
});

// Add a new book button click handler
addBookBtn.addEventListener('click', () => {
  popupContainer.style.display = 'block';
  isEditMode = false; // Ensure we're not in edit mode
  addBtn.textContent = 'Add Book'; // Change button text back to "Add Book"
});

// Cancel button click handler
cancelBtn.addEventListener('click', () => {
  popupContainer.style.display = 'none';
});

// Delete a book
function deleteBook(index) {
  let books = JSON.parse(localStorage.getItem('books')) || [];
  books.splice(index, 1);
  localStorage.setItem('books', JSON.stringify(books));

  // Clear the book list and re-render it
  bookList.innerHTML = '';
  books.forEach((book, index) => addBookToList(book, index));
}
