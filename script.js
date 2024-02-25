/* Konstruktor */

class Music {
    constructor(id, name, authors, resource, coverart){
        this.id = id;
        this.name = name;
        this.authors = authors;
        this.resource = resource;
        this.coverart = coverart;
    }
}

let selected_song = 0, repeat_song = false, playing = false, showList = false;

let songs = [
    new Music(1, "Crab Rave", "Noisestorm", "resources/music/crabrave.mp3", "resources/coverarts/crabrave.jpg"),
    new Music(2, "Mortals", "Warriyo (feat. Laura Brehm)", "resources/music/mortals.mp3", "resources/coverarts/mortals.jpg"),
    new Music(3, "Fearless pt. II", "Lost Sky (feat. Chris Linton)", "resources/music/fearless.mp3", "resources/coverarts/fearless.jpg"),
    new Music(4, "Nekozilla", "Different Heaven", "resources/music/nekozilla.mp3", "resources/coverarts/nekozilla.jpg")
];

songs.forEach(element => {
    let song = document.createElement("li");
    song.innerText = `${element.name} - ${element.authors}`
    song.setAttribute("data-song", element.id - 1)
    
    song_list.appendChild(song);
});

function loadSong(selected_song){
    player.setAttribute("src", songs[selected_song].resource);
    song_title.innerText = songs[selected_song].name;
    song_author.innerText = songs[selected_song].authors;
    song_coverart.src = songs[selected_song].coverart;
    document.querySelectorAll("li").forEach(li => {
        li.classList.remove("playing")
        if(li.getAttribute("data-song") == selected_song)
            li.classList.add("playing");
    });
    player.play();
    document.getElementsByClassName("body")[0].style.backgroundImage = `url('${songs[selected_song].coverart}')`
}

let elements = document.querySelectorAll("li");
elements.forEach(song => {
    song.addEventListener("click", function(){
        selected_song = song.getAttribute("data-song");
        loadSong(selected_song);
    });
})

player.addEventListener("canplay", function(){
    time_playingbar.max = Math.floor(player.duration)
    time_playingbar.value = 0

    let seconds = player.duration % 60 < 10 ? "0" + parseInt(player.duration % 60) : parseInt(player.duration % 60)
    song_length.innerText = parseInt(player.duration / 60) + ":" + seconds
});

player.addEventListener("timeupdate", function() {
    let seconds = player.currentTime % 60 < 10 ? "0" + parseInt(player.currentTime % 60) : parseInt(player.currentTime % 60)
    time_playing.innerText = parseInt(player.currentTime / 60) + ":" + seconds
    time_playingbar.value = player.currentTime
});

player.addEventListener("ended", function(){
    if(!repeat_song)
        selected_song = selected_song == songs.length - 1? 0 : (selected_song % 3) + 1;

    loadSong(selected_song);
})

repeat.addEventListener("click", function(){
    if(!repeat_song) {
        document.querySelector(".fa-repeat").classList.add("repeat-on");
        repeat_song = true;
    } else {
        document.querySelector(".fa-repeat").classList.remove("repeat-on");
        repeat_song = false;
    }
});

play.addEventListener("click", function() {
    if(player.paused)
        player.play();
    else 
        player.pause();
});

time_playingbar.addEventListener("change", () => { player.currentTime = time_playingbar.value });

next.addEventListener("click", function(){
    selected_song = selected_song == songs.length - 1? 0 : (selected_song % 3) + 1;
    loadSong(selected_song);
});

back.addEventListener("click", function(){
    selected_song = selected_song == 0 ? songs.length - 1 : (selected_song % 3) - 1;
    loadSong(selected_song);
});

forward.addEventListener("click", function(){
    player.currentTime += (player.duration > player.currentTime + 10) ? 10 : 0;
    time_playingbar.value += (player.duration > player.currentTime + 10) ? 10 : 0;
});

backward.addEventListener("click", function(){
    player.currentTime -= (0 < player.currentTime - 10) ? 10 : 0;
    time_playingbar.value -= (0 < player.currentTime - 10) ? 10 : 0;
})

list.addEventListener("click", function(){
    if(!showList){
        document.querySelector(".list").style.display = "inline-block";
        document.querySelector(".fa-list").classList.add("open-list");
        showList = true;
    } else {
        document.querySelector(".list").style.display = "none";
        document.querySelector(".fa-list").classList.remove("open-list");
        showList = false;
    }
});

setInterval(function(){
    if(!player.paused){
        play_icon.classList.remove("fa-play");
        play_icon.classList.add("fa-pause");
    } else {
        play_icon.classList.remove("fa-pause");
        play_icon.classList.add("fa-play");
    }
}, 1000);

loadSong(selected_song);

console.log("Done!")

