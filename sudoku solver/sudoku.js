let boardtype=document.getElementById("boardType"); // input grid size

//function to create a matrix
function creatematrix(m, n) {
    return Array.from({
      length: m
    }, () => new Array(n).fill(0));
};

let N=9; //default grid size is 9x9
let arr=creatematrix(N,N);  //matrix to store grid values;
let sq=Math.sqrt(N);    //sqaure root of the grid size
let temparr=creatematrix(N,N);  //another copy of the matrix for undo feature
createGrid(N);

//function creates grid based on size
function createGrid(){
    let board=document.getElementById("grid");

    while(board.firstChild) {
        board.removeChild(board.firstChild);
    }

    let w=(N)*33;
    board.style.width=w+"px";


    for(let i=1;i<=N;i++){
        for(let j=1;j<=N;j++){
            let cell=document.createElement("input");
            let idx=(i-1)*N+j;
            cell.setAttribute("id",idx)
            cell.setAttribute("type","text");
            cell.setAttribute("maxlength",2);
            cell.setAttribute("inputmode","numeric");

            if(i===1){
                if(j===1){
                    cell.setAttribute("class","uplftcorner");
                }
                else if(j%sq===0){
                    cell.setAttribute("class","uprytcorner");
                }
                else{
                    cell.setAttribute("class","fr");
                }
            }
            else{
                if(i%sq===0){
                    if(j===1){
                        cell.setAttribute("class","mjxrc_fc");
                    }
                    else if(j%sq===0){
                        cell.setAttribute("class","mjxrc");
                    }
                    else{
                        cell.setAttribute("class","mjxr");
                    }
                }
                else{
                    if(j===1){
                        cell.setAttribute("class","fc");
                    }
                    else if(j%sq===0){
                        cell.setAttribute("class","mjxc");
                    }
                    else{
                        cell.setAttribute("class","mc");
                    }
                }
            }

            board.append(cell);
        }
    }
}

//creates grid when size changed
boardtype.addEventListener('change', function(e){
    N=e.target.value;
    arr=creatematrix(N,N);
    sq=Math.sqrt(N);
    temparr=creatematrix(N,N);
    createGrid(N);
});


//checks if adding a number at a position in grid is safe or not
function isSafe(x,y,curnum){
    for(let i=0;i<N;i++){
        if(arr[i][y]===curnum){
            return false;
        }
        if(arr[x][i]===curnum){
            return false;
        }
        let q1=Math.floor(x/sq);
        let q2=Math.floor(y/sq);
        let q3=Math.floor(i/sq);
        if(arr[sq*(q1)+q3][sq*(q2)+i%sq]===curnum){
            return false;
        }
    }
    return true;
}

//Solving the sudoku
function solveFull(){
    for(let i=0;i<N;i++){
        for(let j=0;j<N;j++){

            if(arr[i][j]===0){   // found empty place

                for(let k=1;k<=N;k++){

                    if(isSafe(i,j,k)){
                        arr[i][j]=k;
                        if(solveFull()){
                            return true;
                        }
                        else{
                            arr[i][j]=0;
                        }
                    }
                }

                return false;
            }
        }
    }
    return true;
}


//take values from the grid input and also checks if the inputs are valid
function sudokuCheckSolve(){

    arr=creatematrix(N,N);

    let msgdiv=document.getElementById("message");
    msgdiv.innerHTML="";

    // TAKING INPUT
    for(let i=1;i<=N;i++){
        for(let j=1;j<=N;j++){
            let num=(i-1)*N+j;
            let val=document.getElementById(num).value;
            if(val=="") val=0;

            let x=parseInt(val);

            if(isNaN(x)){
                msgdiv.innerHTML="Invalid input in the board";
                return;
            }
            else if(x<0 || x>N){
                msgdiv.innerHTML="Invalid input in the board";
                return;
            }
            else{
                if(x===0){
                    arr[i-1][j-1]=x;
                    temparr[i-1][j-1]=x;
                }
                else{
                    if(isSafe(i-1,j-1,x)){
                        arr[i-1][j-1]=x;
                        temparr[i-1][j-1]=x;
                    }
                    else{
                        msgdiv.innerHTML="Invalid input in the board";
                        return;
                    }
                }
                
            }
        }
    }

    // PRINTING SUDOKU
    if(solveFull()===true){

        for(let i=1;i<=N;i++){
            for(let j=1;j<=N;j++){
                let num=(i-1)*N+j;
                let val=document.getElementById(num);
                val.value=arr[i-1][j-1];
                val.disabled=true;
            }
        }
        return;
    }
    else{
        msgdiv.innerHTML="Invalid input in the board";
        return;
    }
}

//Reset function resets the entire grid
function resetfunc(){
    let msgdiv=document.getElementById("message");
    msgdiv.innerHTML="";

    for(let i=1;i<=N;i++){
        for(let j=1;j<=N;j++){
            let num=(i-1)*N+j;
            let val=document.getElementById(num);
            val.disabled=false;
            val.value='';
            arr[i-1][j-1]=0;
            temparr[i-1][j-1]=0;
        }
    }
    return;
}

//Undo function which resets the grid to its initial state
function unsolvefunc(){
    let msgdiv=document.getElementById("message");
    msgdiv.innerHTML="";
    
    for(let i=1;i<=N;i++){
        for(let j=1;j<=N;j++){
            let num=(i-1)*N+j;
            let val=document.getElementById(num);
            val.disabled=false;
            if(temparr[i-1][j-1]!==0) val.value=temparr[i-1][j-1];
            else val.value='';
        }
    }
    return;
}

let solvebtn=document.getElementById("solveButton");
solvebtn.addEventListener("click",sudokuCheckSolve);


let rstbtn=document.getElementById("resetButton");
rstbtn.addEventListener("click",resetfunc);

let unsolvebtn=document.getElementById("unsolveButton");
unsolvebtn.addEventListener("click",unsolvefunc);