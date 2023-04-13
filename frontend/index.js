let renderPage = async () => {
  let response = await axios.get("http://localhost:1337/api/books?populate=*");
  const books = response.data.data;
  const bookList = document.querySelector("#bookList");

  if(sessionStorage.getItem("token")){
    document.querySelector(".login").classList.add("hidden");
    document.querySelector("#logout").classList.remove("hidden")
    document.querySelector("#loginText").classList.remove("hidden")
    document.querySelector("#loginText").innerText=`Signed in as ${identifier.value}`
    // document.querySelector("#readList-container").classList.remove("hidden")
    bookList.innerHTML = "";
     document.querySelector("#read-list").innerHTML = "";
  } else {
    document.querySelector("#logout").classList.add("hidden")
    document.querySelector(".login").classList.remove("hidden")
    document.querySelector("#readList-container").classList.add("hidden")
  }

  
  // let addedToReadList = response.data.data.filter(book => book.attributes.onreadlist)

  books.forEach(book => {
    const bookInfo = document.createElement("li");
    
    bookInfo.innerHTML += `
      <b>Title</b>: ${book.attributes.title}<br>
      <b>Author</b>: ${book.attributes.author}<br>
      <b>Pages</b>: ${book.attributes.pages}<br>
      <b>Avg Rating</b>: ${book.attributes.rating}<br>
      <b>Release date</b>: ${book.attributes.releasedate}<br>
      <img src="http://localhost:1337${book.attributes.cover.data.attributes.url}" id="cover" />
      <br>
    `
    if(sessionStorage.getItem("token")){
      bookInfo.innerHTML+=`<i class="fa-regular fa-bookmark"></i>
      <button onclick="addToReadList(${book.id})">Add to read list</button>
      <br>
      <input type="number" min="1" max="10" id="ratingBtn"></input>
      <button type="submit" id="submitRatingBtn" onclick="submitRating(${book.id})">Submit rating</button>
      `
    } else {
      bookInfo.innerHTML+=`<p>Login to add to your list</p>`
    }
    ;
    bookList.append(bookInfo);
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
  document.querySelector("#profileBtn").classList.add("hidden")
  renderPage();
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
          rating:document.querySelector("#ratingBtn").value
      },
  },
  {
      headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`
      }
  }
  )
  console.log(document.querySelector("#ratingBtn").value)
  renderPage();
}


document.querySelector("#loginBtn").addEventListener("click",login);
document.querySelector("#logout").addEventListener("click",logout);

renderPage();

