# What's Poppin'?

Project: Created an application to exhibit and challange myself of what I am capable off with what I have learned from web development.
(The Odin Project - Final JavaScriptProject)

# Summary

The application allows users to create an account and login into an existing account as well. A search bar is built into the header that
searches for the indicated post based on the title on the input. A user can create a text post, an image post (but pasting the link of the desire 
image they wish to display), or a link post. The user has three options to choose from to view the psot board. From most like to least, oldest to newest
and newes to oldest. As well as how to view the comments. The user can up and down vote a post from the homepage and click on a post. Once a post has been 
selected the user can read comments left on it as well as leave a comment on the post or a reply to a comment. The user can also vote on the comments. 

# Technologies

HTML, CSS, JavaScript, React (Routem Use-state, Use-Effect, Use-Ref), BootStrap Icons, Firebase (Firestore Database, Authentication)

# Challenges 

Understood the many features Firebase has to offer such as its authentication services, realtime database, and firestore database. I big challenge I came
across in this project was how render the nested replies to the comments on the posts. I knew how to set and the data structure but at the moment I was using
Firebase's Realtime Database as a back-end service. So it became difficult to save the data and to call it as well. This is where I learned Firebase's Realtime Database is a bit outdated because it becomes difficult dealing with nested data. Firestore Database on the other hand allows you to work with nested data. I used recursion along
side Firestore database to save and access the nested data that made the nested comment section on the application. 
