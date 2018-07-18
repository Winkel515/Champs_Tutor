
const tutors = [
    {
        name: 'Daniel Bucci', 
       
        description: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subject: 'Waves and Modern Physics',
        price: '10$/h',
        showTutor: false,
      },
      {
        name: 'Winkel Yin', 
        
        description: "I am a Cal 2 tutor with an R-Score of 35",
        subject: 'Calculus 2',
        price: '15$/h',
        showTutor: false,
      },
      {
        name: 'Daniel Bucci', 
        
        description: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subject: 'Waves and Modern Physics',
        price: '10$/h',
        showTutor: false,
      },
      {
        name: 'Winkel Yin', 
        
        description: "I am a Cal 2 tutor with an R-Score of 35",
        subject: 'Calculus 2',
        price: '15$/h',
        showTutor: false,
      },
      {
        name: 'Daniel Bucci', 
       
        description: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subject: 'Waves and Modern Physics',
        price: '10$/h',
        showTutor: false,
      },
]



const app = new Vue({
    el: '#tutorList',
    data: {
      title: 'Tutor Me',
      tutorList: tutors,
      type: ''
    },
    methods: {
      toggleDetails: function(media){
        media.showDetail = !media.showDetail
      },
      filterList: function(){
        this.type = event.target.value;
      }
    },


});



