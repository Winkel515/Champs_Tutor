
console.log('hello');
$(document).ready(function(){

    var list = ['John', 'Sam', 'Jake', 'Dan'];
    console.log('hello');

    var appendDiv = ''; 
    
    function randomPicture() {
        var pics = ['ecma.png', 'jay.png', 'json.png', 'robbie.png', 'vivianne.png'];
        let index = Math.random()*4;
        console.log(index);
        return pics[index];
    }
    

for(let i = 0; i<list.length-1; i++){
 
    appendDiv += 
   ` <div class="col-md-6 col-lg-4">
        <div class="card mb-3">
            <img class="card-img-top" src="img/json.png" alt="${list[i]}">
            <div class="card-body">
                <h4 class="card-title">${list[i]}</h4>
                <p class="card-text">Vivianne is a web developer and teacher who is passionate about building scalable, data-driven web apps, especially ones that address old problems with new tech!</p>
                <button type="button" class="btn btn-dark">View Profile</button>
            </div>
          </div>
    </div>`;
    
}

$('.row').append(appendDiv);

});



