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
        subject: '',
        price: '',
      },
      methods: {
        filterList: function(){
            
          console.log(event);
          this.subject = event.target.value;

          console.log(this.price)
          this.price = event.target.value;
          console.log(this.price)
        }
      }, 
      computed: {
          subjectList:function() {
              return  ['Calculus I', 'Calculus II', 'Calculus III','Mechanics', 'Electricity & Magnetism','Waves and Optics']
          },
          priceList:function() {
            return  [10,20,30,40,50];
        }

      }
  });
}
