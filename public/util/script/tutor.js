const pathName = window.location.pathname;
document.addEventListener("DOMContentLoaded", getTutor(pathName));


function getTutor(pathName){ // Gets tutor from /tutors and sets it up for Vue
  // *************************************** GET REQUEST TO /tutors ROUTE ****************************
  
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", '/tutors' + pathName, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var tutor = (JSON.parse(this.responseText).tutor);
          tutorsVue(tutor) // Injects the tutors array into the Vue object
      };
  };
};
// btw were using fetch and ajax requests in same file, is that good practice???
// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------

function checkStatus(response){
  if(response.ok){
     return Promise.resolve(response); 
  } else{
   return Promise.reject(response.text()); 
  }
 }

// ------------------------------------------
//  Vue.js template
// ------------------------------------------


function tutorsVue(tutor){
  const app = new Vue({
      el: '#tutorProfile',
      data: {
        tutor: tutor,
        email: "",
        password: "",
        reviewer: "",
        rating: null,
        ratingComments: "",
        reviewPosted: true,
        ratingError: false
      },
      methods: {
        signIn: function (e) {
          e.preventDefault();
          
            const config = {
                method: 'POST' ,
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({ 
                  email : this.email,
                  password : this.password, 
                }) 
            };
            fetch('/tutors/login', config).then(checkStatus)
            .then(response => { // Runs when all inputs are good
              localStorage.setItem('token', response.headers.get('x-auth'));
              console.log(response.headers.get('x-auth')); // Logging the JWT for now. Can be stored in sessionStorage or localStorage
            }).catch(response => { // Runs when there's an invalid input
              response.then(e => {
                console.log(JSON.parse(e));
              })
            });
        },
        postReview: function(e){
          e.preventDefault();

          if(this.reviewer === "") this.reviewer = "Anonymous";
          this.ratingError = this.rating === null; 
          
          if (this.ratingError === false) {
            const config = {
                method: 'POST' ,
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({ 
                  reviewer : this.reviewer,
                  rating: this.rating, 
                  text: this.ratingComments
                }) 
            };
            fetch(`/tutors${pathName}/reviews`, config).then(checkStatus)
            .then(response => { // Runs when all inputs are good
                console.log(response);
            }).catch(response => { // Runs when there's an invalid input
              response.then(e => {
                console.log(JSON.parse(e));
              })
            });
            
            document.location.reload();

            
             
          }
        }
      }
      
  });
}

