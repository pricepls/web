
/***********************************************************************************
  
Animations
  
************************************************************************************/

jQuery(document).ready(function($) {
	$(function() {
		$('#header').delay(100).fadeIn(1000);
		$('#intro').delay(300).fadeIn(500);
	});
});


/***********************************************************************************
  
Mailchimp Form Processing
  
************************************************************************************/

$(function() {

    // Get the form.
    var form = $('#mailchimp');

    // Get the messages div.
    var formLoading = $('#loading');
    var formMessages = $('#loading .status');
    var signupform = $('#pre-subscribe');
    var successMessage = $('#post-subscribe');

    // Set up an event listener for the subscribe form.
    $(form).submit(function(e) {

        // Stop the browser from submitting the form.
        e.preventDefault();
        
        // Show the loading div.
        $(formLoading).fadeIn(100);

        // Serialize the form data.
        var formData = $(form).serialize();

        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData
        })

        .done(function(response) {

            //var responseParse= JSON.parse(response);
            if(response.status === 'success') {

                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass('error');
                $(formMessages).addClass('success');
                $(formMessages).fadeIn(100);
                $(successMessage).fadeIn(100);
                $(signupform).fadeOut(100);
                $(formMessages).delay(1000).fadeOut(500);
                $(formLoading).delay(1000).fadeOut(500);
                $('#email').val('');

            }else{

                $(formMessages).removeClass('success');
                $(formMessages).addClass('error');
                $(formMessages).fadeIn(100);
                $(formMessages).delay(1000).fadeOut(500);
                $(formLoading).delay(1000).fadeOut(500);
                // Clear the form.
                $('#email').val('');
            }

            // Clear the form.
        })

        .fail(function(data) {

            // Make sure that the formMessages div has the 'error' class.
            $(formMessages).removeClass('success');
            $(formMessages).addClass('error');
            $(formMessages).fadeIn(100);
            $(formMessages).delay(1000).fadeOut(500);
            $(formLoading).delay(1000).fadeOut(500);

            // Clear the form.
            $('#email').val('');
        });
    });
});
