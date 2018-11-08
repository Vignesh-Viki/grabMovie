  function likedislikeop(id,op){
    // alert("hey1")
    var str;
    str = '#' + op + id
    // alert($(str).attr('class'))

    if($(str).attr('class').indexOf('btn-success')==-1)
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
              var temp;
              $('#like'+id).removeClass("btn-success");
              $('#dislike'+id).removeClass("btn-success");
              $(str).addClass("btn-success");

              temp = '#likedMovie'
               content = $(temp).val()
               id = ' ' + id
               content = content.replace(id,"")
               $(temp).val(content)
              
              temp = '#dislikedMovie'
               content = $(temp).val()
               id = ' ' + id
               content = content.replace(id,"")
               $(temp).val(content)

              temp = '#' + op + 'dMovie'
              content = $(temp).val()
              content += ' ' + id
              $(temp).val(content)

            }else{
              console.log("hi")
               $(str).removeClass("btn-success");
               temp = '#' + op + 'dMovie'
               content = $(temp).val()
               id = ' ' + id
               content = content.replace(id,"")
               $(temp).val(content)
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
              ratings = movies[i]["vote_average"]
              rdate = movies[i]["release_date"]
              content = $("#displayMovie").html();
              like = "like"
              dislike = "dislike"
              content += '<br><div style="border: 1px solid;">  <h3>' + title + '</h3> <br> ' + overview + ' <br><br> <b>Ratings:</b> '+ ratings +'<br> <br> <b>Release Date:</b> '+ rdate +' <br> <button onclick="likedislikeop(' + 
              id + ',' + like + ')"  id="like' + id + '" class="btn-default">like</button> <button  onclick="likedislikeop(' + id + ',' + dislike + ')" id="dislike' + id + '" class="btn-default">dislike</button> </div>'

              $("#displayMovie").html(content)
            }

            likedMovie = $('#likedMovie').val().split(" ");
            dislikedMovie = $('#dislikedMovie').val().split(" ");

            var i;
            for (i = 0; i < likedMovie.length; i++) {
                str = "#like" + likedMovie[i]
                $(str).addClass("btn-success");
            }
            for (i = 0; i < dislikedMovie.length; i++) {
                str = "#dislike" + dislikedMovie[i]
                $(str).addClass("btn-success");
            }

        }});
  }

  function getGenres(){
    
    searchURL = "https://api.themoviedb.org/3/genre/movie/list?api_key=82fcbf7b36ecd002c7e286194ee9c0f1";
    
    $.ajax({url: searchURL,method:"GET",success: function(result){
            
            genres = result["genres"]
            var content = $("#genre").html();

            for (var i = 0; i < genres.length ; i++) {
              content += '<option id="' + genres[i]['id'] + '" value="' + genres[i]['id'] + '"> ' + genres[i]['name'] + ' </option>'
              $("#genre").html(content)
            }
    }});    

  }


  function getRegion(){

    console.log("hr")
    
    searchURL = "https://pkgstore.datahub.io/core/country-list/data_csv/data/d7c9d7cfb42cb69f4422dec222dbbaa8/data_csv.csv"    
    $.ajax({url: searchURL,method:"GET",success: function(result){
            

          regions = result.split("\n")
          // alert(regions.length)
          var content = $("#region").html();

          for (var i = 1; i < regions.length ; i++) {
              region = regions[i].split(',')
              content += "<option id='" + region[0] + "' value='" + region[1] + "'> " + region[0] + " </option>"
              $("#region").html(content)
            }


    }});    

  }




  $(document).ready(function(){

    getRegion()

    getPref();

    getGenres();

    $("#search").click(function(){      

      query = $("#search__").val();
      searchURL = "https://api.themoviedb.org/3/search/movie?api_key=82fcbf7b36ecd002c7e286194ee9c0f1&query=" + query;
      displayMovie(searchURL);  

    })

    $( "#genre" ).change(function() {
      id = $("p1 select option:selected").val()
      // alert(id)
      searchURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.asc&api_key=82fcbf7b36ecd002c7e286194ee9c0f1&with_genres=" + id
      displayMovie(searchURL);  
    });


    $( "#region" ).change(function() {
      id = $("p2 select option:selected").val()
      searchURL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.asc&api_key=82fcbf7b36ecd002c7e286194ee9c0f1&region=" + id
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
