console.log("Testing Typescript")

let printNumbers = (start: number, end:number):void => {
    let temp:string= '';
    for(let i:number = start; i<=end; i++){
        temp+= `${i} `;
    }
    console.log(temp);
}
printNumbers(0,10)