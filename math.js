export const map = (value,startVal,endVal,targetValueMin,targetValMax)=>{
    if(value > endVal) return targetValMax;
    if(value < startVal) return targetValueMin;
    return ((value - startVal)/(endVal - startVal)) * (targetValMax - targetValueMin) + targetValueMin
}
export const lerp = (startValue,endValue,precentace)=>{
    return startValue + (endValue-startValue) * precentace;
}