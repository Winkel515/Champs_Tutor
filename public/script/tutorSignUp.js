
const sunmitButton = document.getElementById('submitButton');
sunmitButton.addEventListener('click', postData);

function postData(e) {
    e.preventDefault(); 
    const name = document.getElementById('name').value;
    const mail = document.getElementById('mail').value;
    const password = document.getElementById('password').value;
     
     const config = {
    method: 'POST' ,
    headers: {'Content-type': 'application/json'},
    body: JSON.stringify({name: name, mail: mail,password: password }) 
   };
     
   fetch('https://jsonplaceholder.typicode.com/comments', config)
         .then(checkStatus)
         .then(res => res.json())
         .then(data => console.log(data))
   }

   function checkStatus(response){
    if(response.ok){
       return Promise.resolve(response); 
    } else{
     return Promise.reject(new Error(response.statusText)); 
    }
   }