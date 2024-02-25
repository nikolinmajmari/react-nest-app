# MDM

Real time chat applications. Features already implemented.

## App Structure 

- **apps** applications can be found here 
  - **chats** system backend build with nest-js , postgres and typeorm
  - **client** front end build with react, typescript and redux
- **libs** libraries shared between apps 
  - **event-emitter** client side node-js like event emitter used in react app as global event emitter 
  - **mdm-core** core interfaces and constants shared between client and server 
  - **mdm-js-client** http client which wraps fetch api to query backend 
  - **replyable** stores callbacks so they can be called multiple times in case they fail. Uses abort controller to manually abort task. 
  - **ws-rpc-adapter** wrapper around DOM WebSocket to support synchronous communication mimicking rpc protocol. 


### Real time communication
 - Messages are transmitted via websocket 
 - node-poppler is used to create thumbnails for images and pdf files
 - 
![Instant Messaging](/docs/gifs/Real%20Time%20Messaging.gif)


### Channel Media Management 
- Upload different types of media like images, pdf , files, audio etc. 
- Cancel upload operation and restart it back any time
- Manage channel media

![Media Messaging](/docs/gifs/Media%20Management.gif)

- Audio Recording

![Audio Recording](/docs/gifs/Audio%20Recording.gif)


### Channel Management
- Manage channel members 
- Assign admin roles
- remove channel members

![Media Messaging](/docs/gifs/Channel%20Management.gif)


### Create New Channels 
 - private channels 
 - group channels

![Media Messaging](/docs/gifs/New%20Channels.gif)


###  Ws Auto Connect

- Auto Connect via websocket when connection is lost
![Media Messaging](/docs/gifs/WS%20AutoConnect.gif)
