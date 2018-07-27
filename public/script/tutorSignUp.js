
const sunmitButton = document.getElementById('submitButton');
sunmitButton.addEventListener('click', postData);

function postData(e) {
    e.preventDefault(); 
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const credentials = document.getElementById('credentialsInput').value;
    const availabilities = document.getElementById('availabilitiesInput').value;
    const subjects = document.getElementById('subjects').value;
     
     const config = {
    method: 'POST' ,
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({name, email, password, credentials, availabilities, subjects}) 
   };
     
   fetch('/tutors/signup', config)
         .then(checkStatus)
         .then(response => {
               console.log('JSON Web Token:', response.headers.get('x-auth')); // Get the JWT from the response header (Used to identify user). Store it in localStorage/Cookie/idk you choose
            //    location.href = '/' // Redirects the user upon successful signup. Link can be changed (currently redirects to main page)
         }).catch(e => {
            console.log(e) // Do something upon UNsuccessful signup (currently only logs in console)
      })
   }

   function checkStatus(response){
    if(response.ok){
       return Promise.resolve(response); 
    } else{
     return Promise.reject(response.text());
    }
   }

//    -------------------
//    TUTOR VUE.JS FOR FORM VALIDATION
// ----------------------

const app = new Vue({
    el: '#form',
    data: {
      name: "",
      nameError: false,
      email: "",
      emailError: false,
      password: "",
      passwordError:false
    },
    methods: {
      checkForm: function (e) {
         
        this.nameError = this.name.length === 0;
    
        this.emailError = !this.validEmail(this.email);
        
        this.passwordError = this.password.length < 8;
        
        e.preventDefault();
      },
      validEmail: function (email) {
         console.log(email); 
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        console.log(re.test(email));
        return re.test(email);
        
      }
    }
  })