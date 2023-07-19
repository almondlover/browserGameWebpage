

const gallery=document.getElementById("gallery");
let imgs=[];
imgs=gallery.getElementsByTagName("img");
imgs=Array.from(imgs);
let next=1;
let step;
function slide(automatic, dir)
{
    
    step=(-1+2*(+dir));
    for (const element of imgs)
    {
        
        element.style.transitionDelay=automatic?"5s":"0s";
        
        element.style.right=((imgs.length+next-1+step)%imgs.length)*100+automatic+'%';
        
        
    }
    
}

const arrows=gallery.querySelectorAll("a");

arrows[0].addEventListener("click", ()=>slide(false, false));
arrows[1].addEventListener("click", ()=>slide(false, true));
imgs[imgs.length-1].addEventListener("transitionend", ()=>{slide(true, true);});
imgs[imgs.length-1].addEventListener("transitionstart", ()=>{
    //next=(imgs.length+next+step)%imgs.length
    if (imgs[imgs.length-1].style.transitionDelay!="0s")
        slide(false, true);
    else next=(imgs.length+next+step)%imgs.length;
});
//imgs[imgs.length-1].addEventListener("transitionstart", ()=>next=(imgs.length+next+step)%imgs.length);
slide(true, true);

