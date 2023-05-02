import { Link, Outlet } from 'umi';
import styles from './index.less';
import "./reset.css"
import EChartsReact from 'echarts-for-react';
import geoJson from '../assets/100000_geojson_full.json';
import * as  echarts from 'echarts';
import { useState, useEffect, useLayoutEffect } from 'react';
export default function Layout() {

  const option = {
    backgroundColor: "rbg(40,46,72)",
    grid: {
      left: "5%",
      right: "6%",
      top: "30%",
      bottom: "5%",
      containLabel: true, // grid 区域是否包含坐标轴的刻度标签
    },
    tooltip: {},
    xAxis: {
      name: "月份",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#42A4FF",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "white",
      },

      data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
    },
    yAxis: {
      name: "个",
      nameTextStyle: {
        color: "white",
        fontSize: 13,
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: "#42A4FF",
        },
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: "#42A4FF",
        },
      },
      axisLabel: {
        color: "white",
      },
    },
    series: [
      {
        name: "销量",
        type: "bar",
        barWidth: 17,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#01B1FF", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#033BFF", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        data: [500, 2000, 3600, 1000, 1000, 2000, 4000],
      },
    ],
  };
  const [data,setData] = useState<{name:string,id:string,childrenNum:number,adcode:string}[]>([])
  const [name,setName] = useState("中国")
  const [mapOptions,setMapOptions] = useState({})
  const getJSONID = (name:String)=>{
    return data.find((item)=>item.name===name)?.adcode
  }
  const canBeContinued = data.find((item)=>item.name===name)?.childrenNum !==0
  const loadMap = async ()=>{
    
    console.log(name)
    if(name==="中国"){
      echarts.registerMap('china',geoJson)

      setMapOptions({
        visualMap: {
          type: "piecewise",
          pieces: [
            { min: 90, max: 300, color: "#990000" },
            { min: 80, max: 89, color: "#cc0033" },
            { min: 70, max: 79, color: "#ff6600" },
            { min: 60, max: 69, color: "#ff9933" },
            { min: 50, max: 59, color: "#ffcc00" },
            { min: 40, max: 49, color: "#99cc00" },
            { min: 30, max: 39, color: "#339966" },
            { min: 20, max: 29, color: "#336699" },
            { min: 10, max: 19, color: "#3333cc" },
            { min: 0, max: 9, color: "#663399" },
          ],
          orient: "horizontal",
          left: "center",
          top: "bottom",
          inRange: {
            color: ["#d7e1fa", "#2a6efa"],
          },
          textStyle: {
            color: "#fff",
          },
        },
        tooltip:{
          show:true,
          formatter: (params) => {
            
            const value = params.value || "-";
            return `${params.name}: ${value}`;
          },
        },
        geo: {
          type: 'map',
          map: 'china',
          // 其他配置项 ...
        },
          series:[
            {
            type:"map",
            map: 'china', 
              itemStyle:{
                areaColor:'#023677',
                borderColor:'#1180c7'
              },
              emphasis:{
                itemStyle:{
                  areaColor:'#4499d0'
                },
                label:{
                  color:"white"
                }
              },
              select:{
                label:{color:"white"},
                itemStyle:{
                  areaColor:'#4499d0'
                },
              },
              data: [
                { name: "北京市", value: 100 },
                { name: "天津市", value: 100 },
                { name: "河南省", value: 100 },
                {name:"浙江省",value:200}
                // ... 其他地区 ...
              ],
              
            
            },
            {
              name: 'flight',
              type: 'lines',
              zlevel: 1,
              effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: '#fff',
                symbolSize: 3,
                z: 0, // 将 effect 特效的 z 值设置为 0
              },
              tooltip: {
                show: true,
                trigger: 'item',
                formatter: function(params) {
                  if (params.dataIndex >= 0) {
                    // 飞线数据
                    return `${params.data.fromName} 到 ${params.data.toName}`;
                  } else {
                    // 地图数据
                    return params.name;
                  }
                },
                textStyle: {
                  fontSize: 12,
                  color: '#fff',
                },
                backgroundColor: '#000',
                opacity: 0.7,
              },
              lineStyle: {
                normal: {
                  color: '#a6c84c',
                  width: 10,
                  curveness: 0.2,
                },
              },
              data: [
                {
                  fromName: '北京',
                  toName: '浙江',
                  coords: [
                    [116.46, 39.92],
                    [120.19, 30.26],
                  ],
                },
                // ... 其他飞线数据 ...
              ],
            },
          ],
        })
        
        // console.log(geoJson.features.map((item)=>item.properties))
        setData(geoJson.features.map((item)=>item.properties))
    
    }else{
      console.log(canBeContinued)
      if(!canBeContinued){
        return
      }
      let code = getJSONID(name)?.toString()
      console.log(code)
      let dd = await import(`/public/data/${code}_geojson_full.json`)
      console.log("测测",)   
          echarts.registerMap(code,dd)
      
      setMapOptions({
        geo:{
          type:'map',
          map:code,
        },
        series:[
          {
            type:'map',
            map:code,
            zoom:1.2,
            nameProperty:'name',
            itemStyle:{
              areaColor:'#023677',
              borderColor:'#1180c7'
            },
            emphasis:{
              itemStyle:{
                areaColor:'#4499d0'
              },
              label:{
                color:"white"
              }
            },
           
          },
          {
            type: 'lines',
            name: '河南省内飞线',
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              color: '#fff',
              symbolSize: 3,
            },
            lineStyle: {
              normal: {
                color: '#a6c84c',
                width: 0,
                curveness: 0.2,
              },
            },
            data: [
              {
                fromName: '许昌市',
                toName: '焦作市',
                coords: [
                  [113.852806, 34.035217],
                  [113.238266, 35.23904],
                ],
              },
            ],
          },
        ],
      })
      
      setData(dd.features.map((item)=>item.properties))
      // console.log(dd.features.map((item)=>item.properties))
    }
        
      
    
    
  }
  useLayoutEffect(()=>{
    loadMap() 
  },[name])
  
 
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
      <div className={styles.left_top}>
        <EChartsReact
        option={option}    style={{height:"100%",width:"100%"}}/>
      </div>
      <div className={styles.left_center}>
      <EChartsReact option={option} 
      
      style={{height:"100%",width:"100%"}}/>
      </div>
      <div className={styles.left_bottom}>
      <EChartsReact  option={option} style={{height:"100%",width:"100%"}}/>
      </div>
      </div>
      <div className={styles.center}>
      <div className={styles.center_top}>
      <EChartsReact  option={mapOptions}  onEvents={
          {
            'click':(params)=>{
              console.log(params)
              setName(params.name)
            }
          }
        } style={{height:"100%",width:"100%"}}/>
      </div>
      <div className={styles.center_bottom}>
      <EChartsReact  option={option} style={{height:"100%",width:"100%"}}/>
      </div>
      </div>
      <div className={styles.right}>
      <div className={styles.right_top}>
      <EChartsReact  option={option} style={{height:"100%",width:"100%"}}/>
      </div>
      <div className={styles.right_center}>
      <EChartsReact option={option} style={{height:"100%",width:"100%"}}/>
      </div>
      <div className={styles.right_bottom}>
      <EChartsReact  option={option} style={{height:"100%",width:"100%"}}/>
      </div>
      </div>
      <Outlet />
    </div>
  );
}
