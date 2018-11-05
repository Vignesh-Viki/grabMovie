  function likedislikeop(id,op){
    // alert("hey1")
    var str;
    str = '#' + op + id
    // alert($(str).attr('class'))

    if($(str).attr('class').indexOf('btn-primary')==-1)
      addORremove = 'add'
    else
      addORremove = 'remove'
    var data = {};
    data.op = op
    data.addORremove = addORremove
    data.id = id
    data.user = (location.href).split("=")[1];
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/likeDislikeOperation',            
        success: function(data) {
          if(data=="success"){
            if(addORremove == 'add'){
              $('#like'+id).removeClass("btn-primary");
              $('#dislike'+id).removeClass("btn-primary");
              $(str).addClass("btn-primary");
            }else{
              // console.log("hi")
               $(str).removeClass("btn-primary");
            }
          }
        }
    });
  }

  function loadLatestMovie(){
    searchURL = "https://api.themoviedb.org/3/discover/movie?api_key=82fcbf7b36ecd002c7e286194ee9c0f1";
    displayMovie(searchURL);
  }

  function getPref(){
    // alert("hey")
      url_ = 'getPref?username=' + (location.href).split("=")[1];
      $.ajax({
        type: 'GET',
        url: url_,            
        success: function(data) {
          $('#likedMovie').val(data.likedMovie);
          $('#dislikedMovie').val(data.dislikedMovie);
          loadLatestMovie();
        }
      });
  }

  function displayMovie(searchURL){

        $.ajax({url: searchURL,method:"GET",success: function(result){

            $("#displayMovie").html("");
            $("#displayUserdetails").html("");
            var movies = result["results"]

            totalMovieCount = result["total_results"]
            displayCount = (totalMovieCount>10)? 10 : totalMovieCount;

            for (var i = 0; i < displayCount ; i++) {
              id = movies[i]["id"]
              title = movies[i]["original_title"]
              overview = movies[i]["overview"]
              content = $("#displayMovie").html();
              like = "like"
              dislike = "dislike"
              content += '<br><div style="border: 1px solid;">  <h3>' + title + '</h3> <br> ' + overview + ' <br> <button onclick="likedislikeop(' + 
              id + ',' + like + ')"  id="like' + id + '" class="btn-default">like</button> <button  onclick="likedislikeop(' + id + ',' + dislike + ')" id="dislike' + id + '" class="btn-default">dislike</button> </div>'

              $("#displayMovie").html(content)
            }

            likedMovie = $('#likedMovie').val().split(" ");
            dislikedMovie = $('#dislikedMovie').val().split(" ");

            var i;
            for (i = 0; i < likedMovie.length; i++) {
                str = "#like" + likedMovie[i]
                $(str).addClass("btn-primary");
            }
            for (i = 0; i < dislikedMovie.length; i++) {
                str = "#dislike" + dislikedMovie[i]
                $(str).addClass("btn-primary");
            }

        }});
  }

  function getGenres(){
    
    searchURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=82fcbf7b36ecd002c7e286194ee9c0f1";
    
    $.ajax({url: searchURL,method:"GET",success: function(result){
            
            genres = result["genres"]
            var content = $("#genre").html();

            for (var i = 0; i < 10 ; i++) {
              content += '<option id="' + genres[i]['id'] + '" value="' + genres[i]['id'] + '"> ' + genres[i]['name'] + ' </option>'
              $("#genre").html(content)
            }
    }});    

  }

  $(document).ready(function(){

    getPref();

    getGenres();

    $("#search").click(function(){      

      query = $("#search__").val();
      searchURL = "https://api.themoviedb.org/3/search/movie?api_key=82fcbf7b36ecd002c7e286194ee9c0f1&query=" + query;
      displayMovie(searchURL);  

    })

    $( "#genre" ).change(function() {
      id = $("select option:selected").val()
      // alert(id)
      searchURL = "https://api.themoviedb.org/3/discover/movie?api_key=82fcbf7b36ecd002c7e286194ee9c0f1&with_genres=" + id
      displayMovie(searchURL);  
    });

    // $().c(function(){

    //   genreid = "https://api.themoviedb.org/3/discover/movie?api_key=82fcbf7b36ecd002c7e286194ee9c0f1&with_genres=" + 28
    // })


    $('#userdetails').click(function(){

      $("#displayMovie").html("");
      $("#displayUserdetails").html("");

      var user = (location.href).split("=")[1];
      url_ = '/userdetails?username=' + user

      $.ajax({
          type: 'GET',
          url: url_,            
          success: function(data) {
            content = '<div> <b>Username</b> : ' + data.username + '<br> <b>Email</b> : ' + data.email + '<br> <b>Liked Movie Count</b> : ' + data.likedMovieCount + '<br> <b>Disliked Movie Count</b> : ' + data.dislikedMovieCount + ' </div>'
            $("#displayUserdetails").html(content)
          }
      });

    })


  });
