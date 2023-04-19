let userPage = document.querySelector("#user-page");
let loginText = document.querySelector("#loginText")

let mainPageBtn = document.querySelector("#mainPageBtn")

let userPageReadList = document.querySelector("#userpage-readlist")
let userPageReadListBox = document.querySelector("#userpage-readlist-box");
let userPageRatingList = document.querySelector("#userpage-ratinglist");

let sortOptions = document.querySelector("#sortOptions")
let reverseBtn = document.querySelector("#reverseBtn")

profileBtn.addEventListener("click", () => {
    userPage.classList.remove("hidden")
    mainPageBtn.classList.remove("hidden")
    yourReadListBtn.classList.add("active");
    yourRatingBtn.classList.remove("active");
    yourRatingBtn.classList.remove("hidden");
    document.querySelector("#book-info").classList.add("hidden")
    userPageReadList.classList.remove("hidden")
    document.querySelector("#readListText").classList.remove("hidden")
    document.querySelector("#yourReadListBtn").classList.remove("hidden");
    userPageReadListBox.classList.remove("hidden")
    document.querySelector("#userpage-yourRatings-box").classList.add("hidden");
    document.querySelector("#readList-container").classList.remove("hidden")
    loginText.innerText=`Signed in as ${identifier.value}`
    printReadList();
})

mainPageBtn.addEventListener("click", () => {
    document.querySelector("#book-info").classList.remove("hidden")
    mainPageBtn.classList.add("hidden")
    document.querySelector("#readList-container").classList.add("hidden");
    userPageReadList.classList.add("hidden");
    document.querySelector("#readListText").classList.add("hidden");
    document.querySelector("#yourReadListBtn").classList.add("hidden");
    document.querySelector("#yourRatingBtn").classList.add("hidden");
    document.querySelector("#userpage-yourRatings-box").classList.add("hidden");
    
})

let printReadList = async () => {
    
    let response = await axios.get("http://localhost:1337/api/books?populate=*");

    document.querySelector("#read-list").innerHTML = "";
    userPageReadList.innerHTML = "";

    listofBooks.forEach(async (book) => {
    let listBookId = book;
    let getBooks = await axios.get(`http://localhost:1337/api/books/${listBookId}`);
    if (getBooks.data) {
        userPageReadList.innerHTML += `<li>
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



let getRatedBooks = async () => {
    reverseBtn.classList.add("hidden")
    yourReadListBtn.classList.remove("active");
    yourRatingBtn.classList.add("active");
    userPageRatingList.innerHTML = ""
    userPageReadListBox.classList.add("hidden")
    document.querySelector("#userpage-yourRatings-box").classList.remove("hidden");

    let userId = sessionStorage.getItem("loginId")
    let books = await axios.get("http://localhost:1337/api/books?populate=*");
    
    let ratedBooks = books.data.data.filter(book => {
        if(!book.attributes.userratings){
            return false
        }
        for(let userRating of book.attributes.userratings){
            if(userRating.user_id == userId){
                book.myrating = userRating.rating
                return true
            }
        }
        return false;

    })
    if(sortOptions.value === "All"){
        userPageRatingList.innerHTML = "";
            ratedBooks.forEach((book) => {
                userPageRatingList.innerHTML += `<li>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                    <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
            renderPage();
    }
    sortOptions.addEventListener("change", () => {
        reverseBtn.classList.add("hidden")
        if (sortOptions.value === "All") {
            userPageRatingList.innerHTML = "";
            ratedBooks.forEach((book) => {
                userPageRatingList.innerHTML += `<li>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                    <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
            renderPage();

        } // Sort by Title
        else if (sortOptions.value === "Title A-Ö") {
            reverseBtn.classList.add("hidden")
            ratedBooks.sort((a, b) => {
                const titleA = a.attributes.title.toUpperCase();
                const titleB = b.attributes.title.toUpperCase();
    
                if (titleA < titleB) {
                    return -1;
                }
                if (titleA > titleB) {
                    return 1;
                }
                return 0;
            });
            renderPage();
    
            userPageRatingList.innerHTML = "";
            ratedBooks.forEach((book) => {
                userPageRatingList.innerHTML += `<li>
                    <b>Title</b>: ${book.attributes.title}<br>
                    <b>Author</b>: ${book.attributes.author}<br>
                    <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
        } // Sort by Author 
        else if (sortOptions.value === "Author A-Ö") {
            reverseBtn.classList.add("hidden")
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
    
            userPageRatingList.innerHTML = "";
            ratedBooks.forEach((book) => {
                userPageRatingList.innerHTML += `<li>
                <b>Author</b>: ${book.attributes.author}<br>
                <b>Title</b>: ${book.attributes.title}<br>
                <b>Your rating</b>: ${book.myrating}<br>
                </li><br>`;
            });
            renderPage();
        }
        // Sort by Rating        
        else if (sortOptions.value === "Rating") {
            reverseBtn.classList.remove("hidden")
            reverseBtn.addEventListener("click", () => {
                userPageRatingList.innerHTML = "";
                ratedBooks.sort((a, b) => a.myrating - b.myrating);
                ratedBooks.forEach((book) => {
                    userPageRatingList.innerHTML += `<li>
                      <b>Your rating</b>: ${book.myrating}<br>
                      <b>Title</b>: ${book.attributes.title}<br>
                      <b>Author</b>: ${book.attributes.author}<br>
                    </li><br>`;
                  });
                  renderPage();
                })
            ratedBooks.sort((a, b) => b.myrating - a.myrating);
    
            userPageRatingList.innerHTML = "";
            ratedBooks.forEach((book) => {
                userPageRatingList.innerHTML += `<li>
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
    userPageReadListBox.classList.remove("hidden")
    document.querySelector("#userpage-yourRatings-box").classList.add("hidden")
    yourReadListBtn.classList.add("active");
    yourRatingBtn.classList.remove("active");


})

