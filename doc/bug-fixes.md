# Bug Fixes & Improvements

Check off when fixed and deployed:

1. If another user joins game and has the same name as an existing user the first user is being overwritten ✅

2. Fix chatbox text field so its not included in scroll and the scroll stays at the bottom with most recent messages

3. Add validation to forms

   - Game Lobby form: genre is required

4. Not all genres are working ✅

5. Keyboard pause button stops audio

6. Shouldn't be able to send a blank message in chatbox

7. Progess bar lags after the first round ✅

8. Shouldn't be able to send a blank message ✅

9. UserForm should be passed the user state and not re-create it

10. Client sockets will randomly disconnect/reconnect if left idol or several players in room

    - this also seems to cause the Host boolean to be set to false and then none of the players can start the game

11. Overall performance degrades with each round

12. Find a way to clear the room ID if a use is not successful loggin in
