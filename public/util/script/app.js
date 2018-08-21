// // ------------------------------------------
// //  FETCH FUNCTIONS
// // ------------------------------------------

  fetch('/tutors')
    .then(checkStatus)
    .then(response => response.json())
    .then(data => tutorsVue(data.tutors)) // Injects tutors array into the Vue object
    .catch(error => console.log('Looks like there was a problem', error))

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

function tutorsVue(tutors){
  const app = new Vue({
      el: '#tutorList',
      data: {
        tutors,
        subject: 'All Subjects',
        price: 'All Prices',
        email:"",
        password:"",
        isSignedIn: false,
        invalidCredentials: false,
        screenSize: window.screen.width
      },
      methods: {
        filterSubject: function(){
           /* Filter Subjects */ 
          this.subject = event.target.value;

          console.log("Subject:", this.subject);
          console.log("Price:", this.price);
        },
        filterPrice: function(){
          /* Filter Prices */
          var priceIndex = event.target.value;
          const prices = [10,20,30,40,50];
          if (priceIndex != "All Prices") 
          this.price = prices[priceIndex];
          else 
          this.price = priceIndex;
          console.log("Subject:", this.subject);
          console.log("Price:", this.price);
        },
      },
      computed: {
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

          priceList:function() {
            return  [10,20,30,40,50];
          }
      }
  });
}


