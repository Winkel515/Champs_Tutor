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
      passwordError:false,
      shortDescription: '',
      shortDescriptionError: false,
      price: 0
    },
    methods: {
      submitForm: function (e) {
         
        this.nameError = this.name.length === 0;
        this.emailError = !this.validEmail(this.email);
        this.emailDuplicate = false;
        this.passwordError = this.password.length < 8;
        this.shortDescriptionError = this.shortDescription.length > 200;
        
        e.preventDefault();
        // Checks for error before actually making the POST request
        if(!(this.nameError || this.passwordError || this.emailError || this.shortDescriptionError)){
          const config = {
              method: 'POST' ,
              headers: {'Content-type': 'application/json'},
              body: JSON.stringify({
                name : this.name,
                email : this.email,
                password : this.password,
                shortDescription: this.shortDescription,
                price: this.price
              }) 
          };
          fetch('/tutors/signup', config).then(checkStatus)
          .then(response => { // Runs when all inputs are good
            localStorage.setItem('token', response.headers.get('x-auth'));
            console.log(response.headers.get('x-auth')); // Logging the JWT for now. Can be stored in sessionStorage or localStorage
            location.href = '/';
          }).catch(response => { // Runs when there's an invalid input
            response.then(e => {
              console.log(JSON.parse(e));
              if(JSON.parse(e).message === "Email is already in use"){ // Run if email is already in database
                    this.emailDuplicate = true; // Boolean used to show error message on signUp page
              }
            })
          });
          
        }
      },
      validEmail: function (email) {
        return validator.isEmail(email);
      }
    },
    computed: {
      shortDescRemaining: function() {
        return 250 - this.shortDescription.length;
      }
    }
  })