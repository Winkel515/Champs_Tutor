document.addEventListener("DOMContentLoaded", getTutor());

function getTutor(){ // Gets tutor from /tutors and sets it up for Vue
  // *************************************** GET REQUEST TO /tutors ROUTE ****************************
  let pathName = window.location.pathname;
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
        password: ""
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
        }
      }
      
  });
}

