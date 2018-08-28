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

var footerText = $('<p class="m-0 text-center text-white">Copyright &copy; Champs Tutors </p>').append(new Date().getFullYear());
$('#footerDiv').append(footerText);
 
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
        screenSize: window.screen.width,
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
        scrollTutor: function(){
          $('html, body').animate({ scrollTop: $('#tutor').offset().top }, 250);
        },
        filterList: function(subjectList){
          var filteredList = [];
          for(sub of subjectList){
            if(this.tutorSubjects.indexOf(sub) !== -1 && filteredList.indexOf(sub) === -1){
              filteredList.push(sub);
            }
          }
          return filteredList;
        }
      },
      computed: {
          tutorSubjects: function() {
            var tutorSubjects = []
            for(tutor of this.tutors){
              for(subject of tutor.subjects){
                if(tutorSubjects.indexOf(subject) === -1)
                  tutorSubjects.push(subject);
              }
            }
            return tutorSubjects;
          },

          math:function() {
              var subjectList = ['Calculus I', 'Calculus II', 'Calculus III', 'Linear Algebra', 'Discrete Mathematics', 'Quantitative Methods'];
              return this.filterList(subjectList);
          },

          physics:function() {
            var subjectList = ['Mechanics', 'Electricity & Magnetism','Waves & Optics'];
            return this.filterList(subjectList);
          },

          chemistry:function() {
            var subjectList = ['General Chemistry I', 'General Chemistry II', 'Organic Chemistry I'];
            return this.filterList(subjectList);
          },

          biology:function() {
            var subjectList = ['General Biology I', 'General Biology II'];
            return this.filterList(subjectList);
          },

          commerce:function() {
            var subjectList = ['Macroeconomics', 'Microeconomics', ];
            return this.filterList(subjectList);
          },

          languages:function() {
            var subjectList = ['English', 'French', 'Spanish', 'Italian'];
            return this.filterList(subjectList);
          },

          priceList:function() {
            return  [10,20,30,40,50];
          }
      }
  });
}


