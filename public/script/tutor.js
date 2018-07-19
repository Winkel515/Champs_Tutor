

document.addEventListener("DOMContentLoaded", getTutor());

function getTutor(){ // Gets tutor from /tutors and sets it up for Vue
  // *************************************** GET REQUEST TO /tutors ROUTE ****************************
  let pathName = window.location.pathname;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", '/tutors' + pathName, true);
  xmlhttp.send();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          var tutor = (JSON.parse(this.responseText).tutor);
          tutorsVue(tutor) // Injects the tutors array into the Vue object
      };
  };
};

function tutorsVue(tutor){
  const app = new Vue({
      el: '#tutorProfile',
      data: {
        tutor: tutor,
      },
      
      
  });
}

