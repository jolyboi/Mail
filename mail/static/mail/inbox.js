// Operations made after DOM Loaded 
// Login, Logout, Register are performed with python backend 

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

   // Send form 
  document.querySelector('#compose-form').onsubmit = send_email;

  // By default, load the inbox
  load_mailbox('inbox');

});

// No emails selected view used globally
no_items_selected = 
`
  <div id='view-email-noitems'>
    <h1>Items not Selected</h1>
  </div>
`;

//* Compose email
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  // Hide error message 
  document.querySelector('#compose-error').style.display = 'none';
}



//* Load mailbox
function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // COULDVE PUT SKELETON IN inbox.html
  // Show the mailbox name and the skeleton
  document.querySelector('#emails-view').innerHTML = `
    <h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
    <div id='emails-view-container'>
      <div id="emails-area">
                
      </div>

      <div id='vertical-line'>

      </div>

      <div id="view-email">
        ${no_items_selected}
      </div>
      
    </div>
  `;

  // Display emails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Show emails in console
    console.log(emails);
    
    //
    if (emails.length === 0) {
      const message = document.createElement('h1');
      message.innerHTML = 'No Emails';
      message.style.textAlign = 'center';
      message.style.marginTop = '300px'
      document.querySelector('#emails-area').append(message); 
    }

    let selected_email = null;  // keeping the last selected email
    // For each email, create a div and fill it up with email's content 
    emails.forEach(email => {
      // Email Wrapper
      let new_email = document.createElement('div');
      new_email.setAttribute('class', 'mailbox-email')

      // Set email structure 
      if (email.subject != '') {
        new_email.innerHTML = `
        <div class='mailbox-email-left'>
          <span class="mailbox-email-sender"><b>${email.sender}</b></span> 
          <span class="mailbox-email-subject">${email.subject}</span>
        </div>
        <span class="mailbox-email-timestamp">${email.timestamp}</span>
      `;
      }
      else {
        new_email.innerHTML = `
        <div class='mailbox-email-left'>
          <span class="mailbox-email-sender"><b>${email.sender}</b></span> 
          <span class="mailbox-email-subject">No Subject</span>
        </div>
        <span class="mailbox-email-timestamp">${email.timestamp}</span>
      `;
      }

      // if inbox or archive showed and email is read, mark email as gray
      if (mailbox != 'sent' && email.read) {
        new_email.style.backgroundColor = '#f5f5f5';  // grayish color
      }
      else {
        new_email.style.backgroundColor = 'white';
      }

      // View Email on click 
      new_email.addEventListener('click', () => {
        if (selected_email) {
          selected_email.classList.remove('selected');
          selected_email.style.backgroundColor = '#f5f5f5';
        }
        new_email.style.backgroundColor = '#F1F9FD';
        new_email.classList.add('selected');
        selected_email = new_email;
        view_email(email, mailbox);
      })

      // Brigten up on hover
      let original_color = new_email.style.backgroundColor;
      new_email.addEventListener('mouseover', () => {
        if (!new_email.classList.contains('selected')) {
          new_email.style.backgroundColor = '#eeeeee';
        }
      })
      new_email.addEventListener('mouseout', () => {
        if (!new_email.classList.contains('selected')) {
          new_email.style.backgroundColor = original_color;
        }
      })
      
      // Append email to view
      document.querySelector('#emails-area').append(new_email); 
    });
   
  });

}


//* Send email
function send_email() {
  
  // Parse the values from fields 
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  // Send the parsed values to the API
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    })
  })
  .then(response => response.json())
  .then(result => {
    // Print result to the console 
    console.log(result);
    
    // if error, stay with the form
    // else, go to sent emails
    if (result.error) {
      // Return the compose view
      compose_email();

      // Leave the info in fields
      document.querySelector('#compose-recipients').value = recipients;
      document.querySelector('#compose-subject').value = subject;
      document.querySelector('#compose-body').value = body;

      // Show error message 
      document.querySelector('#compose-error').style.display = 'block';
      
      const message = document.querySelector('#compose-error-message');
      message.textContent = result.error;
    }
    
    else {
      load_mailbox('sent');
    }
  });

  // Prevent from submitting the form
  return false;

}


