const header=document.createElement("header");
header.innerHTML=` 
            <div id="banner"><h1>Nutty Warriors</h1></div>
            <nav>
                <a href="index.html">Home</a>
                <a href="instructions.html">Instructions</a>
                <a href="game.html">Play</a>
                <a href="account.html">Login</a>
                <a href="scoreboard.html">Ranking</a>

            </nav>
`;

document.body.prepend(header);

let curpage = Array.from(header.getElementsByTagName("a")).filter(el => el.href == window.location.href);


if (curpage.length>0) curpage[0].id = "currentpage";

const footer = document.createElement("footer");
footer.innerHTML = `
    <div id="upper">
        <article>This page is educational. </article>
        <a href="#">Scroll to top ^</a>
    </div>
    <div id="lower">Thank you for visiting!</div>
`;
document.body.append(footer);
