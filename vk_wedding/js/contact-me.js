$(document).ready(function() {

    $("#contact-form [type='submit']").click(function(e) {
        e.preventDefault();

        $('#valid-form').html('Sending <i class="fa fa-spinner" aria-hidden="true"></i>'); // Message displayed in the submit button during the sending
        
        // Get input field values of the contact form
        var user_checking      = $('input[name=checking]').val(); // Anti-spam field

        var user_name          = $('input[name=name]').val();
        var user_email         = $('input[name=email-address]').val();
        var user_company       = $('input[name=company]').val();
        var user_phone         = $('input[name=phone]').val();
        var user_message       = $('textarea[name=message]').val();
        var user_newsletter    = $('input[name=newsletter]').val();
       
        // Datadata to be sent to server
        post_data = {
            'userChecking':user_checking,
            'userName':user_name,
            'userEmail':user_email,
            'userCompany':user_company,
            'userPhone':user_phone,
            'userMessage':user_message,
            'userNewsletter':user_newsletter,
        };
       
        // Ajax post data to server
        $.post('php/contact-me.php', post_data, function(response){  
           
            // Load json data from server and output message    
            if(response.type == 'error') {

                output = '<div class="error-message"><p>'+response.text+'</p></div>';

                $('#valid-form').html('Send my Message'); // Message displayed in the submit button if an error has occured
                
            } else {
           
                output = '<div class="success-message"><p>'+response.text+'</p></div>';
               
                // After, all the fields are reseted
                $('#contact-form input').val('');
                $('#contact-form textarea').val('');
                
                $('#valid-form').html('Sent!'); // Message displayed in the submit button when the submission is successfull
            }
           
            $("#answer").hide().html(output).fadeIn();

        }, 'json');

    });
   
    // Reset and hide all messages on .keyup()
    $("#contact-form input, #contact-form textarea").keyup(function() {
        $("#answer").fadeOut();
    });

    // Accept only figure from 0 to 9 and + ( ) in the phone field
    $("#contact-form #phone").keyup(function() {
        $("#phone").val(this.value.match(/[0-9+() -]*/));
    });
    
    $('#contact-form').on('change', 'input#ios', function() {
        this.checked ? this.value = 'Yes' : this.value = 'No';
    });
   
});