<template>
    <div>
        <!--按钮-->
        <el-button type="primary" size="smell" @click="toAddHandler" >添加</el-button>
        <el-button type="danger" size="smell" >批量删除</el-button>
         <!--按钮结束-->
          <!--表格-->
        <el-table :data="employees">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="realname" label="姓名"></el-table-column>
            <el-table-column prop="gender" label="性别"></el-table-column>
            <el-table-column prop="telephone" label="手机号"></el-table-column>
             <el-table-column prop="idCard" width="200" label="身份证号"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="slot">
                    <a href="" @click.prevent="toDeleteHandler(slot.row.id)">删除</a>
                    <a href="" @click.prevent="toUpdateHandler(slot.row)">修改</a>

                </template>

            </el-table-column>
        </el-table>
         <!--表格结束-->
         <!--分页开始-->
         <el-pagination
        layout="prev, pager, next"
        :total="50">
         </el-pagination>
         <!--分页结束-->
         <!--模态框-->
         <el-dialog
        title="录入员工信息"
        :visible.sync="visible"
        width="60%">
        ---{{form}}
            <el-form :model="form" label-width="80px">
                <el-form-item label="姓名">
                <el-input v-model="form.realname"></el-input> 
                </el-form-item> 
            </el-form>

            <el-form :model="form" label-width="80px">
                 <el-form-item label="性别">
                <el-input v-model="form.gender"></el-input>
                </el-form-item>
            </el-form>   

            <el-form :model="form" label-width="80px">
                 <el-form-item label="手机号">
                <el-input v-model="form.telephone"></el-input>
                </el-form-item>
            </el-form>   

            <el-form :model="form" label-width="80px">
                 <el-form-item label="身份证号">
                <el-input v-model="form.idCard"></el-input>
                </el-form-item>
            </el-form>     

        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeMedalHandler">取 消</el-button>
            <el-button size="small" type="primary" @click="submitHander">确 定</el-button>
         </span>
        </el-dialog>
    </div>
</template>

<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {
    //用于存放网页中需要存放的方法
    methods:{
        loadData(){
             let url="http://localhost:6677/waiter/findAll"
             request.get(url).then((response)=>{//指向外部this
             //将查询结果设置到employee
             this.employees=response.data;
             })
        },

        submitHander(){
            let url="http://localhost:6677/waiter/saveOrUpdate"
                request({
                  url,
                  method:"POST",
                  headers:{
                   "Content-Type":"application/x-www-form-urlencoded"
                    },
                data:querystring.stringify(this.form)
                }).then((response)=>{
                 this.closeMedalHandler();
                 this.loadData();
                 this.$message({
                      type:"success",
                    message:response.message
                })
            })
        },
    
        toDeleteHandler(id){
            //确认
         this.$confirm('此操作将永久删除该行信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            //调用后台接口，完成删除操作
            let url="http://localhost:6677/waiter/deleteById?id="+id;
            request.get(url).then((response)=>{
                //1.刷新数据
                this.loadData();
                this.$message({
                type: 'success',
                message: response.message
            });
            })
          
        })
        },

        toUpdateHandler(row){
            this.form=row;
            this.visible=true;

        },
        closeMedalHandler(){
            this.visible=false;

        },
        toAddHandler(){
            this.form={
                type:"waiter"
            }
            this.visible=true;
        },

    },
    //用于存放要向网页中显示的数据
    data(){
        return{
            visible:false,
            employees:[],
            form:{
             type:"waiter"
            }
        }
    },
   
    created(){
        // this为当前vue实例对象
        // vue实例创建完毕 
        this.loadData();
 
    }
}
</script>

<style scoped>

</style>