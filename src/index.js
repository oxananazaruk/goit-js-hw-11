import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { fetchPhotos } from './servises/pixabay-api';
import {makeMarkupFromRequest} from './servises/makeMarkupFromRequest'

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');
const loadBtn = document.querySelector('.load-more');
const endMessage = document.querySelector('.end-message');

loadBtn.classList.add("visually-hidden");
endMessage.classList.add("visually-hidden");
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
    userRequest = event.currentTarget.searchQuery.value;
    
    fetchPhotos(userRequest)
        .then((data) => {
            const result = data.hits;
            if (result.length === 0 || userRequest.trim() === "") {
                galleryEl.innerHTML = "";
                Notify.failure("Sorry, there are no images matching your search query. Please try again.");
                return;
            }
             Notify.success(`Hooray! We found ${data.totalHits} images.`)
             const markup = makeMarkupFromRequest(result);
             galleryEl.insertAdjacentHTML("beforeend", markup);
             lightbox.refresh();
            loadBtn.classList.remove("visually-hidden");

            if (page === Math.ceil(data.totalHits/40)) {
            loadBtn.classList.add("visually-hidden");
            endMessage.classList.remove("visually-hidden");
           }
        })
        .catch(error => {
        console.log(error);
    })
};

async function onLoadBtn() {
    page += 1;
    fetchPhotos(userRequest)
        .then(data => {
            const markup = makeMarkupFromRequest(data.hits);
            galleryEl.insertAdjacentHTML("beforeend", markup);
            lightbox.refresh();
            
            if (page === Math.ceil(data.totalHits / 40)) {
                loadBtn.classList.add("visually-hidden");
                endMessage.classList.remove("visually-hidden");
            } 
        })
        .catch(error => {
            console.log(error);
        })
};

