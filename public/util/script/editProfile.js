const pathName = jwt_decode(localStorage.getItem('token'))._id;
document.addEventListener("DOMContentLoaded", getTutor(pathName));

function getTutor(pathName){ // Gets tutor from /tutors and sets it up for Vue
  // *************************************** GET REQUEST TO /tutors ROUTE ****************************
  
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", '/tutors/' + pathName, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          
          var tutor = (JSON.parse(this.responseText).tutor);
          
          tutorInfo(tutor) // Injects the tutors array into the Vue object
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

function tutorInfo(tutor){
    const app = new Vue({
        el: '#editProfile',
        data: {
            tutor: tutor,
            name: tutor.name,
            nameError: false,
            email: tutor.email,
            emailError: false,
            emailDuplicate : false,
            oldPassword: "",
            oldPasswordError: false,
            oldPasswordIncorrect: false,
            password: "",
            passwordError: false,
            description: tutor.description,
            descriptionError: false,
            price: tutor.price,
            priceError: false,
            subjects: [],
            subjectInput: "",
            subjectsError: false 
        }, 
        methods: {    
        submitChanges: function (e) {
            
        if(this.password.trim() === "" && this.oldPassword.trim() === ""){
            var body = JSON.stringify({
                name : this.name,
                email : this.email,
                description: this.description,
                price: this.price,
                subjects: this.subjects
              }) 
        } else {
            var body = JSON.stringify({
                name : this.name,
                email : this.email,
                description: this.description,
                oldPassword: this.oldPassword,
                password: this.password,
                price: this.price,
                subjects: this.subjects
              }) 
        }
        this.nameError = this.name.length === 0;
        this.emailError = !this.validEmail(this.email);
        this.emailDuplicate = false;
        this.passwordError = this.password.length < 8 && this.oldPassword.length !== 0;
        this.descriptionError = this.description.length > 250;
        this.priceError = this.price === "";
        this.oldPasswordIncorrect = false;
        // this.subjectsError = this.subjects.length === 0; // Set up later
        var signupError = (this.nameError || this.emailError || this.passwordError || this.descriptionError || this.priceError || this.subjectsError);  
        e.preventDefault();
        // Checks for error before actually making the POST request
        if(!signupError){
          const config = {
              method: 'PATCH' ,
              headers: {'Content-type': 'application/json', 'x-auth': localStorage.getItem('token')},
              body
              
          }; 
          fetch('/tutors/me', config).then(checkStatus)
          .then(response => { // Runs when all inputs are good
            location.href = '/';
          }).catch(response => { // Runs when there's an invalid input 
            
            response.then(e => { 
              console.log(JSON.parse(e));
              if(JSON.parse(e).message === "Email is already in use"){ // Run if email is already in database
                    this.emailDuplicate = true; // Boolean used to show error message on signUp page
              }
              if(JSON.parse(e).message === "Wrong password"){
                this.oldPasswordIncorrect = true;
              }
            })
          });
          
        }
      },
      validEmail: function (email) {
        return validator.isEmail(email);
      },
      addSubject: function(){
        var subject = this.subjectInput.trim()
        if(subject !== ""){
          this.subjects.push(subject)
          this.subjectInput = "";
        }
      },
      deleteSubject: function(index){
        this.subjects.splice(index, 1);
      }
    },
    computed: {
      descRemaining: function() {
        var remaining = 250 - this.description.length;
          if(remaining < 0)
            return 0
          else 
            return remaining;
      }
    }
  })

}