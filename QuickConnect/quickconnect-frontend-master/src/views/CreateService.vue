<template>
  <div class="div-body">
    <AdminNavbar/>
    <b-row class="custom-container">
      <b-col cols="12">
        <b-container style="margin-top: 5vh;">
          <b-row class="custom-row post-feed">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <div style="width: 100%;">                        
                <b-button style="width: 100%; margin-bottom: 10px;" variant="primary" type="button" @click="openForm = !openForm;" >create new service</b-button>
              </div>
              <b-form @submit.prevent="submitForm" v-if="openForm">
                <div style="width: 100%; margin-bottom: 10px;">
                  <input type="text" required v-model="serviceTitle" class="form-control main-feed-post" placeholder="Enter service title ...">                        
                </div>
                <div style="width: 100%; margin-bottom: 10px;">
                  <input type="text" required v-model="serviceWork" class="form-control main-feed-post" placeholder="Describe your service ...">                        
                </div>
                <div style="width: 100%; margin-bottom: 10px;">
                  <input type="number" required v-model="price" class="form-control main-feed-post" placeholder="Enter price per hour ...">                        
                </div>
                <div style="width: 100%;">                        
                <b-button style="width: 20%; float: right; margin-bottom: 10px;" variant="primary" type="submit">create</b-button>
              </div>
              </b-form>
            </b-col>
          </b-row>
          <b-row class="custom-row" v-if="allServices">
            <b-col class="col-md-8 col-sm-11" style="margin: auto; padding: 0px !important">
              <b-card-group v-for="(service, index) in allServices" :key="index" deck class="text-left main-posts">
                <b-card header-tag="header" footer-tag="footer" class="uplifted">
                  <template #header>
                    <h6 class="mb-0">{{service.title}}</h6>
                  </template>
                  <b-card-text>{{service.description}}</b-card-text>
                  <b-card-text><b>Price</b>: $ {{service.price}}/hr</b-card-text>
                  <hr/>
                  <div>
                    <b-card-text style="float: left">
                      {{service.num_likes}} 
                      <font-awesome-icon style="cursor: pointer; color: var(--primary); margin-left: 5px; font-size: 20px;" icon="thumbs-up" />
                    </b-card-text>
                  </div>
                  <template #footer>
                    <div v-for="(comment, index2) in service.comments" :key="index2">
                        <p>
                          <b>{{comment.from_name}}</b>: {{comment.content}}
                        </p>
                      </div>
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
        <p class="text-left">New service has been created!</p>
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

export default {
  name: "CreateService",
  components: {
    AdminNavbar
  },
  data() {
    return {
      serviceTitle: null,
      serviceWork: null,
      price: null,
      openForm: false,
      username: null,
      userInfo: null,
      allServices: [],
    };
  },
  methods: {
    async submitForm() {
      try {
        let response = await axios.post('/services', {
          service: {
            title: this.serviceTitle,
            description: this.serviceWork,
            price: this.price,
            user_id: this.userInfo.id,
            user_name: this.userInfo.name,
            id: this.allServices.length + 1,
            num_likes: 0,
            comments: [],
          }
        });
        this.allServices = response.data.result;
        this.openForm = !this.openForm;
        this.$bvModal.show('modal-success');
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
    async getServices() {
      try {
        let response = await axios.get('/getService/'+this.userInfo.id);
        this.allServices = response.data.result;
      } catch (error) {
        this.$bvModal.show('modal-failure');
      }
    },
  },
  async mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await this.getServices();
  },
};
</script>

<style scoped lang="scss">
.div-body {
  min-height: 100vh;
  overflow-x: hidden !important;
  background-image: url('../assets/Groups.jpg');
  background-position:center;
  background-repeat:no-repeat;
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
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
