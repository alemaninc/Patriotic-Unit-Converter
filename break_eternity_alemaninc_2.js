"use strict";
function N(x) {
	return new Decimal(x);
}
Object.defineProperty(JSON,"validDecimal",{
	value:function validDecimal(x) {
		if (x instanceof Decimal) return true;
		if (typeof x !== "string") return false;	// Regular numbers will remain numeric in JSON.
		if (x==="0") return true;									// Special case for Decimal 0
		if (N(x).isNaN()) return false;					 
		if (N(x).eq(0)) return false;					// If the variable evaluates to 0 but did not get stored as such, it's not a decimal.
		return true;															// If all of the above tests were false, it's probably a Decimal.
	}
})
Object.defineProperty(Array.prototype,"sumDecimals",{value:function sumDecimals() {
	return this.reduce((x,y) => x.add(y),new Decimal(0));
}})
Object.defineProperty(Array.prototype,"productDecimals",{value:function productDecimals(){
	return this.reduce((x,y) => x.mul(y),new Decimal(0));
}})
Object.defineProperty(Array.prototype,"decimalPowerTower",{value:function decimalPowerTower() {
	return this.reduceRight((x,y) => y.pow(x));
}})
Decimal.notations = {
	formatSmall:function(x,p=2){
		if (x===0) {
			return "0"
		}
		let decimalPlaces = Math.max(0,p-Math.floor(Math.log10(x)));
		let rounded_x = Math.round(x*10**decimalPlaces)/(10**decimalPlaces)
		let out = Math.floor(rounded_x).toLocaleString("en-US").replaceAll(","," ")
		if (((x%1)!==0)&&(decimalPlaces!==0)) {
			out += (rounded_x%1).toFixed(decimalPlaces).replace("0","");
		}
		return out;
	},
	defaultPrecision:{
		"Scientific":2,
	},
	leadingEs:function(x){return x.layer-((x.mag<1e6)?1:0)},
	list:{
		"Scientific":function(x,sub="Scientific",p=2){
			if (x.gte("eeeee6")) return Decimal.notations.list["Hyper-E"](x,sub);
			let leadingEs = Decimal.notations.leadingEs(x);
			let effp = p
			if (x.layerplus(-leadingEs).gte("ee4")) {
				effp--;
			}
			if (x.layerplus(-leadingEs).gte("ee5")) {
				effp--;
			}
			if (leadingEs===0) {
				x=x.mul(1.0000001);
				return x.log10().mod(1).pow10().mul(10**effp).floor().div(10**effp).toFixed(effp)+"e"+Decimal.notations.formatSmall(x.log10().floor().toNumber())
			}
			return Array(leadingEs+1).join("e")+Decimal.notations.list["Scientific"](x.layerplus(-leadingEs),sub,p+1)
		}
  }
}
Decimal.format = function(value,precision=0,notation="Scientific",subnotation=notation,highPrecision=0) {
	if ([value,precision,notation,subnotation].includes(undefined)) Util.functionError("Decimal.format",arguments)
	let x=N(value);
	if (x.sign===-1) return "-"+Decimal.format(x.abs(),precision,notation,subnotation,highPrecision);
	if (x.eq(N(10).tetrate(Number.MAX_VALUE))) return "Infinite";
	if (x.eq(N(10).tetrate(Number.MAX_VALUE).recip())) return "0"
	if (x.isNaN()) return "NaN";
	if (x.eq(0)) return "0";
	if (x.lt(1e-5)) return "(1 ÷ "+Decimal.format(x.recip(),precision,notation,subnotation,highPrecision)+")";
	if (x.lt(1e6)) return Decimal.notations.formatSmall(x.toNumber(),precision)
	return Decimal.notations.list[notation](x,subnotation,highPrecision+Decimal.notations.defaultPrecision[notation])
}
Decimal.structuredClone = function(obj) {
	if (typeof obj === "object") {
		if (obj === null) {
			return null
		} else if (obj instanceof Array) {
			return obj.map(x=>Decimal.structuredClone(x))
		} else if (obj instanceof Decimal) {
			return N(obj)
		} else {
			let out = {}
			for (let i of Object.keys(obj)) out[i] = Decimal.structuredClone(obj[i])
			return out
		}
	} else {
		return obj
	}
}
Decimal.prototype.format = function() {
  return Decimal.format(this,2,"Scientific","Scientific",0)
}