<template>
  <div>
    <div class="components-input-demo-size">
        <a-input-search placeholder="输入邮箱" v-model="value" style="width: 200px" @search="onSearch" />
        <a-input v-show="ok" placeholder="邮箱" v-model="email"/>
        <a-input-password v-show="ok" placeholder="密码" v-model="password"/>
        <a-input-password v-show="ok" placeholder="确认密码" v-model="confirmpassword"/>
        <a-button class="editable-add-btn" @click="handleAdd">
        添加
        </a-button>
        <a-button type="primary" @click="Logout()">
            退出登录
        </a-button>
    </div>
    <a-table 
        :rowKey="record => record.id"  
        :data-source="dataSource" 
        :columns="columns"
        :pagination="pagination"
        @change="ChangeTable"
    >
      <template slot="state" slot-scope="text, record">
        <a-button type="primary" v-if="text == 'normal'" @click="UpdateUserState(record.id, 'abnormal')">
            正常
        </a-button>
        <a-button type="danger" @click="UpdateUserState(record.id, 'normal')" v-else>
            异常
        </a-button>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.id)"
        >
        <a-button type="danger">删除</a-button>
        </a-popconfirm>
        &nbsp;&nbsp;&nbsp;
        <a-button type="primary" @click="showModal(record.id)">
          编辑
        </a-button>
        <a-modal
          title="Title"
          :visible="visible"
          :confirm-loading="confirmLoading"
          @ok="update_userinfo"
          @cancel="handleCancel"
        >
          <a-input v-show="false" v-model="user_id"/>
          新邮箱：<a-input placeholder="邮箱" v-model="update_email"/>
          新密码<a-input-password placeholder="密码" v-model="update_password"/>
          用户状态：<a-radio-group v-model="update_state">
            <a-radio :value="1">
              正常
            </a-radio>
            <a-radio :value="2">
              异常
            </a-radio>
          </a-radio-group>
        </a-modal>
      </template>
    </a-table>
  </div>
