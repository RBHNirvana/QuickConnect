<template>
  <div class="div-body">
    <Navbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 5vh;">
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <b-card-group v-for="(service, index) in allServices" :key="index" deck class="text-left main-posts">
                <b-card header-tag="header" footer-tag="footer" class="uplifted">
                  <template #header>
                    <h4 class="mb-0" style="float: left;">{{service.title}}</h4>
                    <!-- <b-button @click="sendMessage(service)" style="font-size: 10px; float: right; margin-left: 10px;" variant="outline-primary">contact</b-button>
                    <b-button @click="sendComment(service)" style="font-size: 10px; float: right;" variant="outline-primary">comment</b-button> -->
                  </template>
                  <b-card-text>Service Provider - {{service.user_name}}</b-card-text>
                  <b-card-text>{{service.description}}</b-card-text>
                  <b-card-text>Cost per hour e.g. $ {{service.price}}/hr</b-card-text>
                  <hr/>
                  <div>
                    <b-card-text style="float: left">
                      <b>{{service.num_likes}}</b> likes and <b>{{service.comments.length || 0}}</b> comments
                      <!-- <font-awesome-icon @click="sendLike(service)" style="cursor: pointer; color: var(--primary); margin-left: 10px; font-size: 20px;" icon="thumbs-up" /> -->
                    </b-card-text>
                    <b-button @click="sendMessage(service)" style="font-size: 10px; float: right; margin-left: 10px;" variant="outline-primary">contact</b-button>
                    <b-button @click="sendComment(service)" style="font-size: 10px; float: right;" variant="outline-primary">comment</b-button>
                    <b-button @click="sendLike(service)" style="margin-right: 10px; font-size: 10px; float: right;" variant="outline-primary"><font-awesome-icon style="color: var(--primary); font-size: 10px;" icon="thumbs-up" /></b-button>
                  </div>
                  <template #footer v-if="openFormComment == service.id || openForm == service.id">
                    <div v-if="openFormComment == service.id">
                      <div v-for="(comment, index2) in service.comments" :key="index2">
                        <p>
                          <b>{{comment.from_name}}</b>: {{comment.content}}
                        </p>
                      </div>
                      <b-form @submit.prevent="sendCommentMain(service)">
                        <div style="float: left; width: 80%;">
                          <input type="text" required v-model="mainComment" class="form-control" placeholder="Write your comment here ...">                        
                        </div>
                        <div style="float: left; width: 17%; margin-left: 3%;">                        
                          <b-button style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="paper-plane" /></b-button>
                        </div>
                      </b-form>
                    </div>
                    <div v-if="openForm == service.id">
                      <b-form @submit.prevent="sendMessageToProvide(service)">
                        <div style="float: left; width: 80%;">
                          <input type="text" required v-model="mainMessage" class="form-control" :placeholder="customPlaceholder">                        
                        </div>
                        <div style="float: left; width: 17%; margin-left: 3%;">                        
                          <b-button style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="paper-plane" /></b-button>
                        </div>
                      </b-form>
                    </div>
                  </template>
                  <!-- <template #footer v-if="openForm == service.id">
                    <b-form @submit.prevent="sendMessageToProvide(service)">
                      <div style="float: left; width: 80%;">
                        <input type="text" required v-model="mainMessage" class="form-control" :placeholder="customPlaceholder">                        
                      </div>
                      <div style="float: left; width: 17%; margin-left: 3%;">                        
                        <b-button style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="paper-plane" /></b-button>
                      </div>
                    </b-form>
                  </template> -->
                </b-card>
              </b-card-group>
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
    <b-modal id="modal-failure2" hide-footer>
      <template v-slot:modal-title>
        FAILURE
      </template>
      <div class="d-block text-center">
        <p class="text-left">Please do not use any rude or inappropriate comment! Let's spread positivity.</p>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('modal-failure2')">CLOSE</b-button>
    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import axios from "../axios_instance.js";

export default {
  name: "AdminOrganization",
  components: {
    Navbar
  },
  data() {
    return {
      openFormComment: null,
      customPlaceholder: "Send message ...",
      mainMessage: null,
      allServices: [],
      openForm: null,
      userInfo: null,
      mainComment: null,
    };
  },
  methods: {
    sendComment(service) {
      this.openForm = null;
      this.openFormComment = service.id;
    },
    sendMessage(service) {
      this.openFormComment = null;
      this.openForm = service.id;
      this.customPlaceholder = "Send message to "+ service.user_name + " ...";
    },
    async sendLike(service) {
      try {
        let response = await axios.post('/postLikeService', {
          id: service.id
        });      
        this.allServices = response.data.result;
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async sendCommentMain(service) {
      try {
        let response = await axios.post('/postCommentService', {
          id: service.id,
          content: this.mainComment,
          from_id: this.userInfo.id,
          from_name: this.userInfo.name,
        });      
        if(response.data.result == 'Hate Speech')  {
          this.$bvModal.show('modal-failure2');
        } else {
          this.mainComment = null;
          this.allServices = response.data.result;
        }
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async sendMessageToProvide(service) {
      try {
        let response = await axios.post('/sendMessageToServiceProvider', {
          message: {
            from_id: this.userInfo.id,
            from: this.userInfo.name,
            to_id: service.user_id,
            to: service.user_name,
            message: this.mainMessage
          }
        });      
        this.mainMessage = null;
        this.$router.push("/inbox");
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async services() {
      try {
        let response = await axios.get('/services');
        this.allServices = response.data.result;
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await this.services();
  }
}
</script>

<style scoped lang="scss">
.div-body {
  min-height: 100vh;
  overflow-x: hidden !important;
  background-image: url('../assets/Groups.jpg');
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

.main-posts {
  margin-bottom: 20px;
}
</style>
