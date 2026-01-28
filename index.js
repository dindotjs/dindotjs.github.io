address = 'http://127.0.0.1:8090'

currentOpen = {id:NaN, menuType:""}
currentReviewOpen = {id:NaN}

openReviewIDs = []

var albumPage = 1
var reviewPage = 1

searchBarHTML = `
    <div id="album-search" class="centered-text">
        <form id="search-form" class="search-form">
            <label for="search">Search:</label>
            <input class="form-control" id="search" name="search" type="text">
        </form>
    </div>
    `


addAlbumHTML = `
    <div id="add-album" class="add-album">
        <form id="add-album-form">
            <div class="add-album-field">
                <label for="album_name">Album Name</label><br>
                <input class="form-control" id="album_name" name="album_name" type="text" placeholder="Enter Album Name">
            </div>
            <div class="add-album-field">
                <label for="artist">Artist</label><br>
                <input class="form-control" id="artist" name="artist" type="text" placeholder="Enter Artist Name">
            </div>
            <div class="add-album-field">
                <label for="year">Year</label><br>
                <input class="form-control" id="year" name="year" type="text" placeholder="Enter Year of Release">
            </div>
            <div class="add-album-field">
                <label for="genres">Genres</label><br>
                <input class="form-control" id="genres" name="genres" type="text" placeholder="Enter Genres">
            </div>
            <div class="add-album-field">
                <label for="credits">Credits</label><br>
                <input class="form-control" id="credits" name="credits" type="text" placeholder="Enter Credits">
            </div>
            <div class="add-album-field">
                <label for="cover">Album Cover</label><br>
                <input class="form-control" id="cover" name="cover" type="file" accept="image/*">
            </div>
            <div class="add-album-field">
                <input class="btn button-margin" type="submit" value="Submit">
            </div>
        </form>
        <div id="form-status">

        </div>
    </div>
`    


async function PlaceAlbums(page) {
    try {
        currentReviewOpen.id = NaN
        currentOpen.id = NaN
        currentOpen.menuType = ""

        album_html = `
        <div id="album-list" class="centered-text">
            <div id="album-list-content">`

        let response = await fetch(`${address}/album/list?page=${page}`)
        let body = await response.text()
        let albums = JSON.parse(body)
        /*
        for(var i = 0; i < albums.length; i++) {
            album = albums[i]
            let coverResponse = await fetch(`${address}/album/cover?id=${album.id}`)
        }*/


        for(var i=0; i < albums.length; i++) {
            album = albums[i]
            album_html += `<div id="album${album.id}" class="album">
                    <img class="album-cover" src="${`${address}/album/cover?id=${album.id}`}">
                    <p class="centered album-text">${album.album_name}</p>
                    <p class="centered album-text">${album.artist}</p>
                    <p class="centered album-text">${album.rating}/100</p>
                </div>
                <div class="btn-group" role="group" aria-label="Basic example">
                <button id="view-info${album.id}" class="btn button-margin album-button">[View Info]</button>
                <button id="view-reviews${album.id}" class="btn button-margin album-button">[View Reviews]</button>
                <button id="leave-review${album.id}" class="btn button-margin album-button">[Leave Review]</button>
                </div>
                <div id="content-space${album.id}">

    

                </div>
                `
        }

        album_html += `
            </div>
        </div>
        `

        let pageCountResponse = await fetch(`${address}/album/pageCount`)
        let pageCount = await pageCountResponse.text()

        album_html += `
                <p>Page ${albumPage} of ${pageCount}</p>
            <div class="btn-group" role="group">
                <button id="prevPage" class="btn page-button button-margin">Prev</button>
                <button id="nextPage" class="btn page-button button-margin">Next</button>
            </div>`

        document.getElementById("page-content").innerHTML = album_html

        for(let i = 0; i < albums.length; i++) {
            document.getElementById(`view-info${albums[i].id}`).addEventListener("click", function() {ShowAlbumInfo(albums[i].id)})
            document.getElementById(`view-reviews${albums[i].id}`).addEventListener("click", function() {ShowAlbumReviews(albums[i].id)})
            document.getElementById(`leave-review${albums[i].id}`).addEventListener("click", function() {ShowLeaveReview(albums[i].id)})
        }
        document.getElementById(`prevPage`).addEventListener("click", function() {ChangeAlbumPage(-1, pageCount); PlaceAlbums(albumPage)})
        document.getElementById(`nextPage`).addEventListener("click", function() {ChangeAlbumPage(1, pageCount); PlaceAlbums(albumPage)})
    }
    catch(err) {
        alert(err)
    }
}

