<template>
  <div class="home">
    <el-upload
      class="upload-demo"
      :action="fileurl"
      :limit="1"
      :on-success="handleupload"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <button @click="handletap">普通预览word</button>
     <button @click="handleclick">axios预览word</button>
     <button @click="handleexcel">excel预览</button>
      <button @click="handlepdf">pdf预览</button>
     <div v-html="vHtml" />
     <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="(value,key,index) in tableData[0]"
        :key="index"
        :prop="key"
        :label="key"
      ></el-table-column>
    </el-table>
    <div>
          <pdf ref="pdf" :src="pdfUrl" style="width: 100%;" />
    </div>
    
  </div>
</template>

<script>
import mammoth from "mammoth";
import XLSX from "xlsx";
import axios from "axios";
import pdf from 'vue-pdf'
export default {
  data() {
    return {
      fileurl: "/file/api/upload",
      url: "",
       vHtml: '',
        tableData: [],
      workbook: {},
      pdfUrl:''
     
    };

  },
  components: {
    pdf,
  },
  methods: {
    handleupload(event) {
      console.log(event);
      this.url = '/file'+ event.data;
    },
    handletap() {
	 const xhr = new XMLHttpRequest();
    xhr.open("get", this.url, true);
    xhr.responseType = "arraybuffer";
    let _this = this
    xhr.onload = function () {
      if (xhr.status == 200) {
		  console.log('999');
		  console.log(new Uint8Array(xhr.response));
			mammoth.convertToHtml({arrayBuffer: new Uint8Array(xhr.response)})
    .then(function(result){
        var html = result.value; // The generated HTML
        console.log(_this);
         _this.vHtml = html
        var messages = result.messages; // Any messages, such as warnings during conversion
    })
    .done();
		
      }
    };
    xhr.send();
   
    },
    handleclick(){
     axios({
       url:this.url,
       method:'get',
       responseType: 'arraybuffer'
     }).then(res=>{
       let _this = this
      mammoth.convertToHtml({arrayBuffer: new Uint8Array(res.data)})
      .then(function(result){
        var html = result.value; // The generated HTML
        console.log(_this);
         _this.vHtml = html
        var messages = result.messages; // Any messages, such as warnings during conversion
    })
    .done();
     })
    },
    handleexcel(){
       axios({
       url:this.url,
       method:'get',
       responseType: 'arraybuffer'
     }).then(res=>{
        let _this = this
       console.log(res);
       var data = new Uint8Array(res.data);
        var workbook = XLSX.read(data, { type: "buffer" });
       //var workbook = XLSX.readFile(data)
          console.log(workbook);
           var sheetNames = workbook.SheetNames; // 工作表名称集合
           _this.workbook = workbook;
          _this.getTable(sheetNames[0]);
     })
    },
    getTable(sheetName) {

      var worksheet = this.workbook.Sheets[sheetName];
      console.log(worksheet);
      this.tableData = XLSX.utils.sheet_to_json(worksheet);
     // this.vHtml = XLSX.utils.sheet_to_html(worksheet);
     // this.tableData = XLSX.utils.sheet_to_csv(worksheet);
      console.log(this.tableData);

    },
    handlepdf(){
        axios({
       url:this.url,
       method:'get',
       responseType: 'arraybuffer'
     }).then(res=>{
       console.log(res);
       const path = res.request.responseURL
       this.pdfUrl = pdf.createLoadingTask(path)
       console.log(this.pdfUrl);
     })
    }
  },
};
</script>

<style scoped >
#table {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  border: 1px solid #ebebeb;
  padding: 20px;
  width: 80%;
  margin: 20px auto;
  border-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6), 0 2px 4px 0 rgba(232, 237, 250, 0.5);
  border-radius: 10px;
  overflow: scroll;
  height: 100%;

 
}
 .tab {
    margin: 0 0 20px 0;
    display: flex;
    flex-direction: row;
  }
</style>
