// Function to handle school fee payment response
function handlePaymentResponse(reference, paymentNumber, courseApplied) {
  let message = 'School fee payment complete! Reference: ' + reference;
  alert(message); // Alert message for payment completion
  // Trigger server-side database update with payment details
  $.post('/updateDatabase', { reference: reference, paymentNumber: paymentNumber, courseApplied: courseApplied })
  .done(function(response) {
      console.log('Database updated successfully:', response);
  })
  .fail(function(error) {
      console.error('Error updating database:', error);
  });
}

$(document).ready(function() {
  // Handle form submission to get student details for school payment
  $('#getAdmissionDetailsForm').submit(function(e) {
      e.preventDefault();
      var admissionNumber = $('#admissionNumber').val();
      var paymentNumber = $('#paymentNumber').val();
      if (!admissionNumber) {
          alert("Please enter the admission number.");
          return;
      }

      // Submit admission details form
      $.get('/fetchStudentDetails', { admissionNumber: admissionNumber, paymentNumber: paymentNumber })
      .done(function(data) {
          var studentDetails = '<p>Student Details:</p><p>Name: ' + data.firstName + ' ' + data.surname + ' ';
          if (data.lastName) {
              studentDetails += data.lastName;
          }
          studentDetails += '</p><p>Email Address: ' + data.emailAddress + '</p><p>Admission Number: ' + data.admissionNumber + '</p><p>Course Applied: ' + data.courseApplied + '</p><p>School Fee: ' + data.schoolFee + '</p><p>PaymentInstallmetAmount: ' + data.installmentAmount + '</p>';
          $('#studentDetails').html(studentDetails);
          $('#admissionNumberPayment').val(admissionNumber);
          $('#first-name').val(data.firstName); // Populate first name input
          $('#last-name').val(data.surname); // Populate last name input
          $('#email-address-payment').val(data.emailAddress); // Populate email address input

          // Set transaction amount based on installment amount
          var transactionAmount = data.installmentAmount;
          $('#amount').val(transactionAmount); // Set transaction amount
          $('#getAdmissionDetailsForm').hide(); // Hide get details form
          $('#makeAdmissionPaymentForm').show(); // Show proceed to payment form

          // Proceed to payment with fetched details
          $('#proceedToPaymentButton').click(function(e) {
              e.preventDefault();
              if (paymentNumber === "2" && !data.firstPaymentMade) {
                  alert("Please make the first installment payment before proceeding to the second installment.");
                  return;
              }
              payWithPaystack(data.referenceNumber, data.emailAddress, paymentNumber, data.courseApplied);
          });
      })
      .fail(function() {
          $('#studentDetails').html('<p class="text-danger">Student not found!</p>');
          $('#makeAdmissionPaymentForm').hide(); // Hide proceed to payment form if student not found
      });
  });

  // Function to initiate payment with Paystack
  function payWithPaystack(reference, emailAddress, paymentNumber, courseApplied) {
      let handler = PaystackPop.setup({
          key: 'pk_live_e6942e61f70c87019cbeb64ffed04e10fbd2ee10', // Replace with your public key
          email: emailAddress,
          amount: $('#amount').val() * 100,
          ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          onClose: function() {
              alert('Window closed.');
          },
          callback: function(response) {
              handlePaymentResponse(response.reference, paymentNumber, courseApplied);
          }
      });

      handler.openIframe();
  }

  // Navbar dropdown functionality
  $('.nav-item.dropdown').hover(function() {
      $(this).find('.dropdown-menu').show();
      $('.nav-item.dropdown').not(this).find('.dropdown-menu').hide();
  });

  // Close dropdown when clicking outside of it or hovering over another navbar item
  $(document).on('click mouseenter', function(e) {
      if (!$(e.target).closest('.nav-item.dropdown').length) {
          $('.dropdown-menu').hide();
      }
  });

  // Scroll to top button
  let mybutton = document.getElementById("myBtn");
  window.onscroll = function() {
      scrollFunction();
  };

  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
      } else {
          mybutton.style.display = "none";
      }
  }

  // Function to scroll to top when the button is clicked
  $('#myBtn').click(function() {
      $('html, body').animate({ scrollTop: 0 }, 'fast');
      return false;
  });
});
