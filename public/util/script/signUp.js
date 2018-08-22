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
      description: '',
      descriptionError: false,
      price: null,
      priceError: false,
      subjects: [],
      subjectInput: "",
      subjectsError: false,
      confirmPassword: "",
      passwordMatchError: false,
      reviewerCode: "",
      reviewerCodeError: false,
      facebook: "",
      facebookError: false,
      phone: "",
      phoneError: false,
      image: '',
      profileImageURL : '' // Temporary solution for profile picture
    },
    methods: {
      submitForm: function (e) {
        const phoneNumber = this.phone.replace(/\s+/g, '');
        var profileImageURL;
        if(this.profileImageURL.trim() === ''){
          profileImageURL = 'img/profile/Default.png';
        } else {
          profileImageURL = this.profileImageURL.trim();
        }

        this.nameError = this.name.trim().length === 0;
        this.emailError = !this.validEmail(this.email);
        this.emailDuplicate = false;
        this.passwordError = this.password.trim().length < 8;
        this.descriptionError = this.description.trim().length > 500;
        this.priceError = this.price === null;
        this.subjectsError = this.subjects.length === 0;
        this.passwordMatchError = this.password != this.confirmPassword;
        this.reviewerCodeError = this.reviewerCode.trim().length === 0;
        this.facebookError = this.facebook.indexOf("facebook.com/") === -1 && this.facebook !== '';
        this.phoneError = !validateNumber(phoneNumber);
        function validateNumber(number) {
          const areaCode = number.substring(0,3);
          const validCode = (areaCode === '514'|| areaCode === '438' || areaCode === '450');
          const validLength = number.length === 10;
          return (validCode && validLength) || number.trim() === '';
        }

        var signupError = (this.nameError || this.passwordMatchError || this.emailError || this.passwordError || this.descriptionError || this.priceError || this.subjectsError || this.reviewerCodeError || this.facebookError || this.phoneError);

        e.preventDefault();
        // Checks for errors before actually making the POST request
        if(!signupError){
          var formData = new FormData();
          const data = {
            name : this.name.trim(),
            email : this.email,
            password : this.password.trim(),
            description: this.description.trim(),
            price: this.price,
            subjects: this.subjects,
            reviewerCode: this.reviewerCode.trim(),
            facebook: this.facebook.trim(),
            phone: phoneNumber,
            profileImage: profileImageURL
          }

          console.log(data);

          for(var key in data){
            console.log(key, data[key]);
            formData.append(key, data[key]);
          }
          // formData.append('profileImage', $('input[type=file]')[0].files[0]);
          const config = {
              method: 'POST' ,
              headers: {
                'email': this.email.trim()
              },
              body: formData
          };
          fetch('/tutors/signup', config).then(checkStatus)
          .then(response => { // Runs when all inputs are good
            localStorage.setItem('token', response.headers.get('x-auth'));
            console.log(response.headers.get('x-auth')); // Logging the JWT for now. Can be stored in sessionStorage or localStorage
            location.href = '/';
          }).catch(response => { // Runs when there's an invalid input
            response.then(e => {
              console.log(e);
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
      },
      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.createImage(files[0]);
      },
      createImage(file) {
        var image = new Image();
        var reader = new FileReader();
        var vm = this;
  
        reader.onload = (e) => {
          vm.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },
    },
    computed: {
      descRemaining: function() {
        var remaining = 500 - this.description.length;
          if(remaining < 0)
            return "Exceeded character limit"
          else 
            return remaining;
      },
      math:function() {
        return  ['Calculus I', 'Calculus II', 'Calculus III', 'Linear Algebra', 'Discrete Mathematics'];
      },

      physics:function() {
        return  ['Mechanics', 'Electricity & Magnetism','Waves & Optics'];
      },

      chemistry:function() {
        return  ['General Chemistry I', 'General Chemistry II', 'Organic Chemistry I'];
      },

      biology:function() {
        return  ['General Biology I', 'General Biology II'];
      },

      commerce:function() {
        return  ['Macroeconomics', 'Microeconomics', 'Quantitative Methods'];
      },

      languages:function() {
        return  ['English', 'French', 'Spanish', 'Italian'];
      },
      previewImageURL: function() {
        var profileImageURL;
        if(this.profileImageURL.trim() === ''){
          profileImageURL = 'img/profile/Default.png';
        } else {
          profileImageURL = this.profileImageURL.trim();
        }
        return profileImageURL;
      }
    }
  })