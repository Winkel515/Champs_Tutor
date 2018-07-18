
const tutors = [
    {
        name: 'Daniel Bucci', 
        
        description: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subject: 'Waves and Optics',
        price: '10$/h',
        showTutor: false,
      },
      {
        name: 'Winkel Yin', 
        
        description: "I am a Cal 2 tutor with an R-Score of 35",
        subject: 'Calculus II',
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
        subject: 'Calculus II',
        price: '15$/h',
        showTutor: false,
      },
      {
        name: 'Daniel Bucci', 
       
        description: "I am a Waves and Modern Physics tutor with an R-Score of 34",
        subject: 'Mechanics',
        price: '10$/h',
        showTutor: false,
      },
]



const app = new Vue({
    el: '#tutorList',
    data: {
      title: 'Tutor Me',
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
         return  ['Calculus I', 'Calculus II', 'Calculus III','Mechanics', 'Waves and Optics', 'Electricity & Magnetism']
        }
    }


});

