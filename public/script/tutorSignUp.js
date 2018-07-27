function postData(config) {

   return fetch('/tutors/signup', config)
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
      emailDuplicate: false,
      password: "",
      passwordError:false
    },
    methods: {
      submitForm: function (e) {
         
        this.nameError = this.name.length === 0;
        this.emailError = !this.validEmail(this.email);
        this.passwordError = this.password.length < 8;
        this.emailDuplicate = false;
        
        e.preventDefault();
        if(!(this.nameError || this.passwordError || this.emailError)){
            const config = {
                method: 'POST' ,
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({name : this.name, email : this.email, password : this.password}) 
               };
            postData(config).then(checkStatus)
               .then(response => { // Runs when all inputs are good
                     console.log(response.headers.get('x-auth')); // Logging the JWT for now. Can be stored in sessionStorage or localStorage
               }).catch(response => { // Runs when there's an invalid input
                  response.then(e => {
                        console.log(JSON.parse(e));
                        if(JSON.parse(e).message === "Email is already in use"){ // Run if email is already in database
                              this.emailDuplicate = true; // Boolean used to show error message on signUp page
                        }
                  })
               })
        }
      },
      validEmail: function (email) {
        return validator.isEmail(email);
      }
    }
  })