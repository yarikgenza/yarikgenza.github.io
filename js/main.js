///////
///////
///////                           ∧                     ∧  
///////                          ∧∧                    ∧∧  
///////                         ∧  ∧                  ∧  ∧   
///////                        ∧    ∧                ∧    ∧  
///////                       ∧      ∧              ∧      ∧  
///////                      ∧        ∧∧∧∧∧∧∧∧∧∧∧∧∧        ∧        
///////                    (((                               )))
///////                   (((      ∧                  ∧       )))
///////                  (((      ∧ ∧               ∧ ∧        )))
///////                 (((      ∧   ∧             ∧   ∧        )))
///////         ========(((                                      )))========
///////      ===========(((                                      )))===========
///////         ========(((              (      )                )))========
///////                  (((              (    )                )))
///////                   (((                                  )))
///////                    (((                                )))
///////               ∧∧∧                                     ∧∧∧
///////              ∧    ∧                                  ∧     ∧
///////             ∧      ∧                                ∧       ∧
///////             ∧      ∧                                ∧       ∧
///////
///////
///////
///////



$(document).ready(function(){   
    
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('#scroller').fadeIn();
        } else {
            $('#scroller').fadeOut();
        }
    });
    $('#scroller').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 400);
        return false;
    });
});


// Helping functions
var upper = (str) => {
    return str[0].toUpperCase() + str.slice(1);
}

var eId = (id) => {
    if(id.length == 1) {
        return `00${id}`
    } else if(id.length == 2) {
        return `0${id}`
    } else {
        return id;
    }
}

var delType = () => {
    added = true;
    $('#list').remove();
    $('.col-md-5').append('<div id="list"></div>');
    renderList(chunck);
}

//


// functional variables

let chunck;
let next = "";
let added = true;

//


// API functions

(function getChunkList() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokeapi.co/api/v1/pokemon/?limit=12", true);
    xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
      chunck = JSON.parse(xhr.responseText);
      renderList(JSON.parse(xhr.responseText));
  }
 }
    xhr.send();
}())

var getSinglePokemon = (id) => {
    
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://pokeapi.co/api/v1/pokemon/" + id, true);
    xhr.onreadystatechange = function() {
  if (xhr.readyState == 4) {
      renderSinglePokemon(JSON.parse(xhr.responseText));
  }
 }
    xhr.send();
    
}

var more = () => {
    $('.btn-block').text("loading...");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", next, true);
    xhr.onreadystatechange = function() {
  if (xhr.readyState == 4 && xhr.status == 200) {
      renderList(JSON.parse(xhr.responseText));
      $('.btn-block').text("load more");
  }
 }
    xhr.send();               
}

//


// Render functions


var renderList = (data) => {
    
    $('#cbutton').remove();
    
    
    //init next page url
    next = `https://pokeapi.co${data.meta.next}`;
    let renddata = '';
    let typesList = '';

    
    for(var i = 0; i < data.objects.length; i++) {
        
        //build types list
        for(var j = 0; j < data.objects[i].types.length; j++) {
        
        typesList += `<div onclick="filterType('${data.objects[i].types[j].name}')" id='char' class='char_${data.objects[i].types[j].name} type'>${upper(data.objects[i].types[j].name)}</div>`;
       }
    
         // build template
    renddata += `<a href='#' onclick='getSinglePokemon(${data.objects[i].national_id})'><div class='article' id='${data.objects[i].national_id}'> <img src='https://pokeapi.co/media/img/${data.objects[i].national_id}.png'></img><span class='name'>${data.objects[i].name}</span></a>${typesList}</div>`
    
       typesList = '';
    }
    
    //render
    $('.loader').fadeOut(500, function() {
    $('#list').append(renddata);
    if(added) {
    $('.col-md-5').append('<button type="button" class="btn btn-primary btn-lg btn-block" id="more" onclick="more()">Load more</button>');
        added = false;
    }
    });
}



var renderSinglePokemon = (data) => {
    
    //remove previos pokemon
    $('.pokeImg').remove();
    $('.pokeName').remove();
    $('.table').remove();
    
    let renddata = '';
    let typesList = ''
    
    for(var j = 0; j < data.types.length; j++) {
        
        if(j > 0) { typesList += ", " }
        
        typesList += upper(data.types[j].name);
        
    }
    
    renddata += `
        
        <div class="pokeImg"><img src='https://pokeapi.co/media/img/${data.national_id}.png'></img></div>
        <div class="pokeName"><h3>${data.name} #${eId((data.national_id).toString())}</h3></div>
        <table class="table table-striped">
            <tbody>
            <tr>
                <td>Type</td>
                <td>
                    ${typesList}
                </td>
            </tr>
            <tr>
                <td>Attack</td>
                <td>${data.attack}</td>
            </tr>
            <tr>
                <td>Defense</td>
                <td>${data.defense}</td>
            </tr>
            <tr>
                <td>HP</td>
                <td>${data.hp}</td>
            </tr>
            <tr>
                <td>SP Attack</td>
                <td>${data.sp_atk}</td>
            </tr>
            <tr>
                <td>SP Defense</td>
                <td>${data.sp_def}</td>
            </tr>
            <tr>
                <td>Speed</td>
                <td>${data.speed}</td>
            </tr>
            <tr>
                <td>Weight</td>
                <td>${data.weight}</td>
            </tr>
            <tr>
                <td>Total moves</td>
                <td>${data.moves.length}</td>
            </tr>
            </tbody>
        </table> `

$('#single').append(renddata);
    
}


var filterType = (typeName) => {
    
    let filtedData = '';
    let typesList = '';
    let detected = false;
    
    for(var i = 0; i < chunck.objects.length; i++) {
        
            for(var x = 0; x < chunck.objects[i].types.length; x++) {
                if(chunck.objects[i].types[x].name === typeName) {
                    detected = true;
                } else {
                    detected = false;
                }
            
        
         if(detected === true) {       
             //build types list
             for(var j = 0; j < chunck.objects[i].types.length; j++) {
        typesList += `<div onclick="filterType('${chunck.objects[i].types[j].name}')" id='char' class='char_${chunck.objects[i].types[j].name} type'>${upper(chunck.objects[i].types[j].name)}</div>`;
             }
              
         //build template
    filtedData += `<a href='#' onclick='getSinglePokemon(${chunck.objects[i].national_id})'><div class='article' id='${chunck.objects[i].national_id}'><img src='https://pokeapi.co/media/img/${chunck.objects[i].national_id}.png'></img><span class='name'> ${chunck.objects[i].name}</span></a>${typesList}</div>`
    
       typesList = '';
       detected = false;
            } 
       }
    }
                
//rend  
   $('#list').html('');
   $('#more').remove();
   $('#list').append(filtedData);
   $('.col-md-5').prepend(`<button type="button" id="cbutton" onclick="delType()" class="btn btn-primary"><div id="close">${upper(typeName)} X</div></button>`);
}












