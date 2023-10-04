import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchPhotos } from './services/pixabay-api';
import {makeMarkupFromRequest} from './services/makeMarkupFromRequest'

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const endMessage = document.querySelector('.end-message');
const buttonUp = document.querySelector('.up-button');

loadBtn.classList.add("visually-hidden");
endMessage.classList.add("visually-hidden");
buttonUp.classList.add("visually-hidden");
const lightbox = new SimpleLightbox('.gallery a');
export let page = 1;
let userRequest = "";

formEl.addEventListener('submit', onFormSubmit);
loadBtn.addEventListener('click', onLoadBtn);

async function onFormSubmit(event) {
    event.preventDefault();
    galleryEl.innerHTML = "";
    loadBtn.classList.add("visually-hidden");
    endMessage.classList.add("visually-hidden");
    buttonUp.classList.add("visually-hidden");
    userRequest = event.currentTarget.searchQuery.value;
    page = 1;
    
    const data = await fetchPhotos(userRequest);
    const result = data.hits;

    if (result.length === 0 || userRequest.trim() === "") {
         galleryEl.innerHTML = "";
         Notify.failure("Sorry, there are no images matching your search query. Please try again.");
         return;
    };
    
    Notify.success(`Hooray! We found ${data.totalHits} images.`)
    const markup = makeMarkupFromRequest(result);
    galleryEl.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
    loadBtn.classList.remove("visually-hidden");
    buttonUp.classList.remove("visually-hidden");
    
    
    if (page === Math.ceil(data.totalHits / 40)) {
        loadBtn.classList.add("visually-hidden");
        endMessage.classList.remove("visually-hidden");
    };   
};

async function onLoadBtn() {
    page += 1;
    const data = await fetchPhotos(userRequest)
    const markup = makeMarkupFromRequest(data.hits);
    galleryEl.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();

    const { height: cardHeight } = document
   .querySelector(".gallery")
   .firstElementChild.getBoundingClientRect();

   window.scrollBy({
   top: cardHeight * 2,
   behavior: "smooth",
});
            
    if (page === Math.ceil(data.totalHits / 40)) {
         loadBtn.classList.add("visually-hidden");
         endMessage.classList.remove("visually-hidden");
    };
};

buttonUp.addEventListener('click', () => {
   window.scrollTo(0, 0);
});