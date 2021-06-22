let master,
    masterdata,
    admin1,
    admin1data,
    admin2,
    admin2data,
    user1,
    user1data,
    user2,
    user2data

master = `{
  "isMaster": "true",
  "isAdmin": "true",
  "email": "master@ex.com",
  "password": "imtheboss"
}`

masterdata = `{
  "handle": "TheBoss",
  "firstName": "The",
  "middleName": "Head",
  "lastName": "Honcho",
  "location": "Upstairs office",
  "bio": "I pwn everyone here",
  "avatar": "/some/awesome/path/awesome.png"
}`

admin1 = `{
  "isMaster": "false",
  "isAdmin": "true",
  "email": "admin1@ex.com",
  "password": "admin1"
}`

admin1data = `{
  "handle": "Underling1",
  "firstName": "Some",
  "middleName": "Guys",
  "lastName": "Friend",
  "location": "Second floor office",
  "bio": "I just work here",
  "avatar": "/some/path/cute.png"
}`

admin2 = `{
  "isMaster": "false",
  "isAdmin": "true",
  "email": "admin2@ex.com",
  "password": "admin2"
}`

admin2data = `{
  "handle": "Underling2",
  "firstName": "Guys",
  "middleName": "Other",
  "lastName": "Buddy",
  "location": "Second floor closet",
  "bio": "I know the boss",
  "avatar": "/some/path/llama.png"
}`

user1 = `{
  "isMaster": "false",
  "isAdmin": "false",
  "email": "user1@ex.com",
  "password": "iwritecoolstuff"
}`

user1data = `{
  "handle": "CoolUser",
  "firstName": "Best",
  "middleName": "Nerd",
  "lastName": "Ever",
  "location": "The Basement",
  "bio": "AMA",
  "avatar": "/some/path/glasses.png"
}`

user2 = `{
  "isMaster": "false",
  "isAdmin": "false",
  "email": "user2@ex.com",
  "password": "iamthestrongest"
}`

user2data = `{
  "handle": "StrongUser",
  "firstName": "Eye",
  "middleName": "Lift",
  "lastName": "Weights",
  "location": "The Gym",
  "bio": "Do you even lift?",
  "avatar": "/some/path/dumbbell.png"
}`

master = JSON.parse(master)
masterdata = JSON.parse(masterdata)
admin1 = JSON.parse(admin1)
admin1data = JSON.parse(admin1data)
admin2 = JSON.parse(admin2)
admin2data = JSON.parse(admin2data)
user1 = JSON.parse(user1)
user1data = JSON.parse(user1data)
user2 = JSON.parse(user2)
user2data = JSON.parse(user2data)


exports.users = { master,
                  masterdata,
                  admin1,
                  admin1data,
                  admin2,
                  admin2data,
                  user1,
                  user1data,
                  user2,
                  user2data }
