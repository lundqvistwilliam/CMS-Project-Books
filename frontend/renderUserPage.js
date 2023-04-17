document.querySelector("#profileBtn").addEventListener("click", () => {
    document.querySelector("#user-page").classList.remove("hidden")
    document.querySelector("#mainPageBtn").classList.remove("hidden")
    document.querySelector("#book-info").classList.add("hidden")
    document.querySelector("#userpage-readlist").classList.remove("hidden")
    document.querySelector("#readListText").classList.remove("hidden")


    document.querySelector("#readList-container").classList.remove("hidden")
   
    document.querySelector("#loginText").innerText=`Signed in as ${identifier.value}`
    printReadList();
})

document.querySelector("#mainPageBtn").addEventListener("click", () => {
    document.querySelector("#book-info").classList.remove("hidden")
    document.querySelector("#mainPageBtn").classList.add("hidden")
    document.querySelector("#readList-container").classList.add("hidden");
    document.querySelector("#userpage-readlist").classList.add("hidden");
    document.querySelector("#readListText").classList.add("hidden");
})

let printReadList = async () => {
    let response = await axios.get("http://localhost:1337/api/books?populate=*");

    let addedToReadList = response.data.data.filter(book => book.attributes.onreadlist)
    document.querySelector("#read-list").innerHTML = "";
    document.querySelector("#userpage-readlist").innerHTML = "";


    addedToReadList.forEach((book) => {
        document.querySelector("#userpage-readlist").innerHTML += `<li>
        <b>Title</b>: ${book.attributes.title}<br>
        <b>Author</b>: ${book.attributes.author}<br>
        </li>
        <button onclick="deleteFromReadList(${book.id})">Remove from read list</button>
    `;
});
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
