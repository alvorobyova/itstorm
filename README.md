## Online promotion services agency website 🔝

The project is implemented in the Angular framework, the programming language used is TypeScript.</br>
Layout only in desktop version.

<h3>Home page</h3>
✔️ there are 2 carousels (OwlCarousel), and an interactive map Google.Maps has been added</br>
✔️ when you click on the banner or the ‘More details’ button in the services block, a service request form appears, the service is automatically selected in accordance with which banner or which card button the user clicked</br>
✔️ when you click on the ‘Order a consultation’ and ‘Leave a request’ button, a request is sent to the server with the appropriate type of request, and the user is shown the ‘Thank you for your request!’ window

<h3>Blog page</h3>
✔️ sorting and filtering of articles, pagination have been implemented, you can also go to the page of a specific article

<h3>Separate blog article</h3>

The article is displayed, as well as other articles related to it</br>

The page is available in 3 options:

1) user is not authorized - you cannot leave comments and reactions to articles, the user is asked to register or log into the profile if he is already registered
2) user is authorized, but there are no comments on the article yet - comments are allowed, the text 'Be the first to leave your comment on the article!' will be displayed.
3) user is authorized, there are comments on the article - by default, the last 3 comments on the article are loaded. If an article has more comments, the ‘Load more comments’ button is displayed. If an article has 3 comments or less, this button is missing. When you click on the button, 10 more comments are loaded. If, after loading 10 comments, the article has more comments, then the ‘Load more comments’ button is displayed again, otherwise this button is not displayed.
> [!Note]
> _The text entry area is required. If the field is empty, then the button is not available for clicking. After a user leaves a comment, the comment block is updated so that the comment left appears on the page_


<h4>Likes/dislikes</h4>
✔️ after the user has left a reaction to the comment, the corresponding button is highlighted in blue. When you click the button again, the reaction is removed</br>
✔️ it is impossible to select both reactions, that is, if the user liked it and then disliked it, then the backend will remove the like and dislike it</br>
✔️ after the user puts a reaction, he is shown the message ‘Your vote has been counted’ (implemented using HotToast)</br>
✔️ when the user opens the page, the list of assigned reactions is loaded, a check is made to see whether a reaction was given to this article, and, if necessary, this reaction is highlighted in blue (except for a complaint about a comment)

<h4>Complaint about the article</h4>
When the user clicks on the button with an exclamation mark, the message ‘Complaint has been sent’ is displayed. The state of the icon does not change after this. If the user clicks on this icon again, the user will be prompted with the message ‘Complaint has already been sent’.

<h3>User authorization/registration</h3>

All form fields are checked for compliance with the following requirements:

- all fields must be filled in</br>
- field 'name' can contain Russian letters and spaces, and each new word is capitalized</br>
- the 'email' field undergoes standard email validation</br>
- the 'password' field must be at least 8 characters long, contain at least 1 uppercase letter and at least 1 number</br>

By default, the Login/Register button is disabled. When all form fields are filled in and valid, the user can proceed to further actions.</br>

> [!Note]
> _After the user has logged in, the header instead of ‘Login’ displays ‘Hello, name!’, where name is the username specified during registration. When you click on ‘Hello, name!’, a ‘Logout’ dropdown appears, clicking on which the user can log out_

<hr>

run backend → `npm start`<br>
run app → `ng serve --o`