//* View email
function view_email(email, mailbox) {
  // Put on read
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });

  // Check if email has subject
  if (email.subject)
  {
    subject = email.subject;
  }
  else 
  {
    subject = '(No Subject)';
  }
  
  // If mailbox not sent, then show sender, reply, archive-unarchive
  if (mailbox != 'sent')
  {
    document.querySelector('#view-email').innerHTML = 
      `
        <div id='view-email-header'>
          <div id='view-email-subject'>
            <h2>${subject}</h2>
            <button id='archive-button'></button>
          </div>
          <span>${email.timestamp}</span>
        </div> 

        <div id='view-email-contents'>
          <span id='view-email-sender'>Sender: ${email.sender}</span> 
        </div>
      `
  }
  else 
  {
    document.querySelector('#view-email').innerHTML = 
    `
      <div id='view-email-header'>
        <h2>${subject}</h2>
        <span>${email.timestamp}</span>
      </div> 

      <div id='view-email-contents'>
        <span id='view-email-sender'>To: ${email.recipients}</span> 
      </div>
    `
  }
  // If body is present, add it
  if (email.body)
  {
    let body = document.createElement('div');
    body.innerHTML = `<span id='view-email-body'>${email.body}</span>`;
    document.querySelector('#view-email-contents').append(body);
  }

  // Add archive/unarchive button
  if (mailbox != 'sent') {
    // const archive_button = document.createElement('div');
    // archive_button.innerHTML = "<button id='archive-button'></button>";
    // document.querySelector('#view-email').append(archive_button);

    if (email.archived) {
      document.querySelector('#archive-button').innerHTML = '<i class="fas fa-box-open"></i>';
      document.querySelector('#archive-button').style.backgroundColor = '#3579f6';    //? placeholder color 
    }  

    else {
      document.querySelector('#archive-button').innerHTML = '<i class="fa-solid fa-box-archive"></i>'
      document.querySelector('#archive-button').style.backgroundColor = 'gray';     //? placeholder color
    }
    document.querySelector('#archive-button').onclick = () => archive(email);
  }
}



//* Archive/Unarchive 
function archive(email) {
  let archived = false;
  if (!email.archived) {
    archived = true;
  }
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: archived
    })
  });
  
  document.querySelector('#view-email').innerHTML = no_items_selected;
  // Find selected message to archive/unarchive
  let archived_message = document.querySelector('.selected');
  archived_message.classList.add('deleted-email');
  archived_message.classList.remove('selected');

  archived_message.addEventListener('animationend', () => {
    setTimeout(() => {
        archived_message.remove();
    }, 1000); // Match animation duration
  });

 

}

// todo Button functionality that will send a PUT request to archive-unarchive the email and delete it from the original inbox with animation







// ! BAD DESIGN 


  //  For each email, create a div and fill it up with email's content 
  //  emails.forEach(email => {
  //   let div = document.createElement('div');

  //   let sender = document.createElement('span');  // Sender 
  //   sender.textContent = email.sender;
  //   sender.setAttribute('class', 'mailbox-email-sender');

  //   let subject = document.createElement('span');  // Subject 
  //   subject.textContent = email.subject;
  //   subject.setAttribute('class', 'mailbox-email-subject');

  //   let timestamp = document.createElement('span');  // Timestamp
  //   timestamp.textContent = email.timestamp;
  //   timestamp.setAttribute('class', 'mailbox-email-timestamp');

  //   div.setAttribute('class', 'mailbox-email');   // Add class to div

  //   div.append(sender, timestamp, subject);   // Append content to div

  //   document.querySelector('#emails-view').append(div); // Append div to view
  // });

