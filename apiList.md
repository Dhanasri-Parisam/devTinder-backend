# DevTinder APIS

- POST /Signup : User Registration
- POST /Login : User Login
- POST /Profile : Create or Update User Profile 
- POST /Logout : User Logout
- POST /Like : Like a User
- POST /Dislike : Dislike a User
- POST /Matches : Get User Matches
- POST /Messages : Send Message to Match
- POST /CONNECT : Connect to WebSocket for Real-time Chat
- POST /Status : Update User Online Status(Status: ignored, intrested, accepted, rejected)
- POST /Password/Reset : Reset User Password
- POST /Password/Change : Change User Password
- POST /Notifications : Get User Notifications
- POST /Search : Search Users by Name or Interests
- POST / request/review/accepted/:requestId
- POST / request/review/rejected/:requestId

- GET /Signup : Check if User Email or Username is Available
- GET /Login : Validate User Login Credentials
- GET /Profile : Get User Profile Information
- GET /Matches : Get List of User Matches
- GET /Users : Get List of Users based on Preferences
- GET /Notifications : Get User Notifications
- GET /Messages : Get Chat Messages with a Match
- GET /Search : Search Users by Name or Interests

- DELETE /Profile : Delete User Profile
- DELETE /Matches : Remove a Match
- DELETE /Messages : Delete Chat Messages with a Match
- DELETE /Account : Delete User Account

- PUT /Profile : Update User Profile Information
- PUT /Settings : Update User Account Settings
- PUT /Password : Change User Password
- PUT /Notifications : Update Notification Preferences

- PATCH /Profile/Picture : Update Profile Picture
- PATCH /Profile/Interests : Update User Interests
- PATCH /Status : Update User Online Status
- PATCH /Location : Update User Location
- PATCH /Visibility : Update Profile Visibility Settings
- PATCH /Bio : Update User Bio
- PATCH /Preferences : Update Match Preferences

