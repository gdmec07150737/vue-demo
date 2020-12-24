<template>
  <a-form-model layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item>
      <a-input v-model="formInline.email" placeholder="email">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-input v-model="formInline.password" type="password" placeholder="Password">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="formInline.user === '' || formInline.password === ''"
      >
        Log in
      </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    handleSubmit(e) {
      this.$axios({
          method:'post',
          url:'http://127.0.0.1:9501/user/login',
          data:{
                email:this.formInline.email,
                password:this.formInline.password,
          }
      }).then((response) =>{
          this.$store.commit('setAuthorization', response.data.token)
          this.$store.commit('login', true)
          this.$store.commit('setId', response.data.id)
          localStorage.setItem('authorization',response.data.token)
          localStorage.setItem('id',response.data.id)
          localStorage.setItem('login',true)
          this.$router.push({
            path: 'index',
          });
      }).catch((error) =>{
          alert(error.response.data.msg)
      })
    },
  },
};
</script>