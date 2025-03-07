# Mail Website

A web-based email application built using **Python (Django)** for the backend and **JavaScript** for dynamic frontend interactions. This project replicates core functionalities of popular email applications, such as sending emails, viewing mailboxes, archiving/unarchiving emails, and replying to emails.

---

## Features

1. **Send Mail**:
   - Users can compose and send emails to other users.
   - Includes fields for recipients, subject, and body.

2. **Mailboxes**:
   - **Inbox**: Displays all received emails.
   - **Sent**: Displays all sent emails.
   - **Archive**: Displays archived emails.
   - Each mailbox dynamically loads the appropriate emails.

3. **View Email**:
   - Clicking on an email opens a detailed view with the email's content, sender, timestamp, and subject.

4. **Archive and Unarchive**:
   - Users can archive emails to remove them from the inbox.
   - Archived emails can be unarchived and restored to the inbox.

5. **Reply**:
   - Users can reply to an email directly from the email view.
   - The reply form pre-fills the recipient, subject, and body for convenience.

6. **Dynamic UI**:
   - Smooth animations for archiving/deleting emails.
   - Interactive hover effects and real-time updates using JavaScript.

---

## Technologies Used

- **Backend**: Python (Django)
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite (default Django database)
- **Other Tools**:
  - Django REST Framework (for API endpoints)
  - Fetch API (for AJAX requests)
  - CSS Animations (for smooth transitions)

---

## Setup Instructions

### Prerequisites

1. **Python**: Ensure Python 3.x is installed.
2. **Django**: Install Django using pip:
   ```bash
   pip install django
