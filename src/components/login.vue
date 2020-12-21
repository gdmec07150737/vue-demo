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
      console.log(this.formInline.email);
      console.log(this.formInline.password);
      this.$axios({
          method:'post',
          url:'http://127.0.0.1:9501/user/login',
          data:{    //这里是发送给后台的数据
                email:this.formInline.email,
                password:this.formInline.password,
          }
      }).then((response) =>{
          //console.log(response.data)       //请求成功返回的数据
          this.$router.push({
            path: 'index'
          });
      }).catch((error) =>{
          alert('请输入正确的用户名和密码！')
          //console.log(error.response.data)       //请求失败返回的数据
      })
    },
  },
};
</script>