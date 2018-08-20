new Vue({
    el: "#navbar",
    data: {
        isSignedIn: false,
        email:"",
        password:"",
        invalidCredentials: false,
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
})