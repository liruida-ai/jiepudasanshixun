<template>
    <div>
        <h2>产品管理</h2>
        <!-- 按钮 -->
        <el-button type="primary" size="small" @click="toAddHandler">添加</el-button>
        <el-button type="danger" size="small">批量删除</el-button>
        <!-- /按钮 -->
        <!-- 表格 -->
        <el-table :data="products">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column width="150px" prop="name" label="产品名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column width="200px" prop="description" label="描述"></el-table-column>
            <el-table-column prop="categoryId" label="所属栏目"></el-table-column>
            <el-table-column width="150px" prop="photo" label="图片">
                <template v-slot="slot">
                    <img :src="slot.row.photo" style="height:100px" alt="">
                </template>
            </el-table-column>
            <el-table-column label="操作"  fixed="right">
                <template v-slot="slot">
                    <a href="" @click.prevent="toDeleteHandler(slot.row.id)">删除</a>
                    <a href="" @click.prevent="toUpdataHandler(slot.row)">修改</a>
                </template>
            </el-table-column>
        </el-table>
        <!-- /表格 -->
        <!-- 分页 -->
        <el-pagination layout="prev, pager, next" :total="50"></el-pagination>
        <!-- /分页结束 -->
        <!-- 模态框 -->
        <el-dialog :title="title" :visible.sync="visible" width="50%">
            {{form}}
            <el-form :model="form" label-width="80px">
                <el-form-item label="产品名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price"></el-input>
                </el-form-item>
                <el-form-item label="所属栏目">
                    <el-select v-model="form.categoryId" placeholder="请选择">
                        <el-option
                            v-for="item in options"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="介绍">
                    <el-input type="textarea" :rows="2" v-model="form.description"></el-input>
                </el-form-item>
                <!-- action上传地址 -->
                <el-form-item label="产品主图">
                   <el-upload v-model="form.photo"
                        class="upload-demo"
                        action="http://134.175.154.93:6677/file/upload"
                        :file-list="fileList"
                        :on-success="uploadSuccessHandler"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeModelHandler">取 消</el-button>
                <el-button size="small" type="primary" @click="submitHandler">确 定</el-button>
            </span>
        </el-dialog>
        <!-- /模态框 -->
    </div>
</template>

<script>
import request from '@/utils/request'
import querystring from 'querystring'
export default {
    methods:{
        //加载页面
        loadData(){
            let url ="http://localhost:6677/product/findAll";
            request.get(url).then((response)=>{
                this.products = response.data;
            })
        },
        loadCategry(){
            let url ="http://localhost:6677/category/findAll";
            request.get(url).then((response)=>{
                this.options = response.data;
            })
        },
        submitHandler(){
            let url = "http://localhost:6677/product/saveOrUpdate";
            request({
                url,
                method:"POST",
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                },
                data:querystring.stringify(this.form)
            }).then((response)=>{
                this.closeModelHandler();
                this.loadData();
                this.$message({
                    type:"success",
                    message:response.message
                })
            })
        },
        toAddHandler(){
            this.fileList=[]
            this.form={}
            this.visible=true;
        },
        closeModelHandler(){
            this.visible=false;
        },
        toUpdataHandler(row){
            this.title="修改栏目信息"
            this.visible=true;
            this.form=row;
        },
        toDeleteHandler(id){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let url = "http://localhost:6677/product/deleteById?id="+id;
                request.get(url).then((response)=>{
                    //刷新数据
                    this.loadData();
                    //提示结果
                    this.$message({
                        type: 'success',
                        message: response.message
                    });
                })
            })
        },
        uploadSuccessHandler(response){
            let photo ="http://134.175.154.93:8888/group1/"+response.data.id;
            //将图片地址设置到form中，便于一起提交给后台
            this.form.photo=photo;
        }
    },
    data(){
        return{
            fileList: [],
            title:"录入栏目信息",
            visible:false,
            products:[],
            form:{},
            options: [],
            value: ''
        }
    },
    created(){
        this.loadData();
        this.loadCategry();
    }
}
</script>

<style scoped>

</style>