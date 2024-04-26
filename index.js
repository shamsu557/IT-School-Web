// navbar js
$(document).ready(function() {
  $('.nav-item.dropdown').hover(function() {
      // Show current dropdown
      $(this).find('.dropdown-menu').show();
      // Close other dropdowns
      $('.nav-item.dropdown').not(this).find('.dropdown-menu').hide();
  });

  // Close dropdown when clicking outside of it or hovering over another navbar item
  $(document).on('click mouseenter', function(e) {
      if (!$(e.target).closest('.nav-item.dropdown').length) {
          $('.dropdown-menu').hide();
      }
  });
});
//submit application
$(document).ready(function() {
  $('#getStudentDetailsForm').submit(function(e) {
      e.preventDefault();
      var admissionNumber = $('#admissionNumber').val();
      $.get('/getStudentDetails', { admissionNumber: admissionNumber }, function(data) {
          var studentDetails = '<p>Student Details:</p><p>Name: ' + data.firstName + ' ' +data.surname+ ' ';
                  if (data.lastName) {
                      studentDetails += data.lastName;
                  }
                  studentDetails += '</p><p>Admission Number: ' +data.admissionNumber+'</p><p>Course Applied: ' + data.courseApplied + '</p><p>Application Fee: ' + data.applicationFee + '</p>';
           $('#studentDetails').html(studentDetails);
          $('#admissionNumberPayment').val(admissionNumber);
          $('#getStudentDetailsForm').hide(); // Hide get details button
          $('#makePaymentForm').show(); // Show make payment button
      }).fail(function() {
          $('#studentDetails').html('<p class="text-danger">Student not found!</p>');
          $('#makePaymentForm').hide();
      });
  });
});


  // Get the button
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
  mybutton.style.display = "block";
} else {
  mybutton.style.display = "none";
}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
}
//carousel change time
$(document).ready(function(){
  $('#carouselComputech').carousel({
      interval: 4000, // Change slide every 3 seconds (adjust as needed)
      pause: false // Do not pause on hover
  });
});
