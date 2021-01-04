<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="秘钥" prop="encodeKey">
        <el-input
          v-model="queryParams.encodeKey"
          placeholder="请输入秘钥"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['gateway:authfilter:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['gateway:authfilter:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['gateway:authfilter:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['gateway:authfilter:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="authfilterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="秘钥" align="center" prop="encodeKey" />
      <el-table-column label="忽略客戶端" align="center" prop="ignoreClients" />
      <el-table-column label="忽略url" align="center" prop="ignoreUrls" />
      <el-table-column label="渠道映射" align="center" prop="channelKeys" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="修改人id" align="center" prop="updateBy" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleShow(scope.row)"
          >预览</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['gateway:authfilter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gateway:authfilter:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改权限拦截器对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="秘钥" prop="encodeKey">
          <el-input v-model="form.encodeKey" placeholder="请输入秘钥" />
        </el-form-item>

        <el-form-item label="忽略端" prop="ignoreClientList">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click.prevent="addClient()"></el-button>
          <el-input v-for="(item,index) in form.ignoreClientList" v-model="form.ignoreClientList[index]">
            <el-button  slot="append" size="mini" icon="el-icon-remove-outline" @click.prevent="removeClient(index)"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item label="忽略url" prop="ignoreUrlList">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click.prevent="addUrl()"></el-button>
          <el-input v-for="(item,index) in form.ignoreUrlList" v-model="form.ignoreUrlList[index]">
            <el-button  slot="append" size="mini" icon="el-icon-remove-outline" @click.prevent="removeUrl(index)"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="渠道映射" prop="channelKeyArray">
          <el-button type="primary" size="mini" icon="el-icon-plus" @click.prevent="addChannelKey()"></el-button>
          <el-row :gutter="3" v-for="(item,index) in form.channelKeyArray">
            <el-col style="width: 100%">
              <el-col :span="2">键:</el-col>
              <el-col :span="8"><el-input size="mini"  v-model="item.key" /></el-col>
              <el-col :span="2">值:</el-col>
              <el-col :span="12">
                  <el-input size="mini"  v-model="item.value">
                   <el-button  slot="append" size="mini" icon="el-icon-remove-outline" @click.prevent="removeChannelKey(index)"></el-button>
                   </el-input>
              </el-col>
            </el-col>
          </el-row>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预览 -->
    <el-dialog :title="title" :visible.sync="dataOpen" width="500px" append-to-body>
      <el-form  label-width="80px" v-for="(ad,index) in authData">

        <el-form-item >

          <el-col :span="4">
            {{ad.name}}:
          </el-col>
          <el-col :span="12">
            {{ad.value}}
          </el-col>

        </el-form-item>

        <el-divider></el-divider>

      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAuthfilter, getAuthfilter, delAuthfilter, addAuthfilter, updateAuthfilter, exportAuthfilter,getAuthData } from "@/api/gateway/authfilter";

export default {
  name: "Authfilter",
  components: {
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 权限拦截器表格数据
      authfilterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,

      dataOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        encodeKey: null,
        ignoreClients: null,
        ignoreUrls: null,
        channelKeys: null,
        type: null,
        createId: null,
        updateId: null,
      },
      // 表单参数
      form: {
        ignoreClientList: [
          ],
        ignoreUrlList: [],
        channelKeyArray: [],
      },
      authData:null,
      // 表单校验
      rules: {
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询权限拦截器列表 */
    getList() {
      this.loading = true;
      listAuthfilter(this.queryParams).then(response => {
        this.authfilterList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.dataOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        encodeKey: null,
        ignoreClients: null,
        ignoreUrls: null,
        channelKeys: null,
        type: null,
        delFlag: null,
        createId: null,
        createBy: null,
        createTime: null,
        updateId: null,
        updateBy: null,
        updateTime: null,
        ignoreClientList: [
        ],
        ignoreUrlList: [],
        channelKeyArray: [],

      };
      this.authData=null;
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加权限拦截器";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getAuthfilter(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改权限拦截器";
      });
    },
    handleShow(row) {
      this.reset();
      const id = row.id;
      getAuthData(id).then(response => {
        this.authData = response.data;
        this.dataOpen = true;
        this.title = "生成数据格式";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAuthfilter(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAuthfilter(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除权限拦截器编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delAuthfilter(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有权限拦截器数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportAuthfilter(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    removeClient(index) {

        this.form.ignoreClientList.splice(index, 1)
    },
    addClient() {
      this.form.ignoreClientList.push('');
    },
    removeUrl(index) {

        this.form.ignoreUrlList.splice(index, 1)
    },
    addUrl() {
      this.form.ignoreUrlList.push('');
    },
    addChannelKey() {
      this.form.channelKeyArray.push({key:'',value:'' });
    }
  }
};
</script>
