
const gallery=document.getElementById("gallery");
let imgs=[];
imgs=gallery.getElementsByTagName("img");
imgs=Array.from(imgs);
let current=0;
let step;
let tout;
function slide(snum)
{
    step=snum;
    for (const element of imgs)
    {
        
        element.style.right = ((imgs.length + current + step) % imgs.length) * 100 + '%';
    }
    
}

const arrows = gallery.querySelectorAll("a");
const dots = Array.apply(null, Array(imgs.length)).map(el => { const temp = document.createElement("a"); temp.classList.add("slideButton"); return temp; });
const dotContainer = gallery.querySelector("div");
for (const element of dots)
{
    element.addEventListener("click", () => { clearTimeout(tout); slide(dots.indexOf(element)-current) });

    dotContainer.append(element);
}

arrows[0].addEventListener("click", ()=>{clearTimeout(tout); slide(-1)});
arrows[1].addEventListener("click", () => { clearTimeout(tout); slide(1)});
imgs[imgs.length - 1].addEventListener("transitionend", () => { dots[current].id = ""; current=(imgs.length+current+step)%imgs.length; dots[current].id = "currentButton";tout=setTimeout(()=>slide(1),5000);});

//imgs[imgs.length-1].addEventListener("transitionstart", ()=>next=(imgs.length+next+step)%imgs.length);
dots[0].id = "currentButton";
tout = setTimeout(() => slide(true, 1), 5000);