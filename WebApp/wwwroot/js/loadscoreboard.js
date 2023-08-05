let bestScores;
//!!!
const cover=document.createElement("div");
const scoreBlock = document.createElement("div");

const classImg = document.createElement("img");
const statinfo = document.createElement("article");
const heading = document.createElement("h1");
let infop = Array.apply(null, Array(5)).map(el => document.createElement("p"));
cover.id="scoreDetailsWrapper";
scoreBlock.classList.add("block");
scoreBlock.classList.add("scoreDetails");
cover.append(scoreBlock);

scoreBlock.append(classImg);
scoreBlock.append(statinfo);


cover.addEventListener("click", () => { while (statinfo.firstChild) statinfo.removeChild(statinfo.firstChild); document.body.removeChild(cover) });
scoreBlock.addEventListener("click", (event)=>event.stopPropagation());

const olist = document.querySelector("ol");

fetch("api/scoreboard",
    {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        
    }
).then(response => {
    if (response.status != 200) olist.innerText = "Couldn't load!";
    else response.json()
        .then(
            response => {
                bestScores = Array.from(response.scores);
                displayScoreBoard();
            }
        ) //response.json().then(
    //
})


function displayScoreBoard()
{
    
    for (const entry of bestScores) 
    {
        const newrecord=document.createElement("li");
        const recordbody=document.createElement("a");
        const playerName=document.createElement("div");
        const playerClass=document.createElement("div");
        const playerScore=document.createElement("div");

        playerName.innerText=entry.user.username;
        playerClass.innerText=entry.classname;
        playerScore.innerText=entry.score;

        recordbody.append(playerName, playerClass, playerScore);
        newrecord.append(recordbody);
        olist.append(newrecord);

        newrecord.addEventListener("click", (event) => showSelected(event), true);

    }
}
function showSelected(event)
{
    const list=Array.from(olist.children);
    const current = bestScores[list.indexOf(event.currentTarget)-1];
    document.body.append(cover);


    infop[0].innerText = `Final score: ${current.score}`;
    infop[1].innerText = `Achieved by ${current.user.username}`;
    infop[2].innerText = `With the ${current.classname} starting class`;
    if (!current.user.isPrivate) {
        infop[3].innerText = `${current.user.username}'s lifetime total: ${current.user.experience}`;
        infop[4].innerText = `${current.user.username}'s lifetime best: ${current.user.bestScore}`;
    }
    else infop[3].innerText = infop[4].innerText = "";
    classImg.src = `/imgs/assets/${current.classname}Class.png`;
    heading.innerText = `#${(list.indexOf(event.currentTarget))} All-time`;

    statinfo.append(heading);
    for (entry of infop) statinfo.append(entry);

    const profile = document.createElement("a");
    profile.href = `/profile.html?requestedName=${current.user.username}`;
    profile.innerText = "View profile";
    statinfo.append(profile);
}
//load();