let userPage = document.querySelector("#user-page");
let loginText = document.querySelector("#loginText")

document.querySelector("#profileBtn").addEventListener("click", () => {
    userPage.classList.remove("hidden")
    document.querySelector("#mainPageBtn").classList.remove("hidden")
    document.querySelector("#book-info").classList.add("hidden")
    document.querySelector("#userpage-readlist").classList.remove("hidden")
    document.querySelector("#readListText").classList.remove("hidden")
    document.querySelector("#yourReadListBtn").classList.remove("hidden");
    yourReadListBtn.classList.add("active");
    yourRatingBtn.classList.remove("active");
    yourRatingBtn.classList.remove("hidden");
    document.querySelector("#userpage-readlist-box").classList.remove("hidden")
    document.querySelector("#userpage-yourRatings-box").classList.add("hidden");
    document.querySelector("#readList-container").classList.remove("hidden")
    loginText.innerText=`Signed in as ${identifier.value}`
    printReadList();
})

document.querySelector("#mainPageBtn").addEventListener("click", () => {
    document.querySelector("#book-info").classList.remove("hidden")
    document.querySelector("#mainPageBtn").classList.add("hidden")
    document.querySelector("#readList-container").classList.add("hidden");
    document.querySelector("#userpage-readlist").classList.add("hidden");
    document.querySelector("#readListText").classList.add("hidden");
    document.querySelector("#yourReadListBtn").classList.add("hidden");
    document.querySelector("#yourRatingBtn").classList.add("hidden");
    
})

let printReadList = async () => {
    
    let response = await axios.get("http://localhost:1337/api/books?populate=*");

    let addedToReadList = response.data.data.filter(book => book.attributes.onreadlist)
    document.querySelector("#read-list").innerHTML = "";
    document.querySelector("#userpage-readlist").innerHTML = "";


    addedToReadList.forEach((book) => {
        document.querySelector("#userpage-readlist").innerHTML += `<li>
        <b>Title</b>: ${book.attributes.title}<br>
        <b>Author</b>: ${book.attributes.author}
        </li>
        <button onclick="deleteFromReadList(${book.id})">Remove from read list</button>

    `;
});


listofBooks.forEach(async (book) => {
    let listBookId = book;
    let getBooks = await axios.get(`http://localhost:1337/api/books/${listBookId}`);
    if (getBooks.data) {
        document.querySelector("#userpage-readlist").innerHTML += `<li>
        <b>Title</b>: ${getBooks.data.data.attributes.title}<br>
        <b>Author</b>: ${getBooks.data.data.attributes.author}<br>
        <button onclick="removeFromReadList(${listBookId})" id="deleteIcon"><i class="fa-solid fa-trash"></i></button>
        </li><br>

    `;
      } else {
        console.log("Error: API response is undefined");
      }

});
const userId = sessionStorage.getItem("loginId");

await axios.put(`http://localhost:1337/api/users/${userId}`,
   {
          readlist:listofBooks,      
      },
      {
          headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`
          }
      }
   )
   renderPage();
}

let removeFromReadList = async(id) => {
    for( let i = 0; i < listofBooks.length; i++){ 
        if ( listofBooks[i] === id) { 
            listofBooks.splice(i, 1); 
        }
    }
    printReadList();
}


let deleteFromReadList = async (id) => {
    await axios.put(`http://localhost:1337/api/books/${id}`,
    {
        data:{
            onreadlist:false
        },
    },
    {
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`
        }
    }
    )
    printReadList();
  }
let getRatedBooks = async () => {
    yourReadListBtn.classList.remove("active");
    yourRatingBtn.classList.add("active");
    document.querySelector("#userpage-ratinglist").innerHTML = ""
    document.querySelector("#userpage-readlist-box").classList.add("hidden")
    document.querySelector("#userpage-yourRatings-box").classList.remove("hidden");

    let userId = sessionStorage.getItem("loginId")
    let currentUser = await axios.get(`http://localhost:1337/api/users/${userId}`);
    let books = await axios.get("http://localhost:1337/api/books?populate=*");
    

    let ratedBooks = books.data.data.filter(book => {
        if(!book.attributes.userratings){
            return false
        }

        for(var userRating of book.attributes.userratings){
            if(userRating.user_id == userId){
                book.myrating = userRating.rating
                return true
            }
        }
        return false;

    })
    console.log(ratedBooks)
    if(document.querySelector("#sortOptions").value === "All"){
        document.querySelector("#userpage-ratinglist").innerHTML = "";
            ratedBooks.forEach((book) => {
                document.querySelector("#userpage-ratinglist").innerHTML += `<li>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                    <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
            renderPage();
    }
    console.log(document.querySelector("#sortOptions").value)
    document.querySelector("#sortOptions").addEventListener("change", () => {
        console.log(document.querySelector("#sortOptions").value);
        if (document.querySelector("#sortOptions").value === "All") {
            console.log("all");
            document.querySelector("#userpage-ratinglist").innerHTML = "";
            ratedBooks.forEach((book) => {
                document.querySelector("#userpage-ratinglist").innerHTML += `<li>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                    <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
            renderPage();

        } // Sort by Title
        else if (document.querySelector("#sortOptions").value === "Title A-Ö") {
            ratedBooks.sort((a, b) => {
                const titleA = a.attributes.title.toUpperCase();
                const titleB = b.attributes.title.toUpperCase();
    
                if (titleA < titleB) {
                    console.log("" + titleA + " < " + titleB)
                    return -1;
                }
                if (titleA > titleB) {
                    console.log("" + titleA + " > " + titleB)
                    return 1;
                }
                return 0;
            });
            renderPage();
    
            document.querySelector("#userpage-ratinglist").innerHTML = "";
            ratedBooks.forEach((book) => {
                document.querySelector("#userpage-ratinglist").innerHTML += `<li>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                    <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
        } // Sort by Author 
        else if (document.querySelector("#sortOptions").value === "Author A-Ö") {
            ratedBooks.sort((a, b) => {
                const authorA = a.attributes.author.toUpperCase();
                const authorB = b.attributes.author.toUpperCase();
    
                if (authorA < authorB) {
                    return -1;
                }
                if (authorA > authorB) {
                    return 1;
                }
                return 0;
            });
    
            document.querySelector("#userpage-ratinglist").innerHTML = "";
            ratedBooks.forEach((book) => {
                document.querySelector("#userpage-ratinglist").innerHTML += `<li>
                <b>Author</b>: ${book.attributes.author}<br>
                <b>Title</b>: ${book.attributes.title}<br>
                <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
            renderPage();
        }
        // Sort by Rating        
        else if (document.querySelector("#sortOptions").value === "Rating") {
            ratedBooks.sort((a, b) => b.myrating - a.myrating);
    
            document.querySelector("#userpage-ratinglist").innerHTML = "";
            ratedBooks.forEach((book) => {
                document.querySelector("#userpage-ratinglist").innerHTML += `<li>
                <b>Your rating</b>: ${book.myrating}<br>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                </li><br>`;
            });
            renderPage();
        }
    });
}


let yourRatingBtn = document.querySelector("#yourRatingBtn");
let yourReadListBtn = document.querySelector("#yourReadListBtn");

yourRatingBtn.addEventListener("click",getRatedBooks)

yourReadListBtn.addEventListener("click", () => {
    document.querySelector("#userpage-readlist-box").classList.remove("hidden")
    document.querySelector("#userpage-yourRatings-box").classList.add("hidden")
    yourReadListBtn.classList.add("active");
    yourRatingBtn.classList.remove("active");


})

