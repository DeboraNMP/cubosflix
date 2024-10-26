

const movies = document.querySelector(".movies")
const divHighlightVideo = document.querySelector(".highlight__video")
const classModal = document.querySelector(".modal")
const classInput = document.querySelector("input")
const previousButton = document.querySelector(".btn-prev")
const nextButton = document.querySelector(".btn-next")

const highlightVideoLink = document.querySelector(".highlight__video-link")
const apiUrl = "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
const urlHighlight = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR"
const urlVideoHighlight = "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
const urlModal = "https://tmdb-proxy.cubos-academy.workers.dev"
const apiInput = ""

let page = 0
let filmes = []

const api = async () => {
    try {
        const response = await fetch(apiUrl)
        const resultado = await response.json()
        return resultado.results
    } catch (error) {
        console.log(error)
    }
}

const listaDeFilmes = async (filme) => {

    const criacaoDiv = document.createElement("div")
    criacaoDiv.classList.add("movie__info")

    const criacaoSpan = document.createElement("span")
    criacaoSpan.classList.add("movie__title")
    criacaoSpan.textContent = filme.title

    const criacaoSpan2 = document.createElement("span")
    criacaoSpan2.classList.add("movie__rating")
    criacaoSpan2.textContent = filme.vote_average.toFixed(1)

    const imgStar = document.createElement("img")
    imgStar.src = "./assets/estrela.svg"
    imgStar.alt = "Estrela"
    criacaoSpan2.appendChild(imgStar)

    const divMovie = document.createElement("div")
    divMovie.classList.add("movie")
    divMovie.style.backgroundImage = `url(${filme.poster_path})`
    divMovie.addEventListener("click", () => modal(filme))

    criacaoDiv.appendChild(criacaoSpan)
    criacaoDiv.appendChild(criacaoSpan2)
    divMovie.appendChild(criacaoDiv)
    movies.appendChild(divMovie)
}

const carregarFilmes = async () => {
    movies.innerHTML = ""
    try {
        filmes = await api()
        for (let i = page; i < page + 5; i++) {
            const filme = filmes[i]
            if (!filme) {
                return
            }
            listaDeFilmes(filme)
        }
    } catch (error) {
        console.log(error)
    }
}

previousButton.addEventListener("click", () => {
    if (page === 0) {
        page = 20;
    }

    page -= 5;

    carregarFilmes();
});

nextButton.addEventListener("click", () => {
    if (page === 20) {
        page = 0;
    }

    page += 5;
    carregarFilmes();
});

const inputApi = async () => {
    try {
        const response = await fetch(apiInput)
        const resultado = await response.json()
        return resultado
    } catch (error) {
        return error
    }
}

classInput.addEventListener("keydown", function (event) {

    if (event.key !== "Enter") {
        return;
    }

    classInput.value = ""
})




const highlight = async () => {

    try {
        const response = await fetch(urlHighlight)
        const high = await response.json()

        divHighlightVideo.style.backgroundImage = `url('${high.backdrop_path}')`


        const divHighlightTitle = document.querySelector(".highlight__title")
        divHighlightTitle.textContent = high.title

        const spanHighlightRating = document.querySelector(".highlight__rating")
        spanHighlightRating.textContent = high.vote_average.toFixed(1)


        const spanHighlightGenres = document.querySelector(".highlight__genres")
        const generos = []
        for (let genero of high.genres) {
            generos.push(genero.name)
        }
        spanHighlightGenres.textContent = generos.join(", ")

        const spanHighlightLaunch = document.querySelector(".highlight__launch")
        const result = new Date(high.release_date)
        spanHighlightLaunch.textContent = result.toLocaleDateString('en-us', { year: "numeric", month: "long", day: "numeric" })

        const pHighlightDescription = document.querySelector(".highlight__description")
        pHighlightDescription.textContent = high.overview
    } catch (error) {
        return error
    }
}

const apiHighlightVideo = async (result) => {
    try {
        const response = await fetch(urlVideoHighlight)
        result = await response.json()
        highlightVideoLink.href = `https://www.youtube.com/watch?v=${result.results[0].key}`
        return result
    } catch (error) {
        return error
    }
}

const modal = async (filme) => {
    classModal.classList.remove("hidden")


    const response = await fetch(`${urlModal}/3/movie/${filme.id}?language=pt-BR`)
    const movieData = await response.json()



    const classModalTitle = document.querySelector(".modal__title")
    classModalTitle.textContent = movieData.title

    const classModalImg = document.querySelector(".modal__img")
    classModalImg.src = movieData.backdrop_path
    classModalImg.alt = movieData.title

    const classModalDescription = document.querySelector(".modal__description")
    classModalDescription.textContent = movieData.overview

    const classModalAverage = document.querySelector(".modal__average")
    classModalAverage.textContent = movieData.vote_average.toFixed(1)
}


classModal.addEventListener("click", () => closeModal())

function closeModal() {
    classModal.classList.add("hidden");
}


carregarFilmes()
apiHighlightVideo()
highlight()















