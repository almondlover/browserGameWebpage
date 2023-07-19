const title = document.querySelector("h1.blockTitle");

const loginform = document.querySelector("form");
//const email=document.getElementById("email");
//const username=document.getElementById("username");
//const password = document.getElementById("password");

const fields = /*loginform.querySelectorAll("input");*/
    Array.apply(null, Array(4)).map(el => { const temp = document.createElement("input"); temp.required = true; return temp });
fields[3].required = false;
const labels = /*loginform.querySelectorAll("label");*/
    Array.apply(null, Array(4)).map(el => document.createElement("label"));
//console.log(fields);

const bttn = /*loginform.querySelectorAll("button");*/
    Array.apply(null, Array(2)).map(el => { const temp = document.createElement("button"); temp.type = "submit"; return temp; });

const fieldctx = ["email", "username", "password", "private"];

for (let i = 0; i < 4; i++)
{
    fields[i].name = fieldctx[i];
    fields[i].id = fieldctx[i];
    labels[i].htmlFor = fieldctx[i];
}
function setLabelField(idx, txt, pholder, t)
{
    labels[idx].innerText = txt;
    fields[idx].placeholder = pholder;
    fields[idx].type = t;
}
setLabelField(0, "E-mail:", "mail@mail.com", "text");
setLabelField(1, "Username:", "epicuser96", "text");
setLabelField(2, "Password:", "", "password");
setLabelField(3, "Make the account private:", "", "checkbox");

let userdata;

console.log(fields, bttn)

