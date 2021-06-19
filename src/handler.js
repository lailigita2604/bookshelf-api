const { nanoid } = require("nanoid");
const books = require("./books");

//---Handler Untuk Menyimpan Buku---
const addBooksHandler = (request, h) => {
  
    const { 
      name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  //Gagal bila tidak melampirkan name
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      });
      response.code(400);
  
      return response;
    }
  //Gagal apabila readpage lebih besar dari pagecount
    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        
      });
      response.code(400);
  
      return response;
    }
const id = nanoid(16);
const insertedAt = new Date().toISOString();
const updatedAt = insertedAt;
const finished = (pageCount === readPage);

const newBook = {
  name,year,author,summary,publisher,pageCount,readPage,reading,updatedAt,insertedAt,id,reading,finished
};
    books.push(newBook);

    const isSuccess = books.filter((book)=>book.id === id).length >0;
    //Berhasil
    if(isSuccess){
        const response = h.response({
            status : 'success',
            message: 'Buku berhasil ditambahkan',
            data : {
                bookId : id,
            },
        });
        response.code(201);
        return response;
    }
  //Error Generic
  const response = h.response({
        status: 'error',
        message: 'Buku Gagal ditambahkan'
    });
    response.code(500);
    return response;

    
  
}

//--- Menampilkan Buku ---

const getAllBooksHandler = (request,h)=> {
  const { name, reading, finished } = request.query;
  if(name ){
    books = books.filter((book)=>book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if(reading){
    books = books.filter((book)=>book.reading);
  }
  if(finished){
    books = books.filter((book)=>book.finished);
  }
const response = h.response({
  status: 'success',
  data:{
    books: books.map((book)=>({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    })),

  },
});
response.code(200);
return response;
}

//-- Menampilkan detail buku dengan id--

const getBooksByIdHandler = (request, h)=> {
  const {bookId} = request.params;
  const book = books.filter((n)=>n.id===bookId)[0];
  if(book !== undefined){
    const response = h.response({
        status : 'success',
        data : {
            book,
        },
    });
    response.code(200);
    return response;
}
const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
});
response.code(404);
return response;
}

//-- Mengubah data buku
const editBookByidHandler = (request,h)=>{
  const{bookId} = request.params;

    const { 
      name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    
    //Gagal bila tidak melampirkan name
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
  
      return response;
    }
  //Gagal apabila readpage lebih besar dari pagecount
    if (pageCount < readPage) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        
      });
      response.code(400);
  
      return response;
    }
    const index = books.findIndex((book)=>book.id === bookId);

    if(index !== -1){

      const finished = (pageCount === readPage);
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
  
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
   
}

//---Menghapus Buku---
const deleteBooksByIdHandler = (request,h)=>{
  const {bookId}=request.params;
  
  const index = books.findIndex((book)=>book.id === bookId);

  if(index !== -1){
      books.splice(index,1);
      const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
})
response.code(404);
return response;
  
  };
  



module.exports = {addBooksHandler,getAllBooksHandler,getBooksByIdHandler,editBookByidHandler,deleteBooksByIdHandler}