function ChangeAlbumPage(diff, pageCount) {
    albumPage+=diff
    if(albumPage < 1) {albumPage=1}
    if(albumPage > pageCount) {albumPage=parseInt(pageCount)}
    console.log(albumPage)
}


function ShowSearchBar() {
    currentReviewOpen.id = NaN
    currentOpen.id = NaN
    currentOpen.menuType = ""
    document.getElementById("page-content").innerHTML = searchBarHTML;
    document.getElementById("search-form").addEventListener("submit", function() {Search()})
}

async function Search() {
    event.preventDefault()

    try {

        searchForm = document.getElementById(`search-form`)
        const searchData = new FormData(searchForm)
        searchObject = Object.fromEntries(searchData.entries())
        searchTerm = searchObject["search"]
        const response = await fetch(`${address}/search?term=${searchTerm}`)
        let body = await response.text()
        let albums = JSON.parse(body)

        album_html = `
        ${searchBarHTML}
        <div id="album-list" class="centered-text">
            <div id="album-list-content">`

        for(var i=0; i < albums.length; i++) {
            album = albums[i]
            album_html += `<div id="album${album.id}" class="album">
                    <img class="album-cover" src="${address}/album/cover?id=${album.id}" width="150px">
                    <p class="centered album-text">${album.album_name}</p>
                    <p class="centered album-text">${album.artist}</p>
                    <p class="centered album-text">${album.rating}/100</p>
                </div>
                <div class="btn-group" role="group" aria-label="Basic example">
                    <button id="view-info${album.id}" class="btn button-margin album-button" style="margin-top:-70px">[View Info]</button>
                    <button id="view-reviews${album.id}" class="btn button-margin album-button" style="margin-top:-70px">[View Reviews]</button>
                    <button id="leave-review${album.id}" class="btn button-margin album-button" style="margin-top:-70px">[Leave Review]</button>
                </div>
                <div id="content-space${album.id}">

                </div>
                
                `
        }
        

        album_html += `
            </div>
        </div>
        `

        currentReviewOpen.id = NaN
        currentOpen.id = NaN
        currentOpen.menuType = ""
        document.getElementById("page-content").innerHTML = album_html
        document.getElementById("search-form").addEventListener("submit", function() {Search()})
        
        for(let i = 0; i < albums.length; i++) {
            document.getElementById(`view-info${albums[i].id}`).addEventListener("click", function() {ShowAlbumInfo(albums[i].id)})
            document.getElementById(`view-reviews${albums[i].id}`).addEventListener("click", function() {ShowAlbumReviews(albums[i].id)})
            document.getElementById(`leave-review${albums[i].id}`).addEventListener("click", function() {ShowLeaveReview(albums[i].id)})
        }
    }
    catch(err) {
        alert(err)
    }
}

function ShowAddAlbum() {
    currentReviewOpen.id = NaN
    currentOpen.id = NaN
    currentOpen.menuType = ""
    document.getElementById(`page-content`).innerHTML = addAlbumHTML
    document.getElementById(`add-album-form`).addEventListener("submit", function() {SubmitNewAlbum()})
}

async function SubmitNewAlbum() {
    event.preventDefault()
    
    try {

        let albumForm = document.getElementById(`add-album-form`)
        const albumData = new FormData(albumForm)

        inputGood = true
        errorText = ""

        for (const [key, value] of albumData.entries()) {
            if(value == false && !(value === 0 || value === "0")) {
                inputGood = false
                errorText = "Please make sure all fields are filled in"
            }
        }

        if(!inputGood) {
            document.getElementById(`form-status`).innerHTML = `
                <p class="bad-status">${errorText}</p>
            `
            return
        }

        const response = await fetch(`${address}/add_album`, {
            method: "POST",
            body: albumData
        })

        if(response.ok) {
            document.getElementById(`form-status`).innerHTML = `
                <p class="good-status">Album Successfully Submitted</p>
            `
            document.getElementById(`add-album-form`).reset()
        }
        else {
            document.getElementById(`review-status`).innerHTML = `
                <p class="bad-status">${response.statusText}</p>
            `
        }
    }
    catch(err) {
        alert(err)
    }

}

function CloseAlbumMenu() {
    if(isNaN(currentOpen.id)) {
        return;
    }
    currentReviewOpen.id = NaN
    
    document.getElementById(`content-space${currentOpen.id}`).innerHTML = ""
    ResetButton(currentOpen.id, currentOpen.menuType)
    currentOpen.id = NaN;
    currentOpen.menuType=""
}

