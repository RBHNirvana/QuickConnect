<template>
  <div class="div-body">
    <Navbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 5vh;">
          <b-row class="custom-row post-feed">
            <b-col class="col-md-8 col-sm-10" style="margin: auto; padding: 0px !important">
              <b-form @submit.prevent="submitForm">
                <div style="float: left; width: 80%;">
                  <input type="text" required v-model="mainPost" class="form-control main-feed-post" placeholder="Share your words ...">                        
                </div>
                <div style="float: left; width: 17%; margin-left: 3%;">                        
                  <b-button style="width: 100%; height: 70px;" variant="primary" type="submit">Post</b-button>
                </div>
              </b-form>
            </b-col>
          </b-row>
          <b-row class="custom-row">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <b-card-group v-for="(post, index) in allPosts" :key="index" deck class="text-left main-posts">
                <b-card header-tag="header" footer-tag="footer" class="uplifted">
                  <template #header>
                    <h6 class="mb-0">{{post.user_name}}</h6>
                  </template>
                  <b-card-text>{{post.text}}</b-card-text>
                  <hr/>
                  <div>
                    <b-card-text style="float: left">
                      <b>{{post.num_likes}}</b> likes and <b>{{post.comments.length || 0}}</b> comments
                    </b-card-text>
                    <b-button @click="sendInitialComment(post)" style="font-size: 10px; float: right;" variant="outline-primary">comments</b-button>
                    <b-button @click="sendLike(post)" style="margin-right: 10px; font-size: 10px; float: right;" variant="outline-primary"><font-awesome-icon style="color: var(--primary); font-size: 10px;" icon="thumbs-up" /></b-button>
                    <!-- <font-awesome-icon @click="sendLike(post)" style="float: right; cursor: pointer; color: var(--primary); margin-left: 10px; font-size: 20px;" icon="thumbs-up" />                       -->
                    
                    
                  </div>
                  <template #footer v-if="openFormComment == post.id">
                    <div v-for="(comment, index2) in post.comments" :key="index2">
                      <p>
                        <b>{{comment.from_name}}</b>: {{comment.content}}
                      </p>
                    </div>
                    <b-form @submit.prevent="sendComment(post)">
                      <div style="float: left; width: 80%;">
                        <input type="text" required v-model="mainComment" class="form-control" placeholder="Write your comment here ...">                        
                      </div>
                      <div style="float: left; width: 17%; margin-left: 3%;">                        
                        <b-button style="width: 100%;" variant="primary" type="submit"><font-awesome-icon icon="paper-plane" /></b-button>
                      </div>
                    </b-form>
                  </template>
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
      <b-button class="mt-3" block color="primary" @click="$bvModal.hide('modal-success')">CLOSE</b-button>
    </b-modal>
    <b-modal id="modal-failure" hide-footer>
      <template v-slot:modal-title>
        FAILURE
      </template>
      <div class="d-block text-center">
        <p class="text-left">Something went wrong!</p>
      </div>
      <b-button class="mt-3" color="primary" block @click="$bvModal.hide('modal-failure')">CLOSE</b-button>
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
  name: "UserFeed",
  components: {
    Navbar
  },
  data() {
    return {
      mainComment: null,
      mainPost: null,
      allPosts: [],
      userInfo: null,
      openFormComment: null,
    };
  },
  methods: {
    sendInitialComment(post) {
      this.openFormComment = post.id;
    },
    async sendComment(post) {
      try {
        let response = await axios.post('/postComment', {
          id: post.id,
          content: this.mainComment,
          from_id: this.userInfo.id,
          from_name: this.userInfo.name,
        });    
        if(response.data.result == 'Hate Speech')  {
          this.$bvModal.show('modal-failure2');
        } else {
          this.mainComment = null;
          this.allPosts = response.data.result;
        }
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async sendLike(post) {
      try {
        let response = await axios.post('/postLike', {
          id: post.id
        });      
        this.allPosts = response.data.result;
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async submitForm() {
      try {
        let response = await axios.post('/posts', {
          id: this.allPosts.length,
          user_name: this.userInfo.name,
          text: this.mainPost,
          num_likes: 0,
          comments: [],
        });      
        this.allPosts = response.data.result;
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async getPosts() {
      try {
        let response = await axios.get('/posts');
        this.allPosts = response.data.result;
        console.log("allPosts: ", this.allPosts);
      } catch (error) {
        // this.$bvModal.show('modal-failure');
      }
    },
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await this.getPosts();
  },
};
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

.post-feed {
  margin-bottom: 15px;
}
.main-feed-post {
  height: 70px;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
