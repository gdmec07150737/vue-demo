<template>
  <a-form-model layout="inline" :model="formInline" @submit="handleSubmit" @submit.native.prevent>
    <a-form-model-item>
      <a-input v-model="formInline.email" placeholder="email">
        <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-input v-model="formInline.password" type="password" placeholder="密码">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-input v-model="formInline.confirmpassword" type="password" placeholder="确认密码">
        <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
      </a-input>
    </a-form-model-item>
    <a-form-model-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="formInline.user === '' || formInline.password === ''"
      >
        注册
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
        confirmpassword: '',
      },
    };
  },
  methods: {
    handleSubmit(e) {
      console.log(this.formInline.email);
      console.log(this.formInline.password);
      console.log(this.formInline.confirmpassword);
      if(this.formInline.email == '') {
        alert('邮箱不能为空!')
        return false;
      }

      if(this.formInline.password == '' | this.formInline.confirmpassword == '') {
        alert('请输入密码')
        return false;
      }

      if(this.formInline.password !== this.formInline.confirmpassword) {
        alert('密码和确认密码不一致')
        return false;
      }
      this.$axios({
          method:'post',
          url:'http://127.0.0.1:9501/user/registered',
          data:{
                email:this.formInline.email,
                password:this.formInline.password
          }
      }).then((response) =>{
          this.$router.push({
            path: 'login',
          });
      }).catch((error) =>{
          alert(error.response.data)
      })
    },
  },
};
</script>