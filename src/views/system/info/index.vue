<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="实例id" prop="instanceId">
        <el-input
          v-model="queryParams.instanceId"
          placeholder="请输入实例id"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应用名称" prop="appName">
        <el-input
          v-model="queryParams.appName"
          placeholder="请输入应用名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="ip" prop="ipAddr">
        <el-input
          v-model="queryParams.ipAddr"
          placeholder="请输入ip"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="端口" prop="port">
        <el-input
          v-model="queryParams.port"
          placeholder="请输入端口"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="主机名" prop="hostName">
        <el-input
          v-model="queryParams.hostName"
          placeholder="请输入主机名"
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
          v-hasPermi="['system:info:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:info:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:info:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:info:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="实例id" align="center" prop="instanceId" />
      <el-table-column label="应用名称" align="center" prop="appName" />
      <el-table-column label="ip" align="center" prop="ipAddr" />
      <el-table-column label="sid" align="center" prop="sid" />
      <el-table-column label="端口" align="center" prop="port" />
      <el-table-column label="国家id" align="center" prop="countryId" />
      <el-table-column label="主机名" align="center" prop="hostName" />
      <el-table-column label="状态" align="center" prop="status" />
      <el-table-column label="最后更新时间" align="center" prop="lastUpdatedTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastUpdatedTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次异常时间" align="center" prop="lastDirtyTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.lastDirtyTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-picture-outline-round"
            @click="handleStop(scope.row)"
          >停机</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-edit"-->
<!--            @click="handleUpdate(scope.row)"-->
<!--            v-hasPermi="['system:info:edit']"-->
<!--          >修改</el-button>-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['system:info:remove']"-->
<!--          >删除</el-button>-->
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

    <!-- 添加或修改服务实例信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="实例id" prop="instanceId">
          <el-input v-model="form.instanceId" placeholder="请输入实例id" />
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用分组名称" prop="appGroupName">
          <el-input v-model="form.appGroupName" placeholder="请输入应用分组名称" />
        </el-form-item>
        <el-form-item label="ip" prop="ipAddr">
          <el-input v-model="form.ipAddr" placeholder="请输入ip" />
        </el-form-item>
        <el-form-item label="sid" prop="sid">
          <el-input v-model="form.sid" placeholder="请输入sid" />
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="安全端口" prop="securePort">
          <el-input v-model="form.securePort" placeholder="请输入安全端口" />
        </el-form-item>
        <el-form-item label="主页URL" prop="homePageUrl">
          <el-input v-model="form.homePageUrl" placeholder="请输入主页URL" />
        </el-form-item>
        <el-form-item label="状态页URL" prop="statusPageUrl">
          <el-input v-model="form.statusPageUrl" placeholder="请输入状态页URL" />
        </el-form-item>
        <el-form-item label="健康检测URL" prop="healthCheckUrl">
          <el-input v-model="form.healthCheckUrl" placeholder="请输入健康检测URL" />
        </el-form-item>
        <el-form-item label="vip地址" prop="vipAddress">
          <el-input v-model="form.vipAddress" placeholder="请输入vip地址" />
        </el-form-item>
        <el-form-item label="安全vip地址" prop="secureVipAddress">
          <el-input v-model="form.secureVipAddress" placeholder="请输入安全vip地址" />
        </el-form-item>
        <el-form-item label="国家id" prop="countryId">
          <el-input v-model="form.countryId" placeholder="请输入国家id" />
        </el-form-item>
        <el-form-item label="主机名" prop="hostName">
          <el-input v-model="form.hostName" placeholder="请输入主机名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio label="1">请选择字典生成</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最后更新时间" prop="lastUpdatedTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.lastUpdatedTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择最后更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上次异常时间" prop="lastDirtyTime">
          <el-date-picker clearable size="small" style="width: 200px"
            v-model="form.lastDirtyTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择上次异常时间">
          </el-date-picker>
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, exportInfo ,stopInfo } from "@/api/system/info";

export default {
  name: "Info",
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
      // 服务实例信息表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        instanceId: null,
        appName: null,
        appGroupName: null,
        ipAddr: null,
        sid: null,
        port: null,
        securePort: null,
        homePageUrl: null,
        statusPageUrl: null,
        healthCheckUrl: null,
        vipAddress: null,
        secureVipAddress: null,
        countryId: null,
        hostName: null,
        status: null,
        lastUpdatedTime: null,
        lastDirtyTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询服务实例信息列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.rows;
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
        instanceId: null,
        appName: null,
        appGroupName: null,
        ipAddr: null,
        sid: null,
        port: null,
        securePort: null,
        homePageUrl: null,
        statusPageUrl: null,
        healthCheckUrl: null,
        vipAddress: null,
        secureVipAddress: null,
        countryId: null,
        hostName: null,
        status: "0",
        lastUpdatedTime: null,
        lastDirtyTime: null,
        createTime: null,
        updateTime: null
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
      this.title = "添加服务实例信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getInfo(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改服务实例信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateInfo(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(response => {
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
      this.$confirm('是否确认删除服务实例信息编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    handleStop(row) {
      const ids = row.id;
      this.$confirm('是否确认停机该设备吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return stopInfo(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("操作成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有服务实例信息数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportInfo(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    }
  }
};
</script>
