
const sunmitButton = document.getElementById('submitButton');
sunmitButton.addEventListener('click', postData);

function postData(e, config) {
    e.preventDefault(); 
    
   fetch('/tutors/signup', config)
         .then(checkStatus)
         .then(response => {
               console.log('JSON Web Token:', response.headers.get('x-auth')); // Get the JWT from the response header (Used to identify user). Store it in localStorage/Cookie/idk you choose
            //    location.href = '/' // Redirects the user upon successful signup. Link can be changed (currently redirects to main page)
         }).catch(e => {
            e.then(err => {
                  console.log(JSON.parse(err));
            }) // Do something upon UNsuccessful signup (currently only logs in console)
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
      submitForm: function (e) {
         
        this.nameError = this.name.length === 0;
    
        
        this.emailError = !this.validEmail(this.email);
        


        this.passwordError = this.password.length < 8;
        
        e.preventDefault();

        if(!(this.nameError && this.passwordError && this.emailError)){
            const config = {
                method: 'POST' ,
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({name : this.name, email : this.email, password : this.password}) 
               };
              postData(e, config); 
        }
      },
      validEmail: function (email) {
         console.log(email); 
        var re = /^(?:[a-z0-9!#$%&amp;'+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        console.log(re.test(email));
        return re.test(email);
        
      }
    }
  })