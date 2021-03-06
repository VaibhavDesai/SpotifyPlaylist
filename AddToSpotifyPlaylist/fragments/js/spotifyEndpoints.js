function searchTrack(query) {

    jQuery.ajax({

        type:'GET',
        async: false,
        url: search_url,
        headers:{
            'Authorization':"Bearer "+localStorage.getItem('access_token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        data:{

            'q':query,
            'type':'track'
        },

        success: function(responseText) {
            console.log(responseText);
            track_0 = responseText['tracks']['items'][0];
            console.log(track_0);
            if(track_0 == null){
                console.log("asdfsfds");
                document.getElementById('results_div').innerHTML="<h3>Track not found. Try with a different keyword.</h3>";
            }
            else{
                artist = responseText['tracks']['items'][0]['artists'][0]['name'];
                document.getElementById('results_div').innerHTML="<h3>Track:"+track_0['name']+"-"+artist+"</h3>";
                localStorage.setItem("track_uri", track_0['uri']);
                updateUIWithPlaylists();
            }
            $(results_div).show();
        },

        error: function (response) {
        }

    });
}

function getUserDetails() {

    jQuery.ajax({

        type:'GET',
        url: user_url,
        async: false,
        headers:{
            'Authorization':"Bearer "+localStorage.getItem('access_token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        success: function(responseText) {

            console.log(responseText);
            localStorage.setItem('user_name', responseText['display_name']);
            localStorage.setItem('user_id', responseText['id']);
        },

        error: function (response) {

            var access_token_expires_in = parseInt(localStorage.getItem("access_token_expires_in"));

            if (response['status'] == '401' && access_token_expires_in < Date.now()){
                getRefreshToken(getUserDetails);
            }

            else{
                console.log("There is a error in getUserDetails()");
            }
        }

    });

}

function getPlaylists() {

    jQuery.ajax({

        type:'GET',
        url: playlist_url,
        headers:{
            'Authorization':"Bearer "+localStorage.getItem('access_token'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },

        success: function(responseText) {

            var playlists = [];

            responseText.items.forEach(function(playlist, index) {

                playlists.push({
                    playlist_id: playlist['id'],
                    playlist_name: playlist['name']
                });

            });

            localStorage.setItem('playlists', JSON.stringify(playlists));
            console.log(playlists);
        },

        error: function (response) {

            var access_token_expires_in = parseInt(localStorage.getItem("access_token_expires_in"));

            if (response['status'] == '401' && access_token_expires_in < Date.now()){
                getRefreshToken(getPlaylists);
            }

            else{
                console.log("There is a error in getPlaylists()");
            }
        }
    });

}

function addToPlaylist(playlist_id) {

    url = "https://api.spotify.com/v1/users/"+localStorage.getItem('user_id')+'/playlists/'+playlist_id+'/tracks';

    jQuery.ajax({

        type:'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers:{
            'Authorization':"Bearer "+localStorage.getItem('access_token'),
            'Content-Type': 'application/json'
        },

        data:JSON.stringify({'uris':[localStorage.getItem('track_uri')]}),

        success: function(responseText) {
            console.log("added to the playlist playlist Id"+playlist_id);
            updatePlaylistButton(playlist_id);
        }

    });
}