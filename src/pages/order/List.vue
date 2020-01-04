<template>
    <div>
        <!--标签页-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="所有订单" value="first"></el-tab-pane>
            <el-tab-pane label="待支付" name="second"></el-tab-pane>
            <el-tab-pane label="待派单" name="third"></el-tab-pane>
            <el-tab-pane label="待派单" name="fourth"></el-tab-pane>
            <el-tab-pane label="待接单" name="fiveth"></el-tab-pane>
            <el-tab-pane label="待服务" name="sixth"></el-tab-pane>
            <el-tab-pane label="待确认" name="seventh"></el-tab-pane>
            <el-tab-pane label="已完成" name="eightth"></el-tab-pane>
        </el-tabs>
         <!--标签页-->
          <!--表格-->
        <el-table :data="orders">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间"></el-table-column>
            <el-table-column prop="total" label="总价"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="customerId" width="200" label="顾客id"></el-table-column>
            <el-table-column prop="waiterId" width="200" label="员工id"></el-table-column>
            <el-table-column prop="addressId" width="200" label="地址id"></el-table-column>
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
        title="录入订单信息"
        :visible.sync="visible"
        width="60%">
        ---{{form}}
            <el-form :model="form" label-width="80px">
                <el-form-item label="下单时间">
                <el-input v-model="form.orderTime"></el-input> 
                </el-form-item> 
            </el-form>

            <el-form :model="form" label-width="80px">
                 <el-form-item label="总价">
                <el-input v-model="form.total"></el-input>
                </el-form-item>
            </el-form>  

            <el-form :model="form" label-width="80px">
                 <el-form-item label="状态">
                <el-input v-model="form.status"></el-input>
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
             let url="http://localhost:6677/order/findAll"
             request.get(url).then((response)=>{//指向外部this
             //将查询结果设置到order
             this.orders=response.data;
             })
        },

        submitHander(){
            let url="http://localhost:6677/order/save"
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
         this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            //调用后台接口，完成删除操作
            let url="http://localhost:6677/order/deleteById?id="+id;
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
                type:"order"
            }
            this.visible=true;
        },

    },
    //用于存放要向网页中显示的数据
    data(){
        return{
            visible:false,
            orders:[],
            form:{
             type:"order+"
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