</template>
<script>
const EditableCell = {
  template: `
      <div class="editable-cell">
        <div v-if="editable" class="editable-cell-input-wrapper">
          <a-input :value="value" @change="handleChange" @pressEnter="check" /><a-icon
            type="check"
            class="editable-cell-icon-check"
            @click="check"
          />
        </div>
        <div v-else class="editable-cell-text-wrapper">
          {{ value || ' ' }}
          <a-icon type="edit" class="editable-cell-icon" @click="edit" />
        </div>
      </div>
    `,
  props: {
    text: String,
  },
  data() {
    return {
      value: this.text,
      editable: true,
    };
  },
  methods: {
    handleChange(e) {
      const value = e.target.value;
      this.value = value;
    },
    check() {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit() {
      this.editable = true;
    },
  },
};
export default {
  components: {
    EditableCell,
  },
  data() {
    return {
      user_id: 0,
      update_email: '',
      update_password: '',
      update_state: 1,
      visible: false,
      confirmLoading: false,
      pagination: {
        total: 0,
        pageSize: 2,
        showTotal: total => `共有 ${total} 条数据`,  //分页中显示总的数据
      },
      queryParam: {
        page: 1,//第几页
        perPage: 2,//每页中显示数据的条数
      },
      ok: false,
      value: '',  
      email: '',  
      password: '',  
      confirmpassword: '',  
      dataSource: [
        {
          id: '1',
          email: 'Edward@qq.com',
          state: 'normal',
          created_at: '2020-12-16 19:38:45',
        },
        {
          id: '2',
          email: 'Dward@163.com',
          state: 'abnormal',
          created_at: '2020-12-17 10:02:34',
        },
      ],
      columns: [
        {
          title: '邮箱',
          dataIndex: 'email',
          width: '30%',
          scopedSlots: { customRender: 'email' },
        },
        {
          title: '状态',
          dataIndex: 'state',
          scopedSlots: { customRender: 'state' },
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    };
  },

  created: function () {
      //没有登录就退出
      if(localStorage.getItem('login') == 'false'){
        this.$router.push({
            path: 'login',
        });
      }
      
      if(this.$store.state.authorization == '') {
          this.$store.commit('setAuthorization', localStorage.getItem('authorization'))
      }
      this.$axios({
          method:'get',
          url:'http://127.0.0.1:9501/user/select_or_query?perPage=2&page=1',
          headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{
        this.dataSource = response.data.data.data
        this.pagination.total = response.data.data.total
        this.pagination.pageSize = response.data.data.per_page
      }).catch((error) =>{
        alert(error.response.data.msg)
        if (error.response.data.code == 401) {
          this.$router.push({
            path: 'login',
          });
        }
      })
  },
  methods: {

    //获取用户的信息
    showModal(id) {
      this.$axios({
          method:'get',
          url:'http://127.0.0.1:9501/user/get_user?id=' + id,
          headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{
        this.user_id = response.data.data.id
        this.update_email = response.data.data.email
        this.update_password = ''
        this.update_state = (response.data.data.state == 'normal') ? 1 : 2
        this.visible = true;
      }).catch((error) =>{
          alert(error.response.data.msg)
          if (error.response.data.code == 401) {
            this.$router.push({
              path: 'login',
            });
          }
          return false;
      })
    },

    //修改用户信息
    update_userinfo(e) {
      if(this.update_email == '' || this.update_password=='' || this.update_state == '') {
          alert('请填写完整用户新的信息')
          return false
      }
      this.confirmLoading = true;
      this.$axios({
          method:'post',
          url:'http://127.0.0.1:9501/user/update_user',
          data:{
              id:this.user_id,
              email:this.update_email,
              password:this.update_password,
              state: (this.update_state == 1) ? 'normal' : 'abnormal',
          },
          headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{
          this.onSearch()
          alert('修改用户信息成功!')
      }).catch((error) =>{
          alert(error.response.data.msg)
          if (error.response.data.code == 401) {
            this.$router.push({
              path: 'login',
            });
          }
      })
      this.user_id = 0
      this.update_email = ''
      this.update_password = ''
      this.update_state = 1
      this.visible = false;
      this.confirmLoading = false;
      console.log(111);
    },

    //取消修改用户信息
    handleCancel(e) {
        this.user_id = 0
        this.update_email = ''
        this.update_password = ''
        this.update_state = 1
        this.visible = false;
    },

    //退出登录
    Logout(){
      this.$axios({
        method:'get',
        url:'http://127.0.0.1:9501/user/logout?id=' + localStorage.getItem('id'),
        headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{ 
          alert('退出登录成功！')
          this.$store.commit('setAuthorization', '')
          this.$store.commit('login', false)
          localStorage.setItem('authorization','')
          localStorage.setItem('login',false)
          this.$router.push({
            path: 'login',
          });
      }).catch((error) =>{
          alert(error.response.data.msg)
          if (error.response.data.code == 401) {
            this.$router.push({
              path: 'login',
            });
          }
      })
    },

    //分页查询
    ChangeTable(pagination) {
      this.queryParam.page = pagination.current;
      this.$axios({
        method:'get',
        url:'http://127.0.0.1:9501/user/select_or_query?perPage=2&page=' + this.queryParam.page + '&email=' + this.value,
        headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{
        this.pagination.total = response.data.data.total
        const pagination = { ...this.pagination };
        this.dataSource = response.data.data.data
        this.pagination = pagination;
      }).catch((error) =>{
        alert(error.response.data.msg)
        if (error.response.data.code == 401) {
          this.$router.push({
            path: 'login',
          });
        }
      })
      this.loading = false;
    },

    //修改用户状态
    UpdateUserState(id, state) {
      this.$axios({
        method:'post',
        url: 'http://127.0.0.1:9501/user/update_user_state',
        data:{
            id:id,
            state:state,
        },
        headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{
        this.$message.success('修改用户状态成功');
        this.onSearch()
      }).catch((error) =>{
        alert(error.response.data.msg)
        if (error.response.data.code == 401) {
          this.$router.push({
            path: 'login',
          });
        }
      })
    },

    //搜索功能
    onSearch(value) {
      var url = ''
      if(typeof(value)=="undefined") {
          url = 'http://127.0.0.1:9501/user/select_or_query?perPage=2&page=' + this.queryParam.page
      }else {
          url = 'http://127.0.0.1:9501/user/select_or_query?perPage=2&page='+this.queryParam.page+'&email=' + value;
      }
      
      this.$axios({
        method:'get',
        url: url,
        headers: {'authorization': this.$store.getters.getAuthorization}
      }).then((response) =>{
        this.pagination.total = response.data.data.total
        const pagination = { ...this.pagination };
        this.dataSource = response.data.data.data
        this.pagination = pagination;
      }).catch((error) =>{
        alert(error.response.data.msg)
        if (error.response.data.code == 401) {
          this.$router.push({
            path: 'login',
          });
        }
      })
    },

    //删除功能
    onDelete(id) {
        this.$axios({
            method:'delete',
            url:'http://127.0.0.1:9501/user/delete_user?id=' + id,
            headers: {'authorization': this.$store.getters.getAuthorization}
        }).then((response) =>{
            this.onSearch()
        }).catch((error) =>{
            alert(error.response.data.msg)
            if (error.response.data.code == 401) {
              this.$router.push({
                path: 'login',
              });
            }
        })
    },

    //添加功能
    handleAdd() {
        if(this.ok == false) {
            this.ok = true
            return false;
        }
      
        if(this.email == '') {
            alert('邮箱不能为空!')
            return false;
        }

        if(this.password == '' | this.confirmpassword == '') {
            alert('请输入密码')
            return false;
        }

        if(this.password !== this.confirmpassword) {
            alert('密码和确认密码不一致')
            return false;
        }

        const {dataSource } = this;
        this.$axios({
            method:'post',
            url:'http://127.0.0.1:9501/user/add_user',
            data:{
                    email:this.email,
                    password:this.password,
            },
            headers: {'authorization': this.$store.getters.getAuthorization}
        }).then((response) =>{
            this.onSearch()
        }).catch((error) =>{
            alert(error.response.data.msg)
            if (error.response.data.code == 401) {
              this.$router.push({
                path: 'login',
              });
            }
        })
      
    },
  },
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}
.components-input-demo-size .ant-input {
  width: 200px;
  margin: 0 8px 8px 0;
}
.components-input-demo-size .ant-input-affix-wrapper {
    width: 15%;
}
.editable-add-btn {
  margin-bottom: 8px;
}
</style>
