// axios.get("/tutors")
//   .then(response => tutorsVue(response.data.tutors))
//   .catch(e => console.log(e))

// document.addEventListener("DOMContentLoaded", getTutors());

// function getTutors(){ // Gets tutors from /tutors and sets it up for Vue
//   // *************************************** GET REQUEST TO /tutors ROUTE ****************************
//   var xmlhttp = new XMLHttpRequest();
//   xmlhttp.open("GET", "/tutors", true);
//   xmlhttp.send();
//   xmlhttp.onreadystatechange = function() {
//       if (this.readyState == 4 && this.status == 200) {
//           var tutors = JSON.parse(this.responseText).tutors; // Setting up the tutors array
//           tutorsVue(tutors) // Injects the tutors array into the Vue object
//       };
//   };
// };

// // ------------------------------------------
// //  FETCH FUNCTIONS
// // ------------------------------------------

  fetch('/tutors')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => tutorsVue(data.tutors)) // Injects tutors array into the Vue object
    .catch(error => console.log('Looks like there was a problem', error))

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

function tutorsVue(tutors){
  const app = new Vue({
      el: '#tutorList',
      data: {
        tutors,
        subject: 'All Subjects',
        price: 'All Prices',
        email:"",
        password:"",
        isSignedIn: false,
        invalidCredentials: false,
        screenSize: window.screen.width
      },
      methods: {
        signIn: function (e) {
          e.preventDefault();
          this.invalidCredentials = false;
          
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
              this.isSignedIn = true;
              $('#signIn').modal('hide');
            }).catch(response => { // Runs when there's an invalid input
              response.then(e => {
                console.log(JSON.parse(e));
                this.invalidCredentials = true;
              })
            });
        },
        filterSubject: function(){
           /* Filter Subjects */ 
          console.log(this.screenSize);
          this.subject = event.target.value;

          console.log("Subject:", this.subject);
          console.log("Price:", this.price);
        },
        filterPrice: function(){
          /* Filter Prices */
          var priceIndex = event.target.value;
          const prices = [10,20,30,40,50];
          if (priceIndex != "All Prices") 
          this.price = prices[priceIndex];
          else 
          this.price = priceIndex;
          console.log("Subject:", this.subject);
          console.log("Price:", this.price);
        },
        logOut: function(){
          localStorage.clear();
          this.isSignedIn = false;
            $('#logOut').modal('hide');
        }
      },
      beforeMount() { // Called right before the mounting begins: the render function is about to be called for the first time.this checks local storage
          if (localStorage.getItem('token')) {
            this.isSignedIn = true;
          }  
          console.log(localStorage.getItem('token'));
      
      }, 
      computed: {
          subjectList:function() {
              return  ['Calculus I', 'Calculus II', 'Calculus III','Mechanics', 'Electricity & Magnetism','Waves and Optics']
          },
          priceList:function() {
            return  [10,20,30,40,50];
          }
      }
  });
}


