<template>
  <div class="gc-canvas" @click="reloadPic">
    <canvas id="gc-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>

<script>
  import { getAction } from '@/api/manage'

  export default {
    name: 'JGraphicCode',
    props: {
      length:{
        type: Number,
        default: 4
      },
      fontSizeMin: {
        type: Number,
        default: 20
      },
      fontSizeMax: {
        type: Number,
        default: 45
      },
      backgroundColorMin: {
        type: Number,
        default: 180
      },
      backgroundColorMax: {
        type: Number,
        default: 240
      },
      colorMin: {
        type: Number,
        default: 50
      },
      colorMax: {
        type: Number,
        default: 160
      },
      lineColorMin: {
        type: Number,
        default: 40
      },
      lineColorMax: {
        type: Number,
        default: 180
      },
      dotColorMin: {
        type: Number,
        default: 0
      },
      dotColorMax: {
        type: Number,
        default: 255
      },
      contentWidth: {
        type: Number,
        default:136
      },
      contentHeight: {
        type: Number,
        default: 38
      },
      remote:{
        type:Boolean,
        default:false,
        required:false
      }
    },
    methods: {
      // 乱数を生成する
      randomNum (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      // ランダムな色を生成する
      randomColor (min, max) {
        let r = this.randomNum(min, max)
        let g = this.randomNum(min, max)
        let b = this.randomNum(min, max)
        return 'rgb(' + r + ',' + g + ',' + b + ')'
      },
      drawPic () {
        this.randomCode().then(()=>{
          let canvas = document.getElementById('gc-canvas')
          let ctx = canvas.getContext('2d')
          ctx.textBaseline = 'bottom'
          // 背景を描く
          ctx.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax)
          ctx.fillRect(0, 0, this.contentWidth, this.contentHeight)
          // テキストを描く
          for (let i = 0; i < this.code.length; i++) {
            this.drawText(ctx, this.code[i], i)
          }
          this.drawLine(ctx)
          this.drawDot(ctx)
          this.$emit("success",this.code)
        })
      },
      drawText (ctx, txt, i) {
        ctx.fillStyle = this.randomColor(this.colorMin, this.colorMax)
        let fontSize = this.randomNum(this.fontSizeMin, this.fontSizeMax)
        ctx.font = fontSize + 'px SimHei'
        let padding = 10;
        let offset = (this.contentWidth-40)/(this.code.length-1)
        let x=padding;
        if(i>0){
          x = padding+(i*offset)
        }
        //let x = (i + 1) * (this.contentWidth / (this.code.length + 1))
        let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5)
        if(fontSize>40){
          y=40
        }
        var deg = this.randomNum(-10,10)
        // 座標原点と回転角度を変更する
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 座標原点と回転角度を復元する
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
      },
      drawLine (ctx) {
        // 干渉線を引く
        for (let i = 0; i <1; i++) {
          ctx.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax)
          ctx.beginPath()
          ctx.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
          ctx.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight))
          ctx.stroke()
        }
      },
      drawDot (ctx) {
        // 干渉点をプロットする
        for (let i = 0; i < 100; i++) {
          ctx.fillStyle = this.randomColor(0, 255)
          ctx.beginPath()
          ctx.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI)
          ctx.fill()
        }
      },
      reloadPic(){
        this.drawPic()
      },
      randomCode(){
        return new Promise((resolve)=>{
          if(this.remote==true){
            getAction("/sys/getCheckCode").then(res=>{
              console.log("aaaaa",res)
              if(res.success){
                this.checkKey = res.result.key
                this.code = res.result.code
                resolve();
              }else{
                this.$message.error("確認コードエラーを生成します。システム管理者に連絡してください")
                this.code = 'BUG'
                resolve();
              }
            }).catch(()=>{
              console.log("検証コード接続サーバー例外を生成")
              this.code = 'BUG'
              resolve();
            })
          }else{
            this.randomLocalCode();
            resolve();
          }
        })
      },
      randomLocalCode(){
        let random = ''
        //I l i o O削除しました
        let str = "QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890"
        for(let i = 0; i < this.length; i++) {
          let index = Math.floor(Math.random()*57);
          random += str[index];
        }
        this.code = random
      },
      getLoginParam(){
        return {
          checkCode:this.code,
          checkKey:this.checkKey
        }
      }
    },
    mounted () {
      this.drawPic()
    },
    data(){
      return {
        code:"",
        checkKey:""
      }
    }

  }
</script>

<style scoped>

</style>