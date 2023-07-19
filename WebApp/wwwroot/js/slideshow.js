
const gallery=document.getElementById("gallery");
let imgs=[];
imgs=gallery.getElementsByTagName("img");
imgs=Array.from(imgs);
let current=0;
let step;
let tout;
function slide(dir)
{
    step=(-1+2*(+dir));
    for (const element of imgs)
        element.style.right=((imgs.length+current+step)%imgs.length)*100+'%';
}

const arrows=gallery.querySelectorAll("a");

arrows[0].addEventListener("click", ()=>{clearTimeout(tout); slide(false)});
arrows[1].addEventListener("click", ()=>{clearTimeout(tout); slide(true)});
imgs[imgs.length-1].addEventListener("transitionend", ()=>{current=(imgs.length+current+step)%imgs.length; tout=setTimeout(()=>slide(true),5000);});

//imgs[imgs.length-1].addEventListener("transitionstart", ()=>next=(imgs.length+next+step)%imgs.length);
tout=setTimeout(()=>slide(true),5000);