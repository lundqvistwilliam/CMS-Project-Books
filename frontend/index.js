let loginBox = document.querySelector(".login");
let logoutBtn = document.querySelector("#logout");

let renderPage = async () => {
  let response = await axios.get("http://localhost:1337/api/books?populate=*");
  const books = response.data.data;
  const bookList = document.querySelector("#bookList");

  if(sessionStorage.getItem("token")){
    loginBox.classList.add("hidden");
    logoutBtn.classList.remove("hidden")
    document.querySelector("#loginText").classList.remove("hidden")
    document.querySelector("#registerText").classList.add("hidden")
    document.querySelector("#loginText").innerText=`Signed in as ${identifier.value}`
    bookList.innerHTML = "";
    document.querySelector("#read-list").innerHTML = "";
  } else {
    document.querySelector("#logout").classList.add("hidden")
    loginBox.classList.remove("hidden")
    document.querySelector("#readList-container").classList.add("hidden")
    document.querySelector("#loginText").classList.add("hidden");
    document.querySelector("#profileBtn").classList.add("hidden");
    bookList.innerHTML = "";
    document.querySelector("#read-list").innerHTML = "";

  }

  
  // let addedToReadList = response.data.data.filter(book => book.attributes.onreadlist)

  let bookCounter = 0

  books.forEach(book => {
    const bookInfo = document.createElement("li");
    bookInfo.className = 'book-info';

    
    bookInfo.innerHTML += `
      <h3>${book.attributes.title}</h3>
      <h4>${book.attributes.author}</h4>
      <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" id="cover" /><br>
      <b>Pages</b>: ${book.attributes.pages}<br>
      <b>Avg Rating</b>: ${book.attributes.rating}<br>
      <b>Release date</b>: ${book.attributes.releasedate}<br>
      <br>
    `
    let ratingBtnId = `ratingBtn_` + book.id

    if(sessionStorage.getItem("token")){
      bookInfo.innerHTML+=`<i class="fa-regular fa-bookmark"></i>
      <button onclick="addToReadList(${book.id})">Add to read list</button>
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
        document.querySelector("#loginText").innerText=`Signed in as ${identifier.value}`
        document.querySelector("#profileBtn").classList.remove("hidden")
        renderPage();
}

const logout = async () => {
  sessionStorage.clear();
  document.querySelector("#profileBtn").classList.add("hidden");
  renderPage();
  document.querySelector("#registerText").classList.remove("hidden")

}

let addToReadList = async (id) => {
  await axios.put(`http://localhost:1337/api/books/${id}`,
  {
      data:{
          onreadlist:true
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


let submitRating = async (id) => {
  await axios.put(`http://localhost:1337/api/books/${id}`,
  {
      data:{
          rating:document.querySelector("#ratingBtn_" + id).value
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


document.querySelector("#loginBtn").addEventListener("click",login);
document.querySelector("#logout").addEventListener("click",logout);

renderPage();

