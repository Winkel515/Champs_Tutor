try{
  const pathName = jwt_decode(localStorage.getItem('token'))._id;
} catch (e) {
  localStorage.removeItem('token');
  location.href="/";
}
document.addEventListener("DOMContentLoaded", getTutor());

function getTutor(){ // Gets tutor from /tutors and sets it up for Vue
  // *************************************** GET REQUEST TO /tutors ROUTE ****************************
  fetch('/tutors/me', {
    headers: {'x-auth': localStorage.getItem('token')}
  }).then(checkStatus)
  .then(response => {
    console.log(response)
    response.text().then(tutor => {
      tutorInfo(JSON.parse(tutor).tutor);
    })
  }).catch(() => {
    localStorage.removeItem('token');
    location.href="/";
  })
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
            tutor,
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
            confirmPassword: "",
            passwordMatchError: false,
            description: tutor.description,
            descriptionError: false,
            price: tutor.price,
            priceError: false,
            subjects: tutor.subjects,
            subjectInput: "",
            subjectsError: false ,
            deletePassword: "",
            deletePasswordError: false,
            reviewerCode: tutor.reviewerCode,
            reviewerCodeError: false,
            phone: tutor.phone,
            phoneError: false,
            facebook: tutor.facebook,
            facebookError: false
        }, 
        methods: {    
        submitChanges: function (e) { 
        const phoneNumber = this.phone.replace(/\s+/g, '');
        if(this.password.trim() === "" && this.oldPassword.trim() === ""){
            var body = JSON.stringify({
                name : this.name,
                email : this.email,
                description: this.description,
                price: this.price,
                subjects: this.subjects,
                reviewerCode: this.reviewerCode,
                phone: phoneNumber,
                facebook: this.facebook
              }) 
        } else {
            var body = JSON.stringify({
                name : this.name,
                email : this.email,
                description: this.description,
                oldPassword: this.oldPassword,
                password: this.password,
                price: this.price,
                subjects: this.subjects,
                reviewerCode: this.reviewerCode,
                phone: phoneNumber,
                facebook: this.facebook
              }) 
        }
        this.nameError = this.name.trim().length === 0;
        this.emailError = !this.validEmail(this.email);
        this.emailDuplicate = false;
        this.passwordError = this.password.trim().length < 8 && this.oldPassword.trim().length !== 0;
        this.passwordMatchError = this.password != this.confirmPassword;
        this.descriptionError = this.description.trim().length > 500;
        this.priceError = this.price === "";
        this.oldPasswordIncorrect = false;
        this.subjectsError = this.subjects.length === 0;
        this.reviewerCodeError = this.reviewerCode.trim().length === 0;
        this.facebookError = this.facebook.indexOf("facebook.com/") === -1 && this.facebook !== '';
        this.phoneError = !validateNumber(phoneNumber);
        function validateNumber(number) {
          const areaCode = number.substring(0,3);
          const validCode = (areaCode === '514'|| areaCode === '438' || areaCode === '450');
          const validLength = number.length === 10;
          return (validCode && validLength) || number.trim() === '';
        }
        const signupError = (this.nameError || this.passwordMatchError || this.emailError || this.passwordError || this.descriptionError || this.priceError || this.subjectsError || this.reviewerCodeError || this.facebookError || this.phoneError);
        e.preventDefault();
        console.log('signupError:', signupError);
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
      deleteAccount: function(){
        fetch('/tutors/me', {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'x-auth': localStorage.getItem('token')
          },
          body: JSON.stringify({
            password: this.deletePassword
          })
        }).then(checkStatus)
        .then(response => {
          localStorage.removeItem('token');
          location.href = '/';
        }).catch(err => {
          err.then(message =>{
            this.deletePasswordError = true;
            console.log(JSON.parse(message))
          })
        })
      }
    },
    computed: {
      descRemaining: function() {
        var remaining = 500 - this.description.trim().length;
          if(remaining < 0)
            return 0
          else 
            return remaining;
      },
      subjectList:function() {
        return  ['Calculus I', 'Calculus II', 'Calculus III','Mechanics', 'Electricity & Magnetism','Waves and Optics']
    },
    }
  })

}