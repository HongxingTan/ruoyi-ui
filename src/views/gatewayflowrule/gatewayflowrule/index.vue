<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="RouteID" prop="resource">
        <el-input
          v-model="queryParams.resource"
          placeholder="请输入RouteID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="阈值类型" prop="grade">
        <el-input
          v-model="queryParams.grade"
          placeholder="请输入阈值类型"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="阈值" prop="count">
        <el-input
          v-model="queryParams.count"
          placeholder="请输入阈值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="时间间隔" prop="intervalSec">
        <el-input
          v-model="queryParams.intervalSec"
          placeholder="请输入时间间隔"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流控方式" prop="controlBehavior">
        <el-input
          v-model="queryParams.controlBehavior"
          placeholder="请输入流控方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="突发请求数目" prop="burst">
        <el-input
          v-model="queryParams.burst"
          placeholder="请输入突发请求数目"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最长排队时间（毫秒）" prop="maxQueueingTimeoutMs">
        <el-input
          v-model="queryParams.maxQueueingTimeoutMs"
          placeholder="请输入最长排队时间（毫秒）"
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
          v-hasPermi="['gatewayflowrule:gatewayflowrule:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['gatewayflowrule:gatewayflowrule:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['gatewayflowrule:gatewayflowrule:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['gatewayflowrule:gatewayflowrule:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="gatewayflowruleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="gatewayFlowRuleId" />
      <el-table-column label="RouteID" align="center" prop="resource" />
      <el-table-column label="阈值类型" align="center" prop="grade" :formatter="gradeFormat" />
      <el-table-column label="阈值" align="center" prop="count" />
      <el-table-column label="时间间隔" align="center" prop="intervalSec" />
      <el-table-column label="流控方式" align="center" prop="controlBehavior" :formatter="controlBehaviorFormat" />
      <el-table-column label="突发请求数目" align="center" prop="burst" />
      <el-table-column label="最长排队时间（毫秒）" align="center" prop="maxQueueingTimeoutMs" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['gatewayflowrule:gatewayflowrule:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gatewayflowrule:gatewayflowrule:remove']"
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

    <!-- 添加或修改网关限流对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="RouteID" prop="resource">
          <el-input v-model="form.resource" placeholder="请输入RouteID" />
        </el-form-item>
        <el-form-item label="阈值类型" prop="grade">
          <el-radio-group v-model="form.grade">
            <el-radio :label="1">QPS</el-radio>
            <el-radio :label="0" >线程数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="阈值" prop="count">
          <el-input v-model="form.count" placeholder="请输入阈值" />
        </el-form-item>
        <el-form-item label="时间间隔" prop="intervalSec">
          <el-input v-model="form.intervalSec" placeholder="请输入时间间隔" />
          默认是 1 秒。
        </el-form-item>
        <el-form-item label="流控方式" prop="controlBehavior">
          <el-radio-group v-model="form.controlBehavior">
            <el-radio :label="0">快速失败</el-radio>
            <el-radio :label="2">匀速排队</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="突发请求数目" prop="burst">
          <el-input v-model="form.burst" placeholder="请输入突发请求数目" />
          应对突发请求时额外允许的请求数目。
        </el-form-item>
        <el-form-item label="最长排队时间（毫秒）" prop="maxQueueingTimeoutMs">
          <el-input v-model="form.maxQueueingTimeoutMs" placeholder="请输入最长排队时间（毫秒）" />
          匀速排队模式下的最长排队时间，单位是毫秒，仅在匀速排队模式下生效。
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
import { listGatewayflowrule, getGatewayflowrule, delGatewayflowrule, addGatewayflowrule, updateGatewayflowrule, exportGatewayflowrule } from "@/api/gatewayflowrule/gatewayflowrule";

export default {
  name: "Gatewayflowrule",
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
      // 网关限流表格数据
      gatewayflowruleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        resource: null,
        grade: null,
        count: null,
        intervalSec: null,
        controlBehavior: null,
        burst: null,
        maxQueueingTimeoutMs: null
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        resource: [
          { required: true, message: "RouteID不能为空", trigger: "blur" }
        ],
        grade: [
          { required: true, message: "阈值类型不能为空", trigger: "blur" }
        ],
         count: [
          { required: true, message: "阈值不能为空", trigger: "blur" }
        ],
        controlBehavior: [
          { required: true, message: "流控方式不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询网关限流列表 */
    getList() {
      this.loading = true;
      listGatewayflowrule(this.queryParams).then(response => {
        this.gatewayflowruleList = response.rows;
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
        gatewayFlowRuleId: null,
        resource: null,
        grade: null,
        count: null,
        intervalSec: null,
        controlBehavior: null,
        burst: null,
        maxQueueingTimeoutMs: null
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
      this.ids = selection.map(item => item.gatewayFlowRuleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加网关限流";
      this.form.grade= 1;
      this.form.intervalSec= 1;
      this.form.controlBehavior= 0;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const gatewayFlowRuleId = row.gatewayFlowRuleId || this.ids
      getGatewayflowrule(gatewayFlowRuleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改网关限流";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.gatewayFlowRuleId != null) {
            updateGatewayflowrule(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addGatewayflowrule(this.form).then(response => {
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
      const gatewayFlowRuleIds = row.gatewayFlowRuleId || this.ids;
      this.$confirm('是否确认删除网关限流编号为"' + gatewayFlowRuleIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delGatewayflowrule(gatewayFlowRuleIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有网关限流数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportGatewayflowrule(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    gradeFormat(row, column) {
      if (row.grade === 1) {
        return 'QPS';
      } else if  (row.grade === 0) {
        return '线程数';
      } else{
        return 'QPS';
      }
    },
    controlBehaviorFormat(row, column) {
      if (row.controlBehavior === 0) {
        return '快速失败';
      } else if  (row.controlBehavior === 2) {
        return '匀速排队';
      } else{
        return '快速失败';
      }
    },
  }
};
</script>