let token;
let reqstatus;
//usera koito vzima
let loggeduser;
function loggedin()
{
    

    fetch("api/users/current",
        {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("usertoken")}` }
            //body: JSON.stringify(loggeduser)
        }
    ).then(response => {
        if (response.status === 200) response.json()
            .then(
                //if(response.status!=200) window.alert("Invalid data!");
                //else {
                response => {
                    //localStorage.setItem("currentuser", JSON.stringify(response));
                    loggeduser = response;

                    while (loginform.firstChild) loginform.removeChild(loginform.firstChild);

    
                    loginform.innerText = `Welcome, ${loggeduser.username}`;
    
                    bttn[0].innerText = "Logout";
                    bttn[0].addEventListener("click", login, { once: true });
                    bttn[0].removeEventListener("click", trylogging);

                    bttn[1].innerText = `Go ${loggeduser.isPrivate?"public":"private"}`;
                    bttn[1].addEventListener("click", togglePrivacy, { once: true });
                    bttn[1].removeEventListener("click", register);

                    const p = document.createElement("p");
                    loginform.append(p);
                    p.append(bttn[0], bttn[1]);

                    const profile = document.createElement("a");
                    profile.href = "/profile.html";
                    profile.innerText = "View profile";
                    loginform.append(profile);
                    
                })
    });

    
}
function trylogging(event)
{
    event.preventDefault();

        userdata = { username: fields[1].value, email: "", password: fields[2].value};

        fetch("api/Login",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userdata)
            }
        ).then(response => {
            if (response.status != 200) window.alert("Invalid data!");
            else response.text()
                .then(
                    //if(response.status!=200) window.alert("Invalid data!");
                    //else {
                    response => {
                        
                        //localStorage.setItem("currentuser", JSON.stringify(response));
                        localStorage.setItem("usertoken", response);
                        loggedin();
                    }
                ) //response.json().then(
            //
        })
        
}
function login()
{
    while (loginform.firstChild) loginform.removeChild(loginform.firstChild);
    fields[3].checked = false;

    for (let i = 1; i < 3; i++)
    {
        const p = document.createElement("p");
        loginform.append(p);
        p.append(labels[i]);
        p.append(fields[i]);
        
        
        fields[i].value = "";
    }

    const p = document.createElement("p");
    loginform.append(p);
    p.append(bttn[0]);
    p.append(bttn[1]);
    title.textContent = "Login";

    localStorage.setItem("usertoken", "");

    bttn[1].removeEventListener("click", tryregistering);
    bttn[1].removeEventListener("click", togglePrivacy);
    fields[2].removeEventListener("input", assessPwStrength);

    bttn[0].innerText = "Login";
    bttn[1].innerText = "Register";
    bttn[0].addEventListener("click", trylogging);
    bttn[1].addEventListener("click", register, {once:true});
}
let privateField;
function register()
{


    while (loginform.firstChild) loginform.removeChild(loginform.firstChild);
    for (let i = 0; i < 4; i++) {
        const p = document.createElement("p");
        loginform.append(p);
        p.append(labels[i]);
        p.append(fields[i]);
        fields[i].value = "";
    }

    //pstrength
    const pwarning = document.createElement("span");
    fields[2].parentNode.append(pwarning);
    pwarning.id = "passwordWarning";

    //makeprivate
    //const privateLabel = document.createElement("label");
    //privateLabel.htmlFor = "private";
    //privateField = document.createElement("input");
    //fields[2].parentNode.append(privateField, privateLabel);
    //privateField.type = "checkbox";
    //privateField.id = "private";
    //privateLabel.textContent = "Make the account private";

    const p = document.createElement("p");
    loginform.append(p);
    p.append(bttn[1]);
    p.append(bttn[0]);
    title.textContent = "Register";

    localStorage.setItem("usertoken", "");

    //bttn[1].addEventListener("click", tryregistering);
    bttn[0].removeEventListener("click", trylogging);


    bttn[1].innerText = "Register";
    bttn[0].innerText = "Login";

    
    bttn[0].addEventListener("click", login, { once: true });
    bttn[1].addEventListener("click", tryregistering);

    fields[2].addEventListener("input", assessPwStrength);
}
const passwordStrength = {
    Valid:0,
    NoUpperCase:1,
    NoNumber:2,
    None:3
}
const pstrengthWarnings = [
    "",
    "Your password must contain at least one uppercase letter",
    "Your password must contain at least one number",
    "Your password must contain at least one number and uppercase letter"
]
let pstrength;
function assessPwStrength(event)
{
    pstrength = 0;
    if (event.target.value === event.target.value.toLowerCase()) pstrength |= 1;
    pstrength |= 2
    for (const char of event.target.value)
    {
        if (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57)
        {
            pstrength ^=2;  break;
        }
    }
    const warningsection = document.getElementById("passwordWarning");
    warningsection.innerText = pstrengthWarnings[pstrength];
    console.log(event.target);

}
function togglePrivacy(event)
{
    event.preventDefault();

    //const loggeduser = JSON.parse(localStorage.getItem("currentuser"));

    fetch(`api/privacy`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("usertoken")}` },
            //body: JSON.stringify(loggeduser)
        }
    ).then(response => {
        if (response.status === 200) response.json()
            .then(
                //if(response.status!=200) window.alert("Invalid data!");
                //else {
                response => {
                    

                    //razmeneni sa shtoto gleda predishnoto
                    bttn[1].innerText = `Go ${loggeduser.isPrivate ? "private" : "public"}`;
                    bttn[1].addEventListener("click", togglePrivacy, { once: true });
                    loggeduser.isPrivate = !loggeduser.isPrivate;
                })
    });
}
function tryregistering(event)
{
    event.preventDefault();

    userdata = { email: fields[0].value, username: fields[1].value, password: fields[2].value, isPrivate: fields[3].checked };

    if (userdata.username === "" || userdata.password === "" || userdata.email === ""||pstrength) { window.alert("Invalid data!"); return; }
   
    fetch("api/registration",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userdata)
        }
    ).then(response => {
        if (response.status != 200) window.alert("Invalid data!");
        else {
                window.alert("Registration Successful!");
                login()
                }
        //
            })
            
}
if (localStorage.getItem("usertoken") != "") loggedin();
else login();