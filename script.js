(() => {
    "use strict";

    const header = document.querySelector(".header");
    const menuButton = document.getElementById("menu");
    const navigation = document.getElementById("nav");

    const closeMenu = (returnFocus = false) => {
        if (!menuButton || !navigation) return;
        navigation.classList.remove("active");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Navigation öffnen");
        document.body.classList.remove("menu-open");
        if (returnFocus) menuButton.focus();
    };

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
            navigation.classList.toggle("active", willOpen);
            menuButton.setAttribute("aria-expanded", String(willOpen));
            menuButton.setAttribute("aria-label", willOpen ? "Navigation schließen" : "Navigation öffnen");
            document.body.classList.toggle("menu-open", willOpen);
        });

        navigation.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => closeMenu());
        });

        document.addEventListener("click", (event) => {
            if (
                navigation.classList.contains("active") &&
                !navigation.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 800) closeMenu();
        });
    }

    if (header) {
        const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }

    const sectionLinks = document.querySelectorAll('#nav a[href^="#"]');
    const observedSections = [...sectionLinks]
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    if ("IntersectionObserver" in window && observedSections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                sectionLinks.forEach((link) => {
                    const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
                    link.classList.toggle("active", isCurrent);
                    if (isCurrent) {
                        link.setAttribute("aria-current", "page");
                    } else {
                        link.removeAttribute("aria-current");
                    }
                });
            });
        }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });

        observedSections.forEach((section) => navObserver.observe(section));
    }

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxCounter = document.getElementById("lightbox-counter");
    const nextButton = document.querySelector(".lightbox-next");
    const prevButton = document.querySelector(".lightbox-prev");
    const closeButton = document.querySelector(".lightbox-close");
    const allGalleryButton = document.querySelector(".gallery-all-button");
    const galleryItems = document.querySelectorAll(".gallery-item");
    const allImages = Array.from(
        { length: 25 },
        (_, index) => `images/galerie${String(index + 1).padStart(2, "0")}.jpg`
    );

    let currentImage = 0;
    let previousFocus = null;
    let touchStartX = 0;

    const updateLightboxImage = () => {
        if (!lightboxImage || !lightboxCounter) return;
        const imageNumber = currentImage + 1;
        lightboxImage.src = allImages[currentImage];
        lightboxImage.alt = `Projektaufnahme ${imageNumber} von ${allImages.length}`;
        lightboxCounter.textContent = `${imageNumber} / ${allImages.length}`;
    };

    const openGallery = (index = 0) => {
        if (!lightbox || !closeButton) return;
        previousFocus = document.activeElement;
        currentImage = index;
        updateLightboxImage();
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-open");
        closeButton.focus();
    };

    const closeGallery = () => {
        if (!lightbox) return;
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-open");
        if (lightboxImage) lightboxImage.removeAttribute("src");
        if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };

    const showNext = () => {
        currentImage = (currentImage + 1) % allImages.length;
        updateLightboxImage();
    };

    const showPrevious = () => {
        currentImage = (currentImage - 1 + allImages.length) % allImages.length;
        updateLightboxImage();
    };

    if (lightbox && lightboxImage && nextButton && prevButton && closeButton) {
        galleryItems.forEach((item) => {
            item.addEventListener("click", () => openGallery(Number(item.dataset.galleryIndex) || 0));
        });

        allGalleryButton?.addEventListener("click", () => openGallery(0));
        nextButton.addEventListener("click", showNext);
        prevButton.addEventListener("click", showPrevious);
        closeButton.addEventListener("click", closeGallery);

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) closeGallery();
        });

        lightboxImage.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].clientX;
        }, { passive: true });

        lightboxImage.addEventListener("touchend", (event) => {
            const distance = event.changedTouches[0].clientX - touchStartX;
            if (Math.abs(distance) < 50) return;
            distance < 0 ? showNext() : showPrevious();
        }, { passive: true });

        document.addEventListener("keydown", (event) => {
            if (lightbox.hidden) {
                if (event.key === "Escape") closeMenu(true);
                return;
            }

            if (event.key === "Escape") closeGallery();
            if (event.key === "ArrowRight") showNext();
            if (event.key === "ArrowLeft") showPrevious();

            if (event.key === "Tab") {
                const controls = [closeButton, prevButton, nextButton];
                const currentIndex = controls.indexOf(document.activeElement);
                if (event.shiftKey && currentIndex <= 0) {
                    event.preventDefault();
                    controls[controls.length - 1].focus();
                } else if (!event.shiftKey && currentIndex === controls.length - 1) {
                    event.preventDefault();
                    controls[0].focus();
                }
            }
        });
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion && "IntersectionObserver" in window) {
        const animatedElements = document.querySelectorAll(".service, .about-media, .about-content, .steps li, .gallery-item");
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            });
        }, { threshold: .12 });

        animatedElements.forEach((element) => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });
    }
})();
