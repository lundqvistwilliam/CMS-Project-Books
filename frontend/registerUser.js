
let registerText = document.querySelector("#registerSpanText");
let registerBox = document.querySelector("#register-box");


let registerBtn = document.querySelector("#register");

registerText.addEventListener("click", () => {
    document.querySelector("#registerText").classList.add("hidden")
    registerBox.classList.remove("hidden")
    document.querySelector(".login").classList.add("hidden")
})


let register = async () => {
     let username = document.querySelector("#username").value;
     let email = document.querySelector("#email").value;
     let registerPassword = document.querySelector("#registerPassword").value;
     
     await axios.post("http://localhost:1337/api/auth/local/register",
     {
         username:username,
         email:email,
         password:registerPassword,
     });
     alert("User has been created! Please login")
     registerBox.classList.add("hidden");
     document.querySelector(".login").classList.remove("hidden")
}

registerBtn.addEventListener("click", register)