function ResetButton(id, type) {
    switch(type) {
        case "album-info":
            document.getElementById(`view-info${id}`).innerHTML = "[View Info]"
            break;
        case "reviews":
            document.getElementById(`view-reviews${id}`).innerHTML = "[View Reviews]"
            break;
        case "leave-review":
            document.getElementById(`leave-review${id}`).innerHTML = "[Leave Review]"
            break;
    }
}

// show info for an album
async function ShowAlbumInfo(id) {

    try {
        if(currentOpen.id == id && currentOpen.menuType=="album-info") {
            CloseAlbumMenu();
            return;
        }
        CloseAlbumMenu();

        currentOpen.id = id;
        currentOpen.menuType="album-info"

        document.getElementById(`view-info${id}`).innerHTML = "[Close Info]"

        let response = await fetch(`${address}/album?id=${id}`)
        let body = await response.text()
        let album = JSON.parse(body)

        info_html = `
            <div class = "album-info" style="margin-top:-30px">
                <div class="album-info-text">
                    <p>Year: ${album.year}</p>
                    <p>Genres: ${album.genres}</p>
                    <p>Credits: ${album.credits}</p>
                </div>
            </div>
        `
        document.getElementById(`content-space${id}`).innerHTML = info_html;
    }
    catch(err) {
        alert(err)
    }
}

async function ShowAlbumReviews(album_id) {
    try {
        if(currentOpen.id == album_id && currentOpen.menuType=="reviews") {
            CloseAlbumMenu();
            return;
        }
        CloseAlbumMenu();
        openReviewIDs = []
        currentOpen.id = album_id;
        currentOpen.menuType="reviews"


        document.getElementById(`view-reviews${album_id}`).innerHTML = "[Close Reviews]"

        reviewPage = 1

        let response = await fetch(`${address}/reviews?album_id=${album_id}&page=${reviewPage}`)
        let body = await response.text()
        let albumReviews = JSON.parse(body)

        reviewsHTML = '<div class="reviews" style="margin-top:-50px"> <div id="review-space">'

        if(albumReviews.length == 0) {
            reviewsHTML += `
                <div class="review">
                    <div class="review-text">
                        <p>No Reviews yet. Be the first to review this album!</p>
                    </div>
                </div>
            `
        }

        else{

            for(i = 0; i < albumReviews.length; i++) {
                review = albumReviews[i]
                reviewsHTML += `
                    <div id=review${review.id} class="review">
                        <div class="review-text">
                            <p>${review.rating}/100</p>
                            <p>${review.title}</p>
                            <div id="review-content${review.id}">

                            </div>
                            <small>${review.author}</small>
                        </div>
                    </div>
                    `
            }
        }
        reviewsHTML += `

        </div>
        <div id ="view-more-reviews-div">
            <button id="view-more-reviews" class="btn button-margin">[View More]</button>
        </div>
        </div>`
        document.getElementById(`content-space${album_id}`).innerHTML = reviewsHTML;

        for(let i = 0; i < albumReviews.length; i++) {
            openReviewIDs.push(albumReviews[i].id)
            document.getElementById(`review${albumReviews[i].id}`).addEventListener("click", function() {ShowReviewInfo(albumReviews[i].id)})
        }
        document.getElementById(`view-more-reviews`).addEventListener("click", function() {ChangeReviewPage(1); ViewMoreReviews(album_id)})
    }
    catch(err) {
        alert(err)
    }
}

async function ViewMoreReviews(album_id) {
    try {
        let response = await fetch(`${address}/reviews?album_id=${album_id}&page=${reviewPage}`)
        let body = await response.text()
        let albumReviews = JSON.parse(body)

        reviewsHTML = ""

        for(i = 0; i < albumReviews.length; i++) {
            review = albumReviews[i]
            reviewsHTML += `
                <div id=review${review.id} class="review">
                    <div class="review-text">
                        <p>${review.rating}/100</p>
                        <p>${review.title}</p>
                        <div id="review-content${review.id}">

                        </div>
                        <small>${review.author}</small>
                    </div>
                </div>
                `
        }
        if(albumReviews.length == 0) {

            document.getElementById(`view-more-reviews-div`).innerHTML = ""
        }
        
        document.getElementById(`review-space`).innerHTML = document.getElementById(`review-space`).innerHTML+reviewsHTML;

        for(let i = 0; i < albumReviews.length; i++) {
            openReviewIDs.push(albumReviews[i].id)
        }
        for(let i = 0; i < openReviewIDs.length; i++) {
            document.getElementById(`review${openReviewIDs[i]}`).addEventListener("click", function() {ShowReviewInfo(openReviewIDs[i])})
        }
    }
    catch(err) {
        alert(err)
    }
}

