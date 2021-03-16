<template>
  <div class="div-body">
    <AdminNavbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 2vh;">
          <b-row class="custom-row">
            <b-col class="col-md-4 col-sm-5" style="margin: auto; padding: 20px !important">
              <div class="chat-list text-left">
                <h3><b>Chats</b></h3>
                <hr/>
                <div @click="showChat(user)" v-for="(user, index) in connectedUsers" :key="index"  class="list-of-people">
                  <label>{{user.name}}</label>
                </div>
              </div>
            </b-col>
            <b-col class="col-md-8 col-sm-7" style="margin: auto; padding: 0px !important">
              <div class="message-list text-left">
                <h3><b>User Name</b></h3>
                <hr/>
                <div v-for="(message, index) in messages" :key="index">
                  <div v-if="userInfo.id == message.from_id" class="message-me">
                    <label><i><b>{{userInfo.name}}</b></i></label><br/>
                    {{message.message}}
                  </div>
                  <div v-else class="message-you">
                    <label><i><b>{{message.from}}</b></i></label><br/>
                    {{message.message}}
                  </div>
                </div>
              </div>
              <div style="margin-top: 1vh" class="text-left">
                <b-form @submit.prevent="sendMessage">
                    <div style="float: left; width: 80%;">
                      <input style="height: 9vh;" type="text" required v-model="userMessage" class="form-control" placeholder="Write your message here ...">                        
                    </div>
                    <div style="float: left; width: 17%; margin-left: 3%;">                        
                      <b-button style="height: 9vh; width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="paper-plane" /></b-button>
                    </div>
                  </b-form>
              </div>
              <!-- <b-card-group deck class="text-left main-posts">
                <b-card header-tag="header" footer-tag="footer" class="uplifted">
                  <template #header>
                    <h6 class="mb-0">Name of the user</h6>
                  </template>
                  <b-card-text>Main post of the user goes here. People can see the post and daily posts. No need to add anyone. All posts are public.</b-card-text>
                  <b-button href="#" variant="primary">Like</b-button>
                  <template #footer>
                    <div>
                      <p>
                        <b>User Name</b>: H aosd osajd 0oqiwjdasndkq whdiqw nqw lkjdn qwijdnw qid wijnd ijqwndijnaksdn iqwnd kamsnd ,m
                      </p>
                    </div>
                    <b-form @submit.prevent="submitForm">
                      <div style="float: left; width: 80%;">
                        <input type="text" required v-model="username" class="form-control" placeholder="Write your comment here ...">                        
                      </div>
                      <div style="float: left; width: 17%; margin-left: 3%;">                        
                        <b-button style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="paper-plane" /></b-button>
                      </div>
                    </b-form>
                  </template>
                </b-card>
              </b-card-group> -->
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-modal id="modal-success" hide-footer>
      <template v-slot:modal-title>
        SUCCESS
      </template>
      <div class="d-block text-center">
        <p class="text-left">Task status has been updated!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-failure" hide-footer>
      <template v-slot:modal-title>
        FAILURE
      </template>
      <div class="d-block text-center">
        <p class="text-left">Something went wrong!</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-failure')">CLOSE</b-button>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import AdminNavbar from "@/components/AdminNavbar.vue";
import axios from "../axios_instance.js";
import io from 'socket.io-client';

export default {
  name: "Inbox",
  components: {
    AdminNavbar
  },
  data() {
    return {
      userMessage: null,
      socket : io(''+process.env.VUE_APP_SOCKET_URL),
      connectedUsers: [],
      messages: [],
      openForm: false,
      userInfo: null,
      selectedUser: null,
    };
  },
  methods: {
    async sendMessage() {
      this.socket.emit('SEND_MESSAGE', {
          from_id: this.userInfo.id,
          from: this.userInfo.name,
          to_id: this.selectedUser.id,
          to: this.selectedUser.name,
          message: this.userMessage
      });
      this.userMessage = '';
    },
    async showChat(user) {
      this.selectedUser = user;
      try {
        let response = await axios.get('/getMessages/'+this.userInfo.id+'/'+user.id);
        this.messages = response.data.result;
      } catch (error) {
        alert("Something went wrong!");
      }
    },
    async getConnectedUsers() {
      try {
        let response = await axios.get('/getConnectedUsers/'+this.userInfo.id);
        this.connectedUsers = response.data.result;
        console.log("connectedUsers: ", this.connectedUsers);
      } catch (error) {
        alert("Something went wrong!");
      }
    },
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.getConnectedUsers();
    this.socket.on('MESSAGE', (data) => {
        this.messages = [...this.messages, data];
        console.log("this.messages: ", this.messages);
    });
  },
};
</script>

<style scoped lang="scss">
.div-body {
  min-height: 100vh;
  overflow-x: hidden !important;
  overflow-x: hidden !important;
  background-image: url('../assets/Group 16.jpg');
  background-position:center;
  // background-repeat:no-repeat;
  background-size:cover;
}
.custom-row {
  padding-top: 7px;
}

table,
td,
th {
  border: 1px solid #ddd !important;
  text-align: left !important;
}

table {
  border-collapse: collapse !important;
  width: 100% !important;
}

th,
td {
  padding: 7px !important;
}

td:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.previewImg {
  max-width: 100%;
  max-height: 150px;
}

.sentence {
  text-align: left;
}

.uplifted {
  box-shadow: 1px 1px 1px 1px rgb(224, 224, 224);
  border: 1px solid rgb(212, 212, 212);
}

.card-header {
  background-color: var(--accent);
}

.post-feed {
  margin-bottom: 15px;
}

.main-feed-post {
  height: 70px;
  padding-top: 20px;
  padding-bottom: 20px;
}

.chat-list {
  padding: 10px;
  background-color: var(--accent);
  height: 80vh;
  border: 1px solid rgb(212, 212, 212);
  overflow-y: scroll;
}
.message-list {
  padding: 10px;
  background-color: var(--accent);
  height: 70vh;
  border: 1px solid rgb(212, 212, 212);
  overflow-y: scroll;
}
.list-of-people {
  background-color: var(--accentTwo);
  border-radius: 25px;
  padding: 13px 15px 5px 15px; 
  border: 1px solid rgb(240, 240, 240);
  cursor: pointer;
  margin-bottom: 15px;
}
.message-me {
  background-color: var(--accent);
  text-align: right !important;
  overflow-wrap: break-word !important;
  border-radius: 25px;
  padding: 6px 15px 5px 15px; 
  border: 1px solid rgb(240, 240, 240);
  margin-bottom: 15px;
}
.message-me > label {
  font-size: 12px;
}
.message-you > label {
  font-size: 12px;
}
.message-you {
  background-color: var(--accentTwo);
  border-radius: 25px;
  text-align: left !important;
  padding: 6px 15px 5px 15px; 
  border: 1px solid rgb(240, 240, 240);
  margin-bottom: 15px;
}
</style>
