!["logo"](https://teams-microsoft-ms.herokuapp.com/static/media/Microsoft%20Logo.564db913.svg)

# **Microsoft Teams**

!["home page"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Home%20Page.png)

Project Link: [teams-microsoft-ms.herokuapp.com/](teams-microsoft-ms.herokuapp.com/)
<br>
Demo Video Link: [https://www.youtube.com/watch?v=2KMvn1nJiW8](https://www.youtube.com/watch?v=2KMvn1nJiW8)

<br>

---

## **Tech Stack Used**

---

- #### _Language_
  - JavaScript

* #### _Server Side_

  - Node.js
  - Express.js
  - MongoDB (Database)
  - Socket.io

* ### _Client Side_
  - React.js
  - Socket.io-client
  - Simple-peer

<br>

---

## **Features**

---

- ### **Main Feature - Video Calling between two users**

  - Two users in contact can connect with each other through video calling facility.
  - This Video Calling feature is implemented using _simple-peer_ webRTC technolgy and _socket.io_.

  !["video call"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/VideoCall.png)

- ### **Second Priority Feature - Chat between two users**

  - Real time chat between two users facility.
  - Previous messages are stored in the database and can be accessed afterwards.
  - This features is implemented using _socket.io_.

    <br>

  !["chat"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Chat.png)

<br>

---

## **Additional Features**

---

1. #### **Sign up**
   - Signup feature with encrypted password (hashed + salted)
   - Implemented using bcrypt

!["signup"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Signup.png)

2. #### **Login / Sign Out**
   - Login feature help to give access to the team and user can chat, video call, create and create and join teams and create notes
3. #### **Create New Personal Chat**

   - Users can start a new chat with the existing contacts.
   - Contacts here means all the users that exits in a team joined/created by the user

4. #### **Teams Page**
   - All the teams which the user is memeber of are listed

!["teams"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Teams.png)

5. #### **Create Teams**

   - Users can create new teams and share the team code with the other users to join
     <br>

!["Create Teams"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/CreateTeam.png)

6. #### **Join Teams**
   - User can join an existing teams using team code.
7. #### **Leave Teams**
   - User can exit an joined team
8. #### **Group Video Call (Teams Video Call)**
   - Users in the team can join a group video chat (maximum 4 members)
9. #### **Group Chat**
   - Users can chat in the team (group)
   - This is implemented using socket.io
     <br>

!["Group Chat"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Teams%20Chat.png)

9. #### **Video Toggle**
   - Users can switch on and off there video.
10. #### **Audio Toggle**
    - Users can switch on and off there auido.
11. #### **Create Notes For Teams**
    - Users can create new notes and view create by other users in the teams.

!["Notes"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Notes.png)

12. #### **Search Users**
    - User can search the contacts from the search bar

!["Search"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Search.png)

13. #### **Contacts Page**
    - All the contacts of the user are displayed here
    - Contacts means all the users common to some of the teams in which the user(logged in) is the memeber

!["signup"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Contact.png)

14. #### **UI Similar to Teams**
    - The site has an UI similar to the Microsoft Teams
      <br>
15. #### **Responsive UI**
    - The site is responsive

!["signup"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Responsive.png)

<br>

---

## **Agile Methodology**

---

I managed work by making a list of tasks to be completed on a specified date, so that whole project could be successfully completed. I had to practice management from the beginning to achieve the result
<br>
In this process I separated the task into tiny subtasks.

- Starting with the project firstly, I added the video calling feature in the initial stage.
- Then I implemented the authentication task for signup and login
- After this I tried to move on to the group video calling feature (max. 4 users only) as well.
- I implemented real time chat feature for two users.
- Then I also implemented it for mutiple users as well (group chat).
- Later I came up with teams feature (creating/joining team)
- Then I added some more features to the video calling like audio and video toggle.
- I had to deal with some bugs. So they became my more priorty task to be solved.
- I've added a few additional feature of creating and viewing notes.
- Last but not the least, I added a leave team funtionality.
- Still there's so much to be worked upon and perhaps this journey won't end.

<br>

!["trello"](https://raw.githubusercontent.com/EkjotKaur/Microsoft.Teams/main/client/src/assets/Screenshots/Trello-2.png)

<!-- > Blockquote

## Heading 2

_Hello_

**Hello**

[login](https://teams-microsoft-ms.herokuapp.com/login, "Login Page") -->
