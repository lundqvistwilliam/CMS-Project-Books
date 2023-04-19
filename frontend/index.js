let loginBox = document.querySelector(".login");
let logoutBtn = document.querySelector("#logout");
let loginBtn = document.querySelector("#loginBtn");

let profileBtn =  document.querySelector("#profileBtn");

let listofBooks = [];
let books = []



let renderPage = async () => {
  let response = await axios.get("http://localhost:1337/api/books?populate=*");
  books = response.data.data;
  const bookList = document.querySelector("#bookList");

  let userId = sessionStorage.getItem("loginId")
  let currentUser = await axios.get(`http://localhost:1337/api/users/${userId}`);
  listofBooks = currentUser.data.readlist;
  
  
  if(sessionStorage.getItem("token")){
    loginBox.classList.add("hidden");
    logoutBtn.classList.remove("hidden")
    loginText.classList.remove("hidden")
    document.querySelector("#registerText").classList.add("hidden")
    loginText.innerText=`Signed in as ${currentUser.data.username}`
    bookList.innerHTML = "";
    document.querySelector("#read-list").innerHTML = "";
  } else {
    logoutBtn.classList.add("hidden")
    loginBox.classList.remove("hidden")
    document.querySelector("#readList-container").classList.add("hidden")
    document.querySelector("#loginText").classList.add("hidden");
    profileBtn.classList.add("hidden");
    bookList.innerHTML = "";
    document.querySelector("#read-list").innerHTML = "";
  }

  let bookCounter = 0

  books.forEach(book => {
    const bookInfo = document.createElement("li");
    bookInfo.className = 'book-info';
    
    let rating = calculateAverageRating(book)
    
    bookInfo.innerHTML += `
      <h3>${book.attributes.title}</h3>
      <h4>${book.attributes.author}</h4>
      <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" id="cover" /><br>
      <b>Pages</b>: ${book.attributes.pages}<br>
      <b>Avg Rating</b>: ${rating}<br>
      <b>Release date</b>: ${book.attributes.releasedate}<br>
      <br>
    `
    let ratingBtnId = `ratingBtn_` + book.id


    if(sessionStorage.getItem("token")){
      bookInfo.innerHTML+=`
      <button onclick="addToReadList(${book.id})" id="addToReadListBtn">Add to read list</button>
      <br>
      <input type="number" min="1" max="10" id="${ratingBtnId}" placeholder="Rating"></input>
      <button type="submit" id="submitRatingBtn" onclick="submitRating(${book.id})">Submit rating</button>
      `
    } else {
      bookInfo.innerHTML+=`<p>Login to add to your list</p>`
    }
    ;
    bookList.append(bookInfo);

    bookCounter++;

  if (bookCounter % 3 === 0) {
    const row = document.createElement('div');
    row.className = 'row'; 
    bookList.append(row);
  }
  });
}

const login = async () => {
  let identifier = document.querySelector("#identifier")
  let password = document.querySelector("#password")
    let response = await axios.post("http://localhost:1337/api/auth/local",
    {
        identifier:identifier.value,
        password: password.value,
    });
        sessionStorage.setItem("token", response.data.jwt);
        sessionStorage.setItem("loginId", response.data.user.id);
        profileBtn.classList.remove("hidden")
        renderPage();
}

const logout = async () => {
  sessionStorage.clear();
  profileBtn.classList.add("hidden");
  renderPage();
  document.querySelector("#registerText").classList.remove("hidden")

}

let addToReadList = async (id) => {
   const userId = sessionStorage.getItem("loginId");
   
   if(!listofBooks){
    listofBooks = []
   } 
   if(!listofBooks.includes(id)){
    listofBooks.push(id)
   }

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
  
let submitRating = async (id) => {
  const userId = sessionStorage.getItem("loginId")
  let rating = document.querySelector("#ratingBtn_" + id).value;

  let book = books.find((book) => book.id===id);

  if(!book){
    console.log("No book found with id" + id)
    return;
  }
  let currentRatings = book.attributes.userratings
  if(!currentRatings){
    currentRatings= []
  }

  let userRating = currentRatings.find((currentRating) => currentRating.user_id == userId)
  if(userRating){
    userRating.rating= rating
  } else {

  currentRatings.push({
    user_id: userId,
    rating:rating
  })
}
  
  await axios.put(`http://localhost:1337/api/books/${id}`,
  {
      data:{
          userratings:currentRatings
      },
  },
  {
      headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
  }
  )
  renderPage();
}

let calculateAverageRating = (book) => {
  let totalRating = 0;

  if(!book || !book.attributes || !book.attributes.userratings){
    return 0;
  }

  for(let i=0; i<book.attributes.userratings.length; i++){
    let userrating = book.attributes.userratings[i]
    totalRating +=parseInt(userrating.rating)
  }
  totalRating = totalRating / book.attributes.userratings.length;
  return totalRating.toFixed(2)

}

const applyTheme = async() => {
  let response = await axios.get("http://localhost:1337/api/displaytheme");
  let theme = response.data.data.attributes.theme;

  document.body.classList.add(theme); 
  const header = document.querySelector('header');
  header.classList.add(theme)
}


loginBtn.addEventListener("click",login);
logoutBtn.addEventListener("click",logout);

renderPage();
applyTheme();

