//if (localStorage.getItem("currentuser") === "" || localStorage.getItem("currentuser") === null) window.location.href = "/account.html";
const param = window.location.search.substring(1);

const token = (localStorage.getItem("usertoken") === "" || localStorage.getItem("usertoken") === null )?null:localStorage.getItem("usertoken");

fetch(`api/users/profile?${param}`,
    {
        method: "GET",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        //body: JSON.stringify(current)
    }
).then(response => {
    if (response.status != 200) {
        if (response.status === 404) window.location.href = "/account.html";
        else {
            const profileContent = document.getElementById("profileBlock");
            while (profileContent.firstChild) profileContent.removeChild(profileContent.firstChild)
            profileContent.innerText = "This account is either private or doesn't exist.";
        };
    }
    else response.json()
        .then(
            //if(response.status!=200) window.alert("Invalid data!");
            //else {
            response => {

                /*localStorage.setItem("currentuser", JSON.stringify(response));*/
                loadProfile(response);
            }
        ) //response.json().then(
    //
})
function loadProfile(userdata)
{
    const profileContent = document.getElementById("profileBlock");
    const info = profileContent.getElementsByTagName("p");
    const usertitle = profileContent.getElementsByTagName("h2");
    usertitle[0].innerText = `User ${userdata.username}`;
    info[0].innerText = `Lifetime total amount of points accumulated: ${userdata.experience}`;
    info[1].innerText = `Highest score achieved in a single run: ${userdata.bestScore}`;
    info[3].innerText = `Top rank on the leaderboard: ${userdata.rank ? userdata.rank : "None"}`;

    const classContainer = document.getElementById("userClasses");
    for (const uclass of userdata.unlockedclasses)
    {
        const classImg = document.createElement("span");
        classImg.style.backgroundImage = `url(/imgs/assets/${uclass}Class.png)`;
        classImg.classList.add("classImg");
        classImg.innerText = uclass;
        classContainer.append(classImg);
    }

    

}