function ChangeReviewPage(diff) {
    reviewPage += diff
    if(reviewPage < 1) {reviewPage = 1}
}

async function ShowReviewInfo(id) {
    try {
        let reviewHTML = ``

        if(currentReviewOpen.id == id) {
            CloseCurrentReview()
            return;
        }
        CloseCurrentReview()


        currentReviewOpen.id = id

        console.log(id)

        let response = await fetch(`${address}/review?id=${id}`)
        let body = await response.text()
        let review = JSON.parse(body)
        
        reviewHTML = `
            <p>${review.content}</p>
        `
        document.getElementById(`review-content${id}`).innerHTML = reviewHTML
    }
    catch(err) {
        alert(err)
    }
}

function CloseCurrentReview() {
    if(isNaN(currentReviewOpen.id)) {
        return;
    }
    document.getElementById(`review-content${currentReviewOpen.id}`).innerHTML = ``
    currentReviewOpen.id = NaN
}

function ShowLeaveReview(id) {
    if(currentOpen.id == id && currentOpen.menuType=="leave-review") {
        CloseAlbumMenu();
        return;
    }
    CloseAlbumMenu(); 
    currentOpen.id = id;
    currentOpen.menuType="leave-review"

    document.getElementById(`leave-review${id}`).innerHTML = "[Close Review]"


    leaveReviewHTML = `
        <div id="leave-review${id}" class="leave-review" style="margin-top:-30px">
            <form id="review-form${id}">
                <div class="leave-review-element">
                    <label for="author">Name:</label><br>
                    <input class="form-control" name="author" type="text" placeholder="Enter your name"><br>
                </div>
                <div class="leave-review-element">
                    <label for="rating">Rating: <br></label><br>
                    <input class="form-control" name="rating" type="number" min="0" max="100" placeholder="Enter Rating (from 1-100)"><br>
                    </div>
                 <div class="leave-review-element">
                    <label for="title">Review Title:</label><br>
                    <input class="form-control" name="title" type="text" placeholder="Enter Review Title"><br>
                </div>
                <div class="leave-review-element">
                    <label for="content">Review:</label><br>
                    <textarea class="form-control" name="content" rows="5" placeholder="Enter Review"></textarea><br>
                </div>
                <div class="leave-review-element">
                    <input class="btn button-margin" type="submit" value="Submit">
                </div>
               <div id="review-status">

               </div>
            </form>
        </div>
    `

    document.getElementById(`content-space${id}`).innerHTML = leaveReviewHTML;

    document.getElementById(`review-form${id}`).addEventListener("submit", function() {SubmitReview(id)})
}

async function SubmitReview(id) {
    event.preventDefault()

    try {

        reviewForm = document.getElementById(`review-form${id}`)

        const reviewData = new FormData(reviewForm)
        reviewObj = Object.fromEntries(reviewData.entries())
        reviewObj["album_id"] = id
        const reviewJSON = JSON.stringify(reviewObj)

        //tests if form input is good

        let errorText = ""
        let inputGood = true
        for(const [key, value] of Object.entries(reviewObj)) {
            if(value == false && !(value === 0 || value === "0")) {
                inputGood = false
                errorText = "Please make sure all fields are filled in"
            }
            if(key == "rating") {
                if(value < 0 || value > 100) {
                    inputGood = false
                    if(errorText == "") {
                        errorText = "Rating must be between 0 and 100"
                    }
                }
            }
        }

        if(!inputGood) {
            document.getElementById(`review-status`).innerHTML = `
                <p class="bad-status">${errorText}</p>
            `
            return
        }

        const response = await fetch(`${address}/post_review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: reviewJSON
        })



        if(response.ok) {
            document.getElementById(`review-status`).innerHTML = `
                <p class="good-status">Review Successfully Submitted</p>
            `
            document.getElementById(`review-form${id}`).reset()
        }
        else {
            document.getElementById(`review-status`).innerHTML = `
                <p class="bad-status">${response.statusText}</p>
            `
        }
    }
    catch(err) {
        alert(err)
    }
}

document.getElementById("search-albums-button").addEventListener("click", function() {ShowSearchBar()})
document.getElementById("album-list-button").addEventListener("click", function() {albumPage = 1; PlaceAlbums(albumPage)})
document.getElementById("add-album-button").addEventListener("click", function() {ShowAddAlbum()})


PlaceAlbums(albumPage);