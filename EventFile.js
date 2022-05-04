// JavaScript Document
let scoreX = 0;
let scoreO= 0;


const size = 20;
const countmax = 5;
let CPlayer = 0; // Current Player (0 is O,1 is X)
let InGame = false;
let l_played = [], l_win = [];
let mode = 0; // 0: no block; 1: block
let timereturn = false;
let AI = false;

//New Game
function Loaded()
{
	l_played = [], l_win = [];
	let imgp = document.getElementById("imgPlayer");
	imgp.style.backgroundImage = "url('Images/Opng.png')";


	let table = document.getElementById("table");
	let	row = document.getElementsByClassName("row");
	let square = document.getElementsByClassName("square");
	
	// Create Table
	table.innerHTML = "";
	for (y = 0; y < size; y++)
	{
		table.innerHTML += '<tr class="row"></tr>';
		for (x = 0;x < size; x++)
		{
			let div = '<div class="square" onClick="Click(id)" onMouseOver="MouseOver(id)" onMouseOut="MouseOut(id)"></div>';
			row.item(y).innerHTML += '<td class="col">' + div + '</td>';
			square.item(x+y*size).setAttribute("id",(x+y*size).toString());
			square.item(x+y*size).setAttribute("player","-1");
		}
	}
}



//Play Game
function Click(id)
{
	if (!InGame) return;
	let square = document.getElementsByClassName("square");
	let pos = parseInt(id);
	if (square.item(pos).getAttribute("player") != "-1") return;
	let path = "url('Images/Opng.png')";
	if (CPlayer == 1) path = "url('Images/Xpng.png')";
	square.item(pos).style.backgroundImage = path;
	square.item(pos).setAttribute("player",CPlayer.toString());
	l_played.push(pos);
	
	let win = WinGame();
	let pwin = CPlayer;
	
	if (!AI)
	{
		if (CPlayer == 0) CPlayer = 1;
		else CPlayer = 0;
		
		let iplayer = "url('Images/Opng.png')";
		if (CPlayer == 1) iplayer = "url('Images/Xpng.png')";
		let imgp = document.getElementById("imgPlayer");
		imgp.style.backgroundImage = iplayer;
	}
	else
	{
		if (!win)
		{
			AIMode();
			win = WinGame();
			pwin = 1;
		}
	}
	
	if (win)
	{
		let mess = 'Player 2 win';
		if (pwin == 0) {
			scoreO++
			mess = 'Player 1 win';
			document.getElementById('score1').innerText = scoreO
			CPlayer = 0
			alert(mess);

		} else {
			scoreX++
			document.getElementById('score2').innerText = scoreX
			CPlayer = 1
			alert(mess);
		}
	}
	else
	{
		let pgr = document.getElementById("pgrTime");
		pgr.value = pgr.getAttribute("max");
	}
}

// Min Max
function maxab(a,b)
{
	if (a > b) return a;
	else return b;
}
function minab(a,b)
{
	if (a < b) return a;
	else return b;
}

function MouseOver(id)
{
	if (!InGame) return;
	let square = document.getElementsByClassName("square");
	let pos = parseInt(id);
	square.item(pos).style.backgroundColor = "#3F3";
}

function MouseOut(id)
{
	if (!InGame) return;
	let square = document.getElementsByClassName("square");
	let pos = parseInt(id);
	square.item(pos).style.backgroundColor = "#FFF";
}

function WinGame()
{
	let result = false;
	let Board = GetBoard();
	for (x = 0;x < size;x++)
	{
		for (y = 0;y < size;y++)
		{
			if (winHor(x,y,Board) || winVer(x,y,Board) || winCross1(x,y,Board) 
			|| winCross2(x,y,Board))
			{
				let square = document.getElementsByClassName("square");
				for(i = 0;i < l_win.length;i++)
				{
					square.item(l_win[i]).style.backgroundColor = "#FF0";
				}
				result = true;
			}
		}
	}
	return result;
}

