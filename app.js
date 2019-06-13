// Book Class: Represents a book 
class Book {
    constructor(title,author,isbn) {
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }  
}

// UI Class: Handle UI tasks
 class UI {
     static displayBooks() {
          const books=Store.getBooks();

          books.forEach((book) => UI.addBookToList(book)); 
     }

     static addBookToList(book) {
         const list=document.getElementById('book-list');
         const row=document.createElement('tr');
         row.innerHTML=`
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm 
            delete">X</a></td>
         `;

         list.appendChild(row) ;
     }

     static deleteBook(el) {
         if(el.classList.contains('delete')){
             el.parentElement.parentElement.remove();
         }
     }

     static showAlert(message, className){
         const div = document.createElement('div');
         div.className=`alert alert-${className}`;
         div.appendChild(document.createTextNode(message));
         const container = document.querySelector('.container');
         const form = document.querySelector('#book-form');
         container.insertBefore(div,form); 
         // vanish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(),2000);

     }

     static clearFields(){
         document.querySelector('#title').value='';
         document.querySelector('#author').value='';
         document.querySelector('#isbn').value='';
     }
 }

// Store Class: Handles Storage
class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books')=== null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books =  Store.getBooks();
        books.forEach((book,index) => {
            if(book.isbn===isbn){
                books.splice(index,1);
            }
        });

        localStorage.setItem('books',JSON.stringify(books));
    }
}




// Event: Display Books
document.addEventListener('DOMContentLoaded',UI.displayBooks);

// Event: Add a book
document.querySelector('#book-form').addEventListener('submit', function(e){
   //Prevent actual submit
    e.preventDefault();

    // Get form values
    const title= document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    //Validate 
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all fields!','danger');
    } else{
        // Instantiate book
        const book = new Book(title,author,isbn);
        console.log(book);

        // Add book to UI
        UI.addBookToList(book);
        
        // Add book to store
        Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added Successfully', 'success');

        //Clear Fields
        UI.clearFields();
    }
});

// Event: to remove a Book
document.querySelector('#book-list').addEventListener('click',function(e){
   
   // Remove book form UI
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);


    //Show delete message
    UI.showAlert('Book Removed !', 'success');
})