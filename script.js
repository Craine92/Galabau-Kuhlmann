/* =========================
   MOBILE NAVIGATION
========================= */


const menuButton = document.getElementById("menu");
const navigation = document.getElementById("nav");


if(menuButton && navigation){

    menuButton.addEventListener("click", () => {

        navigation.classList.toggle("active");

    });


    // Menü schließen nach Klick

    document.querySelectorAll("#nav a").forEach(link => {

        link.addEventListener("click", () => {

            navigation.classList.remove("active");

        });

    });

}








/* =========================
   GALERIE / LIGHTBOX
========================= */


const galleryImages =
document.querySelectorAll(".gallery-image");


const lightbox =
document.getElementById("lightbox");


const lightboxImage =
document.getElementById("lightbox-image");


const nextButton =
document.querySelector(".lightbox-next");


const prevButton =
document.querySelector(".lightbox-prev");


const closeButton =
document.querySelector(".lightbox-close");


const allGalleryButton =
document.querySelector(".gallery-all-button");



let currentImage = 0;



// Alle 25 Bilder laden

const allImages = [];


for(let i = 1; i <= 25; i++){

    allImages.push(
        `images/galerie${String(i).padStart(2,"0")}.jpg`
    );

}






// Vorschaubilder öffnen

galleryImages.forEach((image,index)=>{


    image.addEventListener("click",()=>{


        currentImage = index;


        showImage();


    });


});







// Button "Alle Projekte ansehen"

if(allGalleryButton){


    allGalleryButton.addEventListener("click",()=>{


        currentImage = 0;


        showImage();


    });


}







function showImage(){


    lightbox.style.display = "flex";


    lightboxImage.src =
    allImages[currentImage];


    document.body.style.overflow =
    "hidden";


}








// Nächstes Bild


nextButton.addEventListener("click",()=>{


    currentImage++;


    if(currentImage >= allImages.length){

        currentImage = 0;

    }


    showImage();


});








// Vorheriges Bild


prevButton.addEventListener("click",()=>{


    currentImage--;


    if(currentImage < 0){

        currentImage = allImages.length - 1;

    }


    showImage();


});









// Lightbox schließen


closeButton.addEventListener("click",()=>{


    closeGallery();


});






// Klick neben Bild schließt


lightbox.addEventListener("click",(event)=>{


    if(event.target === lightbox){

        closeGallery();

    }


});






function closeGallery(){


    lightbox.style.display =
    "none";


    document.body.style.overflow =
    "auto";


}









/* =========================
   Tastatursteuerung
========================= */


document.addEventListener("keydown",(event)=>{


    if(lightbox.style.display === "flex"){


        switch(event.key){


            case "ArrowRight":

                nextButton.click();

                break;



            case "ArrowLeft":

                prevButton.click();

                break;



            case "Escape":

                closeGallery();

                break;


        }


    }


});









/* =========================
   SCROLL ANIMATIONEN
========================= */


const observer =
new IntersectionObserver(

(entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){


            entry.target.classList.add("visible");


        }


    });


},

{

threshold:0.15

}

);






const animatedElements =
document.querySelectorAll(

".service, .about, .steps div, .gallery-preview img"

);





animatedElements.forEach(element=>{


    element.classList.add("hidden");


    observer.observe(element);


});









/* =========================
   HEADER SHADOW
========================= */


const header =
document.querySelector(".header");



window.addEventListener("scroll",()=>{


    if(window.scrollY > 50){


        header.classList.add("scrolled");


    }

    else{


        header.classList.remove("scrolled");


    }
/* =========================
   TOUCH SWIPE GALERIE
========================= */


let touchStartX = 0;
let touchEndX = 0;



lightboxImage.addEventListener("touchstart", (event)=>{


    touchStartX = event.changedTouches[0].screenX;


});





lightboxImage.addEventListener("touchend", (event)=>{


    touchEndX = event.changedTouches[0].screenX;


    handleSwipe();


});







function handleSwipe(){


    const swipeDistance =
    touchEndX - touchStartX;



    // Mindestdistanz für Swipe

    if(Math.abs(swipeDistance) < 50){

        return;

    }



    // Nach links wischen = nächstes Bild

    if(swipeDistance < 0){


        nextButton.click();


    }



    // Nach rechts wischen = vorheriges Bild

    if(swipeDistance > 0){


        prevButton.click();


    }


}

});