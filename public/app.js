// const tutors = [
//   {
//   "rating": 0,
//   "price": 15,
//   "shortDescription": "I am a Cal 2 tutor with an R-Score of 35",
//   "subjects": [
//   "Calculus I"
//   ],
//   "_id": "5b4f9143c9d1c137342701dc",
//   "name": "Winkel Yin"
//   },
//   {
//   "rating": 0,
//   "price": 50,
//   "shortDescription": "I am a Waves and Modern Physics tutor with an R-Score of 34",
//   "subjects": [
//   "Waves and Optics"
//   ],
//   "_id": "5b4f9143c9d1c137342701dd",
//   "name": "Josh Lang"
//   },
//   {
//   "rating": 0,
//   "price": 15,
//   "shortDescription": "I am Asian therefore I'm good at math",
//   "subjects": [
//   "Calculus I"
//   ],
//   "_id": "5b4f9143c9d1c137342701de",
//   "name": "William Chen"
//   },
//   {
//   "rating": 0,
//   "price": 20,
//   "shortDescription": "Hello, my name is Francesco and I love teaching!!!",
//   "subjects": [
//   "Waves and Optics"
//   ],
//   "_id": "5b4f9143c9d1c137342701df",
//   "name": "Francesco Italiano"
//   },
//   {
//   "rating": 0,
//   "price": 10,
//   "shortDescription": "Hi...",
//   "subjects": [
//   "Waves and Optics"
//   ],
//   "_id": "5b4f9134c9d1c1373427019e",
//   "name": "Daniel Bucci"
//   }
//   ];

document.addEventListener("DOMContentLoaded", getTutors());

function getTutors(){ // Gets tutors from /tutors and sets it up for Vue
  // *************************************** GET REQUEST TO /tutors ROUTE ****************************
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "/tutors", true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var tutors = JSON.parse(this.responseText).tutors; // Setting up the tutors array
          tutorsVue(tutors) // Injects the tutors array into the Vue object
      };
  };
};

function tutorsVue(tutors){
  const app = new Vue({
      el: '#tutorList',
      data: {
        tutorList: tutors,
        subject: ''
      },
      methods: {
        filterList: function(){
            
          console.log(event);
          this.subject = event.target.value;
        }
      }, 
      computed: {
          subjectList:function() {
              return  ['Calculus I', 'Calculus II', 'Waves and Optics']
          }
      }
  });
}
