<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="200px">
      <el-form-item label="RouteID" prop="resource">
        <el-input
          v-model="queryParams.resource"
          placeholder="请输入RouteID"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="熔断策略" prop="grade">
        <el-input
          v-model="queryParams.grade"
          placeholder="请输入熔断策略"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="临界响应时间（毫秒）/阈值" prop="count">
        <el-input
          v-model="queryParams.count"
          placeholder="请输入临界响应时间（毫秒）/阈值"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="熔断时长（秒）" prop="timeWindow">
        <el-input
          v-model="queryParams.timeWindow"
          placeholder="请输入熔断时长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="最小请求数" prop="minRequestAmount">
        <el-input
          v-model="queryParams.minRequestAmount"
          placeholder="请输入最小请求数"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="统计时长（毫秒）" prop="statIntervalMs">
        <el-input
          v-model="queryParams.statIntervalMs"
          placeholder="请输入统计时长"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="慢调用比例阈值" prop="slowRatioThreshold">
        <el-input
          v-model="queryParams.slowRatioThreshold"
          placeholder="请输入慢调用比例阈值"
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
          v-hasPermi="['degraderule:degraderule:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['degraderule:degraderule:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['degraderule:degraderule:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['degraderule:degraderule:export']"
        >导出</el-button>
      </el-col>
	  <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="degraderuleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="degradeRuleId" />
      <el-table-column label="RouteID" align="center" prop="resource" />
      <el-table-column label="熔断策略" align="center" prop="grade" :formatter="gradeFormat" />
      <el-table-column label="临界响应时间（毫秒）/阈值" align="center" prop="count" />
      <el-table-column label="熔断时长（秒）" align="center" prop="timeWindow" />
      <el-table-column label="最小请求数" align="center" prop="minRequestAmount" />
      <el-table-column label="统计时长（毫秒）" align="center" prop="statIntervalMs" />
      <el-table-column label="慢调用比例阈值" align="center" prop="slowRatioThreshold" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['degraderule:degraderule:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['degraderule:degraderule:remove']"
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

    <!-- 添加或修改熔断降级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <el-form-item label="RouteID" prop="resource">
          <el-input v-model="form.resource" placeholder="请输入RouteID" />
        </el-form-item>
        <el-form-item label="熔断策略" prop="grade">
          <el-radio-group v-model="form.grade">
            <el-radio :label="0">慢调用比例</el-radio>
            <el-radio :label="1">异常比例</el-radio>
            <el-radio :label="2">异常数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="临界响应时间（毫秒）/阈值" prop="count">
          <el-input v-model="form.count" placeholder="请输入临界响应时间（毫秒）/阈值" />
          慢调用比例模式下为慢调用临界响应时间（超出该值计为慢调用）；异常比例/异常数模式下为对应的阈值。
        </el-form-item>
        <el-form-item label="熔断时长（秒）" prop="timeWindow">
          <el-input v-model="form.timeWindow" placeholder="请输入熔断时长" />
        </el-form-item>
        <el-form-item label="最小请求数" prop="minRequestAmount">
          <el-input v-model="form.minRequestAmount" placeholder="请输入最小请求数" />
          熔断触发的最小请求数，请求数小于该值时即使异常比率超出阈值也不会熔断
        </el-form-item>
        <el-form-item label="统计时长（毫秒）" prop="statIntervalMs">
          <el-input v-model="form.statIntervalMs" placeholder="请输入统计时长" />
        </el-form-item>
        <el-form-item label="慢调用比例阈值" prop="slowRatioThreshold">
          <el-input v-model="form.slowRatioThreshold" placeholder="请输入慢调用比例阈值" />
          仅慢调用比例模式有效。
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
import { listDegraderule, getDegraderule, delDegraderule, addDegraderule, updateDegraderule, exportDegraderule } from "@/api/degraderule/degraderule";

export default {
  name: "Degraderule",
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
      // 熔断降级表格数据
      degraderuleList: [],
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
        timeWindow: null,
        minRequestAmount: null,
        slowRatioThreshold: null,
        statIntervalMs: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        resource: [
          { required: true, message: "RouteID不能为空", trigger: "blur" }
        ],
         grade: [
          { required: true, message: "熔断策略不能为空", trigger: "blur" }
        ],
         count: [
          { required: true, message: "临界响应时间（毫秒）/阈值不能为空", trigger: "blur" }
        ],
         timeWindow: [
          { required: true, message: "熔断时长不能为空", trigger: "blur" }
        ],
         statIntervalMs: [
          { required: true, message: "统计时长不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询熔断降级列表 */
    getList() {
      this.loading = true;
      listDegraderule(this.queryParams).then(response => {
        this.degraderuleList = response.rows;
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
        degradeRuleId: null,
        resource: null,
        grade: null,
        count: null,
        timeWindow: null,
        minRequestAmount: null,
        slowRatioThreshold: null,
        statIntervalMs: null
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
      this.ids = selection.map(item => item.degradeRuleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加熔断降级";
      this.form.grade= 0;
      this.form.minRequestAmount = 5;
      this.form.statIntervalMs = 1000;      
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const degradeRuleId = row.degradeRuleId || this.ids
      getDegraderule(degradeRuleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改熔断降级";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.degradeRuleId != null) {
            updateDegraderule(this.form).then(response => {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDegraderule(this.form).then(response => {
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
      const degradeRuleIds = row.degradeRuleId || this.ids;
      this.$confirm('是否确认删除熔断降级编号为"' + degradeRuleIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delDegraderule(degradeRuleIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有熔断降级数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportDegraderule(queryParams);
        }).then(response => {
          this.download(response.msg);
        })
    },
    gradeFormat(row, column) {
      if (row.grade === 0) {
        return '慢调用比例';
      } else if (row.grade === 1) {
        return '异常比例';
      } else if (row.grade === 2){
        return '异常数';
      }
      else {
        return '慢调用比例';
      }
    }
  }
};
</script>