// Win Dir
function winHor(x,y,Board)
{
	l_win = [];
	let count = 0, counto = 0;// count opponent
	let player = Board[x + y*size];
	if (player == -1) return false;
	
	if (x > 0)
	{
		let p = Board[x-1+y*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = x; i < size;i++)
	{
		let p = Board[i+y*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push(i+y*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}

function winVer(x,y,Board)
{
	l_win = [];
	let count = 0, counto = 0;
	let player = Board[x + y*size];
	if (player == -1) return false;
	
	if (y > 0)
	{
		let p = Board[x+(y-1)*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = y; i < size;i++)
	{
		let p = Board[x+i*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push(x+i*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}

function winCross1(x,y,Board)
{
	l_win = [];
	if (x > size-countmax || y < countmax-1) return false;
	let count = 0, counto = 0;
	let player = Board[x + y*size];
	if (player == -1) return false;
	
	if (y < size-1 && x > 0)
	{
		let p = Board[x-1+(y+1)*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = 0; i <= minab(size-x,y);i++)
	{
		let p = Board[(x+i)+(y-i)*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push((x+i)+(y-i)*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}

function winCross2(x,y,Board)
{
	l_win = [];
	if (x > size-countmax || y > size-countmax) return false;
	let count = 0, counto = 0;
	let player = Board[x + y*size];
	if (player == -1) return false;
	
	if (y > 0 && x > 0)
	{
		let p = Board[x-1+(y-1)*size];
		if (p != player && p != -1) counto++;
	}
	
	for (i = 0; i < minab(size-x,size-y);i++)
	{
		let p = Board[(x+i)+(y+i)*size];
		if (p == player && p != -1)
		{
			count++;
			l_win.push((x+i)+(y+i)*size);
		}
		else{ if (p != -1) counto++;break;};
	}
	if (count >= countmax) 
	{
		if (mode == 0)
		return true;
		else {
				if (counto >= 2) return false;
				else return true;
			 }
	}
	return false;
}

// Button Event
function PvsP()
{
		document.getElementById('nguoichoi1').innerText = prompt('Nhap ten nguoi choi 1')
		document.getElementById('nguoichoi2').innerText = prompt('Nhap ten nguoi choi 2')
		document.getElementById('score1').innerText = 0
		document.getElementById('score2').innerText = 0
	PvsP1()
	}

	function PvsP1(){
	AI = false;
	Loaded();
	InGame = true;
	let pgr = document.getElementById("pgrTime");
	pgr.value = pgr.getAttribute("max");
	LoadProgress();
}

function PvsM()
{
		document.getElementById('nguoichoi1').innerText = prompt('Nhap ten nguoi choi 1')
		document.getElementById('nguoichoi2').innerText = 'Computer'
		document.getElementById('score1').innerText = 0
		document.getElementById('score2').innerText = 0
		PvsM1()
	}
	function PvsM1(){
	AI = true;
	Loaded();
	InGame = true;
	let pgr = document.getElementById("pgrTime");
	pgr.value = pgr.getAttribute("max");
	LoadProgress();
}

function Undo(time)
{
	if (time < 1) return;
	if (l_played.length <= 0 || !InGame) return;
	let sqr = document.getElementsByClassName("square");
	sqr.item(l_played[l_played.length-1]).setAttribute("player","-1");
	sqr.item(l_played[l_played.length-1]).style.backgroundImage = "";
	
	l_played.pop();
	if (CPlayer == 0) CPlayer = 1;
	else CPlayer = 0;
	
	let iplayer = "url('Images/Opng.png')";
	if (CPlayer == 1) iplayer = "url('Images/Xpng.png')";
	let imgp = document.getElementById("imgPlayer");
	imgp.style.backgroundImage = iplayer;
	
	let pgr = document.getElementById("pgrTime");
	pgr.value = pgr.getAttribute("max");
	if (AI)
	Undo(time-1);
}

function TimeReturn()
{
	let chb = document.getElementById("chbtime");
	if (l_played.length > 0)
	chb.checked = !chb.checked;
	if (chb.checked) timereturn = true;
	else timereturn = false;
	if (timereturn) LoadProgress();
}

function LoadProgress()
{
	if (!timereturn || !InGame) return;
	setTimeout(
	function()
	{
		let pgr = document.getElementById("pgrTime");
		pgr.value--;
		if (pgr.value > 0)
		LoadProgress();
		else
		{
			let mess = 'Player 2 win';
			if (CPlayer == 1){
				scoreO++
				mess = 'Player 1 win';
				document.getElementById('score1').innerText = scoreO
				CPlayer = 0
				alert(mess);

			} else {
				scoreX++
				document.getElementById('score2').innerText = scoreX
				CPlayer = 1
				alert(mess);


			}
		}
	},100);
}

function playagain(){
	Loaded()
}