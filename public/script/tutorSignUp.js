
const sunmitButton = document.getElementById('submitButton');
sunmitButton.addEventListener('click', postData);

function postData(e) {
    e.preventDefault(); 
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
     
     const config = {
    method: 'POST' ,
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({name, email,password}) 
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