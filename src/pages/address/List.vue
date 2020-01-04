<template>
    <div>
        <!-- 按钮 -->
        <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small">批量删除</el-button>
        <!-- /按钮 -->
        <!-- 表格 -->
        <el-table :data="addresses">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="province" label="省"></el-table-column>
            <el-table-column prop="city" label="城市"></el-table-column>
            <el-table-column prop="area" label="市、区"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column prop="telephone" label="手机号"></el-table-column>
            <el-table-column prop="customerId" label="用户编号"></el-table-column>
            <el-table-column label="操作">
                <template v-slot="slot">
                    <a href="" @click.prevent="toDeleteHandler(slot.row.id)">删除</a>
                    <a href="" @click.prevent="toUpdataHandler(slot.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- /表格 -->
        <!-- 分页 -->
        <el-pagination layout="prev, pager, next" :total="50"></el-pagination>
        <!-- /分页 -->
        
        <!-- 模态框 -->
        <el-dialog :title="title" :visible.sync="visible" width="50%">
            ---{{form}}
            <el-form :model="form" label-width="80px">
                <el-form-item label="省">
                    <el-input v-model="form.province"></el-input>
                </el-form-item>
                <el-form-item label="城市">
                    <el-input v-model="form.city"></el-input>
                </el-form-item>
                <el-form-item label="市、区">
                    <el-input v-model="form.area"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.telephone"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeModalHandler">取 消</el-button>
                <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
            </span>
        </el-dialog>
        <!-- /模态框 -->
    </div>
</template>

<script>
import request from "@/utils/request"
import querystring from 'querystring'
export default {
    methods:{
        loadData(){
            let url = "http://localhost:6677/address/findAll"
            request.get(url).then((response)=>{
                this.addresses=response.data;
            })
        },
        toAddHandler(){
            this.form={};
            this.visible=true;
        },
        closeModalHandler(){
            this.visible=false;
        },
        submitHandler(){
            let url = "http://localhost:6677/address/saveOrUpdate"
            request({
                url,
                method:"post",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                data:querystring.stringify(this.form)
            }).then((response)=>{
                this.closeModalHandler();
                this.loadData();
                this.$message({
                    type:"success",
                    message:response.message
                })
            })
            this.visible=false;
        },
        toDeleteHandler(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "http://localhost:6677/address/deleteById?id="+id;
                request.get(url).then((response)=>{
                    //刷新数据
                    this.loadData();
                    //提示结果
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                })
                
            });
        },
        toUpdataHandler(row){
            this.title="修改地址信息";
            this.visible=true;
            this.form=row;
        }
    },
    data(){
        return{
            visible:false,
            addresses:[],
            form:{},
            title:"录入地址信息"
        }
    },
    created(){
        this.loadData();
    }
}
</script>

<style scoped>

</style>