<template>
    <div>
        {{params}}
        <!--选项卡-->
        <el-tabs v-model="params.status" @tab-click="loadData" >
            <el-tab-pane label="全部" name="全部"></el-tab-pane>
            <el-tab-pane label="待派单" name="待派单"></el-tab-pane>
            <el-tab-pane label="待接单" name="待接单"></el-tab-pane>
            <el-tab-pane label="待服务" name="待服务"></el-tab-pane>
            <el-tab-pane label="待确认" name="待确认"></el-tab-pane>
            <el-tab-pane label="已完成" name="已完成"></el-tab-pane>
        </el-tabs>
         <!--选项卡-->
          <!--表格-->
        <el-table :data="orders.list">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="orderTime" label="下单时间"></el-table-column>
            <el-table-column prop="total" label="总价"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column prop="customerId" width="200" label="顾客id"></el-table-column>
            <el-table-column prop="waiterId" width="200" label="员工id"></el-table-column>
            <el-table-column prop="addressId" width="200" label="地址id"></el-table-column>
            <el-table-column fixed="right" label="操作">
                <template v-slot="slot">
                    <a href=""  @click.prevent="toShowMessage(slot.row)">详情</a>
                    <a href="" v-if="slot.row.status==='待派单'"
                    @click.prevent="toSendOrderHandler(slot.row)">派单</a>

                </template>

            </el-table-column>
        </el-table>
         <!--表格结束-->
         <!--分页开始-->
         <el-pagination
        :hide-on-single-page="true"
        layout="prev, pager, next"
        :total="orders.total"
        @current-change="pageChangeHandler">
         </el-pagination>
         <!--分页结束-->
         <!--模态框-->
         <el-dialog
        title="派单"
        :visible.sync="visible"
        width="60%">
        <div>
            <p><strong>订单编号：</strong>{{form.id}}</p>
            <p><strong>订单总价：</strong>{{form.total}}</p>
            <p><strong>下单时间：</strong>{{form.orderTime}}</p>
            <p>
              <strong>服务员工:</strong>
                <el-radio-group v-model="waiterId">
                <el-radio 
                border
                size="small"
                v-for="e in employees"
                :key="e.id"
                :label="e.id">{{e.username}}</el-radio>
            </el-radio-group>
            </p>
        </div>
              
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeMedalHandler">取 消</el-button>
            <el-button size="small" type="primary" @click="submitHander">确 定</el-button>
         </span>
        </el-dialog>
        <!--模态框-->
        <!--显示详情-->
         <el-dialog
        title="显示详情"
        :visible.sync="detail"
        width="60%">
        <div>
            <p><strong>订单编号：</strong>{{form.id}}</p>
            <p><strong>订单总价：</strong>{{form.total}}</p>
            <p><strong>下单时间：</strong>{{form.orderTime | datefmt}}</p>
            <p><strong>订单状态:</strong> {{form.status}}</p>
            <p><strong>服务员工id:</strong> {{form.waiterId}}</p>
            <p><strong>地址id:</strong> {{form.addressId}}</p>
        </div>
              
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeShowMessage">关 闭</el-button>
            
         </span>
        </el-dialog>
        <!--显示详情-->
    </div>
</template>

<script>
import request from '@/utils/request'
import querystring from 'querystring'
// import { readlink } from 'fs';
export default {
    //用于存放网页中需要存放的方法
    methods:{
        closeShowMessage(){
            this.detail=false;
        },
        toShowMessage(row){
            this.form=row;
            this.detail=true;
        },
        pageChangeHandler(page){
            this.params.page=page-1;
            this.loadData();
        },
        loadEmployees(){
            let url="http://localhost:6677/waiter/findAll";
            request.get(url).then(response=>{
                this.employees=response.data;
            })
        },
        loadData(){
             let url="http://localhost:6677/order/queryPage"
             if(this.params.status==="全部"){
                 delete this.params.status;
             }
            request({
                  url,
                  method:"POST",
                  headers:{
                   "Content-Type":"application/x-www-form-urlencoded"
                    },
                data:querystring.stringify(this.params)
             } ).then((response)=>{
             this.orders=response.data;
             })
        },

        submitHander(){
            let url="http://localhost:6677/order/sendOrder"
                request({
                  url,
                  method:"GET",
                params:{
                    orderId:this.form.id,
                    waiterId:this.waiterId
                }
                }).then((response)=>{
                 //模态框关闭
                 this.closeMedalHandler();
                 //刷新
                 this.loadData();
                 //提示消息
                 this.$message({
                      type:"success",
                    message:response.message
                })
            })
        },
    

        toSendOrderHandler(row){
            this.form=row;
            this.visible=true;
        },
        closeMedalHandler(){
            this.visible=false;

        }

    },
    //用于存放要向网页中显示的数据
    data(){
        return{
            visible:false,
            detail:false,
            orders:{},
            form:{},
            params:{
                page:0,
                pageSize:10
            },
            employees:[],
            waiterId:null
        }
    },
   
    created(){
        // this为当前vue实例对象
        // vue实例创建完毕 
        this.loadData();
        //加在员工信息
        this.loadEmployees();
 
    }
}
</script>

<style scoped>

</style>
