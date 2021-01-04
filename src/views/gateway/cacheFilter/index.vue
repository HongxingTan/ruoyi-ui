<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="缓存名称" prop="cacheName">
        <el-input
          v-model="queryParams.cacheName"
          placeholder="请输入缓存名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="缓存uri" prop="cacheUri">
        <el-input
          v-model="queryParams.cacheUri"
          placeholder="请输入缓存uri"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否通用" prop="isGeneral">
        <el-input
          v-model="queryParams.isGeneral"
          placeholder="请输入是否为通用缓存"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="有效时间" prop="timeout">
        <el-input
          v-model="queryParams.timeout"
          placeholder="请输入缓存有效时间"
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
          v-hasPermi="['cacheFilter:cacheFilter:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['cacheFilter:cacheFilter:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['cacheFilter:cacheFilter:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['cacheFilter:cacheFilter:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="cacheFilterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="缓存名称" align="center" prop="cacheName" />
      <el-table-column label="缓存uri" align="center" prop="cacheUri" />
      <el-table-column label="是否为通用缓存" align="center" prop="isGeneral" >
        <template scope="scope">
          <p v-if="scope.row.isGeneral=='0'">否</p>
          <p v-if="scope.row.isGeneral=='1'">是</p>
        </template>
      </el-table-column>
      <el-table-column label="缓存有效时间(秒)" align="center" prop="timeout" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cacheFilter:cacheFilter:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cacheFilter:cacheFilter:remove']"
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

    <!-- 添加或修改结果缓存配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="缓存名称" prop="cacheName">
          <el-input v-model="form.cacheName" placeholder="请输入缓存名称" />
        </el-form-item>
        <el-form-item label="缓存uri" prop="cacheUri">
          <el-input v-model="form.cacheUri" placeholder="请输入缓存uri" />
        </el-form-item>
        <el-form-item label="是否通用" prop="isGeneral">
          <el-select v-model="form.isGeneral" placeholder="请选择下拉选择" clearable :style="{width: '100%'}">
            <el-option v-for="(item, index) in isGeneralOptions" :key="index" :label="item.label"
              :value="item.value" :disabled="item.disabled"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效时间" prop="timeout">
          <el-input v-model="form.timeout" placeholder="请输入缓存有效时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listCacheFilter, getCacheFilter, delCacheFilter, addCacheFilter, updateCacheFilter, exportCacheFilter } from "@/api/gateway/cacheFilter";

export default {
  name: "CacheFilter",
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
      // 结果缓存配置表格数据
      cacheFilterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cacheName: null,
        cacheUri: null,
        isGeneral: null,
        timeout: null
      },
      // 表单参数
      form: {
        isGeneral: 0,
      },
      isGeneralOptions: [{
        "label": "否",
        "value": 0
      }, {
        "label": "是",
        "value": 1
      }],

      // 表单校验
      rules: {
        isGeneral: [{
          required: true,
          message: '请选择下拉选择',
          trigger: 'change'
        }],
        cacheName: [
          { required: true, message: "缓存名称不能为空", trigger: "blur" }
        ],
        cacheUri: [
          { required: true, message: "缓存uri不能为空", trigger: "blur" }
        ],
        timeout: [
          { required: true, message: "缓存有效时间不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询结果缓存配置列表 */
    getList() {
      this.loading = true;
      listCacheFilter(this.queryParams).then(response => {
        this.cacheFilterList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        cacheName: null,
        cacheUri: null,
        isGeneral: null,
        timeout: null
      };
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
      this.title = "添加结果缓存配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getCacheFilter(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改结果缓存配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateCacheFilter(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCacheFilter(this.form).then(response => {
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
      this.$confirm('是否确认删除结果缓存配置编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCacheFilter(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有结果缓存配置数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportCacheFilter(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
