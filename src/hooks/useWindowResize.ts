import { defineComponent, h, ref, reactive, toRefs, onMounted } from "vue";
export default function () {
    const sortColumn = ref(null)//获取div元素

  const evaluationObj: any = reactive({
		tableRadio:'',

    radio:'',
    tableData: [{
        id: '12987122',
        name: '33',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        num:33,

      }, {
        id: '12987123',
        name: '1',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        num:1,
      }, {
        id: '12987125',
        name: '88',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        num:88

      }, {
        id: '12987126',
        name: '3',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333',
        num:3
      }]
  });
  const methods: any = {
    btnClick(val){//子组件事件
        let orders = this.$refs.tagColumn.sortOrders
// "descending"
// "ascending"
        orders.push(orders[0])
        orders.splice(0, 1)
        const order = orders[0]
        this.$refs.refTable.sort("id", "descending")
    }, 
    cellcb(row){
      if(row.column.label==='商品 ID'){
        return "myCell"
      }
    },
    getCurrentRow(currentRow){
      
      this.tableRadio = currentRow
      console.log(this.tableRadio)
      console.log(this.radio)

    },
  };
  return {
    sortColumn,
    ...toRefs(evaluationObj),
    ...methods,
  };
}
